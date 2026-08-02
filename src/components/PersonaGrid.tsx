'use client'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Reveal from '@/components/Reveal'

const personas = [
  {
    title: 'See what needs attention',
    description: 'Turn scattered spreadsheets, inboxes, portal exports, and status checks into one useful report or lightweight dashboard.',
    cta: 'Explore reporting work',
    href: '/services/operations-automation-reporting'
  },
  {
    title: 'Remove repetitive handoffs',
    description: 'Connect stable tools and data sources so routine copying, reminders, notifications, and report preparation happen consistently.',
    cta: 'Explore workflow automation',
    href: '/services/workflow-automation'
  },
  {
    title: 'Keep a human in control',
    description: 'Use validation, logs, exception alerts, and explicit decision points instead of creating an unattended machine nobody trusts.',
    cta: 'See how BlueDot works',
    href: '/services#how-it-works'
  }
]

export default function PersonaGrid() {
  return (
    <section className="page-shell py-24 bg-white/[0.01] border-b border-white/5 space-y-12">
      <div className="max-w-3xl space-y-4">
        <span className="pill">The practical outcome</span>
        <h2 className="text-4xl font-bold tracking-tight text-white">One bounded workflow. Better operational visibility.</h2>
        <p className="text-base-content/65 leading-relaxed">
          The Operations Automation and Reporting Sprint starts with a real process, not an AI sales pitch. BlueDot maps the work, defines the source boundaries in writing, and delivers one maintainable reporting or automation flow.
        </p>
      </div>
      <div className="grid gap-12 md:grid-cols-3">
        {personas.map((p) => (
          <Reveal key={p.title}>
            <div className="h-full space-y-6">
              <div className="w-12 h-0.5 bg-primary/40" />
              <h3 className="text-2xl font-bold tracking-tight text-white">{p.title}</h3>
              <p className="text-sm text-base-content/60 leading-relaxed font-medium">
                {p.description}
              </p>
              <Link href={p.href} className="inline-flex items-center text-primary text-xs font-bold tracking-widest uppercase hover:text-white transition-colors">
                {p.cta} <span className="ml-2">→</span>
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
