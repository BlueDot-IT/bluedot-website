export const dynamic = 'force-static'

export async function GET() {
  const body = `# BlueDot IT - Full Documentation

> BlueDot IT is a software and technical-services business operated by Jason O'Neal in Lenoir, North Carolina. Its primary offer is a fixed-scope Operations Automation and Reporting Sprint. The site also covers secure web development, infrastructure hardening, custom software, workflow automation, AI tooling, and MCP systems.

## Core pages

- Home: https://bluedot.it.com/
- Services: https://bluedot.it.com/services
- About: https://bluedot.it.com/about
- Projects: https://bluedot.it.com/projects
- Blog: https://bluedot.it.com/blog
- Contact: https://bluedot.it.com/contact
- Privacy: https://bluedot.it.com/legal/privacy
- Terms: https://bluedot.it.com/legal/terms
- Security policy: https://bluedot.it.com/.well-known/security.txt

## Services

- Operations automation and reporting
- Security reviews
- Server hardening
- Next.js security hardening
- Workflow automation
- MCP security consulting
- Small business websites
- AI security tooling

## Selected public projects

- Odinn-Forge: local-first runtime for governed AI-assisted operations
- DemonClaw: security-first purple-team agent runtime with WASM sandboxing, approvals, scheduling, memory, and tamper-evident evidence logging
- SignalGate: semantic routing and fallback layer for AI systems
- GhostMCP: audit-first MCP security tooling for authorized operations
- security-middleware: development-time security checks for Node.js and Next.js
- agent-benchmarks: reproducible benchmarks for command-line AI agents

## Blog

The blog covers cybersecurity, web development, AI tooling, infrastructure, automation, and practical technology problem-solving.

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
