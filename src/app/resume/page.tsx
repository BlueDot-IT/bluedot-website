"use client"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import Button from "@/components/ui/Button"
import { CardContent } from "@/components/ui/Card"
import { Download } from "lucide-react"

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef: resumeRef })

  return (
    <div className="sr2-document sr2-resume">
      <div className="sr2-wrap">
        <div className="mx-auto max-w-4xl space-y-6 text-base-content">

          {/* UI Header (screen only) */}
          <header className="flex items-start justify-between print:hidden">
            <div>
              <h1 className="text-4xl font-bold">Professional Background</h1>
              <p className="mt-2 text-sm text-base-content/70">A concise current profile for BlueDot IT.</p>
            </div>
            <div className="flex gap-3">
              <Button size="sm" onClick={handlePrint}>
                <Download className="w-4 h-4" />
                Print/Save
              </Button>
            </div>
          </header>

          {/* ================= PRINTABLE RESUME ================= */}
          <div ref={resumeRef} className="sr2-resume-paper p-8">
            <CardContent className="p-0 space-y-6">

              {/* CONTACT HEADER */}
              <section>
                <h2 className="text-2xl font-bold">Jason O&apos;Neal</h2>
                <p>Software Developer | Systems & Automation | Cybersecurity Student</p>

                <div className="mt-2 text-sm space-y-1">
                  <p>Lenoir, NC 28645</p>
                  <p>jason.allen.oneal@gmail.com | 828-215-6403</p>
                  <p>https://linkedin.com/in/jason-oneal</p>
                  <p>https://github.com/jason-allen-oneal</p>
                  <p>https://bluedot.it.com</p>
                </div>
              </section>

              {/* SUMMARY */}
              <section>
                <h3 className="font-semibold uppercase border-b">Summary</h3>
                <ul className="mt-2 list-disc pl-5 space-y-1">
                  <li>Software development experience spanning more than two decades (since 2002).</li>
                  <li>Builds workflow automation, reporting systems, web applications, and operational tooling.</li>
                  <li>Practical experience with Linux systems, secure deployment, infrastructure hardening, and AI integration.</li>
                  <li>Currently completing formal cybersecurity study while continuing hands-on engineering work.</li>
                </ul>
              </section>

              {/* SKILLS */}
              <section>
                <h3 className="font-semibold uppercase border-b">Technical Skills</h3>

                <p className="mt-2"><strong>Languages & Frameworks:</strong> TypeScript, JavaScript, Python, PHP, React, Next.js, Node.js, Django</p>
                <p><strong>DevOps & Infrastructure:</strong> Docker, Kubernetes, CI/CD pipelines, NGINX, SSH, TLS, AWS, Linode</p>
                <p><strong>Databases & ORMs:</strong> MySQL, PostgreSQL, MongoDB, Prisma, SQLAlchemy</p>
                <p><strong>Cybersecurity:</strong> Pentesting (OWASP), Hardening, Network Analysis (Nmap/Wireshark), Threat Modeling</p>
                <p><strong>Operational Tools:</strong> Git, GitHub, Linux CLI/Zsh, PM2, Agentic AI Tooling</p>
              </section>

              {/* EXPERIENCE */}
              <section>
                <h3 className="font-semibold uppercase border-b">Experience</h3>

                <div className="mt-2">
                  <p className="flex justify-between"><strong>Founder & Principal Solutions Engineer</strong> <span>January 2026 – Present</span></p>
                  <p className="italic text-sm">BlueDot IT — Lenoir, NC</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Design and deliver custom software, websites, workflow automation, and operational reporting systems.</li>
                    <li>Build and maintain Linux, container, reverse-proxy, database, and application infrastructure.</li>
                    <li>Implement evidence-backed validation, documentation, rollback, and human approval controls.</li>
                    <li>Perform authorized security reviews and targeted infrastructure and application hardening.</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="flex justify-between"><strong>Independent Technical Consultant</strong> <span>January 2002 – December 2025</span></p>
                  <p className="italic text-sm">Lenoir, NC</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Built and maintained web applications, automation tooling, and Linux-based systems for independent work.</li>
                    <li>Managed deployment, backups, maintenance, and long-running technical support responsibilities.</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="flex justify-between"><strong>Customer Support Representative</strong> <span>March 2009 – December 2010</span></p>
                  <p className="italic text-sm">Convergys — Hickory, NC</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Resolved Tier 1 and Tier 2 connectivity and device configuration issues.</li>
                    <li>Optimized documentation and troubleshooting procedures for mobile hardware.</li>
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="flex justify-between"><strong>Technical Support & Retention</strong> <span>June 2005 – December 2005</span></p>
                  <p className="italic text-sm">ClientLogic — Asheville, NC</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Performed technical troubleshooting for ISP services and local network configurations.</li>
                  </ul>
                </div>
              </section>

              {/* PROJECTS */}
              <section>
                <h3 className="font-semibold uppercase border-b">Selected Projects</h3>

                <div className="mt-2">
                  <p><strong>ExploitRank (EIE)</strong> | Intelligence Engine</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Automated pipeline for vulnerability ingestion (NVD), GitHub exploit discovery, and ERS scoring.</li>
                  </ul>
                </div>

                <div className="mt-3">
                  <p><strong>BlueDot IT Platform</strong> | Next.js Portfolio & Service Delivery</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Persona-driven business platform featuring automated builds and secure delivery pipelines.</li>
                  </ul>
                </div>
              </section>

              {/* EDUCATION */}
              <section>
                <h3 className="font-semibold uppercase border-b">Education</h3>
                <p className="mt-2">
                  <strong>B.S. in Cybersecurity</strong><br />
                  DeVry University Online (Expected 2027)
                </p>
                <p className="mt-2 text-sm italic">
                  *Undergraduate Certificate in IT Essentials Completed Dec 2025.
                </p>
              </section>

            </CardContent>
          </div>

          {/* PRINT NORMALIZATION */}
          <style jsx global>{`
            @media print {
              * {
                color: #000 !important;
                background: transparent !important;
                box-shadow: none !important;
              }
              body {
                background: white !important;
              }
              a {
                text-decoration: none;
              }
            }
          `}</style>

        </div>
      </div>
    </div>
  )
}
