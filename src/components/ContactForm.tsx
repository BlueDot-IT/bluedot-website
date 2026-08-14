"use client";

import React, { useRef, useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  initialSubject?: string;
}

export default function ContactForm({ initialSubject = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({ name: "", email: "", subject: initialSubject, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [hp, setHp] = useState("");
  const startedAtRef = useRef<number>(Date.now());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setServerMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, startedAt: startedAtRef.current, hp }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || (payload && payload.ok === false)) {
        throw new Error((payload && (payload.error || payload.message)) || `Request failed (${response.status})`);
      }
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("success");
      setServerMessage("Message sent.");
    } catch (error: unknown) {
      setSubmitStatus("error");
      setServerMessage(error instanceof Error ? error.message : "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sr2-contact-grid sr2-wrap">
      <div className="sr2-contact-copy">
        <div>
          <span className="sr2-kicker">BlueDot IT · contact</span>
          <h1>Tell me what you are building, automating, or <span>securing.</span></h1>
        </div>
        <p>Share the current state, the tools or code involved, the boundary that matters, and what a useful handoff would include. This form supports security reviews, AI automation, full-stack development, and existing-system remediation.</p>
        <div className="sr2-contact-methods" aria-label="Contact methods">
          <div className="sr2-contact-method"><strong>Email</strong><a href="mailto:jason@bluedot.it.com">jason@bluedot.it.com</a></div>
          <div className="sr2-contact-method"><strong>Phone</strong><a href="tel:+18282156403">+1 (828) 215-6403</a></div>
          <div className="sr2-contact-method"><strong>Location</strong><span>North Carolina / Remote</span></div>
          <div className="sr2-contact-method"><strong>Public work</strong><a href="https://github.com/jason-allen-oneal" target="_blank" rel="noreferrer">GitHub</a></div>
        </div>
      </div>

      <form className="sr2-form" onSubmit={handleSubmit}>
        <div className="sr2-kicker">Describe the system</div>
        <div className="sr2-form-row">
          <div className="sr2-field"><label htmlFor="name">Name *</label><input id="name" name="name" value={formData.name} onChange={handleInputChange} autoComplete="name" placeholder="Your name" required /></div>
          <div className="sr2-field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} autoComplete="email" placeholder="you@domain.com" required /></div>
        </div>
        <div className="sr2-field"><label htmlFor="subject">Project or system *</label><input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="Security review, agent prototype, API build, production hardening..." required /></div>
        <div className="sr2-field"><label htmlFor="message">Message *</label><textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={6} placeholder="What are you building, automating, or securing? Which code, tools, data, or deployment boundaries are involved?" required /></div>
        <input type="text" name="company" value={hp} onChange={(event) => setHp(event.target.value)} autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
        <input type="hidden" name="startedAt" value={startedAtRef.current} />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send message"}</button>
        {serverMessage && <p className={`sr2-form-status ${submitStatus === "error" ? "error" : ""}`} role={submitStatus === "error" ? "alert" : "status"}>{serverMessage}</p>}
        <p className="sr2-warning">Please do not submit passwords, credentials, regulated data, customer records, or other sensitive information through this form. Describe the boundary and the problem without including secrets or live customer data.</p>
      </form>
    </section>
  );
}
