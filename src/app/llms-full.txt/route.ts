export const dynamic = 'force-static'

export async function GET() {
  const body = `# BlueDot IT, LLC — Full Documentation

> BlueDot IT, LLC helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.

## Positioning

Security, AI automation, and full-stack delivery for systems that have to work.

BlueDot works across frontend applications, backend services, APIs, data, authentication, deployment, Linux infrastructure, AI tool boundaries, and security controls. The work is scoped in writing and delivered with validation, documentation, and handoff.

## Public pages

- Home: https://bluedot.it.com/
- Services: https://bluedot.it.com/services
- Work: https://bluedot.it.com/work
- About: https://bluedot.it.com/about
- Process: https://bluedot.it.com/process
- Contact: https://bluedot.it.com/contact
- Privacy: https://bluedot.it.com/legal/privacy
- Terms: https://bluedot.it.com/legal/terms
- Security policy: https://bluedot.it.com/.well-known/security.txt

## Security Engineering

Application and API security, authentication and authorization reviews, Next.js security hardening, Linux/Docker/NGINX/VPS hardening, CI/CD and dependency security, MCP and AI-agent security, and remediation implementation.

Related pages:

- https://bluedot.it.com/services/security-reviews
- https://bluedot.it.com/services/server-hardening
- https://bluedot.it.com/services/nextjs-security-hardening
- https://bluedot.it.com/services/mcp-security-consulting

## AI Automation

Controlled AI agents, workflow automation, LLM integrations, MCP servers and tools, RAG and knowledge systems, human approval workflows, permissions, logs, guardrails, agent observability, and operational reporting.

Related pages:

- https://bluedot.it.com/services/workflow-automation
- https://bluedot.it.com/services/ai-security-tooling
- https://bluedot.it.com/services/operations-automation-reporting
- https://bluedot.it.com/services/mcp-security-consulting

## Full-Stack Development

React and Next.js applications, TypeScript and Node.js services, Python backends and automation services, APIs, integrations, dashboards, internal platforms, authentication, admin systems, database design, deployment, and production hardening.

Primary page: https://bluedot.it.com/services/full-stack-development

## Engagement entry points

### Security Review

A bounded review of an application, repository, deployment, AI integration, or supporting host. Potential deliverables include findings with severity and evidence, technical and business impact, a prioritized remediation plan, optional implementation, and a retest checklist.

### AI Automation Discovery and Prototype

A bounded engagement to map one workflow and build a controlled working prototype. Potential deliverables include a workflow and tool map, data and permission boundaries, a functional prototype, logs, approval points, and a production roadmap.

### Full-Stack Build Sprint

A defined implementation phase for an application capability, internal tool, dashboard, API, integration, or backend service. Potential deliverables include written scope, architecture, implementation, tests, deployment, documentation, and handoff.

### Operations Automation and Reporting Sprint

A bounded AI Automation offering for replacing one repetitive operational process with a maintainable automation, report, or lightweight dashboard built around agreed tools and data sources.

## Selected public projects

- Odinn-Forge: local-first, single-user AI assistant with inspectable memory, approved tools, web research, and local activity history.
- GhostMCP: hardened Model Context Protocol server for authorized assessments with per-engagement capability manifests, fail-closed proxy routing, and tamper-evident audit logging.
- security-middleware: Node.js and Next.js development middleware for security headers, CORS, and npm dependency findings.
- SignalGate: OpenAI-compatible loopback routing layer for OpenClaw using embeddings, KNN, capability gates, and bounded failover.
- Ares: operator-supervised security assessment runtime with deterministic scope, risk, approvals, evidence, and reporting controls.
- ExploitRank: engine for ingesting, normalizing, and scoring vulnerability records and exploit-candidate evidence.
- agent-benchmarks: reproducible benchmark harness using isolated workspaces, deterministic assertions, and outcome-verified reports.

These are public engineering examples, not named clients, testimonials, or private case studies. BlueDot does not claim customer adoption, production scale, certifications, or security guarantees from these repositories.

## Insights

The /blog route is presented publicly as Insights. Notes are organized around three practical tracks: Security, AI Automation, and Full-Stack Engineering.

## Contact and data boundaries

- Website: https://bluedot.it.com/contact
- Email: jason@bluedot.it.com
- Do not submit passwords, credentials, regulated data, customer records, or other sensitive information through the public contact form.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
