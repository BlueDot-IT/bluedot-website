export default function PersonaGrid() {
  return (
    <section className="sr2-friction" id="friction">
      <div className="sr2-wrap sr2-friction-grid">
        <div className="sr2-friction-copy">
          <div className="sr2-kicker">Where work gets stuck</div>
          <h2>Good people should not have to hold the whole process together.</h2>
          <p>If reporting is manual, permissions are unclear, or a small change feels risky, the underlying system needs attention. BlueDot starts by finding the actual bottleneck.</p>
        </div>
        <div>
          <ul className="sr2-problems">
            <li><div><strong>Reports are assembled by hand.</strong><span>The same information is collected, cleaned, and rechecked every week.</span></div></li>
            <li><div><strong>Automations have no clear owner.</strong><span>Credentials, approvals, failures, and exceptions are handled after something breaks.</span></div></li>
            <li><div><strong>The application is hard to change.</strong><span>Dependencies, deployments, and security issues are poorly documented.</span></div></li>
          </ul>
          <div className="sr2-pull">Build something people can use and maintain.</div>
        </div>
      </div>
    </section>
  )
}
