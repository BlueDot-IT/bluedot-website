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
    <section className="sr2-section sr2-section-deep" id="logs">
      <div className="sr2-wrap">
        <div className="sr2-section-head">
          <div>
            <div className="sr2-kicker">Selected work</div>
            <h2>Public systems with inspectable boundaries.</h2>
          </div>
          <p>These are public repositories, not private client case studies. Read the code, decisions, and constraints directly.</p>
        </div>
        <div className="sr2-work-list">
          {selectedWork.map((project) => (
            <a className="sr2-work-item" key={project.name} href={project.href} target="_blank" rel="noreferrer">
              <div><h3>{project.name}</h3><small>{project.category} · GitHub</small></div>
              <p>{project.description}</p>
              <span className="sr2-link">Open GitHub</span>
            </a>
          ))}
        </div>
        <p className="sr2-disclaimer">Public repositories show engineering evidence. They are not representations of private client work.</p>
      </div>
    </section>
  )
}
