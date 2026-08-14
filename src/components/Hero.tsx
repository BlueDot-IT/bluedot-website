export default function Hero() {
  return (
    <section className="sr2-hero">
      <div className="sr2-wrap sr2-hero-grid">
        <div className="sr2-hero-heading">
          <span className="sr2-kicker">BlueDot IT · security · AI automation · full-stack delivery</span>
          <h1 className="sr2-hero-title">Security, AI automation, and full-stack delivery for systems that have to work.</h1>
          <p className="sr2-hero-statement">Build it. Harden it. Keep control.</p>
        </div>
        <div className="sr2-hero-note">
          <p>BlueDot IT helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.</p>
          <div className="sr2-hero-actions">
            <a className="sr2-link sr2-link-primary" href="/contact?service=security-review">Request a scoped review</a>
            <a className="sr2-link sr2-link-secondary" href="/projects">See selected work</a>
          </div>
          <span className="sr2-mark" aria-hidden="true" />
          <small>Written scope · direct communication · validation and handoff included</small>
        </div>
      </div>
    </section>
  )
}
