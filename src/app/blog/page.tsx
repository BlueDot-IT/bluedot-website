import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'Security, AI Automation & Full-Stack Insights',
  description: 'Technical insights from BlueDot IT on security engineering, AI automation, and full-stack delivery for teams operating real systems.',
  alternates: { canonical: 'https://bluedot.it.com/blog' },
  openGraph: {
    title: 'Security, AI Automation & Full-Stack Insights | BlueDot IT',
    description: 'Technical writing on security engineering, AI automation, and full-stack delivery.',
    type: 'website',
    url: 'https://bluedot.it.com/blog',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BlueDot IT insights' }],
  },
  twitter: { card: 'summary_large_image', title: 'Security, AI Automation & Full-Stack Insights | BlueDot IT', description: 'Technical writing on security engineering, AI automation, and full-stack delivery.', images: ['/twitter-image'] },
}

const topicTracks = [
  { title: 'Security', description: 'Application boundaries, infrastructure hardening, authorization, evidence, and practical risk reduction.', href: '/services/security-reviews', link: 'See security reviews' },
  { title: 'AI Automation', description: 'Agents, tool permissions, human approval, observability, workflow design, and controlled integrations.', href: '/services/workflow-automation', link: 'See AI automation' },
  { title: 'Full-Stack Engineering', description: 'Applications, APIs, data, deployment, maintainability, and the production concerns around the code.', href: '/services/full-stack-development', link: 'See full-stack delivery' },
]

function serviceForCategory(category: string | null | undefined) {
  const value = category?.toLowerCase() || ''
  if (value.includes('security')) return { href: '/services/security-reviews', label: 'Security review' }
  if (value.includes('ai') || value.includes('automation')) return { href: '/services/workflow-automation', label: 'AI automation' }
  return { href: '/services/full-stack-development', label: 'Full-stack delivery' }
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, createdAt: true, category: { select: { name: true } } },
  })

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Insights', url: 'https://bluedot.it.com/blog' }]} />
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">BlueDot insights</span><h1>Notes from the <span>work.</span></h1></div>
          <div className="sr2-page-hero-note"><p>Technical writing for teams building, automating, securing, and operating real systems.</p><Link className="sr2-link" href="/contact">Discuss a system</Link></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <div className="sr2-section-head"><div><span className="sr2-kicker">Topic tracks</span><h2>Three connected lenses.</h2></div><p>Existing writing can be read through these three connected lenses.</p></div>
          <div className="sr2-note-list">
            {topicTracks.map((track) => <article key={track.title}><h3>{track.title}</h3><p>{track.description}</p><Link className="sr2-link" href={track.href}>{track.link}</Link></article>)}
          </div>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep" id="latest-insights" aria-labelledby="latest-insights-heading">
        <div className="sr2-wrap">
          <div className="sr2-section-head"><div><span className="sr2-kicker">Latest insights</span><h2 id="latest-insights-heading">Read the notes.</h2></div><p>Technical notes stay grounded in the systems, boundaries, and decisions they describe.</p></div>
          {posts.length > 0 ? (
            <div className="sr2-note-list">
              {posts.map((post) => { const service = serviceForCategory(post.category?.name); return <article key={post.id}><time className="sr2-kicker" dateTime={post.createdAt.toISOString()}>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time><span className="sr2-post-category">{post.category?.name || 'Engineering note'}</span><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>{post.excerpt && <p>{post.excerpt}</p>}<div className="sr2-note-actions"><Link className="sr2-link" href={`/blog/${post.slug}`}>Read the note</Link><Link className="sr2-link sr2-link-muted" href={service.href}>Related service: {service.label}</Link></div></article> })}
            </div>
          ) : <div className="sr2-note-list"><article><h3>No posts yet.</h3><p>Technical notes will appear here as they are published.</p></article></div>}
        </div>
      </section>

      <section className="sr2-close"><div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Next conversation</span><h2>Have a system question?</h2></div><div><p>Bring a security concern, automation idea, or application problem to the same conversation.</p><Link className="sr2-link" href="/contact">Discuss your project</Link></div></div></section>
    </>
  )
}
