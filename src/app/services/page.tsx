import Link from 'next/link'
import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Security, AI Automation & Full-Stack Services',
  description: 'Security engineering, AI automation, and full-stack delivery for technical founders and lean teams that need working systems and a usable handoff.',
  alternates: { canonical: 'https://bluedot.it.com/services' },
  openGraph: {
    title: 'Security, AI Automation & Full-Stack Services | BlueDot IT',
    description: 'Security engineering, AI automation, and full-stack delivery for technical founders and lean teams.',
    type: 'website',
    url: 'https://bluedot.it.com/services',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BlueDot IT services' }],
  },
  twitter: { card: 'summary_large_image', title: 'Security, AI Automation & Full-Stack Services | BlueDot IT', description: 'Security engineering, AI automation, and full-stack delivery for technical founders and lean teams.', images: ['/twitter-image'] },
}

const categories = [
  {
    id: 'security-engineering',
    kicker: 'Security engineering',
    title: 'Find the risk. Fix what matters.',
    description: 'Review, harden, and improve the application and infrastructure surfaces that can affect production, customer data, operator authority, or recovery.',
    href: '/services/security-reviews',
    cta: 'Start with a security review',
    bestFor: 'Teams approaching launch, recovering from a security concern, or trying to turn a scan into a prioritized remediation path.',
    systems: 'Next.js and API applications, authentication, Linux and VPS hosts, NGINX, Docker, CI/CD, dependencies, and AI tool integrations.',
    receives: 'Findings with evidence and impact, prioritized fixes, implementation notes where scoped, and a retest checklist.',
    outside: 'Unauthorized testing, third-party systems, destructive actions, and an undefined “make everything secure” mandate.',
    startsWith: 'The first step is an agreed list of domains, hosts, repositories, access boundaries, exclusions, and the decision the review needs to support.',
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
    kicker: 'AI automation',
    title: 'Give useful tools a governed shape.',
    description: 'Build controlled agents and workflow automations with explicit permissions, logs, approvals, and failure handling that a real operator can understand.',
    href: '/services/workflow-automation',
    cta: 'Explore AI automation',
    bestFor: 'Teams losing time to recurring coordination, reporting, or tool handoffs; builders who need an AI prototype with clear authority controls.',
    systems: 'Forms, inboxes, spreadsheets, CRMs, internal APIs, scheduled jobs, MCP tools, knowledge sources, and operational reporting.',
    receives: 'A workflow and tool map, bounded implementation or prototype, logs, exception handling, approval points, validation, and handoff notes.',
    outside: 'Autonomous access to sensitive systems without an owner, unofficial integrations that cannot be maintained, and “add AI” without a useful workflow.',
    startsWith: 'The first step is mapping one workflow: its inputs, source of truth, permissions, exceptions, human decisions, and a result worth validating.',
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
    kicker: 'Full-stack development',
    title: 'Build the next useful piece.',
    description: 'Design, build, deploy, and improve applications and services from interface through production operations, with the seams between layers made explicit.',
    href: '/services/full-stack-development',
    cta: 'Explore full-stack delivery',
    bestFor: 'Founders moving from prototype to production, internal teams with a capability gap, and agencies needing implementation support across the stack.',
    systems: 'React and Next.js applications, TypeScript and Node.js services, Python backends, SQL data, authentication, APIs, integrations, and Linux deployment.',
    receives: 'Written scope and architecture, implementation, tests, deployment support where scoped, documentation, and a handoff that explains how to operate the result.',
    outside: 'A rebuild without a defined capability, indefinite feature queues, or a production launch where no one owns the system after delivery.',
    startsWith: 'The first step is defining the capability, users, data, dependencies, production constraints, and acceptance criteria for the next useful cut.',
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
    description: 'Review an application, repository, deployment, AI integration, or supporting host and leave with evidence-backed priorities.',
    href: '/contact?service=security-review',
  },
  {
    title: 'AI Automation Discovery and Prototype',
    description: 'Map one workflow and build a controlled working prototype with permissions, logs, human decisions, and a clear next step.',
    href: '/contact?service=ai-automation-discovery',
  },
  {
    title: 'Full-Stack Build Sprint',
    description: 'Define and implement one application capability, internal tool, dashboard, API, integration, or backend service.',
    href: '/contact?service=full-stack-build-sprint',
  },
]

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Services', url: 'https://bluedot.it.com/services' }]} />
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div>
            <span className="sr2-kicker">Security · AI automation · full-stack delivery</span>
            <h1>Technical work for systems that <span>have to work.</span></h1>
          </div>
          <div className="sr2-page-hero-note">
            <p>BlueDot helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.</p>
            <Link className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</Link>
          </div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <p className="sr2-editorial-intro">Scope, deliverables, acceptance criteria, pricing, and schedule are agreed in writing before work begins. The right first step depends on the system and the consequence of getting it wrong.</p>
          <div className="sr2-service-categories">
            {categories.map((category) => (
              <article className="sr2-service-category" id={category.id} key={category.id}>
                <header className="sr2-service-category-head">
                  <span className="sr2-kicker">{category.kicker}</span>
                  <h2>{category.title}</h2>
                  <p>{category.description}</p>
                </header>
                <div className="sr2-service-category-body">
                  <div className="sr2-service-answers">
                    <div><h3>Who it is for</h3><p>{category.bestFor}</p></div>
                    <div><h3>What systems are covered</h3><p>{category.systems}</p></div>
                    <div><h3>What you receive</h3><p>{category.receives}</p></div>
                    <div><h3>What it starts with</h3><p>{category.startsWith}</p></div>
                    <div><h3>What stays outside</h3><p>{category.outside}</p></div>
                  </div>
                  <div className="sr2-service-offerings">
                    <h3>Available work</h3>
                    <ul>{category.services.map((service) => <li key={service.name}><Link href={service.href}>{service.name}</Link></li>)}</ul>
                    <Link className="sr2-link" href={category.href}>{category.cta}</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-sprint">
        <div className="sr2-wrap sr2-sprint-grid">
          <div>
            <span className="sr2-kicker">Bounded entry point</span>
            <h2>Operations Automation &amp; Reporting Sprint</h2>
            <p>Replace one repetitive operational process with a maintainable automation, report, or lightweight dashboard built around agreed tools and data sources. It is a focused way to begin an AI automation engagement, not a promise of “AI everywhere.”</p>
            <Link className="sr2-link" href="/services/operations-automation-reporting">View the sprint</Link>
          </div>
          <div className="sr2-scope">
            <div><strong>Review the current process</strong><span>Document inputs, data sources, handoffs, exceptions, and the biggest time cost.</span></div>
            <div><strong>Improve one high-cost step</strong><span>Reduce repetitive collection, cleanup, or status chasing without hiding failures.</span></div>
            <div><strong>Hand off the result</strong><span>Leave working changes, validation evidence, and clear next steps.</span></div>
          </div>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep">
        <div className="sr2-wrap">
          <div className="sr2-section-head">
            <div><span className="sr2-kicker">Choose the engagement</span><h2>Start with the engagement that matches the problem.</h2></div>
            <p>Each entry point is a defined engagement. The target, deliverables, acceptance criteria, price, and schedule are settled before implementation begins.</p>
          </div>
          <div className="sr2-entry-lines">
            {entryPoints.map((entryPoint) => (
              <Link className="sr2-entry-line" href={entryPoint.href} key={entryPoint.title}>
                <h3>{entryPoint.title}</h3><p>{entryPoint.description}</p><span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-section">
        <div className="sr2-wrap sr2-process">
          <div><span className="sr2-kicker">Engagement sequence</span><h2>A defined path from review to handoff.</h2></div>
          <div className="sr2-process-line">
            <div><strong>Review</strong><p>Understand the current setup, priority, and authorization.</p></div>
            <div><strong>Scope</strong><p>Set deliverables, assumptions, exclusions, price, and acceptance criteria.</p></div>
            <div><strong>Implement</strong><p>Make the change, test it, and keep decisions visible.</p></div>
            <div><strong>Validate</strong><p>Document the result, failure points, and next operating step.</p></div>
          </div>
        </div>
      </section>

      <section className="sr2-close">
        <div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Start with the system</span><h2>Ready to define the work?</h2></div><div><p>Tell BlueDot what is failing, what system is involved, and what outcome would make the engagement worthwhile.</p><Link className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</Link></div></div>
      </section>
    </>
  )
}
