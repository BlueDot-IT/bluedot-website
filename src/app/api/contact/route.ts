// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { contactRateLimit } from "@/lib/rateLimit";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function singleLine(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export async function POST(req: NextRequest) {
  const limitReached = await contactRateLimit(req);
  if (limitReached) return limitReached;

  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const startedAt = Number(body?.startedAt);
    const hp = body?.hp == null ? "" : String(body.hp);

    // 1) Honeypot
    if (hp && String(hp).trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 }); // pretend success
    }

    // 2) Submit speed gate
    const elapsed = Date.now() - startedAt;
    if (!Number.isFinite(elapsed) || elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) {
      return NextResponse.json(
        { ok: false, error: "Suspicious timing" },
        { status: 400 }
      );
    }

    // 3) Basic validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
    if (!emailOk) return NextResponse.json({ ok: false, error: "Bad email" }, { status: 400 });
    if (!name || !subject || !message) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    if (name.length > 120 || subject.length > 200 || message.length > 10_000) {
      return NextResponse.json({ ok: false, error: "Input too long" }, { status: 400 });
    }

    // 4) Content scoring
    const urlCount = (message.match(/https?:\/\/|www\./gi) || []).length;
    if (urlCount > 2) {
      return NextResponse.json({ ok: false, error: "Too many links" }, { status: 400 });
    }
    const banned = ["viagra", "casino", "crypto investment"];
    const lower = `${subject} ${message}`.toLowerCase();
    if (banned.some((w) => lower.includes(w))) {
      return NextResponse.json({ ok: true }, { status: 200 }); // silent drop
    }

    // 5) Optional: Cloudflare Turnstile check (enable when you add the widget)
    // const token = (await req.json()).turnstileToken;
    // if (process.env.TURNSTILE_SECRET && token) {
    //   const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    //     method: "POST",
    //     headers: { "content-type": "application/x-www-form-urlencoded" },
    //     body: new URLSearchParams({
    //       secret: process.env.TURNSTILE_SECRET,
    //       response: token,
    //       remoteip: ip,
    //     }),
    //   }).then((r) => r.json());
    //   if (!verify.success) {
    //     return NextResponse.json({ ok: false, error: "Captcha failed" }, { status: 400 });
    //   }
    // }

    const result = await sendMail({
      to: "jason@bluedot.it.com",
      subject: `BlueDot contact: ${singleLine(subject)}`,
      text: `From: ${singleLine(name)} <${singleLine(email)}>\nSubject: ${singleLine(subject)}\n\n${message}`,
      html: `<p><b>From:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><pre>${escapeHtml(message)}</pre>`,
      replyTo: singleLine(email),
    });

    return NextResponse.json({ ok: true, id: result.messageId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
