import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Security engineering, AI automation, and full-stack development for teams building real systems.',
  alternates: { canonical: 'https://bluedot.it.com/services' },
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
    kicker: 'Security engineering',
    title: 'Find the risk. Fix what matters.',
    description: 'Review, harden, and improve the application and infrastructure boundaries that matter to production.',
    href: '/services/security-reviews',
    cta: 'Start with a security review',
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
    description: 'Build controlled agents and workflow automations with explicit permissions, logs, approvals, and maintainable failure handling.',
    href: '/services/workflow-automation',
    cta: 'Explore AI automation',
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
    description: 'Design, build, deploy, and improve applications and services from frontend through production operations.',
    href: '/services/full-stack-development',
    cta: 'Explore full-stack development',
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
    href: '/contact?service=security-review',
  },
  {
    title: 'AI Automation Discovery and Prototype',
    description: 'Map one workflow and build a controlled working prototype with clear boundaries.',
    href: '/contact?service=ai-automation-discovery',
  },
  {
    title: 'Full-Stack Build Sprint',
    description: 'A defined implementation phase for an application capability, internal tool, dashboard, API, integration, or backend service.',
    href: '/contact?service=full-stack-build-sprint',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div>
            <span className="sr2-kicker">Security · AI Automation · Full-Stack</span>
            <h1>Build the system. <span>Respect the boundary.</span></h1>
          </div>
          <div className="sr2-page-hero-note">
            <p>BlueDot combines security engineering, AI automation, and full-stack implementation so the application, workflow, deployment, and control surface can be designed together.</p>
            <Link className="sr2-link" href="/contact">Discuss your project</Link>
          </div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <p className="sr2-editorial-intro">No fixed prices or invented timelines. The target, boundary, deliverables, and acceptance criteria are defined in writing.</p>
          <div className="sr2-service-page-list">
            {categories.map((category) => (
              <article className="sr2-service-page-row" id={category.id} key={category.id}>
                <div>
                  <span className="sr2-kicker">{category.kicker}</span>
                  <h2>{category.title}</h2>
                </div>
                <div>
                  <p>{category.description}</p>
                  <div className="sr2-service-page-details">
                    <div>
                      <h4>Where it helps</h4>
                      <p>Review, design, implementation, validation, and a handoff across the system boundary that matters.</p>
                    </div>
                    <div>
                      <h4>Available work</h4>
                      <ul>
                        {category.services.map((service) => (
                          <li key={service.name}><Link href={service.href}>{service.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Link className="sr2-link" href={category.href}>{category.cta}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-sprint">
        <div className="sr2-wrap sr2-sprint-grid">
          <div>
            <span className="sr2-kicker">Operations entry point</span>
            <h2>Operations Automation &amp; Reporting Sprint</h2>
            <p>Replace one repetitive operational process with a maintainable automation, report, or lightweight dashboard built around agreed tools and data sources. It is an entry point—not the definition of the company.</p>
            <Link className="sr2-link" href="/services/operations-automation-reporting">View the sprint</Link>
          </div>
          <div className="sr2-scope">
            <div><strong>Review the current process</strong><span>Document the inputs, data sources, handoffs, and biggest time cost.</span></div>
            <div><strong>Improve one high-cost step</strong><span>Reduce repetitive collection, cleanup, or status chasing.</span></div>
            <div><strong>Hand off the result</strong><span>Leave working changes, validation evidence, and clear next steps.</span></div>
          </div>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep">
        <div className="sr2-wrap">
          <div className="sr2-section-head">
            <div>
              <span className="sr2-kicker">Three ways to begin</span>
              <h2>Choose the first useful cut.</h2>
            </div>
            <p>Each entry point is a bounded engagement. The target, boundary, deliverables, and acceptance criteria are defined before implementation begins.</p>
          </div>
          <div>
            {entryPoints.map((entryPoint) => (
              <Link className="sr2-entry-line" href={entryPoint.href} key={entryPoint.title}>
                <h3>{entryPoint.title}</h3>
                <p>{entryPoint.description}</p>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-section">
        <div className="sr2-wrap sr2-process">
          <div>
            <span className="sr2-kicker">Working together</span>
            <h2>A straightforward process.</h2>
          </div>
          <div className="sr2-process-line">
            <div><strong>Review</strong><p>Understand the current setup and priority.</p></div>
            <div><strong>Plan</strong><p>Set the scope, assumptions, and acceptance criteria.</p></div>
            <div><strong>Build</strong><p>Implement, test, and keep decisions visible.</p></div>
            <div><strong>Hand off</strong><p>Leave documentation, validation, and next steps.</p></div>
          </div>
        </div>
      </section>
    </>
  )
}
