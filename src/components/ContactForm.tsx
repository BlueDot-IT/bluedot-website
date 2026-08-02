"use client";

import React, { useState, useRef } from "react";
import { CheckCircle2, XCircle, Mail, Phone, MapPin, Github, Send } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { Separator } from "@/components/ui/Separator";

interface ContactFormData {
  name:  string;
  email: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  initialSubject?: string;
}

export default function ContactForm({ initialSubject = "" }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: initialSubject,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const [hp, setHp] = useState("");
  const startedAtRef = useRef<number>(Date.now());

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setServerMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData. email,
          subject: formData.subject,
          message: formData.message,
          startedAt: startedAtRef. current,
          hp,
        }),
      });

      let payload: any = null;
      try {
        payload = await res. json();
      } catch {
        // ignore JSON parse errors
      }

      if (! res.ok || (payload && payload.ok === false)) {
        const msg =
          (payload && (payload.error || payload.message)) ||
          `Request failed (${res.status})`;
        throw new Error(msg);
      }

      setFormData({ name: "", email: "", subject:  "", message: "" });
      setSubmitStatus("success");
      setServerMessage("Message sent.");
    } catch (err:  any) {
      setSubmitStatus("error");
      setServerMessage(err?. message || "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: "Email",
      value: "jason@bluedot.it.com",
      href: "mailto:jason@bluedot.it.com",
      color: "text-primary",
    },
    {
      icon: Phone,
      label: "Phone",
      value:  "+1 (828) 215-6403",
      href: "tel:+18282156403",
      color: "text-secondary",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Lenoir, NC / Remote",
      href: undefined,
      color: "text-accent",
    },
  ];

  const socialLinks = [
    {
      icon: Github,
      label:  "GitHub",
      href: "https://github.com/jason-allen-oneal",
      color: "text-base-content hover:text-primary",
    },
  ];

  return (
    <div className="page-shell space-y-10">
      <div className="text-center space-y-2">
        <span className="kicker">Bluedot • contact</span>
        <h1 className="text-3xl md:text-4xl font-bold heading-accent">Tell me what is slowing the business down.</h1>
        <p className="text-base-content/80 max-w-xl mx-auto">
          Describe the current process, the tools involved, and what a useful result would look like. I&apos;ll reply with the clearest next step, even when that step is not a large project.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <p className="text-base-content font-semibold">Contact Information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {contactMethods.map((method, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 rounded-lg border border-white/10 p-4 hover:bg-white/5 transition"
              >
                <method. icon className={`w-5 h-5 ${method. color}`} />
                <div>
                  <p className="text-sm text-base-content/70">
                    {method.label}
                  </p>
                  {method.href ? (
                    <a href={method.href} className="text-sm font-medium hover:underline text-base-content">
                      {method.value}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-base-content">{method.value}</span>
                  )}
                </div>
              </div>
            ))}

            <Separator />

            <div>
              <h4 className="text-lg font-semibold mb-3 text-base-content">Follow Me</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social. href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="rounded-md border border-white/10 p-2 hover:bg-white/5 transition"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <p className="text-base-content font-semibold">Send a Message</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your name"
                    className="bg-white/5 border-white/15 text-base-content"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    className="bg-white/5 border-white/15 text-base-content"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Business or project *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Weekly reporting, manual intake, website rebuild..."
                  className="bg-white/5 border-white/15 text-base-content"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="What happens today? Which tools or data sources are involved? What should be easier or clearer afterward?"
                  className="bg-white/5 border-white/15 text-base-content"
                />
              </div>

              <input
                type="text"
                name="company"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                className="hidden"
              />
              <input type="hidden" name="startedAt" value={startedAtRef.current} />

              <Button>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>

              {submitStatus === "success" && (
                <Alert variant="success" style="soft" icon={<CheckCircle2 className="h-5 w-5" />}>
                  <span>Message sent successfully!  I&apos;ll get back to you soon.</span>
                </Alert>
              )}
              {submitStatus === "error" && (
                <Alert variant="error" style="soft" icon={<XCircle className="h-5 w-5" />}>
                  <span>Failed to send message. Please try again later.</span>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <p className="text-base-content font-semibold">Quick Response Times</p>
        </CardHeader>
        <CardContent>
          <p className="text-base-content/80 text-sm leading-relaxed">
            Messages are reviewed during normal business hours. Please do not submit passwords, credentials, regulated data, customer records, or other sensitive information through this form.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
