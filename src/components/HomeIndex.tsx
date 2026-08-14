import Image from 'next/image'

const problems = [
  {
    title: 'The application is nearly ready, but nobody trusts the authorization model.',
    description: 'Authentication, authorization, public routes, API behavior, deployment, and secrets handling need a review that ends in prioritized fixes—not another generic scanner export.',
    href: '/services/security-reviews',
    link: 'Start with a security review',
  },
  {
    title: 'A useful workflow is trapped in copy, paste, and status chasing.',
    description: 'BlueDot maps the real inputs, tools, exceptions, permissions, and handoffs, then automates one meaningful slice with logs and human review where the decision matters.',
    href: '/services/workflow-automation',
    link: 'Explore workflow automation',
  },
  {
    title: 'The next product capability needs to become maintainable software.',
    description: 'Build the interface, API, data model, integrations, deployment, and operational notes together so the result can be changed and run after the sprint ends.',
    href: '/services/full-stack-development',
    link: 'Explore full-stack delivery',
  },
]

const caseStudies = [
  {
    title: 'Security feedback inside the development loop',
    project: 'security-middleware',
    category: 'Security engineering',
    artifact: '/proof/security-feedback.svg',
    alt: 'Diagram showing a change moving through header, CORS, and dependency checks before developer feedback.',
    caption: 'Public artifact: a developer-facing security feedback flow.',
    problem: 'Security checks are often separated from the place where a developer is making the change. That makes findings late, abstract, and easy to ignore.',
    work: 'BlueDot built Node.js and Next.js development middleware that checks security headers, CORS, and npm dependencies and reports findings through logs or a browser overlay.',
    evidence: 'The public TypeScript repository is the artifact: its checks, middleware integration, and developer feedback path can be inspected directly.',
    result: 'A class of application-security concerns becomes visible during development, where the person who can fix it still has the context to do so.',
    href: 'https://github.com/BlueDot-IT/security-middleware',
  },
  {
    title: 'Useful AI tools with controlled authority',
    project: 'GhostMCP',
    category: 'AI automation + security',
    artifact: '/proof/mcp-approval-flow.svg',
    alt: 'Diagram showing an agent request passing through policy, approval, execution, and audit evidence stages.',
    caption: 'Public artifact: a governed tool-execution flow.',
    problem: 'An agent that can call useful tools can also create side effects. Permission, approval, credential, and audit decisions need to be explicit before wider use.',
    work: 'GhostMCP is a beta security-focused MCP server for authorized assessments with policy-guarded tools, curated workflows, scheduling, dashboards, and audit logging.',
    evidence: 'The public repository documents the server, tool controls, workflows, and audit trail. It is presented as a beta engineering example, not a universal safety guarantee.',
    result: 'The design makes tool authority and operator oversight visible enough to review before an agent is allowed into a real workflow.',
    href: 'https://github.com/BlueDot-IT/GhostMCP',
  },
]

const services = [
  {
    title: 'Security engineering',
    description: 'Application, API, authentication, Next.js, Linux, Docker, NGINX, VPS, CI/CD, dependency, and AI-tooling reviews with an actionable remediation path.',
    href: '/services/security-reviews',
  },
  {
    title: 'AI automation',
    description: 'Workflow automation, agent prototypes, MCP tools, integrations, reporting, permissions, logs, and human approval points built around a real operating need.',
    href: '/services/workflow-automation',
  },
  {
    title: 'Full-stack delivery',
    description: 'React and Next.js applications, TypeScript and Node.js services, Python backends, APIs, data, authentication, deployment, and production hardening.',
    href: '/services/full-stack-development',
  },
]

