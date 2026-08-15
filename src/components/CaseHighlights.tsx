
import Link from 'next/link'

export default function CaseHighlights() {
  return (
    <section className="sr2-section" id="services">
      <div className="sr2-wrap">
        <div className="sr2-section-head">
          <div>
            <div className="sr2-kicker">Services</div>
            <h2>Help where the work is stuck.</h2>
          </div>
          <p>Start with one problem. We will define the work, fix what we can, and show you what comes next.</p>
        </div>
        <div className="sr2-rail-list">
          <a className="sr2-rail featured" href="/services/operations-automation-reporting">
            <h3>Make reporting and handoffs easier.</h3>
            <p>Turn recurring reporting and coordination into a repeatable process with clear inputs, review points, and handoff.</p>
            <span className="sr2-rail-arrow" aria-hidden="true">↗</span>
          </a>
          <a className="sr2-rail" href="/services/security-reviews">
            <h3>Find and fix security problems.</h3>
            <p>Review the application or process, prioritize the risks, and help implement and retest the fix.</p>
            <span className="sr2-rail-arrow" aria-hidden="true">↗</span>
          </a>
          <a className="sr2-rail" href="/services/full-stack-development">
            <h3>Build the next thing properly.</h3>
            <p>Create the site, tool, integration, or internal application with clear ownership and a handoff your team can use.</p>
            <span className="sr2-rail-arrow" aria-hidden="true">↗</span>
          </a>
          <Link className="sr2-rail" href="/blog">
            <h3>Read selected work.</h3>
            <p>Public repositories and technical notes showing how the work is designed, tested, and bounded.</p>
            <span className="sr2-rail-arrow" aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
