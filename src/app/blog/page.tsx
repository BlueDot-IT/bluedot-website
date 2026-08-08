import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import Reveal from "@/components/Reveal"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Technical insights from BlueDot IT across security engineering, AI automation, and full-stack development.',
  alternates: {
    canonical: 'https://bluedot.it.com/blog',
  },
  openGraph: {
    title: 'Insights | BlueDot IT',
    description: 'Technical writing across security engineering, AI automation, and full-stack development.',
    type: 'website',
    url: 'https://bluedot.it.com/blog',
  },
}

const topicTracks = [
  {
    title: 'Security',
    description: 'Application boundaries, infrastructure hardening, authorization, evidence, and practical risk reduction.',
  },
  {
    title: 'AI Automation',
    description: 'Agents, tool permissions, human approval, observability, workflow design, and controlled integrations.',
  },
  {
    title: 'Full-Stack Engineering',
    description: 'Applications, APIs, data, deployment, maintainability, and the production concerns around the code.',
  },
]

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
    },
  })

  return (
    <div className="page-shell space-y-12">
      <div className="text-center space-y-4">
        <span className="kicker">BlueDot insights</span>
        <h1 className="heading-accent text-4xl md:text-5xl font-bold">
          Notes from the system boundary.
        </h1>
        <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
          Technical writing for teams building, automating, securing, and operating real systems.
        </p>
      </div>

      <section className="space-y-5" aria-labelledby="topic-tracks">
        <div>
          <h2 id="topic-tracks" className="text-2xl font-bold">Topic tracks</h2>
          <p className="mt-2 text-base-content/70">Existing writing can be read through these three connected lenses.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {topicTracks.map((track) => (
            <Card key={track.title} className="h-full bg-white/5 border-white/10 p-6">
              <h3 className="text-xl font-bold text-base-content">{track.title}</h3>
              <p className="mt-3 text-sm text-base-content/70 leading-relaxed">{track.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="latest-insights" className="space-y-6" aria-labelledby="latest-insights-heading">
        <div>
          <h2 id="latest-insights-heading" className="text-2xl font-bold">Latest insights</h2>
        </div>
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {posts.map((post: any) => (
              <Reveal key={post.id} className="h-full">
                <Card className="transition-all duration-300 hover:-translate-y-1 h-full">
                  <CardHeader>
                    <time className="text-sm text-primary">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold text-base-content hover:text-primary transition-colors mb-3">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-base-content/80 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <Link href={`/blog/${post.slug}`} className="text-primary hover:text-accent text-sm font-medium">
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <Card className="p-12 text-center">
              <h3 className="text-2xl font-bold text-base-content mb-4">No posts yet</h3>
              <p className="text-base-content/80">Technical notes will appear here as they are published.</p>
            </Card>
          </Reveal>
        )}
      </section>

      <Reveal>
        <Card className="mt-4 p-8 text-center">
          <h2 className="text-2xl font-bold text-base-content mb-4">Have a system question?</h2>
          <p className="text-base-content/80 mb-6 max-w-2xl mx-auto">Bring a security concern, automation idea, or application problem to the same conversation.</p>
          <Link href="/contact" className="btn btn-primary">Discuss your project</Link>
        </Card>
      </Reveal>
    </div>
  )
}
