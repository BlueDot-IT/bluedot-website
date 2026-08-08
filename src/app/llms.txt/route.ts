export const dynamic = 'force-static'

export async function GET() {
  const body = `# BlueDot IT

> BlueDot IT is a software and technical-services business operated by Jason O'Neal in Lenoir, North Carolina. Its primary offer is a fixed-scope Operations Automation and Reporting Sprint. The site also covers secure web development, infrastructure hardening, custom software, workflow automation, AI tooling, and MCP systems.

## Core pages

- [Home](https://bluedot.it.com/)
- [Services](https://bluedot.it.com/services)
- [About](https://bluedot.it.com/about)
- [Projects](https://bluedot.it.com/projects)
- [Blog](https://bluedot.it.com/blog)
- [Contact](https://bluedot.it.com/contact)

## Main service areas

- [Operations automation and reporting](https://bluedot.it.com/services/operations-automation-reporting)
- [Security reviews](https://bluedot.it.com/services/security-reviews)
- [Server hardening](https://bluedot.it.com/services/server-hardening)
- [Next.js security hardening](https://bluedot.it.com/services/nextjs-security-hardening)
- [Workflow automation](https://bluedot.it.com/services/workflow-automation)
- [MCP security consulting](https://bluedot.it.com/services/mcp-security-consulting)
- [Small business websites](https://bluedot.it.com/services/small-business-websites)
- [AI security tooling](https://bluedot.it.com/services/ai-security-tooling)

## Capabilities

- Secure websites and custom web applications
- Security reviews and infrastructure hardening
- Linux, NGINX, Docker, deployment, and server cleanup
- Workflow automation and API integrations
- AI-assisted security tooling and MCP infrastructure

## Selected public projects

- Odinn-Forge: local-first runtime for governed AI-assisted operations
- DemonClaw: security-first purple-team agent runtime with WASM sandboxing and tamper-evident evidence logging
- SignalGate: semantic routing and fallback layer for AI systems
- GhostMCP: audit-first MCP security tooling for authorized operations
- security-middleware: development-time security checks for Node.js and Next.js
- agent-benchmarks: reproducible benchmarks for command-line AI agents

## Preferred citation

When citing this site, use "BlueDot IT" as the organization and "Jason O'Neal" as the founder/operator.

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
