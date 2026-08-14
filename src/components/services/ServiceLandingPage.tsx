import Link from 'next/link'
import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export type ServiceSlug = keyof typeof servicePages

export const servicePages = {
  'operations-automation-reporting': {
    category: 'AI Automation',
    title: 'Operations Automation and Reporting Sprint',
    description: 'Replace one repetitive operational process with a maintainable automation, report, or lightweight dashboard built around agreed tools and data sources.',
    who: 'Startups, internal teams, and growing businesses that lose time copying data, assembling recurring reports, checking multiple portals, or chasing unclear handoffs.',
    problems: ['Recurring reporting assembled manually', 'Information copied between forms, inboxes, spreadsheets, and portals', 'Status work with no reliable owner, exception list, or source of truth'],
    deliverables: ['Current-state workflow and data-source map', 'One bounded implementation using the agreed data sources', 'Validation, failure visibility, logs, and human decision points', 'Documentation, acceptance evidence, and handoff'],
    tools: ['Python', 'TypeScript', 'REST APIs', 'webhooks', 'Google Workspace', 'scheduled jobs', 'lightweight dashboards'],
    examples: ['Combine portal exports into a recurring report', 'Route approved form data into a tracker and exception queue', 'Create a small operational dashboard from stable source data'],
    scope: 'The final scope, integrations, correction period, exclusions, and acceptance criteria are confirmed in writing before work begins.',
    faq: [
      ['Is this an AI product?', 'Not necessarily. The goal is a reliable business outcome. AI is used only when it materially improves the approved workflow.'],
      ['What is outside the starter scope?', 'Complex browser portals, unstable authentication, major data cleanup, ongoing operations, and materially expanded integrations are scoped separately.'],
      ['Will I be able to understand the result?', 'Yes. The handoff includes documentation, validation evidence, and clear failure and human-review points.'],
    ],
  },
  'security-reviews': {
    category: 'Security Engineering',
    title: 'Application and Infrastructure Security Reviews',
    description: 'Review a website, API, application, deployment, AI integration, or supporting host and turn the evidence into prioritized fixes you can act on.',
    who: 'Startups, software teams, founders, agencies, and technical organizations that need a clear security baseline and a practical remediation path.',
    problems: ['Unknown exposure on public applications and VPS hosts', 'Weak authentication, headers, secrets, or deployment habits', 'Unclear remediation priorities after a scan or incident concern'],
    deliverables: ['Findings with severity and technical/business impact', 'Evidence-backed notes, commands, screenshots, or code references where useful', 'Prioritized remediation plan', 'Optional implementation support and retest checklist'],
    tools: ['Linux', 'NGINX', 'Docker', 'Next.js', 'Node.js', 'Python', 'OWASP guidance'],
    examples: ['Pre-launch application review', 'Post-redesign hardening pass', 'VPS and web application exposure review'],
    scope: 'A bounded review begins with agreed domains, hosts, repositories, access boundaries, and exclusions. destructive testing and third-party systems remain out of scope unless explicitly authorized.',
    faq: [
      ['Is this a penetration test?', 'It is a practical security review unless we explicitly scope a deeper authorized test.'],
      ['Will I get fixes or only findings?', 'You get prioritized findings and can add implementation support if you want the fixes handled.'],
    ],
  },
  'server-hardening': {
    category: 'Security Engineering',
    title: 'Linux, NGINX, Docker, and VPS Hardening',
    description: 'Review and strengthen production hosts so applications run with safer defaults, clearer logs, and fewer exposed edges.',
    who: 'Teams running websites, APIs, dashboards, or automation on Linux VPS infrastructure.',
    problems: ['Open services and stale packages', 'Weak firewall, SSH, reverse-proxy, or TLS configuration', 'Containers and application processes deployed without operational guardrails'],
    deliverables: ['Hardening plan', 'Firewall and SSH review', 'NGINX/TLS cleanup', 'Docker and process-manager recommendations', 'Rollback-aware change notes'],
    tools: ['Debian', 'Ubuntu', 'Kali', 'NGINX', 'Docker', 'systemd', 'PM2', 'Certbot'],
    examples: ['Secure a Next.js VPS', 'Clean up exposed administrative surfaces', 'Prepare a host for production launch'],
    scope: 'Hardening is scoped by host count, application count, access level, maintenance window, and the changes that can be validated safely.',
    faq: [
      ['Do you need root access?', 'Implementation usually needs privileged access. Review-only work can use read-only evidence.'],
      ['Can this be done without downtime?', 'Changes are planned to minimize downtime, but risky service changes are scheduled deliberately.'],
    ],
  },
  'nextjs-security-hardening': {
    category: 'Security Engineering',
    title: 'Next.js Security Hardening Before Production',
    description: 'Review and improve a Next.js application before launch, with attention to authentication, headers, routes, server actions, APIs, and deployment behavior.',
    who: 'Teams launching or maintaining Next.js applications with public forms, authentication, dashboards, or API routes.',
    problems: ['Indexable login or administrative pages', 'Weak metadata, headers, or cache behavior', 'Unsafe API routes, secrets handling, or deployment assumptions'],
    deliverables: ['Route and metadata review', 'Security header recommendations', 'Authentication and administrative-surface checks', 'Build and deployment notes', 'Targeted remediation guidance'],
    tools: ['Next.js', 'React', 'TypeScript', 'Prisma', 'NextAuth.js', 'ESLint'],
    examples: ['Pre-launch checklist', 'Administrative route access and indexing review', 'API route exposure review'],
    scope: 'Work starts with a repository review and a bounded list of high-impact production concerns. A rebuild is separate from targeted hardening.',
    faq: [
      ['Can you work from a private repo?', 'Yes, with scoped access and clear boundaries.'],
      ['Do you rewrite the app?', 'No. The goal is targeted hardening unless a rebuild is explicitly scoped.'],
    ],
  },
  'workflow-automation': {
    category: 'AI Automation',
    title: 'Workflow Automation and API Integrations',
    description: 'Turn repetitive workflows into reliable automations with clear handoffs, logs, permissions, and human review where it matters.',
    who: 'Technical teams and growing organizations that rely on forms, spreadsheets, inboxes, CRMs, content queues, booking flows, or internal dashboards.',
    problems: ['Manual copy/paste work', 'Unclear handoffs between tools', 'Automations that fail silently or are hard to maintain'],
    deliverables: ['Workflow and tool map', 'API integration plan', 'Automation scripts or services', 'Logging and failure-handling notes', 'Approval and exception points where appropriate'],
    tools: ['Python', 'TypeScript', 'REST APIs', 'webhooks', 'Google Workspace', 'scheduled jobs'],
    examples: ['Lead-intake routing', 'Content workflow support', 'Internal reporting automation'],
    scope: 'Automation work starts with one narrow workflow and expands only after the first reliable handoff is understood and validated.',
    faq: [
      ['Can humans stay in the loop?', 'Yes. Approval steps and review queues are preferred for sensitive workflows.'],
      ['Can you connect tools without official APIs?', 'Sometimes, but official APIs and exports are more stable and maintainable.'],
    ],
  },
  'mcp-security-consulting': {
    category: 'Security Engineering + AI Automation',
    title: 'MCP Security Consulting for AI Tooling',
    description: 'Design and review Model Context Protocol tool exposure so AI agents can use useful capabilities without unnecessary authority or hidden side effects.',
    who: 'Builders exposing local tools, internal APIs, security utilities, or business workflows to AI agents.',
    problems: ['Overbroad tool permissions', 'No approval layer for sensitive actions', 'Weak audit trails for agent-triggered operations'],
    deliverables: ['Tool exposure review', 'Approval and audit recommendations', 'Safer tool authorization design', 'Implementation support for MCP-related systems'],
    tools: ['MCP', 'TypeScript', 'Python', 'policy gates', 'audit logs', 'local-first agent runtimes'],
    examples: ['Review an MCP server before wider use', 'Add approval gates for sensitive tools', 'Separate safe read-only tools from write actions'],
    scope: 'MCP consulting is scoped by tool count, action risk, credential boundaries, transport, and whether implementation support is included.',
    faq: [
      ['Is MCP safe by default?', 'MCP is a protocol. Safety depends on the tools exposed, permissions, approvals, credentials, and logs.'],
      ['Can you review an existing MCP server?', 'Yes. The review focuses on boundaries, credentials, prompts, authorization, and side effects.'],
    ],
  },
  'ai-security-tooling': {
    category: 'AI Automation + Security Engineering',
    title: 'AI Security Tooling and Agent Guardrails',
    description: 'Prototype and strengthen AI-assisted security workflows with safer tool access, clearer logs, and practical human oversight.',
    who: 'Security-minded builders, operators, and technical teams experimenting with AI-assisted analysis or automation.',
    problems: ['Agents with too much authority', 'No evidence trail for AI-assisted actions', 'Useful prototypes that are not yet bounded for real workflows'],
    deliverables: ['Prototype or repository review', 'Tool and permission model', 'Guardrail recommendations', 'Audit-friendly logging plan', 'Human approval design'],
    tools: ['Python', 'TypeScript', 'LLM APIs', 'MCP', 'structured logs', 'approval gates'],
    examples: ['Agent tool-permission review', 'Security workflow prototype', 'Audit-log design for AI actions'],
    scope: 'AI security tooling starts with a bounded prototype or review before any wider production workflow is considered.',
    faq: [
      ['Do you remove human oversight?', 'No. Sensitive actions should keep a human approval step.'],
      ['Can you work with local models?', 'Yes, if the workflow, model, data, and hardware constraints are clear.'],
    ],
  },
  'full-stack-development': {
    category: 'Full-Stack Development',
    title: 'Full-Stack Application Development',
    description: 'Design, build, deploy, and improve full-stack applications, APIs, dashboards, internal platforms, integrations, and production services.',
    who: 'Startups, software companies, founders moving from prototype to production, technical teams, and agencies needing specialist implementation support.',
    problems: ['A prototype that needs a maintainable production path', 'Frontend and backend work split across disconnected handoffs', 'APIs, dashboards, authentication, or integrations that need clearer boundaries'],
    deliverables: ['Written scope and architecture', 'Frontend and backend implementation', 'APIs, data, authentication, and integrations', 'Tests and validation', 'Deployment, documentation, and handoff'],
    tools: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'SQL', 'Docker', 'Linux infrastructure'],
    examples: ['Internal platform or dashboard', 'API and integration layer', 'Production service or application capability'],
    scope: 'A build sprint is defined by the application capability, constraints, dependencies, production conditions, and acceptance criteria agreed in writing.',
    faq: [
      ['Can you work inside an existing codebase?', 'Yes. The first step is to understand the current architecture, boundaries, and highest-value implementation path.'],
      ['Do you handle deployment?', 'Deployment and production hardening can be included when they are part of the written scope.'],
    ],
  },
} as const

