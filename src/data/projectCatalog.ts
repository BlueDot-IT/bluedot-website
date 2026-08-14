export type ProjectCaseStudy = {
  problem: string
  work: string
  evidence: string
  result: string
  artifact: string
  artifactAlt: string
  artifactCaption: string
}

export type ProjectCatalogEntry = {
  name: string
  url: string
  category: string
  description: string
  language: string
  demonstrates: string
  technologies: string[]
  concerns: string
  featured?: boolean
  caseStudy?: ProjectCaseStudy
}

export const projectCatalog: ProjectCatalogEntry[] = [
  {
    name: 'security-middleware',
    url: 'https://github.com/BlueDot-IT/security-middleware',
    category: 'Security engineering',
    description: 'Node.js and Next.js development middleware that checks security headers, CORS, and npm dependencies and reports findings through logs or a browser overlay.',
    language: 'TypeScript',
    demonstrates: 'Developer-facing application security feedback integrated into the development loop.',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Next.js'],
    concerns: 'Development middleware surfaces issues; it is not a substitute for a complete security review or production control set.',
    featured: true,
    caseStudy: {
      problem: 'Security checks are often separated from the place where a developer is making the change, so findings arrive late and without context.',
      work: 'BlueDot built middleware that checks headers, CORS, and npm dependencies and reports findings through logs or a browser overlay during development.',
      evidence: 'The public TypeScript repository contains the middleware, checks, and developer feedback path for inspection.',
      result: 'A class of application-security concerns becomes visible while the person who can fix it still has the relevant code and context.',
      artifact: '/proof/security-feedback.svg',
      artifactAlt: 'Diagram showing a code change moving through header, CORS, and dependency checks before developer feedback.',
      artifactCaption: 'Public artifact: a developer-facing security feedback flow.',
    },
  },
  {
    name: 'GhostMCP',
    url: 'https://github.com/BlueDot-IT/GhostMCP',
    category: 'AI automation + security',
    description: 'Beta security-focused MCP server for authorized assessments with policy-guarded tools, curated scanners, workflows, dashboards, scheduling, and audit logging.',
    language: 'Python',
    demonstrates: 'MCP tool boundaries, authorization, credential handling, scheduling, and auditable security workflows.',
    technologies: ['Python', 'MCP', 'FastAPI', 'SQLite'],
    concerns: 'The repository describes a beta release; restricted deployment, operator control, and written authorization remain necessary.',
    featured: true,
    caseStudy: {
      problem: 'An agent that can call useful tools can also create side effects. Permission, approval, credential, and audit decisions need to be explicit.',
      work: 'GhostMCP combines policy-guarded tools, curated workflows, scheduling, dashboards, and audit logging for authorized security assessments.',
      evidence: 'The public beta repository documents the server, tool controls, workflows, and audit trail. It is not presented as a universal safety guarantee.',
      result: 'The design makes tool authority and operator oversight visible enough to review before an agent is allowed into a real workflow.',
      artifact: '/proof/mcp-approval-flow.svg',
      artifactAlt: 'Diagram showing an agent request passing through policy, approval, execution, and audit evidence stages.',
      artifactCaption: 'Public artifact: a governed tool-execution flow.',
    },
  },
  {
    name: 'Odinn-Forge',
    url: 'https://github.com/BlueDot-IT/Odinn-Forge',
    category: 'AI automation',
    description: 'Local-first, single-user AI assistant with inspectable memory, approved tools, web research, and local activity history.',
    language: 'TypeScript',
    demonstrates: 'Agent product engineering with explicit approvals, inspectable state, and visible tool activity.',
    technologies: ['TypeScript', 'Node.js', 'pnpm', 'Ollama'],
    concerns: 'Cloud providers and websites can still receive prompts or normal web traffic; local-first does not mean universally private.',
  },
  {
    name: 'DemonClaw',
    url: 'https://github.com/BlueDot-IT/DemonClaw',
    category: 'AI automation + security',
    description: 'Rust-native agent runtime for controlled purple-team and defensive operations with policy gates, constrained WASM execution, memory, and tamper-evident evidence.',
    language: 'Rust',
    demonstrates: 'Security boundaries, approvals, evidence, and operational controls integrated into an agent runtime.',
    technologies: ['Rust', 'Wasmtime/WASI', 'PostgreSQL', 'pgvector'],
    concerns: 'Controlled execution and WASM constraints reduce authority but do not make arbitrary code risk-free; use remains authorized and supervised.',
  },
  {
    name: 'SignalGate',
    url: 'https://github.com/BlueDot-IT/SignalGate',
    category: 'AI automation',
    description: 'OpenAI-compatible loopback routing layer for OpenClaw that selects model tiers using embeddings, KNN, and capability gates.',
    language: 'Python',
    demonstrates: 'Observable model routing, capability-aware decisions, bounded failover, and safe handling for tool-driven automation.',
    technologies: ['Python', 'FastAPI', 'llama.cpp', 'OpenAI-compatible API'],
    concerns: 'Provider and capability support is bounded by the implemented adapters; the project does not claim universal model or tool compatibility.',
  },
  {
    name: 'Ares',
    url: 'https://github.com/BlueDot-IT/Ares',
    category: 'Security engineering',
    description: 'Operator-supervised security assessment runtime for authorized engagements with deterministic scope, risk, approval, evidence, and reporting controls.',
    language: 'Python',
    demonstrates: 'Security workflow orchestration where model requests remain inside deterministic operator and evidence controls.',
    technologies: ['Python', 'SQLite', 'CLI', 'OpenAI-compatible models'],
    concerns: 'Use is limited to authorized engagements; the repository notes that its first public PyPI release is not yet available.',
  },
  {
    name: 'ExploitRank',
    url: 'https://github.com/BlueDot-IT/ExploitRank',
    category: 'Security engineering',
    description: 'Exploit Intelligence Engine that ingests, normalizes, and scores vulnerability records and exploit-candidate evidence.',
    language: 'Python',
    demonstrates: 'Security data ingestion, evidence normalization, scoring, and remediation-oriented reporting.',
    technologies: ['Python', 'NVD API', 'SQLAlchemy', 'FastAPI'],
    concerns: 'It scores candidate evidence; it is not an exploit executor or proof of real-world exploitability.',
  },
  {
    name: 'agent-benchmarks',
    url: 'https://github.com/BlueDot-IT/agent-benchmarks',
    category: 'Engineering and evaluation',
    description: 'Reproducible benchmark harness for command-line AI agents using isolated workspaces, deterministic assertions, and outcome-verified reports.',
    language: 'TypeScript',
    demonstrates: 'Evidence-based evaluation, reproducible fixtures, and explicit separation of capability coverage from verified outcomes.',
    technologies: ['TypeScript', 'Node.js', 'pnpm', 'JSON assertions'],
    concerns: 'The harness is not a security sandbox, and one successful trial is not statistically strong evidence by itself.',
  },
]

export const featuredProjects = projectCatalog.filter((project) => project.featured)
export const openSourceProjects = projectCatalog.filter((project) => !project.featured)
