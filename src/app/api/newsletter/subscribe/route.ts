import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { newsletterRateLimit } from "@/lib/rateLimit";
import { sendMail } from "@/lib/mail";

const SubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
});

function hasSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM
  );
}

export async function POST(req: NextRequest) {
  const limitReached = await newsletterRateLimit(req);
  if (limitReached) return limitReached;

  try {
    const body = await req.json();
    const parsed = SubscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const existing = await prisma.subscriber.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You're already subscribed with that email." },
        { status: 400 }
      );
    }

    await prisma.subscriber.create({
      data: { email },
    });

    if (hasSmtpConfigured()) {
      try {
        await sendMail({
          to: email,
          subject: "Welcome to the BlueDot IT newsletter",
          text: "Thanks for subscribing to the BlueDot IT newsletter!",
          html: `
            <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0b1220;">
              <h2 style="margin: 0 0 12px;">Welcome to BlueDot IT</h2>
              <p style="margin: 0 0 12px;">Thanks for subscribing to the BlueDot IT newsletter.</p>
              <p style="margin: 0;">We’ll only send the good stuff—updates, new posts, and launch notes.</p>
            </div>
          `.trim(),
        });
      } catch (emailErr) {
        // Don’t block a successful subscription if SMTP is down/misconfigured.
        console.error("Newsletter welcome email failed:", emailErr);
      }
    }

    return NextResponse.json(
      { ok: true, message: "Subscribed! Check your inbox for a welcome email." },
      { status: 201 }
    );
  } catch (err: any) {
    // Prisma unique constraint (race condition)
    if (err?.code === "P2002") {
      return NextResponse.json(
        { error: "You're already subscribed with that email." },
        { status: 400 }
      );
    }

    console.error("Newsletter subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