const serviceGuidance: Record<ServiceSlug, { outside: string }> = {
  'operations-automation-reporting': { outside: 'Unstable portals, unowned source data, major cleanup, and ongoing operations are separate decisions rather than hidden inside a starter sprint.' },
  'security-reviews': { outside: 'Unauthorized testing, destructive actions, third-party systems, and a complete penetration test remain outside the review unless explicitly scoped and authorized.' },
  'server-hardening': { outside: 'Application rewrites, unmanaged hosts, and changes that cannot be tested or rolled back safely need a separate plan.' },
  'nextjs-security-hardening': { outside: 'A full rebuild, product redesign, and unbounded feature work are separate from targeted production hardening.' },
  'workflow-automation': { outside: 'Brittle scraping, unofficial integrations, and autonomous actions against sensitive systems are not assumed to be safe or maintainable.' },
  'mcp-security-consulting': { outside: 'A general AI safety guarantee, unrestricted credentials, and authorization to test systems you do not own are outside the engagement.' },
  'ai-security-tooling': { outside: 'Unsupervised high-impact actions, production autonomy without an owner, and claims of universal model safety stay outside the initial prototype or review.' },
  'full-stack-development': { outside: 'An indefinite feature queue, an ownerless production launch, and a rebuild without an agreed capability are separate engagements.' },
}

