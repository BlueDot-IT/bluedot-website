// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { contactRateLimit } from "@/lib/rateLimit";

const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 10_000;
const MAX_SERVICE_LENGTH = 80;
const MAX_STAGE_LENGTH = 80;
const MAX_STACK_LENGTH = 240;
const MAX_TIMING_LENGTH = 80;
const MAX_BUDGET_LENGTH = 80;

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength + 1) : "";
}

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
    const name = normalizeText(body?.name, MAX_NAME_LENGTH);
    const email = normalizeText(body?.email, 320);
    const service = normalizeText(body?.service, MAX_SERVICE_LENGTH);
    const stage = normalizeText(body?.stage, MAX_STAGE_LENGTH);
    const stack = normalizeText(body?.stack, MAX_STACK_LENGTH);
    const timing = normalizeText(body?.timing, MAX_TIMING_LENGTH);
    const budget = normalizeText(body?.budget, MAX_BUDGET_LENGTH);
    const subject = normalizeText(body?.subject, MAX_SUBJECT_LENGTH);
    const message = normalizeText(body?.message, MAX_MESSAGE_LENGTH);
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
        { ok: false, error: "The request took an unexpected amount of time. Please reload the page and try again." },
        { status: 400 }
      );
    }

    // 3) Basic validation
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
    if (!emailOk) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
    if (!name || !service || !stage || !subject || !message) {
      return NextResponse.json({ ok: false, error: "Please complete the required fields before sending your request." }, { status: 400 });
    }
    if (
      name.length > MAX_NAME_LENGTH ||
      service.length > MAX_SERVICE_LENGTH ||
      stage.length > MAX_STAGE_LENGTH ||
      stack.length > MAX_STACK_LENGTH ||
      timing.length > MAX_TIMING_LENGTH ||
      budget.length > MAX_BUDGET_LENGTH ||
      subject.length > MAX_SUBJECT_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return NextResponse.json({ ok: false, error: "One or more fields are too long. Please shorten the request and try again." }, { status: 400 });
    }

    // 4) Content scoring
    const urlCount = (message.match(/https?:\/\/|www\./gi) || []).length;
    if (urlCount > 2) {
      return NextResponse.json({ ok: false, error: "Please remove extra links from the message and try again." }, { status: 400 });
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
      subject: `[BlueDot contact] ${singleLine(subject)}`,
      text: `Business or project: ${singleLine(subject)}\nService: ${singleLine(service)}\nProject stage: ${singleLine(stage)}\nCurrent stack: ${singleLine(stack || "Not provided")}\nTarget timing: ${singleLine(timing || "Not provided")}\nBudget range: ${singleLine(budget || "Not provided")}\nFrom: ${singleLine(name)} <${singleLine(email)}>\n\n${message}`,
      html: `<p><b>Business or project:</b> ${escapeHtml(subject)}</p><p><b>Service:</b> ${escapeHtml(service)}</p><p><b>Project stage:</b> ${escapeHtml(stage)}</p><p><b>Current stack:</b> ${escapeHtml(stack || "Not provided")}</p><p><b>Target timing:</b> ${escapeHtml(timing || "Not provided")}</p><p><b>Budget range:</b> ${escapeHtml(budget || "Not provided")}</p><p><b>From:</b> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><pre>${escapeHtml(message)}</pre>`,
      replyTo: singleLine(email),
    });

    if (!result.messageId) {
      throw new Error("Mail transport did not return a receipt");
    }
    return NextResponse.json({ ok: true, id: result.messageId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "We could not send the request right now. Please try again in a moment." }, { status: 500 });
  }
}
