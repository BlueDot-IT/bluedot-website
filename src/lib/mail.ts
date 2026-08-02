import nodemailer from "nodemailer";

export function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,                  // 587 with STARTTLS
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    tls: { rejectUnauthorized: true }, // your LE cert is valid
  });
}

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}) {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM!, // keep From aligned to bluedot.it.com
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    replyTo: opts.replyTo,
    disableFileAccess: true,
    disableUrlAccess: true,
    headers: {
      "X-Client": "Next.js",
    },
  });

  return info; // contains messageId and response
}
