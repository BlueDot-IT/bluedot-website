"use client";

import { useMemo, useState } from "react";

export default function NewsletterForm({
  title = "Get product + security updates",
  description = "A short email when we ship something new. No spam.",
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  const disabled = useMemo(
    () => status === "loading" || email.trim().length === 0,
    [status, email]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setMessage(data?.error || "Could not subscribe. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data?.message || "You’re on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Could not subscribe. Please try again.");
    }
  }

  return (
    <div className="sr2-newsletter">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <label htmlFor="newsletter_signup" className="sr2-newsletter-label">Email address</label>
      <form onSubmit={onSubmit}>
        <input
          id="newsletter_signup"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="authority-newsletter-input"
          aria-label="Email address"
          required
        />

        <button
          type="submit"
          disabled={disabled}
        >
          {status === "loading" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={status === "success" ? "text-emerald-300" : "text-rose-300"}
          role={status === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
