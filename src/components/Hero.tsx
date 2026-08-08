import Link from 'next/link'

export default function Hero() {
  return (
    <section className="authority-hero" id="top">
      <div className="authority-wrap authority-hero-grid">
        <div className="authority-hero-copy">
          <div className="authority-eyebrow">Practical engineering for growing teams</div>
          <h1>Build it. Harden it. <span>Keep control.</span></h1>
          <p className="authority-hero-lede">
            BlueDot IT helps growing businesses improve the software and workflows they rely on. We automate repetitive work, review security, and build applications that are easier to run and maintain.
          </p>
          <div className="authority-button-row">
            <Link href="/contact" className="authority-button">Talk about your project</Link>
            <Link href="#services" className="authority-button authority-button-secondary">View services</Link>
          </div>
          <div className="authority-hero-note" aria-label="Engagement principles">
            <span>Clear scope</span>
            <span>Direct communication</span>
            <span>Documentation included</span>
          </div>
        </div>

        <div className="authority-delivery-wrap" aria-label="Typical BlueDot delivery">
          <div className="authority-delivery-card">
            <div className="authority-delivery-top"><span>BlueDot IT / Delivery</span><span>Defined from day one</span></div>
            <div className="authority-delivery-title">Leave with usable work, not another recommendation.</div>
            <div className="authority-delivery-list">
              <div className="authority-delivery-item"><b>01</b><strong>Review</strong><small>Current setup and priority</small></div>
              <div className="authority-delivery-item"><b>02</b><strong>Build</strong><small>Agreed change and testing</small></div>
              <div className="authority-delivery-item"><b>03</b><strong>Hand off</strong><small>Documentation and next steps</small></div>
            </div>
          </div>
        </div>
      </div>

      <div className="authority-wrap authority-hero-services" aria-label="Primary services">
        <Link className="authority-hero-service authority-hero-service-featured" href="/services/operations-automation-reporting">
          <span className="authority-service-number">01 / Featured service</span>
          <strong>Operations Automation &amp; Reporting Sprint</strong>
          <small>Cut down manual reporting and status chasing.</small>
        </Link>
        <Link className="authority-hero-service" href="/services/security-reviews">
          <span className="authority-service-number">02 / Security</span>
          <strong>Security review and remediation</strong>
          <small>Find the risk and help fix it.</small>
        </Link>
        <Link className="authority-hero-service" href="/services/full-stack-development">
          <span className="authority-service-number">03 / Build</span>
          <strong>Full-stack application delivery</strong>
          <small>Build the next useful piece.</small>
        </Link>
      </div>
    </section>
  )
}
