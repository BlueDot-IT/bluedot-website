'use client'
import { useRef } from 'react'
import useReveal from '@/hooks/useReveal'

export default function Hero() {
  const textRef = useRef<HTMLDivElement | null>(null)
  useReveal(textRef)

  return (
    <section className="relative overflow-hidden pt-24 pb-16 border-b border-white/5">
      <div className="page-shell">
        <div ref={textRef} className="reveal space-y-8 text-center md:text-left md:max-w-5xl">
          <div className="flex items-center gap-4 justify-center md:justify-start opacity-60">
             <span className="pill">Lenoir, NC</span>
             <span className="pill">Automation</span>
             <span className="pill">Reporting</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tighter md:text-7xl leading-[1.05]">
            Stop running the business by <span className="text-primary">copy, paste, and guesswork.</span>
          </h1>
          <p className="text-xl text-base-content/70 max-w-[65ch] font-medium leading-relaxed">
            BlueDot IT connects scattered tools, automates repetitive work, and builds clear operational reports for small businesses in Lenoir, Caldwell County, and remote teams.
          </p>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start pt-4">
            <a href="/services/operations-automation-reporting" className="px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-primary transition-colors">See the operations sprint</a>
            <a href="/contact?service=operations-sprint" className="px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:border-white transition-colors">Describe the bottleneck</a>
          </div>
          <p className="text-sm text-base-content/55">Fixed-scope projects with written boundaries, validation, documentation, and handoff.</p>
        </div>
      </div>
    </section>
  )
}
