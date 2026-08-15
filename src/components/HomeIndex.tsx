const sections = [
  {
    label: 'Services',
    title: 'Security, AI automation, and full-stack delivery',
    description: 'Start with the problem, the systems involved, and the kind of change that would make the work useful.',
    href: '/services',
    action: 'Read the services',
  },
  {
    label: 'Work',
    title: 'Public systems with the evidence attached',
    description: 'Two selected engineering examples show the problem, the implementation, the artifact, and the result.',
    href: '/projects',
    action: 'Read selected work',
  },
  {
    label: 'About',
    title: 'The person behind the work',
    description: 'Background, technical focus, and the way BlueDot scopes, validates, and hands over a change.',
    href: '/about',
    action: 'Read about BlueDot',
  },
  {
    label: 'Insights',
    title: 'Notes from systems being built and secured',
    description: 'Technical writing tied to application security, controlled automation, and full-stack engineering.',
    href: '/blog',
    action: 'Read the insights',
  },
  {
    label: 'Security posture',
    title: 'How BlueDot handles security in its own work',
    description: 'Vulnerability reporting, inquiry data handling, authorization, and disclosure information.',
    href: '/security',
    action: 'Read the security posture',
  },
]

export default function HomeIndex() {
  return (
    <>
      <section className="sr2-home-index" aria-labelledby="home-index-heading">
        <div className="sr2-wrap sr2-home-index-grid">
          <div className="sr2-home-index-intro">
            <span className="sr2-kicker">Start here</span>
            <h2 id="home-index-heading">Choose the part of the system you need to understand.</h2>
            <p>BlueDot is a small, direct technical practice. The pages below are separate working documents: services explain the engagements, work shows the evidence, and contact starts a scoped conversation.</p>
          </div>
          <nav className="sr2-document-nav" aria-label="BlueDot IT sections">
            {sections.map((section) => (
              <a className="sr2-document-link" href={section.href} key={section.label}>
                <span className="sr2-kicker">{section.label}</span>
                <span>
                  <strong>{section.title}</strong>
                  <small>{section.description}</small>
                  <em>{section.action}</em>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="sr2-home-brief" aria-labelledby="home-brief-heading">
        <div className="sr2-wrap sr2-home-brief-grid">
          <div>
            <span className="sr2-kicker">A useful first move</span>
            <h2 id="home-brief-heading" className="sr-only">A useful first move</h2>
          </div>
          <div>
            <p>Bring the application, workflow, host, or agent that has become difficult to trust. BlueDot will identify the immediate scope and authorization questions before proposing the next deliverable.</p>
            <a className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</a>
          </div>
        </div>
      </section>
    </>
  )
}
