export default function PersonaGrid() {
  return (
    <section className="authority-section authority-friction" id="work">
      <div className="authority-wrap authority-friction-grid">
        <div>
          <div className="authority-eyebrow">Where work gets stuck</div>
          <h2>Good people should not have to hold the whole process together.</h2>
          <p className="authority-section-intro">
            If reporting is manual, permissions are unclear, or a small change feels risky, the underlying system needs attention. BlueDot starts by finding the actual bottleneck.
          </p>
        </div>
        <div>
          <ul className="authority-friction-list">
            <li><b>01</b><div><strong>Reports are assembled by hand.</strong><span>The same information is collected, cleaned, and rechecked every week.</span></div></li>
            <li><b>02</b><div><strong>Automations have no clear owner.</strong><span>Credentials, approvals, failures, and exceptions are handled after something breaks.</span></div></li>
            <li><b>03</b><div><strong>The application is hard to change.</strong><span>Dependencies, deployments, and security issues are poorly documented.</span></div></li>
          </ul>
          <aside className="authority-friction-aside">
            <div className="authority-mini-rule" />
            <div className="authority-quote-mark" aria-hidden="true">“</div>
            <strong>Build something people can use and maintain.</strong>
            <p>We do not stop at a recommendation. We leave you with working changes, clear documentation, and a sensible next step.</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
