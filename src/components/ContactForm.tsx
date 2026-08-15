"use client";

import React, { useRef, useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  service: string;
  stage: string;
  stack: string;
  timing: string;
  budget: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  initialSubject?: string;
  initialService?: string;
}

const emptyForm: ContactFormData = {
  name: "",
  email: "",
  service: "",
  stage: "",
  stack: "",
  timing: "",
  budget: "",
  subject: "",
  message: "",
};

export default function ContactForm({ initialSubject = "", initialService = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({ ...emptyForm, subject: initialSubject, service: initialService });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [hp, setHp] = useState("");
  const startedAtRef = useRef<number>(Date.now());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        throw new Error((payload && (payload.error || payload.message)) || "We could not send the request. Please try again in a moment.");
      }
      setFormData(emptyForm);
      setSubmitStatus("success");
      setServerMessage("Thanks — I’ll review the brief and reply with the next useful step.");
    } catch (error: unknown) {
      setSubmitStatus("error");
      setServerMessage(error instanceof Error ? error.message : "The request could not be sent. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="sr2-contact-grid sr2-wrap">
      <div className="sr2-contact-copy">
        <div>
          <span className="sr2-kicker">BlueDot IT · start with the system</span>
          <h1>Tell me what you are building, automating, or <span>securing.</span></h1>
        </div>
        <p>Tell me what exists, what is failing, and what a useful change would make possible. This is the starting point for security reviews, AI automation, full-stack delivery, and existing-system remediation.</p>
        <div className="sr2-contact-methods" aria-label="Contact methods">
          <div className="sr2-contact-method"><strong>Email</strong><a href="mailto:jason@bluedot.it.com">jason@bluedot.it.com</a></div>
          <div className="sr2-contact-method"><strong>Phone</strong><a href="tel:+18282156403">+1 (828) 215-6403</a></div>
          <div className="sr2-contact-method"><strong>Location</strong><span>North Carolina / Remote</span></div>
          <div className="sr2-contact-method"><strong>Public work</strong><a href="https://github.com/jason-allen-oneal" target="_blank" rel="noreferrer">GitHub</a></div>
        </div>
        <div className="sr2-contact-next">
          <h2>After you send it</h2>
          <p>I’ll read the brief, check the scope and authorization boundary, and reply with the next useful move—usually a scoped review or a short clarification.</p>
        </div>
      </div>

      <form className="sr2-form" onSubmit={handleSubmit} aria-describedby="contact-warning">
        <div className="sr2-kicker">Project brief</div>
        <div className="sr2-form-row">
          <div className="sr2-field"><label htmlFor="name">Name <span aria-hidden="true">*</span></label><input id="name" name="name" value={formData.name} onChange={handleInputChange} autoComplete="name" required /></div>
          <div className="sr2-field"><label htmlFor="email">Email <span aria-hidden="true">*</span></label><input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} autoComplete="email" required /></div>
        </div>
        <div className="sr2-form-row">
          <div className="sr2-field"><label htmlFor="service">Service needed <span aria-hidden="true">*</span></label><select id="service" name="service" value={formData.service} onChange={handleInputChange} required><option value="">Select a service</option><option value="security-review">Security review</option><option value="ai-automation">AI automation</option><option value="full-stack-development">Full-stack development</option><option value="not-sure">Not sure yet</option></select></div>
          <div className="sr2-field"><label htmlFor="stage">Project stage <span aria-hidden="true">*</span></label><select id="stage" name="stage" value={formData.stage} onChange={handleInputChange} required><option value="">Select the current stage</option><option value="idea">Idea or prototype</option><option value="existing">Existing system</option><option value="pre-production">Approaching production</option><option value="production">In production</option><option value="remediation">Remediation or review</option></select></div>
        </div>
        <div className="sr2-field"><label htmlFor="stack">Current system or stack</label><input id="stack" name="stack" value={formData.stack} onChange={handleInputChange} autoComplete="off" /></div>
        <div className="sr2-field"><label htmlFor="subject">Project or system <span aria-hidden="true">*</span></label><input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required /></div>
        <div className="sr2-field"><label htmlFor="message">Primary problem and desired outcome <span aria-hidden="true">*</span></label><textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={7} required /></div>
        <div className="sr2-form-row">
          <div className="sr2-field"><label htmlFor="timing">Target timing</label><select id="timing" name="timing" value={formData.timing} onChange={handleInputChange}><option value="">No firm timing yet</option><option value="exploring">Exploring options</option><option value="this-month">This month</option><option value="one-to-three-months">Within 1–3 months</option><option value="fixed-date">A fixed date matters</option></select></div>
          <div className="sr2-field"><label htmlFor="budget">Budget range</label><select id="budget" name="budget" value={formData.budget} onChange={handleInputChange}><option value="">No budget range to share</option><option value="under-5k">Under $5,000</option><option value="5k-15k">$5,000–$15,000</option><option value="over-15k">Over $15,000</option></select></div>
        </div>
        <input type="text" name="company" value={hp} onChange={(event) => setHp(event.target.value)} autoComplete="off" tabIndex={-1} className="hidden" aria-hidden="true" />
        <input type="hidden" name="startedAt" value={startedAtRef.current} />
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Request a scoped review"}</button>
        {serverMessage && <p className={`sr2-form-status ${submitStatus === "error" ? "error" : ""}`} role={submitStatus === "error" ? "alert" : "status"} aria-live="polite">{serverMessage}</p>}
        <p id="contact-warning" className="sr2-warning">Please do not submit passwords, credentials, regulated data, customer records, or other sensitive information through this form. Describe the boundary and the problem without including secrets or live customer data.</p>
      </form>
    </section>
  );
}
