export default function CaseHighlights() {
  return (
    <section className="authority-section authority-services" id="services">
      <div className="authority-wrap">
        <div className="authority-section-header">
          <div>
            <div className="authority-eyebrow">Services</div>
            <h2>Help where the work is stuck.</h2>
            <p className="authority-section-intro">Start with one problem. We will define the work, fix what we can, and show you what comes next.</p>
          </div>
          <a className="authority-section-link" href="/contact">Discuss your situation</a>
        </div>
        <div className="authority-service-grid">
          <article className="authority-service-card authority-service-card-featured">
            <span className="authority-service-number">01 / OPERATIONS</span>
            <h3>Make reporting and handoffs easier.</h3>
            <p>Turn recurring reporting and coordination into a repeatable process with clear inputs, review points, and handoff.</p>
            <a href="/services/operations-automation-reporting">Operations automation <span aria-hidden="true">→</span></a>
          </article>
          <article className="authority-service-card">
            <span className="authority-service-number">02 / SECURITY</span>
            <h3>Find and fix security problems.</h3>
            <p>Review the application or process, prioritize the risks, and help implement and retest the fix.</p>
            <a href="/services/security-reviews">Security work <span aria-hidden="true">→</span></a>
          </article>
          <article className="authority-service-card">
            <span className="authority-service-number">03 / BUILD</span>
            <h3>Build the next thing properly.</h3>
            <p>Create the site, tool, integration, or internal application with clear ownership and a handoff your team can use.</p>
            <a href="/services/full-stack-development">Full-stack delivery <span aria-hidden="true">→</span></a>
          </article>
          <article className="authority-service-card authority-service-card-logs">
            <span className="authority-service-number">04 / PUBLIC WORK</span>
            <h3>Read the engineering logs.</h3>
            <p>Public repositories and technical notes showing how the work is designed, tested, and bounded.</p>
            <a href="#logs">View public work <span aria-hidden="true">→</span></a>
          </article>
        </div>
      </div>
    </section>
  )
}
