import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Reveal from '@/components/Reveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Security engineering, AI automation, and full-stack development for teams building real systems.',
  alternates: {
    canonical: 'https://bluedot.it.com/services',
  },
  openGraph: {
    title: 'Services | BlueDot IT',
    description: 'Security engineering, AI automation, and full-stack development for teams building real systems.',
    type: 'website',
    url: 'https://bluedot.it.com/services',
  },
}

const categories = [
  {
    id: 'security-engineering',
    title: 'Security Engineering',
    description: 'Review, harden, and improve the application and infrastructure boundaries that matter to production.',
    cta: 'Start with a security review',
    href: '/services/security-reviews',
    services: [
      { name: 'Application and API security', href: '/services/security-reviews' },
      { name: 'Authentication and authorization reviews', href: '/services/nextjs-security-hardening' },
      { name: 'Next.js security hardening', href: '/services/nextjs-security-hardening' },
      { name: 'Linux, Docker, NGINX, and VPS hardening', href: '/services/server-hardening' },
      { name: 'CI/CD and dependency security', href: '/services/security-reviews' },
      { name: 'MCP and AI-agent security', href: '/services/mcp-security-consulting' },
      { name: 'Remediation implementation', href: '/services/security-reviews' },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    description: 'Build controlled agents and workflow automations with explicit permissions, logs, approvals, and maintainable failure handling.',
    cta: 'Explore AI automation',
    href: '/services/workflow-automation',
    services: [
      { name: 'AI agent development', href: '/services/ai-security-tooling' },
      { name: 'Workflow automation and API integrations', href: '/services/workflow-automation' },
      { name: 'LLM integrations', href: '/services/ai-security-tooling' },
      { name: 'MCP servers and tool integrations', href: '/services/mcp-security-consulting' },
      { name: 'RAG and knowledge systems', href: '/services/workflow-automation' },
      { name: 'Human approval workflows and guardrails', href: '/services/ai-security-tooling' },
      { name: 'Agent observability and operational reporting', href: '/services/operations-automation-reporting' },
    ],
  },
  {
    id: 'full-stack-development',
    title: 'Full-Stack Development',
    description: 'Design, build, deploy, and improve applications and services from frontend through production operations.',
    cta: 'Explore full-stack development',
    href: '/services/full-stack-development',
    services: [
      { name: 'Full-stack application development', href: '/services/full-stack-development' },
      { name: 'React and Next.js applications', href: '/services/full-stack-development' },
      { name: 'TypeScript and Node.js services', href: '/services/full-stack-development' },
      { name: 'Python backends and automation services', href: '/services/full-stack-development' },
      { name: 'APIs, integrations, dashboards, and internal platforms', href: '/services/full-stack-development' },
      { name: 'Authentication, admin systems, and database design', href: '/services/full-stack-development' },
      { name: 'Deployment and production hardening', href: '/services/full-stack-development' },
    ],
  },
]

const entryPoints = [
  {
    title: 'Security Review',
    description: 'A bounded review of an application, repository, deployment, AI integration, or supporting host.',
    deliverables: ['Findings with severity and evidence', 'Technical and business impact', 'Prioritized remediation plan', 'Optional implementation and retest checklist'],
    href: '/contact?service=security-review',
  },
  {
    title: 'AI Automation Discovery and Prototype',
    description: 'Map one workflow and build a controlled working prototype with clear boundaries.',
    deliverables: ['Workflow and tool map', 'Data and permission boundaries', 'Functional prototype', 'Logs, approval points, and production roadmap'],
    href: '/contact?service=ai-automation-discovery',
  },
  {
    title: 'Full-Stack Build Sprint',
    description: 'A defined implementation phase for an application capability, internal tool, dashboard, API, integration, or backend service.',
    deliverables: ['Written scope and architecture', 'Implementation and tests', 'Deployment', 'Documentation and handoff'],
    href: '/contact?service=full-stack-build-sprint',
  },
]

export default function ServicesPage() {
  return (
    <div className="page-shell space-y-20 py-12">
      <Reveal>
        <section className="max-w-4xl space-y-5">
          <span className="pill">Security • AI Automation • Full-Stack</span>
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl">
            Build the system. <span className="heading-accent">Respect the boundary.</span>
          </h1>
          <p className="text-xl text-base-content/80">
            BlueDot combines security engineering, AI automation, and full-stack implementation so the application, workflow, deployment, and control surface can be designed together.
          </p>
        </section>
      </Reveal>

      <section className="space-y-8">
        {categories.map((category) => (
          <Reveal key={category.id}>
            <section id={category.id} className="scroll-mt-28 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Capability pillar</p>
                  <h2 className="text-3xl font-bold md:text-4xl">{category.title}</h2>
                  <p className="text-base-content/75 leading-relaxed">{category.description}</p>
                </div>
                <Link href={category.href} className="btn btn-outline w-fit border-white/20 hover:bg-white/10">
                  {category.cta}
                </Link>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {category.services.map((service) => (
                  <Link key={service.name} href={service.href} className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm font-semibold text-base-content/85 hover:bg-white/10 hover:text-primary transition-colors">
                    {service.name}
                  </Link>
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </section>

      <Reveal>
        <section className="space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="pill">Existing offering</span>
            <h2 className="text-3xl font-bold">Operations automation and reporting, inside AI Automation.</h2>
            <p className="text-base-content/70 leading-relaxed">
              The Operations Automation and Reporting Sprint remains available for one bounded workflow, report, dashboard, or integration. It is an entry point—not the definition of the company.
            </p>
          </div>
          <Card className="border-primary/30 bg-primary/5 p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Start with one reliable handoff.</h3>
                <p className="max-w-2xl text-base-content/70">Scope the inputs, outputs, failure modes, approvals, validation, and documentation before the workflow grows teeth.</p>
              </div>
              <Link href="/services/operations-automation-reporting" className="btn btn-primary w-fit">View the sprint</Link>
            </div>
          </Card>
        </section>
      </Reveal>

      <section className="space-y-8">
        <Reveal>
          <div className="max-w-3xl space-y-3">
            <span className="pill">Productized entry points</span>
            <h2 className="text-3xl font-bold">Three clear ways to begin.</h2>
            <p className="text-base-content/70 leading-relaxed">No fixed prices or invented timelines. The target, boundary, deliverables, and acceptance criteria are defined in writing.</p>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {entryPoints.map((entryPoint) => (
            <Reveal key={entryPoint.title}>
              <Card className="h-full flex flex-col space-y-5 bg-white/5 border-white/10 p-8">
                <h3 className="text-2xl font-bold">{entryPoint.title}</h3>
                <p className="text-base-content/70 leading-relaxed">{entryPoint.description}</p>
                <ul className="flex-1 list-disc space-y-2 pl-5 text-sm text-base-content/75">
                  {entryPoint.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                </ul>
                <Link href={entryPoint.href} className="btn btn-outline border-white/20 hover:bg-white/10 w-full">Discuss this entry point</Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section id="how-it-works" className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="pill">How BlueDot works</span>
            <h2 className="text-3xl font-bold">Scope, build, validate, hand off.</h2>
            <p className="text-base-content/70 leading-relaxed">The process stays legible: written boundaries first, implementation against those boundaries, evidence that the result works, and documentation for what comes next.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              ['01. Scope', 'Agree the target, inputs, risks, exclusions, and acceptance criteria.'],
              ['02. Design', 'Choose the architecture, permissions, integrations, and failure paths.'],
              ['03. Build', 'Implement the application, automation, controls, and supporting infrastructure.'],
              ['04. Handoff', 'Validate behavior, document the system, and leave the next operator a clear path.'],
            ].map(([label, description]) => (
              <div key={label} className="space-y-2">
                <div className="text-primary font-bold text-xl">{label}</div>
                <p className="text-sm text-base-content/70">{description}</p>
              </div>
            ))}
          </div>
          <Link href="/contact" className="btn btn-primary btn-lg w-fit">Discuss your project</Link>
        </section>
      </Reveal>
    </div>
  )
}
