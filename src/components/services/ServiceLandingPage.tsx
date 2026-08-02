import Link from 'next/link'
import type { Metadata } from 'next'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export type ServiceSlug = keyof typeof servicePages

export const servicePages = {
  'operations-automation-reporting': {
    title: 'Operations Automation and Reporting Sprint',
    description: 'Replace one repetitive operational process with a maintainable automation, report, or lightweight dashboard built around your existing tools.',
    who: 'Small businesses and operational teams that lose time copying data, assembling recurring reports, checking multiple portals, or chasing unclear handoffs.',
    problems: ['Weekly or monthly reporting assembled manually', 'Information copied between forms, inboxes, spreadsheets, and portals', 'Recurring status work with no reliable owner, exception list, or source of truth'],
    deliverables: ['Current-state workflow and data-source map', 'One bounded implementation using the agreed data sources', 'Validation, failure visibility, logs, and human decision points', 'Documentation, acceptance evidence, and handoff'],
    tools: ['Python', 'TypeScript', 'REST APIs', 'webhooks', 'Google Workspace', 'scheduled jobs', 'lightweight dashboards'],
    examples: ['Combine portal exports into a weekly executive report', 'Route approved form data into a tracker and exception queue', 'Create a small operational dashboard from stable source data'],
    pricing: 'Final price, timeline, integrations, correction period, and exclusions are confirmed in a written scope before work begins.',
    faq: [
      ['Is this an AI product?', 'Not necessarily. The goal is a reliable business outcome. AI is used only when it materially improves the approved workflow.'],
      ['What is outside the starter sprint?', 'Complex browser portals, unstable authentication, major data cleanup, ongoing operations, and materially expanded integrations are scoped separately.'],
      ['Will I be able to understand the result?', 'Yes. The handoff includes documentation, validation evidence, and clear failure and human-review points.'],
    ],
  },
  'security-reviews': {
    title: 'Security Reviews for Small Businesses and Web Teams',
    description: 'A practical review of your website, server, application, and workflow risks with prioritized fixes you can act on.',
    who: 'Small businesses, solo founders, agencies, and technical teams that need a clear security baseline without an enterprise audit process.',
    problems: ['Unknown exposure on public websites and VPS hosts', 'Weak authentication, headers, secrets, or deployment habits', 'Unclear remediation priorities after a scan or incident concern'],
    deliverables: ['Findings summary with severity and business impact', 'Prioritized remediation checklist', 'Evidence-backed notes, commands, screenshots, or code references where useful'],
    tools: ['Linux', 'NGINX', 'Docker', 'Next.js', 'Node.js', 'Python', 'OWASP guidance'],
    examples: ['Pre-launch security review', 'Post-redesign hardening pass', 'VPS and web app exposure review'],
    pricing: 'Fixed-scope reviews start with a short discovery call and a written checklist of targets.',
    faq: [
      ['Is this a penetration test?', 'It is a practical security review unless we explicitly scope a deeper authorized test.'],
      ['Will I get fixes or only findings?', 'You get prioritized findings and can add implementation support if you want the fixes handled.'],
    ],
  },
  'server-hardening': {
    title: 'Server Hardening for Linux, NGINX, Docker, and Node',
    description: 'Secure and clean up production VPS hosts so web apps run with safer defaults, clearer logs, and fewer exposed edges.',
    who: 'Businesses running websites, APIs, dashboards, or automation on Linux VPS infrastructure.',
    problems: ['Open services and stale packages', 'Weak firewall, SSH, reverse proxy, or TLS configuration', 'Containers and app processes deployed without operational guardrails'],
    deliverables: ['Hardening plan', 'Firewall and SSH review', 'NGINX/TLS cleanup', 'Docker and process manager recommendations', 'Rollback-aware change notes'],
    tools: ['Debian', 'Ubuntu', 'Kali', 'NGINX', 'Docker', 'systemd', 'PM2', 'Certbot'],
    examples: ['Secure a Next.js VPS', 'Clean up exposed admin surfaces', 'Prepare a host for production launch'],
    pricing: 'Hardening work is scoped by host count, app count, and whether implementation access is needed.',
    faq: [
      ['Do you need root access?', 'Implementation usually needs privileged access. Review-only work can use read-only evidence.'],
      ['Can this be done without downtime?', 'Most changes can be planned to minimize downtime, but risky service changes are scheduled deliberately.'],
    ],
  },
  'nextjs-security-hardening': {
    title: 'Next.js Security Hardening Before Production',
    description: 'Review and improve a Next.js application before launch, with attention to auth, headers, routes, server actions, APIs, and deployment behavior.',
    who: 'Teams launching or maintaining Next.js applications with public forms, auth, dashboards, or API routes.',
    problems: ['Indexable login/admin pages', 'Weak metadata, headers, or cache behavior', 'Unsafe API routes, secrets handling, or deployment assumptions'],
    deliverables: ['Route and metadata review', 'Security headers recommendations', 'Auth and admin surface checks', 'Build and deployment notes'],
    tools: ['Next.js', 'React', 'TypeScript', 'Prisma', 'NextAuth.js', 'ESLint'],
    examples: ['Pre-launch checklist', 'Admin route noindex cleanup', 'API route exposure review'],
    pricing: 'Starts with a repository review and a short list of high-impact production fixes.',
    faq: [
      ['Can you work from a private repo?', 'Yes, with scoped access and clear boundaries.'],
      ['Do you rewrite the app?', 'No. The goal is targeted hardening unless a rebuild is explicitly scoped.'],
    ],
  },
  'workflow-automation': {
    title: 'Workflow Automation and API Integrations',
    description: 'Turn repetitive business workflows into reliable automations with clear handoffs, logs, and human review where it matters.',
    who: 'Small teams that rely on forms, spreadsheets, inboxes, CRMs, content queues, booking flows, or internal dashboards.',
    problems: ['Manual copy/paste work', 'Unclear handoffs between tools', 'Automations that fail silently or are hard to maintain'],
    deliverables: ['Workflow map', 'API integration plan', 'Automation scripts or services', 'Logging and failure-handling notes'],
    tools: ['Python', 'TypeScript', 'Google Workspace', 'REST APIs', 'webhooks', 'cron jobs'],
    examples: ['Lead intake routing', 'Content workflow support', 'Internal reporting automation'],
    pricing: 'Automation work starts with one narrow workflow and expands after the first reliable handoff works.',
    faq: [
      ['Can humans stay in the loop?', 'Yes. Approval steps and review queues are preferred for sensitive workflows.'],
      ['Can you connect tools without official APIs?', 'Sometimes, but official APIs and exports are more stable.'],
    ],
  },
  'mcp-security-consulting': {
    title: 'MCP Security Consulting for AI Tooling',
    description: 'Design and review Model Context Protocol tool exposure so AI agents can use useful capabilities without unnecessary risk.',
    who: 'Builders exposing local tools, internal APIs, security utilities, or business workflows to AI agents.',
    problems: ['Overbroad tool permissions', 'No approval layer for sensitive actions', 'Weak audit trail for agent-triggered operations'],
    deliverables: ['Tool exposure review', 'Approval and audit recommendations', 'Safer tool boundary design', 'Implementation support for MCP-related systems'],
    tools: ['MCP', 'TypeScript', 'Python', 'policy gates', 'audit logs', 'local-first agent runtimes'],
    examples: ['Review an MCP server before production use', 'Add approval gates for sensitive tools', 'Segment safe read-only tools from write actions'],
    pricing: 'MCP consulting is scoped by tool count, action risk, and whether implementation support is included.',
    faq: [
      ['Is MCP safe by default?', 'MCP is a protocol. Safety depends on the tools exposed, permissions, approvals, and logs.'],
      ['Can you review an existing MCP server?', 'Yes. The review focuses on boundaries, prompts, credentials, and side effects.'],
    ],
  },
  'small-business-websites': {
    title: 'Small Business Website Builds with Secure Defaults',
    description: 'Build or refresh a small business website with practical SEO, fast pages, clean contact flows, and security-conscious deployment.',
    who: 'Local and remote small businesses that need a credible website without a bloated agency process.',
    problems: ['Outdated or slow websites', 'Unclear contact paths', 'Weak hosting, forms, analytics, or maintenance practices'],
    deliverables: ['Modern responsive website', 'Basic technical SEO', 'Contact form or lead flow', 'Deployment and maintenance notes'],
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel or VPS deployments', 'Google Search Console'],
    examples: ['New service business website', 'Portfolio or consultant site', 'Replacement for a fragile legacy site'],
    pricing: 'Website builds start with a fixed scope for core pages, then add integrations or custom features as needed.',
    faq: [
      ['Can you write the copy?', 'Yes, but the best pages come from a short discovery process and real service details.'],
      ['Do you handle hosting?', 'Yes, hosting and deployment can be included in the scope.'],
    ],
  },
  'ai-security-tooling': {
    title: 'AI Security Tooling and Agent Guardrails',
    description: 'Prototype and harden AI-assisted security workflows with safer tool access, clearer logs, and practical human oversight.',
    who: 'Security-minded builders, operators, and small teams experimenting with AI-assisted analysis or automation.',
    problems: ['Agents with too much authority', 'No evidence trail for AI-assisted actions', 'Prototype tools that are useful but not safe enough for real workflows'],
    deliverables: ['Prototype review', 'Tool and permission model', 'Guardrail recommendations', 'Audit-friendly logging plan'],
    tools: ['Python', 'TypeScript', 'LLM APIs', 'MCP', 'structured logs', 'approval gates'],
    examples: ['Agent tool permission review', 'Security workflow prototype', 'Audit log design for AI actions'],
    pricing: 'AI security tooling starts as a small prototype or review before expanding into production workflows.',
    faq: [
      ['Do you remove human oversight?', 'No. Sensitive actions should keep a human approval step.'],
      ['Can you work with local models?', 'Yes, if the workflow and hardware constraints are clear.'],
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
        <span className="pill">BlueDot IT service</span>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">{page.title}</h1>
        <p className="text-xl text-base-content/80">{page.description}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href={`/contact?service=${slug}`}><Button>Describe the problem</Button></Link>
          <Link href="/projects" className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold hover:bg-white/5">View projects</Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Who it is for</h2>
          <p className="text-base-content/75 leading-relaxed">{page.who}</p>
        </Card>
        <Card className="space-y-3 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Pricing starting point</h2>
          <p className="text-base-content/75 leading-relaxed">{page.pricing}</p>
        </Card>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4 bg-white/5 border-white/10 p-8">
          <h2 className="text-2xl font-bold">Problems this solves</h2>
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
          <h2 className="text-2xl font-bold">Tools and stack</h2>
          <ul className="list-disc space-y-2 pl-5 text-base-content/75">
            {page.tools.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </Card>
      </section>

      <Card className="space-y-4 bg-white/5 border-white/10 p-8">
        <h2 className="text-2xl font-bold">Example use cases</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {page.examples.map((item) => <li key={item} className="rounded-xl border border-white/10 p-4 text-base-content/75">{item}</li>)}
        </ul>
      </Card>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">FAQ</h2>
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
        <h2 className="text-2xl font-bold">Need this scoped for your site or system?</h2>
        <p className="text-base-content/75">Send the target, the concern, and what outcome would make the work useful.</p>
        <Link href={`/contact?service=${slug}`}><Button size="lg" special="wide">Contact BlueDot IT</Button></Link>
      </section>
    </div>
  )
}
