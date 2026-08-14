import Link from 'next/link'

export default function Hero() {
  return (
    <section className="sr2-hero" id="top">
      <div className="sr2-wrap sr2-hero-grid">
        <h1 className="sr2-hero-title"><span>Build it.</span><span>Harden it.</span><span>Keep control.</span></h1>
        <div className="sr2-hero-note">
          <span className="sr2-kicker">Practical engineering for growing teams</span>
          <p>BlueDot IT helps growing businesses improve the software and workflows they rely on. We automate repetitive work, review security, and build applications that are easier to run and maintain.</p>
          <span className="sr2-mark" aria-hidden="true" />
          <small>Clear scope<br />Direct communication<br />Documentation included</small>
          <strong className="sr2-hero-delivery">Leave with usable work, not another recommendation.</strong>
          <Link className="sr2-link" href="/contact">Talk about your project</Link>
        </div>
      </div>
    </section>
  )
}
