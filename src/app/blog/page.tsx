import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Technical insights from BlueDot IT across security engineering, AI automation, and full-stack development.',
  alternates: { canonical: 'https://bluedot.it.com/blog' },
  openGraph: {
    title: 'Insights | BlueDot IT',
    description: 'Technical writing across security engineering, AI automation, and full-stack development.',
    type: 'website',
    url: 'https://bluedot.it.com/blog',
  },
}

const topicTracks = [
  { title: 'Security', description: 'Application boundaries, infrastructure hardening, authorization, evidence, and practical risk reduction.' },
  { title: 'AI Automation', description: 'Agents, tool permissions, human approval, observability, workflow design, and controlled integrations.' },
  { title: 'Full-Stack Engineering', description: 'Applications, APIs, data, deployment, maintainability, and the production concerns around the code.' },
]

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, createdAt: true },
  })

  return (
    <>
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">BlueDot insights</span><h1>Notes from the <span>system boundary.</span></h1></div>
          <div className="sr2-page-hero-note"><p>Technical writing for teams building, automating, securing, and operating real systems.</p><Link className="sr2-link" href="/contact">Discuss a system</Link></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <div className="sr2-section-head"><div><span className="sr2-kicker">Topic tracks</span><h2>Three connected lenses.</h2></div><p>Existing writing can be read through these three connected lenses.</p></div>
          <div className="sr2-note-list">
            {topicTracks.map((track) => <article key={track.title}><h3>{track.title}</h3><p>{track.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep" id="latest-insights" aria-labelledby="latest-insights-heading">
        <div className="sr2-wrap">
          <div className="sr2-section-head"><div><span className="sr2-kicker">Latest insights</span><h2 id="latest-insights-heading">Read the notes.</h2></div><p>Technical notes stay grounded in the systems, boundaries, and decisions they describe.</p></div>
          {posts.length > 0 ? (
            <div className="sr2-note-list">
              {posts.map((post) => <article key={post.id}><time className="sr2-kicker" dateTime={post.createdAt.toISOString()}>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>{post.excerpt && <p>{post.excerpt}</p>}<Link className="sr2-link" href={`/blog/${post.slug}`}>Read the note</Link></article>)}
            </div>
          ) : <div className="sr2-note-list"><article><h3>No posts yet.</h3><p>Technical notes will appear here as they are published.</p></article></div>}
        </div>
      </section>

      <section className="sr2-close"><div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Next conversation</span><h2>Have a system question?</h2></div><div><p>Bring a security concern, automation idea, or application problem to the same conversation.</p><Link className="sr2-link" href="/contact">Discuss your project</Link></div></div></section>
    </>
  )
}
