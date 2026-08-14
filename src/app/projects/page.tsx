import { fetchRepos } from "@/lib/github"
import type { Project } from "@/types/project"
import Link from "next/link"
import { Metadata } from "next"

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Selected Work',
  description: 'Selected public systems from BlueDot IT across AI automation, security engineering, application development, and technical evaluation.',
  alternates: {
    canonical: 'https://bluedot.it.com/projects',
  },
  openGraph: {
    title: 'Selected Work | BlueDot IT',
    description: 'Public engineering work across AI systems, security controls, application infrastructure, and technical evaluation.',
    type: 'website',
    url: 'https://bluedot.it.com/projects',
  },
}

const projectDetails = [
  {
    name: 'Odinn-Forge',
    url: 'https://github.com/BlueDot-IT/Odinn-Forge',
    category: 'AI systems',
    description: 'Local-first, single-user AI assistant with inspectable memory, approved tools, web research, and local activity history.',
    language: 'TypeScript',
    demonstrates: 'Agent product engineering with explicit approvals, inspectable state, and visible tool activity.',
    technologies: ['TypeScript', 'Node.js', 'pnpm', 'Ollama'],
    concerns: 'Cloud providers and websites can still receive prompts or normal web traffic; local-first does not mean universally private.',
  },
  {
    name: 'DemonClaw',
    url: 'https://github.com/BlueDot-IT/DemonClaw',
    category: 'AI systems / security',
    description: 'Rust-native agent runtime for controlled purple-team and defensive operations with policy gates, constrained WASM execution, memory, and tamper-evident evidence.',
    language: 'Rust',
    demonstrates: 'Security boundaries, approvals, evidence, and operational controls integrated into an agent runtime.',
    technologies: ['Rust', 'Wasmtime/WASI', 'PostgreSQL', 'pgvector'],
    concerns: 'Controlled execution and WASM constraints reduce authority but do not make arbitrary code risk-free; use remains authorized and supervised.',
  },
  {
    name: 'GhostMCP',
    url: 'https://github.com/BlueDot-IT/GhostMCP',
    category: 'Security / AI systems',
    description: 'Beta security-focused MCP server for authorized assessments with policy-guarded tools, curated scanners, workflows, dashboards, scheduling, and audit logging.',
    language: 'Python',
    demonstrates: 'MCP tool boundaries, authorization, credential handling, scheduling, and auditable security workflows.',
    technologies: ['Python', 'MCP', 'FastAPI', 'SQLite'],
    concerns: 'The repository describes a beta release; restricted deployment, operator control, and written authorization remain necessary.',
  },
  {
    name: 'SignalGate',
    url: 'https://github.com/BlueDot-IT/SignalGate',
    category: 'AI systems',
    description: 'OpenAI-compatible loopback routing layer for OpenClaw that selects model tiers using embeddings, KNN, and capability gates.',
    language: 'Python',
    demonstrates: 'Observable model routing, capability-aware decisions, bounded failover, and safe handling for tool-driven automation.',
    technologies: ['Python', 'FastAPI', 'llama.cpp', 'OpenAI-compatible API'],
    concerns: 'Provider and capability support is bounded by the implemented adapters; the project does not claim universal model or tool compatibility.',
  },
  {
    name: 'security-middleware',
    url: 'https://github.com/BlueDot-IT/security-middleware',
    category: 'Security engineering',
    description: 'Node.js and Next.js development middleware that checks security headers, CORS, and npm dependencies and reports findings through logs or a browser overlay.',
    language: 'TypeScript',
    demonstrates: 'Developer-facing application security feedback integrated into the development loop.',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Next.js'],
    concerns: 'Development middleware surfaces issues; it is not a substitute for a complete security review or production control set.',
  },
  {
    name: 'Ares',
    url: 'https://github.com/BlueDot-IT/Ares',
    category: 'Security / AI systems',
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

const categoryGroups = [
  { title: 'AI systems', matches: ['AI systems'] },
  { title: 'Security engineering', matches: ['Security engineering'] },
  { title: 'Engineering and evaluation', matches: ['Engineering and evaluation'] },
]

export default async function Projects() {
  let repos: Awaited<ReturnType<typeof fetchRepos>> = []
  try {
    repos = await fetchRepos("BlueDot-IT")
  } catch (error) {
    console.error("Unable to load the public BlueDot-IT repository metadata:", error)
  }

  const repoByName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]))
  const projects: Project[] = projectDetails.map((detail) => {
    const repo = repoByName.get(detail.name.toLowerCase())
    return {
      id: `github:${detail.name}`,
      name: detail.name,
      url: repo?.html_url || detail.url,
      description: repo?.description || detail.description,
      language: repo?.language || detail.language,
      source: "github" as const,
      subtype: "repo" as const,
      updatedAt: repo?.updated_at || null,
      category: detail.category,
      demonstrates: detail.demonstrates,
      technologies: detail.technologies,
      concerns: detail.concerns,
    }
  })

  const primaryLanguages = [...new Set(projects.map((project) => project.language).filter(Boolean))].join(' / ')
  return (
    <>
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">BlueDot IT work</span><h1>Selected systems with <span>public evidence.</span></h1></div>
          <div className="sr2-page-hero-note"><p>A curated set of public repositories showing work across AI systems, security engineering, application infrastructure, and evaluation.</p><a className="sr2-link" href="https://github.com/BlueDot-IT" target="_blank" rel="noreferrer">Open the organization</a></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <p className="sr2-editorial-intro">These are engineering examples, not representations of private client work. Read the code, decisions, and constraints directly. Selected languages: {primaryLanguages || 'public metadata unavailable'}.</p>
          <div className="sr2-evidence-table">
            {categoryGroups.map((category) => {
              const categoryProjects = projects.filter((project) => category.matches.some((match) => project.category.includes(match)))
              if (categoryProjects.length === 0) return null
              return categoryProjects.map((project) => (
                <article className="sr2-evidence-row" key={project.id}>
                  <div><small>{project.category}</small><h2>{project.name}</h2><p>{project.description}</p></div>
                  <div><small>What it demonstrates</small><p>{project.demonstrates}</p><p className="sr2-disclaimer">{project.concerns}</p></div>
                  <div><small>Relevant stack</small><div className="sr2-tech">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><a className="sr2-link" style={{ marginTop: 25 }} href={project.url} target="_blank" rel="noreferrer">Repository</a></div>
                </article>
              ))
            })}
          </div>
          <p className="sr2-disclaimer">Public work is evidence of approach, not a claim about a private client engagement.</p>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep">
        <div className="sr2-wrap"><div className="sr2-section-head"><div><span className="sr2-kicker">Next system</span><h2>Need a system built with the same discipline?</h2></div><p>Tell me what you are building, automating, or securing, and where the current boundary is failing.</p></div><Link className="sr2-link" href="/contact">Discuss your project</Link></div>
      </section>
    </>
  )
}
