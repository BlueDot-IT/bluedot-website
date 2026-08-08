import RepoCard from "@/components/RepoCard"
import { fetchRepos } from "@/lib/github"
import { Card, CardContent } from "@/components/ui/Card"
import type { Project } from "@/types/project"
import Link from "next/link"
import Reveal from "@/components/Reveal"
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
  { title: 'Security engineering', matches: ['Security engineering', 'Security /'] },
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
  const stats = [
    { label: "Selected systems", value: projects.length },
    { label: "Capability areas represented", value: categoryGroups.length },
    { label: "Primary languages", value: primaryLanguages || 'Public metadata unavailable' },
  ]

  return (
    <div className="page-shell space-y-14">
      <Reveal>
        <div className="text-center space-y-4">
          <span className="kicker">BlueDot IT work</span>
          <h1 className="heading-accent text-4xl md:text-5xl font-bold">Selected systems with public evidence.</h1>
          <p className="text-base-content/80 max-w-3xl mx-auto">
            A curated set of public repositories showing work across AI systems, security engineering, application infrastructure, and evaluation. These are engineering examples, not representations of private client work.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center h-full">
              <CardContent className="pt-6 pb-5 space-y-2">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-base-content/70 text-xs uppercase tracking-[0.2em]">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Reveal>

      {categoryGroups.map((category) => {
        const categoryProjects = projects.filter((project) => category.matches.some((match) => project.category.includes(match)))
        if (categoryProjects.length === 0) return null
        return (
          <section key={category.title} className="space-y-6">
            <Reveal>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{category.title}</h2>
                <p className="text-base-content/70 max-w-3xl">Public examples of the implementation and control problems represented in this capability area.</p>
              </div>
            </Reveal>
            <div className="grid gap-8 md:grid-cols-2">
              {categoryProjects.map((project) => (
                <Reveal key={project.id} className="h-full">
                  <RepoCard repo={project} />
                </Reveal>
              ))}
            </div>
          </section>
        )
      })}

      <Reveal>
        <Card className="text-center">
          <CardContent className="space-y-4 p-8">
            <h2 className="text-2xl font-bold text-base-content">Need a system built with the same discipline?</h2>
            <p className="text-base-content/80 max-w-2xl mx-auto">Tell me what you are building, automating, or securing, and where the current boundary is failing.</p>
            <Link href="/contact" className="btn btn-primary">Discuss your project</Link>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