export function metadataForServicePage(slug: ServiceSlug): Metadata {
  const page = servicePages[slug]
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://bluedot.it.com/services/${slug}`,
    },
    openGraph: {
      title: `${page.title} | BlueDot IT`,
      description: page.description,
      type: 'website',
      url: `https://bluedot.it.com/services/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${page.title} | BlueDot IT` }],
    },
    twitter: { card: 'summary_large_image', title: `${page.title} | BlueDot IT`, description: page.description, images: ['/twitter-image'] },
  }
}

export function renderServicePage(slug: ServiceSlug) {
  const page = servicePages[slug]
  const guidance = serviceGuidance[slug]

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Services', url: 'https://bluedot.it.com/services' }, { name: page.title, url: `https://bluedot.it.com/services/${slug}` }]} />
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div>
            <span className="sr2-kicker">{page.category}</span>
            <h1>{page.title}</h1>
          </div>
          <div className="sr2-page-hero-note">
            <p>{page.description}</p>
            <Link className="sr2-link" href={`/contact?service=${slug}`}>Discuss this service</Link>
          </div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <div className="sr2-service-detail-intro">
            <span className="sr2-kicker">Who this is for</span>
            <p>{page.who}</p>
          </div>
          <div className="sr2-service-detail-sections">
            <article>
              <span className="sr2-kicker">The problem</span>
              <h2>Start with the pressure point.</h2>
              <p>{page.description}</p>
              <ul>{page.problems.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span className="sr2-kicker">Systems and environment</span>
              <h2>Work with what is already real.</h2>
              <p>The review or build is grounded in the stack, data, permissions, and deployment conditions that the result has to survive.</p>
              <ul>{page.tools.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span className="sr2-kicker">Deliverables</span>
              <h2>Leave with usable work.</h2>
              <ul>{page.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="sr2-service-examples"><strong>Typical starting points:</strong> {page.examples.join('; ')}.</p>
            </article>
            <article>
              <span className="sr2-kicker">How it begins</span>
              <h2>Agree the first useful cut.</h2>
              <p>{page.scope}</p>
              <Link className="sr2-link" href="/projects">See related public work</Link>
            </article>
            <article>
              <span className="sr2-kicker">Operational safeguards</span>
              <h2>Keep the scope honest.</h2>
              <p>{guidance.outside}</p>
            </article>
          </div>
        </div>
      </section>

      {slug === 'security-reviews' && (
        <section className="sr2-section sr2-section-deep">
          <div className="sr2-wrap sr2-about-grid">
            <div className="sr2-about-block"><span className="sr2-kicker">Review methodology</span><h2>Evidence before assurances.</h2></div>
            <div className="sr2-service-page-details">
              <div><h4>Sequence</h4><ul><li>Confirm agreed domains, hosts, repositories, and access boundaries.</li><li>Review public exposure, authentication, dependencies, headers, deployment, and secrets handling.</li><li>Validate material findings with safe, authorized evidence.</li><li>Prioritize remediation by likelihood, impact, effort, and rollback path.</li></ul></div>
              <div><h4>Related work</h4><ul><li><Link href="/services/server-hardening">Server hardening</Link></li><li><Link href="/services/nextjs-security-hardening">Next.js hardening</Link></li></ul></div>
            </div>
          </div>
        </section>
      )}

      <section className="sr2-section">
        <div className="sr2-wrap">
          <div className="sr2-section-head"><div><span className="sr2-kicker">Questions</span><h2>Before the work starts.</h2></div><p>Scope is confirmed in writing. These answers describe the normal shape of this service.</p></div>
          <div className="sr2-note-list">
            {page.faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
          </div>
        </div>
      </section>

      <section className="sr2-close">
        <div className="sr2-wrap"><div className="sr2-close-copy"><div><span className="sr2-kicker">Next step</span><h2>Need this scoped for your system?</h2></div><div><p>Send the target, the concern, and what outcome would make the work useful.</p><Link className="sr2-link" href={`/contact?service=${slug}`}>Contact BlueDot IT</Link></div></div></div>
      </section>
    </>
  )
}
