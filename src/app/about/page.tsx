import { Metadata } from 'next'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'About',
  description: 'Jason O’Neal is the founder and primary technical practitioner behind BlueDot IT, focused on secure full-stack applications, AI automation, developer infrastructure, and practical cybersecurity.',
  alternates: { canonical: 'https://bluedot.it.com/about' },
  openGraph: {
    title: 'About Jason O’Neal | BlueDot IT',
    description: 'Full-stack developer and security-focused systems builder specializing in AI automation.',
    type: 'profile',
    url: 'https://bluedot.it.com/about',
  },
}

const focusAreas = [
  'Frontend applications',
  'Backend services and APIs',
  'Databases and authentication',
  'Deployment and Linux infrastructure',
  'AI tool boundaries and agent workflows',
  'Security controls, validation, and remediation',
]

export default function About() {
  return (
    <>
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">Behind BlueDot IT</span><h1>Full-stack developer and security-focused systems builder.</h1></div>
          <div className="sr2-page-hero-note"><p>I am Jason O&apos;Neal, founder of BlueDot IT. I have been building software since 2002, with current work focused on secure full-stack applications, AI agents and automation, developer infrastructure, and practical cybersecurity.</p><p>Based in North Carolina and working remotely.</p></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap sr2-about-grid">
          <article className="sr2-about-block">
            <span className="sr2-kicker">Technical focus</span>
            <h2>Work across the layers that make a system real.</h2>
            <p>BlueDot works across the interface people use, the services and APIs behind it, the data and authentication model, the deployment boundary, and the operational controls that keep the result understandable.</p>
            <p>I am also completing formal cybersecurity studies to strengthen and validate the security work already integrated into my development and infrastructure practice.</p>
          </article>
          <article className="sr2-about-block">
            <span className="sr2-kicker">Where the work happens</span>
            <ul className="sr2-focus">{focusAreas.map((area) => <li key={area}>{area}</li>)}</ul>
            <div className="sr2-tags"><span>TypeScript</span><span>Python</span><span>React</span><span>Next.js</span><span>Node.js</span><span>PHP</span><span>Linux</span><span>Docker</span><span>NGINX</span><span>SQL</span><span>CI/CD</span></div>
          </article>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep">
        <div className="sr2-wrap sr2-about-grid">
          <article className="sr2-about-block"><span className="sr2-kicker">How I deliver</span><h2>Scope it. Validate it. Leave it usable.</h2></article>
          <article className="sr2-about-block"><p>Work is scoped around a concrete system, workflow, or security boundary. The implementation is validated against that scope, documented, and handed off with the relevant failure and approval points visible.</p><p>Public repositories provide technical evidence of the kinds of systems and controls I build. They are not presented as client case studies.</p></article>
        </div>
      </section>

      <section className="sr2-close">
        <div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Outside the system</span><h2>Music, TTRPG world-building, and mechanical projects remain part of the person behind the work.</h2></div><p>They stay lower on this page because the professional focus comes first.</p></div>
      </section>
    </>
  )
}
