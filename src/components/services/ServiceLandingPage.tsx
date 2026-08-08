import Link from 'next/link'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'

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
    deliverables: ['Tool exposure review', 'Approval and audit recommendations', 'Safer tool-boundary design', 'Implementation support for MCP-related systems'],
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
      ['Can you work with local models?', 'Yes, if the workflow, model boundary, and hardware constraints are clear.'],
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
    scope: 'A build sprint is defined by the application capability, constraints, dependencies, production boundary, and acceptance criteria agreed in writing.',
    faq: [
      ['Can you work inside an existing codebase?', 'Yes. The first step is to understand the current architecture, boundaries, and highest-value implementation path.'],
      ['Do you handle deployment?', 'Deployment and production hardening can be included when they are part of the written scope.'],
    ],
  },
} as const

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
    },
  }
}

export function renderServicePage(slug: ServiceSlug) {
  const page = servicePages[slug]

  return (
    <div className="page-shell space-y-12 py-12">
      <section className="max-w-4xl space-y-5">
        <span className="pill">{page.category}</span>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{page.title}</h1>
        <p className="text-xl text-base-content/80">{page.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/contact?service=${slug}`} className="btn btn-primary">Discuss this service</Link>
          <Link href="/projects" className="btn btn-outline border-white/20 hover:bg-white/10">View selected work</Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Who it is for</h2>
          <p className="text-base-content/75 leading-relaxed">{page.who}</p>
        </Card>
        <Card className="space-y-3 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Scope and handoff</h2>
          <p className="text-base-content/75 leading-relaxed">{page.scope}</p>
        </Card>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Problems this addresses</h2>
          <ul className="list-disc space-y-2 pl-5 text-base-content/75">
            {page.problems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
        <Card className="space-y-4 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Deliverables</h2>
          <ul className="list-disc space-y-2 pl-5 text-base-content/75">
            {page.deliverables.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
        <Card className="space-y-4 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Relevant stack</h2>
          <ul className="list-disc space-y-2 pl-5 text-base-content/75">
            {page.tools.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
      </section>

      <Card className="space-y-4 bg-white/5 border-white/10 p-8">
        <h2 className="text-2xl font-bold">Example scope</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {page.examples.map((item) => <li key={item} className="rounded-xl border border-white/10 p-4 text-base-content/75">{item}</li>)}
        </ul>
      </Card>

      {slug === 'security-reviews' && (
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-4 bg-white/5 border-white/10 p-8">
            <h2 className="text-2xl font-bold">Review methodology</h2>
            <ol className="list-decimal space-y-2 pl-5 text-base-content/75">
              <li>Confirm the agreed domains, hosts, repositories, and access boundaries.</li>
              <li>Review public exposure, authentication, dependencies, headers, deployment, and secrets handling.</li>
              <li>Validate material findings with safe, authorized evidence and explain the technical and business impact.</li>
              <li>Prioritize remediation by likelihood, impact, effort, and available rollback path.</li>
            </ol>
          </Card>
          <Card className="space-y-4 bg-white/5 border-white/10 p-8">
            <h2 className="text-2xl font-bold">Remediation path</h2>
            <p className="text-base-content/75 leading-relaxed">
              The handoff includes findings, evidence, remediation order, and a retest checklist. Implementation support can address agreed fixes instead of leaving the team with a scanner dump.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-sm font-semibold">
              <Link href="/services/server-hardening" className="text-primary hover:underline">Related: server hardening</Link>
              <Link href="/services/nextjs-security-hardening" className="text-primary hover:underline">Related: Next.js hardening</Link>
            </div>
          </Card>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Questions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {page.faq.map(([question, answer]) => (
            <Card key={question} className="space-y-2 bg-white/5 border-white/10 p-6">
              <h3 className="font-bold">{question}</h3>
              <p className="text-sm text-base-content/75 leading-relaxed">{answer}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold">Need this scoped for your system?</h2>
        <p className="text-base-content/75">Send the target, the concern, and what outcome would make the work useful.</p>
        <Link href={`/contact?service=${slug}`} className="btn btn-primary btn-lg">Contact BlueDot IT</Link>
      </section>
    </div>
  )
}
