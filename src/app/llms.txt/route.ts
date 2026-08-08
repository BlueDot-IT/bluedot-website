export const dynamic = 'force-static'

export async function GET() {
  const body = `# BlueDot IT

> BlueDot IT is a remote technical consultancy and development studio operated by Jason O'Neal. It combines security engineering, AI automation and agent systems, and full-stack application development for startups, software companies, technical teams, agencies, and growing businesses.

## Core positioning

Build the application. Automate the workflow. Secure the system.

BlueDot can design, build, automate, deploy, secure, and review complete systems. Engagements use defined scope, permissions, logs, validation, documentation, and clear handoff.

## Core pages

- [Home](https://bluedot.it.com/)
- [Services](https://bluedot.it.com/services)
- [Work](https://bluedot.it.com/projects)
- [About](https://bluedot.it.com/about)
- [Insights](https://bluedot.it.com/blog)
- [Contact](https://bluedot.it.com/contact)

## Service pillars

- [Security Engineering](https://bluedot.it.com/services#security-engineering): application and API security, authentication and authorization reviews, Next.js hardening, Linux/Docker/NGINX/VPS hardening, CI/CD and dependency security, MCP and AI-agent security, and remediation implementation.
- [AI Automation](https://bluedot.it.com/services#ai-automation): agents, workflow automation, LLM integrations, MCP tools, RAG and knowledge systems, human approval workflows, permissions, logs, guardrails, observability, and operational reporting.
- [Full-Stack Development](https://bluedot.it.com/services/full-stack-development): React and Next.js applications, TypeScript and Node.js services, Python backends, APIs, integrations, dashboards, internal platforms, authentication, databases, deployment, and production hardening.

## Productized entry points

- Security Review
- AI Automation Discovery and Prototype
- Full-Stack Build Sprint
- Operations Automation and Reporting Sprint, offered as one bounded AI Automation engagement

## Selected public projects

- Odinn-Forge: local-first, single-user AI assistant with inspectable memory and approved tools.
- DemonClaw: Rust-native runtime for controlled purple-team and defensive operations with policy gates and evidence collection.
- GhostMCP: beta security-focused MCP server for authorized assessments with guarded tools and audit logging.
- SignalGate: OpenAI-compatible model-routing layer using embeddings, KNN, and capability gates.
- security-middleware: Node.js and Next.js development middleware for security headers, CORS, and dependency findings.
- Ares: operator-supervised security assessment runtime for authorized engagements.
- ExploitRank: vulnerability and exploit-candidate ingestion, normalization, and scoring engine.
- agent-benchmarks: reproducible, outcome-verified benchmark harness for command-line AI agents.

These are public engineering examples, not client testimonials or private case studies. They do not establish customer adoption, production scale, or security guarantees.

## Contact

- Website: https://bluedot.it.com/contact
- Email: jason@bluedot.it.com
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