export default function HomeIndex() {
  return (
    <>
      <section className="sr2-proof-strip" aria-labelledby="proof-heading">
        <div className="sr2-wrap">
          <span className="sr2-kicker">Evidence before assurances</span>
          <h2 id="proof-heading" className="sr-only">What BlueDot brings to the work</h2>
          <ul>
            <li><strong>Since 2002</strong><span>Building software, automation, and systems.</span></li>
            <li><strong>Direct access</strong><span>The person doing the work is in the conversation.</span></li>
            <li><strong>Working stack</strong><span>TypeScript, Python, Linux, APIs, cloud, and AI systems.</span></li>
            <li><strong>Written handoff</strong><span>Scope, acceptance criteria, validation, and operating context.</span></li>
          </ul>
        </div>
      </section>

      <section className="sr2-home-problems sr2-section" aria-labelledby="problems-heading">
        <div className="sr2-wrap">
          <div className="sr2-section-head">
            <div><span className="sr2-kicker">Start with the pressure point</span><h2 id="problems-heading">Useful work begins with the thing that keeps failing.</h2></div>
            <p>BlueDot is a good fit when a technical problem has a real owner, a meaningful consequence, and enough access to inspect the current system.</p>
          </div>
          <div className="sr2-problem-chapters">
            {problems.map((problem) => (
              <article key={problem.title}>
                <h3>{problem.title}</h3>
                <p>{problem.description}</p>
                <a className="sr2-link" href={problem.href}>{problem.link}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-home-cases sr2-section-deep" aria-labelledby="cases-heading">
        <div className="sr2-wrap">
          <div className="sr2-section-head">
            <div><span className="sr2-kicker">Selected work</span><h2 id="cases-heading">Two public examples. No invented client metrics.</h2></div>
            <p>Public repositories show the approach. Private client work is not represented as a case study without permission.</p>
          </div>
          <div className="sr2-home-case-list">
            {caseStudies.map((study) => (
              <article className="sr2-home-case" key={study.project}>
                <div className="sr2-home-case-artifact">
                  <Image src={study.artifact} alt={study.alt} width={900} height={420} />
                  <p>{study.caption}</p>
                </div>
                <div className="sr2-home-case-copy">
                  <span className="sr2-project-category">{study.category}</span>
                  <h3>{study.title}</h3>
                  <dl>
                    <div><dt>Problem</dt><dd>{study.problem}</dd></div>
                    <div><dt>Work</dt><dd>{study.work}</dd></div>
                    <div><dt>Evidence</dt><dd>{study.evidence}</dd></div>
                    <div><dt>Result</dt><dd>{study.result}</dd></div>
                  </dl>
                  <a className="sr2-link" href={study.href} target="_blank" rel="noreferrer">Inspect {study.project} <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
          <a className="sr2-link" href="/projects">Read the selected work page</a>
        </div>
      </section>

      <section className="sr2-home-services sr2-section" aria-labelledby="home-services-heading">
        <div className="sr2-wrap">
          <div className="sr2-section-head">
            <div><span className="sr2-kicker">Three capabilities</span><h2 id="home-services-heading">The service is the change, not the technology label.</h2></div>
            <p>Each engagement starts with a concrete problem and ends with a result someone can validate and operate.</p>
          </div>
          <div className="sr2-home-service-list">
            {services.map((service) => (
              <article key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a className="sr2-link" href={service.href}>View {service.title}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-home-process sr2-section-deep" aria-labelledby="process-heading">
        <div className="sr2-wrap sr2-process">
          <div><span className="sr2-kicker">How the work moves</span><h2 id="process-heading">Review, scope, implement, validate, hand off.</h2></div>
          <ol className="sr2-process-line">
            <li><strong>Review</strong><p>Understand the current system, pressure point, permissions, and constraints.</p></li>
            <li><strong>Scope</strong><p>Agree deliverables, exclusions, acceptance criteria, price, and schedule in writing.</p></li>
            <li><strong>Implement</strong><p>Make the smallest useful change while keeping decisions and failure paths visible.</p></li>
            <li><strong>Validate</strong><p>Test the result, document what changed, and hand over enough context to operate it.</p></li>
          </ol>
        </div>
      </section>

      <section className="sr2-fit sr2-section" aria-labelledby="fit-heading">
        <div className="sr2-wrap sr2-fit-grid">
          <div><span className="sr2-kicker">Fit matters</span><h2 id="fit-heading">Good work starts with an honest scope.</h2></div>
          <div className="sr2-fit-columns">
            <article><h3>Good fit</h3><ul><li>Technical founders and lean teams with a real system to improve.</li><li>Teams willing to provide authorized access and a decision-maker.</li><li>Work where clear scope and a usable handoff matter more than theater.</li></ul></article>
            <article><h3>Probably not a fit</h3><ul><li>Unbounded “make it secure” requests with no agreed target.</li><li>Unauthorized testing, credential collection, or work against third-party systems.</li><li>Projects looking for a disposable prototype with no owner after launch.</li></ul></article>
          </div>
        </div>
      </section>

      <section className="sr2-home-faq sr2-section-deep" aria-labelledby="faq-heading">
        <div className="sr2-wrap sr2-faq-grid">
          <div><span className="sr2-kicker">Before you write</span><h2 id="faq-heading">A few useful answers.</h2></div>
          <div className="sr2-faq-list">
            <details><summary>What does an engagement begin with?</summary><p>A short review of the system, the problem, the intended outcome, and the access or authorization required to work safely.</p></details>
            <details><summary>Do you publish fixed prices?</summary><p>Pricing follows the written scope. Scope, deliverables, acceptance criteria, pricing, and schedule are agreed before work begins.</p></details>
            <details><summary>Can you work in an existing codebase?</summary><p>Yes. Existing architecture, deployment assumptions, and the safest high-value change are part of the initial review.</p></details>
            <details><summary>What should I send through the contact form?</summary><p>Send the problem, stack, stage, desired outcome, and relevant constraints. Do not send passwords, credentials, regulated data, or customer records.</p></details>
          </div>
        </div>
      </section>

      <section className="sr2-close">
        <div className="sr2-wrap sr2-close-copy">
          <div><span className="sr2-kicker">Next step</span><h2>Bring the problem. Leave with a scoped next move.</h2></div>
          <div><p>BlueDot will review the request, identify any immediate scope or authorization questions, and reply with the appropriate next step.</p><a className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</a></div>
        </div>
      </section>
    </>
  )
}
