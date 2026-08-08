import Link from 'next/link'
import Reveal from '@/components/Reveal'

const entryPoints = [
  {
    title: 'Security Review',
    description: 'A bounded review of an application, repository, deployment, AI integration, or supporting host.',
    deliverables: ['Findings with severity and evidence', 'Prioritized remediation plan', 'Optional implementation and retest checklist'],
    href: '/contact?service=security-review',
  },
  {
    title: 'AI Automation Discovery and Prototype',
    description: 'A bounded engagement to map one workflow and build a controlled working prototype.',
    deliverables: ['Workflow and tool map', 'Data and permission boundaries', 'Functional prototype with logs, approvals, and a production roadmap'],
    href: '/contact?service=ai-automation-discovery',
  },
  {
    title: 'Full-Stack Build Sprint',
    description: 'A defined implementation phase for an application capability, internal tool, dashboard, API, integration, or backend service.',
    deliverables: ['Written scope and architecture', 'Implementation, tests, and deployment', 'Documentation and handoff'],
    href: '/contact?service=full-stack-build-sprint',
  },
]

export default function EngagementEntryPoints() {
  return (
    <>
      <section className="page-shell space-y-10 py-24 border-t border-white/5">
        <div className="max-w-3xl space-y-4">
          <span className="pill">Engagement entry points</span>
          <h2 className="text-4xl font-bold tracking-tight text-white">Start with a bounded problem.</h2>
          <p className="text-base-content/65 leading-relaxed">
            Bring one system, workflow, or risk boundary into focus. Scope, deliverables, validation, and handoff are written down before implementation begins.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {entryPoints.map((entryPoint) => (
            <Reveal key={entryPoint.title}>
              <article className="h-full flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
                <h3 className="text-2xl font-bold text-white">{entryPoint.title}</h3>
                <p className="text-sm text-base-content/65 leading-relaxed">{entryPoint.description}</p>
                <ul className="flex-1 list-disc space-y-2 pl-5 text-sm text-base-content/70">
                  {entryPoint.deliverables.map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                </ul>
                <Link href={entryPoint.href} className="btn btn-outline border-white/20 hover:bg-white/10 w-full">
                  Discuss this entry point
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="page-shell py-24">
        <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-5 md:p-12">
          <span className="pill">Next step</span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Tell me what you are building, automating, or securing.</h2>
          <p className="mx-auto max-w-2xl text-base-content/70">
            Share the current state, the boundary that matters, and what a useful handoff would include.
          </p>
          <Link href="/contact" className="btn btn-primary btn-lg">Discuss your project</Link>
        </div>
      </section>
    </>
  )
}
