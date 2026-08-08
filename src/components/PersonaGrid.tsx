'use client'
import Link from 'next/link'
import Reveal from '@/components/Reveal'

const pillars = [
  {
    title: 'Security Engineering',
    description: 'Review and strengthen applications, APIs, authentication, deployments, AI tool boundaries, and supporting infrastructure. Findings are prioritized, evidence-backed, and can include remediation implementation.',
    cta: 'Explore security engineering',
    href: '/services#security-engineering'
  },
  {
    title: 'AI Automation',
    description: 'Build controlled AI agents, tool integrations, and workflow automations with explicit permissions, useful logs, human approval points, and maintainable failure handling.',
    cta: 'Explore AI automation',
    href: '/services#ai-automation'
  },
  {
    title: 'Full-Stack Development',
    description: 'Design, build, deploy, and improve full-stack applications, APIs, dashboards, internal platforms, integrations, and production services using TypeScript, React, Next.js, Node.js, Python, and modern infrastructure.',
    cta: 'Explore full-stack development',
    href: '/services/full-stack-development'
  }
]

export default function PersonaGrid() {
  return (
    <section className="page-shell py-24 bg-white/[0.01] border-b border-white/5 space-y-12">
      <div className="max-w-3xl space-y-4">
        <span className="pill">Three connected capabilities</span>
        <h2 className="text-4xl font-bold tracking-tight text-white">Engineering depth across the system.</h2>
        <p className="text-base-content/65 leading-relaxed">
          BlueDot can work at the application layer, the workflow layer, and the security boundary around both. The engagement stays grounded in written scope, observable behavior, and a handoff another technical person can operate.
        </p>
      </div>
      <div className="grid gap-12 md:grid-cols-3">
        {pillars.map((p) => (
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
