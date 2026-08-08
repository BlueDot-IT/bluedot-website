'use client'
import Reveal from '@/components/Reveal'

const principles = [
  {
    label: 'Security during the build',
    description: 'Security is considered during architecture and implementation, not added only after launch.'
  },
  {
    label: 'Controlled AI systems',
    description: 'AI systems include permissions, logs, review points, and operational boundaries.'
  },
  {
    label: 'Full-stack ownership',
    description: 'Frontend, backend, APIs, data, deployment, and production concerns stay in the same conversation.'
  },
  {
    label: 'Remediation, not just reports',
    description: 'Reviews can include implementation and retesting instead of ending with a scanner report.'
  },
  {
    label: 'Written delivery',
    description: 'Engagements use scope, validation, documentation, and handoff so the result is explainable.'
  },
  {
    label: 'Human control',
    description: 'Sensitive actions retain a human approval point where the risk calls for it.'
  }
]

export default function CaseHighlights() {
  return (
    <section className="page-shell py-24">
      <div className="space-y-10">
        <div className="max-w-3xl space-y-4">
          <div className="w-12 h-1 bg-white" />
          <span className="pill">Why BlueDot</span>
          <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">The implementation and the boundary belong together.</h2>
          <p className="text-lg text-base-content/60 leading-relaxed font-medium">
            A security consultant may find the problem without building the replacement. An automation shop may connect tools without handling permissions, secrets, approvals, and auditability. BlueDot works across those seams.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle) => (
            <Reveal key={principle.label}>
              <div className="h-full space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-bold uppercase tracking-widest text-white">{principle.label}</div>
                <div className="text-base text-base-content/60 leading-relaxed font-medium">{principle.description}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
