'use client'
import Reveal from '@/components/Reveal'

const methodology = [
  {
    label: 'Current-state map',
    description: 'The existing process, bottlenecks, owners, inputs, and exceptions.'
  },
  {
    label: 'Bounded implementation',
    description: 'One bounded operational workflow using the sources agreed in writing.'
  },
  {
    label: 'Validation and handoff',
    description: 'Checks, failure visibility, acceptance evidence, documentation, and a maintainable handoff.'
  }
]

export default function CaseHighlights() {
  return (
    <section className="page-shell py-24">
      <div className="grid gap-24 lg:grid-cols-2">
        <div className="space-y-10">
          <div className="w-12 h-1 bg-white" />
          <span className="pill">What a sprint includes</span>
          <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">Useful automation that leaves evidence behind.</h2>
          <p className="text-lg text-base-content/60 leading-relaxed font-medium">
            BlueDot builds around agreed inputs, outputs, failure modes, and handoff points. You get a working system and enough documentation to understand what happens when the happy path wanders into the woods.
          </p>
          <div className="border-l border-white/10 bg-white/5 p-8 font-medium text-base-content/80">
            Good first candidates include weekly reporting assembled from several portals, information copied between forms and sheets, recurring status work with no clear owner, and small dashboards that need reliable source data.
            <a href="/contact?service=operations-sprint" className="mt-6 block text-xs font-bold uppercase tracking-widest text-primary">Tell me what is wasting time →</a>
          </div>
        </div>
        <div className="grid gap-12 self-center">
          {methodology.map((m) => (
            <Reveal key={m.label}>
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-widest text-white">{m.label}</div>
                <div className="text-base text-base-content/60 leading-relaxed font-medium">{m.description}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
