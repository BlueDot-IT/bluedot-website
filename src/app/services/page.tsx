import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";

const dedicatedServices = [
  { title: "Operations automation and reporting", href: "/services/operations-automation-reporting" },
  { title: "Security reviews", href: "/services/security-reviews" },
  { title: "Server hardening", href: "/services/server-hardening" },
  { title: "Next.js security hardening", href: "/services/nextjs-security-hardening" },
  { title: "Workflow automation", href: "/services/workflow-automation" },
  { title: "MCP security consulting", href: "/services/mcp-security-consulting" },
  { title: "Small business websites", href: "/services/small-business-websites" },
  { title: "AI security tooling", href: "/services/ai-security-tooling" },
];

const groups = [
  {
    id: "startups",
    title: "Startup Foundations",
    description: "Build fast and lean without compromising on security or architecture.",
    services: [
      {
        name: "Custom IT Solutions",
        details: "Infrastructure as Code, CI/CD setup, and automated environment provisioning."
      },
      {
        name: "Product Enhancement",
        details: "Accelerate your feature roadmap with specialist engineering support."
      },
      {
        name: "Operational Streamlining",
        details: "Reduce technical toil through intelligent automation and RAG-based runbooks."
      }
    ]
  },
  {
    id: "enterprise",
    title: "Operational Reliability",
    description: "Maintainable systems and practical risk reduction for growing environments.",
    services: [
      {
        name: "Infrastructure Hardening",
        details: "Authorized configuration review and prioritized hardening of agreed infrastructure."
      },
      {
        name: "Scalability Audits",
        details: "Bottleneck identification and measured performance work for web applications and APIs."
      },
      {
        name: "DevSecOps Integration",
        details: "Embed security into the heartbeat of your delivery pipeline."
      }
    ]
  },
  {
    id: "developers",
    title: "Developer Partnerships",
    description: "Focused engineering support and collaboration for independent builds.",
    services: [
      {
        name: "Application Support",
        details: "Targeted debugging and logic reviews for important applications."
      },
      {
        name: "Project Development",
        details: "Collaborative building of tools, modules, and security-first features."
      }
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className="page-shell space-y-20 py-12">
      <Reveal>
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="pill">BlueDot Expertise</span>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Practical systems for <span className="heading-accent">real operational work.</span>
          </h1>
          <p className="text-xl text-base-content/80">
            Start with one reporting bottleneck or repetitive process. Define the boundary, build the smallest useful system, verify it, and leave a maintainable handoff.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="rounded-3xl border border-primary/30 bg-primary/5 p-8 md:p-12 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div className="space-y-4">
            <span className="pill">Primary offer</span>
            <h2 className="text-4xl font-bold">Operations Automation and Reporting Sprint</h2>
            <p className="text-lg text-base-content/75 max-w-3xl">
              Replace one bounded recurring manual process with a report, dashboard, or automation built around agreed data sources and a written scope.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/services/operations-automation-reporting"><Button size="lg">See how the sprint works</Button></Link>
              <Link href="/contact?service=operations-sprint" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold hover:bg-white/5">Describe the bottleneck</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-base-content/55">Commercial model</p>
            <p className="text-3xl font-bold">Scoped in writing</p>
            <p className="text-sm text-base-content/65">Clear deliverables, exclusions, decision points, and acceptance criteria before work begins.</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold">Dedicated service pages</h2>
            <p className="text-base-content/70">Specific pages for the work people and answer engines ask about most often.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dedicatedServices.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 font-semibold hover:bg-white/10 transition-colors"
              >
                {service.title}
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {groups.map((g) => (
        <section key={g.id} id={g.id} className="space-y-8">
          <Reveal>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{g.title}</h2>
              <p className="text-base-content/70 max-w-2xl">{g.description}</p>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {g.services.map((s) => (
              <Reveal key={s.name}>
                <Card className="h-full bg-white/5 border-white/10 p-8 space-y-3 hover:bg-white/10 transition-colors">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <p className="text-sm text-base-content/70 leading-relaxed">{s.details}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      <Reveal>
        <section id="how-it-works" className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">How we work</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-primary font-bold text-xl">01. Scope</div>
              <p className="text-sm text-base-content/70">Clear boundaries and success criteria up front.</p>
            </div>
            <div className="space-y-2">
              <div className="text-primary font-bold text-xl">02. Build</div>
              <p className="text-sm text-base-content/70">Evidence-backed engineering with secure defaults.</p>
            </div>
            <div className="space-y-2">
              <div className="text-primary font-bold text-xl">03. Support</div>
              <p className="text-sm text-base-content/70">PRs, docs, and implementation guidance included.</p>
            </div>
          </div>
          <div className="pt-6">
             <Link href="/contact">
                <Button size="lg" special="wide">Start a build</Button>
             </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
