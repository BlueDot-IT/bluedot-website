import Link from 'next/link'

export default function EngagementEntryPoints() {
  return (
    <>
      <section className="authority-section authority-process" id="process">
        <div className="authority-wrap">
          <div className="authority-section-header">
            <div>
              <div className="authority-eyebrow">Working together</div>
              <h2>A straightforward process.</h2>
            </div>
            <p className="authority-section-intro">You will know what we are doing, what it should produce, and when you need to make a decision.</p>
          </div>
          <div className="authority-process-grid">
            <div className="authority-process-step"><b>01 / REVIEW</b><h3>Understand the current setup.</h3><p>We look at the workflow, code, constraints, and result you need.</p></div>
            <div className="authority-process-step"><b>02 / PLAN</b><h3>Set the scope.</h3><p>We agree on the work, priorities, assumptions, and how we will check it.</p></div>
            <div className="authority-process-step"><b>03 / BUILD</b><h3>Make the change.</h3><p>We implement, test, and keep you informed about decisions and tradeoffs.</p></div>
            <div className="authority-process-step"><b>04 / HAND OFF</b><h3>Leave it usable.</h3><p>You get the code or workflow, documentation, validation notes, and next steps.</p></div>
          </div>
        </div>
      </section>

      <section className="authority-section authority-featured-service">
        <div className="authority-wrap authority-feature-grid">
          <div>
            <div className="authority-eyebrow">Featured service</div>
            <h2>Operations Automation &amp; Reporting Sprint</h2>
            <p>A short, focused engagement for teams spending too much time collecting updates and preparing reports. We review the process, improve the most expensive step, and leave a usable handoff.</p>
            <Link className="authority-feature-link" href="/services/operations-automation-reporting">View the sprint details <span aria-hidden="true">→</span></Link>
          </div>
          <div className="authority-scope-card" aria-label="Operations automation and reporting sprint scope">
            <div className="authority-scope-head"><span>Sprint scope</span><span>Focused engagement</span></div>
            <div className="authority-scope-row"><b>01</b><div><strong>Review current reporting</strong><small>Document the process and identify the biggest time cost.</small></div></div>
            <div className="authority-scope-row"><b>02</b><div><strong>Improve one high-cost step</strong><small>Reduce repetitive collection, cleanup, or status chasing.</small></div></div>
            <div className="authority-scope-row"><b>03</b><div><strong>Hand off the result</strong><small>Leave working changes, notes, and a clear next step.</small></div></div>
          </div>
        </div>
      </section>

      <section className="authority-closing" id="contact">
        <div className="authority-wrap">
          <div className="authority-closing-box">
            <div>
              <div className="authority-eyebrow">Start here</div>
              <h2>Let’s fix the part that is slowing the team down.</h2>
            </div>
            <Link className="authority-button authority-closing-button" href="/contact">Talk to BlueDot</Link>
          </div>
        </div>
      </section>
    </>
  )
}
