import Link from 'next/link'
import Reveal from '@/components/Reveal'

const selectedWork = [
  {
    name: 'Odinn-Forge',
    category: 'AI systems',
    description: 'A local-first AI assistant with inspectable memory, approved tools, and an auditable activity trail.',
    href: 'https://github.com/BlueDot-IT/Odinn-Forge',
  },
  {
    name: 'DemonClaw',
    category: 'Security engineering',
    description: 'A Rust-native security-focused agent runtime for controlled purple-team operations and tamper-evident evidence collection.',
    href: 'https://github.com/BlueDot-IT/DemonClaw',
  },
  {
    name: 'security-middleware',
    category: 'Application security',
    description: 'Drop-in security linting middleware for Node.js and Next.js covering headers, CORS, dependencies, and developer feedback.',
    href: 'https://github.com/BlueDot-IT/security-middleware',
  },
]

export default function SelectedWorkPreview() {
  return (
    <section className="page-shell space-y-10 py-24 border-t border-white/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-4">
          <span className="pill">Selected work</span>
          <h2 className="text-4xl font-bold tracking-tight text-white">Public systems with inspectable boundaries.</h2>
          <p className="text-base-content/65 leading-relaxed">
            These are public engineering examples, not private client case studies. They show work across AI systems, security controls, and application infrastructure.
          </p>
        </div>
        <Link href="/projects" className="text-sm font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">
          View all selected work →
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {selectedWork.map((project) => (
          <Reveal key={project.name}>
            <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">{project.category}</p>
                <h3 className="text-2xl font-bold text-white">{project.name}</h3>
              </div>
              <p className="text-sm text-base-content/65 leading-relaxed">{project.description}</p>
              <a href={project.href} target="_blank" rel="noreferrer" className="inline-flex text-sm font-semibold text-primary hover:text-white transition-colors">
                Read the repository →
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
