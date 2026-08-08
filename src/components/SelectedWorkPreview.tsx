import Link from 'next/link'

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
    <section className="authority-section authority-logs" id="logs">
      <div className="authority-wrap">
        <div className="authority-section-header">
          <div>
            <div className="authority-eyebrow">Engineering logs</div>
            <h2>Public systems with inspectable boundaries.</h2>
            <p className="authority-section-intro">These are public repositories, not private client case studies. Read the code, decisions, and constraints directly.</p>
          </div>
          <a className="authority-section-link" href="https://github.com/BlueDot-IT" target="_blank" rel="noreferrer">Open GitHub <span aria-hidden="true">↗</span></a>
        </div>
        <div className="authority-logs-grid">
          {selectedWork.map((project, index) => (
            <a className="authority-log-entry" key={project.name} href={project.href} target="_blank" rel="noreferrer">
              <span className="authority-log-meta">0{index + 1} / {project.category} · GitHub</span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="authority-log-link">Read the repository <span aria-hidden="true">↗</span></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
