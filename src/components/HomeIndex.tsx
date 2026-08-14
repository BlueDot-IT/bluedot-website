const destinations = [
  {
    href: '/services',
    title: 'Services',
    description: 'Security engineering, AI automation, and full-stack development for real systems.',
  },
  {
    href: '/projects',
    title: 'Work',
    description: 'Public repositories showing the systems, controls, and decisions behind the practice.',
  },
  {
    href: '/about',
    title: 'About',
    description: 'The person behind BlueDot IT, the technical focus, and the way engagements are delivered.',
  },
  {
    href: '/blog',
    title: 'Insights',
    description: 'Notes on security, automation, software delivery, and the boundaries between them.',
  },
]

export default function HomeIndex() {
  return (
    <>
      <section className="sr2-home-index" aria-labelledby="home-index-heading">
        <div className="sr2-wrap sr2-home-index-grid">
          <div className="sr2-home-index-intro">
            <span className="sr2-kicker">Start with the useful part</span>
     <h2 id="home-index-heading">Security, automation, and software for growing teams.</h2>
            <p>BlueDot works across the application, the workflow, the deployment, and the controls around them. Choose the document that matches the question in front of you.</p>
          </div>

          <nav className="sr2-document-nav" aria-label="BlueDot IT site sections">
            {destinations.map((destination) => (
              <a className="sr2-document-link" href={destination.href} key={destination.href}>
                <h3>{destination.title}</h3>
                <p>{destination.description}</p>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="sr2-home-brief">
        <div className="sr2-wrap sr2-home-brief-grid">
          <span className="sr2-kicker">The short version</span>
          <div>
            <p>Start with one concrete problem. Define the boundary, make the change, validate the result, and leave the next person enough context to operate it.</p>
            <a className="sr2-link" href="/contact">Talk about your project</a>
          </div>
        </div>
      </section>
    </>
  )
}
