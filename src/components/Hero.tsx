'use client'
import Link from 'next/link'
import { useRef } from 'react'
import useReveal from '@/hooks/useReveal'

export default function Hero() {
  const textRef = useRef<HTMLDivElement | null>(null)
  useReveal(textRef)

  return (
    <section className="relative overflow-hidden pt-24 pb-16 border-b border-white/5">
      <div className="page-shell">
          <div ref={textRef} className="reveal space-y-8 text-center md:text-left md:max-w-5xl">
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start opacity-70">
             <span className="pill">Security</span>
             <span className="pill">AI Automation</span>
             <span className="pill">Full-Stack</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter md:text-7xl leading-[1.05]">
            Build the application. <span className="text-primary">Automate the workflow. Secure the system.</span>
          </h1>
          <p className="text-xl text-base-content/70 max-w-[65ch] font-medium leading-relaxed">
            BlueDot IT designs and builds full-stack applications, AI-powered automations, and security-conscious systems for startups, technical teams, and growing businesses.
          </p>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-4">
            <Link href="/contact" className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-primary transition-colors">Discuss your project</Link>
            <Link href="/services" className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:border-white transition-colors">Explore services</Link>
          </div>
          <p className="text-sm text-base-content/55">Remote engagements. Defined scope. Production-ready implementation. Clear documentation and handoff.</p>
        </div>
      </div>
    </section>
  )
}
