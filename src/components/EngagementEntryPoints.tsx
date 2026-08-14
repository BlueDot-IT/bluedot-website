import Link from 'next/link'

export default function EngagementEntryPoints() {
  return (
    <>
      <section className="sr2-section" id="process">
        <div className="sr2-wrap sr2-process">
          <div>
            <div className="sr2-kicker">Working together</div>
            <h2>A straightforward process.</h2>
          </div>
          <div className="sr2-process-line">
            <div><strong>Review</strong><p>Understand the current setup.</p></div>
            <div><strong>Plan</strong><p>Set the scope.</p></div>
            <div><strong>Build</strong><p>Make the change.</p></div>
            <div><strong>Hand off</strong><p>Leave it usable.</p></div>
          </div>
        </div>
      </section>

      <section className="sr2-sprint">
        <div className="sr2-wrap sr2-sprint-grid">
          <div>
            <div className="sr2-kicker">Featured service</div>
            <h2>Operations Automation &amp; Reporting Sprint</h2>
            <p>A short, focused engagement for teams spending too much time collecting updates and preparing reports. We review the process, improve the most expensive step, and leave a usable handoff.</p>
            <Link className="sr2-link" href="/services/operations-automation-reporting">View the sprint details</Link>
          </div>
          <div className="sr2-scope" aria-label="Operations automation and reporting sprint scope">
            <div><strong>Review current reporting</strong><span>Document the process and identify the biggest time cost.</span></div>
            <div><strong>Improve one high-cost step</strong><span>Reduce repetitive collection, cleanup, or status chasing.</span></div>
            <div><strong>Hand off the result</strong><span>Leave working changes, notes, and a clear next step.</span></div>
          </div>
        </div>
      </section>

      <section className="sr2-close" id="contact">
        <div className="sr2-wrap">
          <div className="sr2-close-copy">
            <div>
              <div className="sr2-kicker">Start here</div>
              <h2>Let’s fix the part that is slowing the team down.</h2>
            </div>
            <div>
              <p>Tell me what you are building, automating, or securing.</p>
              <Link className="sr2-link" href="/contact">Talk to BlueDot</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
