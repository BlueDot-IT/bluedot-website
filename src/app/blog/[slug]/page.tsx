import { serialize } from "next-mdx-remote/serialize"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import MDXContent from "@/components/MDXContent"
import CommentForm from "@/components/CommentForm"
import ShareButtons from "@/components/ShareButtons"
import { Metadata } from "next"
import { approvedCommentsWhere } from "@/lib/comments"
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.post. findUnique({
    where:  { slug },
    select: {
      title: true,
      excerpt: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: {
      canonical: `https://bluedot.it.com/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.createdAt. toISOString(),
      modifiedTime: post.updatedAt?. toISOString(),
      authors: ['Jason O\'Neal'],
      url: `https://bluedot.it.com/blog/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: `${post.title} | BlueDot IT` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
      images: ['/twitter-image'],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      createdAt: true,
      updatedAt: true,
      category: { select: { name: true } },
    },
  })

  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt?.toISOString() || post.createdAt.toISOString(),
    author: {
      '@type': 'Person',
      name: 'Jason O\'Neal',
      url: 'https://bluedot.it.com/about',
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://bluedot.it.com/#organization',
      name: 'BlueDot IT',
      url: 'https://bluedot.it.com/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bluedot.it.com/bluedot-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bluedot.it.com/blog/${slug}`,
    },
  }
  const serializedJsonLd = JSON.stringify(jsonLd)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')

  const mdxSource = await serialize(post.content)
  const comments = await prisma.comment.findMany({
    where: approvedCommentsWhere(post.id),
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, author: true, createdAt: true },
  })
  const category = post.category?.name?.toLowerCase() || ''
  const relatedService = category.includes('security')
    ? { href: '/services/security-reviews', label: 'Security review' }
    : category.includes('ai') || category.includes('automation')
      ? { href: '/services/workflow-automation', label: 'AI automation' }
      : { href: '/services/full-stack-development', label: 'Full-stack delivery' }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializedJsonLd }}
      />
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Insights', url: 'https://bluedot.it.com/blog' }, { name: post.title, url: `https://bluedot.it.com/blog/${post.slug}` }]} />
      <article className="sr2-document">
        <div className="sr2-wrap sr2-document-inner">
          <header>
            <span className="sr2-kicker">BlueDot insights</span>
            <h1>{post.title}</h1>
            <div className="sr2-article-meta"><p className="sr2-date"><time dateTime={post.createdAt.toISOString()}>{new Date(post.createdAt).toLocaleDateString()}</time></p><span className="sr2-post-category">{post.category?.name || 'Engineering note'}</span></div>
          </header>
          <div className="prose max-w-none">
            <MDXContent source={mdxSource} />
          </div>
          <div className="mt-10 border-t border-white/10 pt-6">
            <ShareButtons title={post.title} url={`https://bluedot.it.com/blog/${post.slug}`} />
          </div>
          <aside className="sr2-related-service">
            <span className="sr2-kicker">Put this to work</span>
            <h2>Need this considered in an existing system?</h2>
            <p>Insights are general. An engagement starts with the application, workflow, or infrastructure you actually need to change.</p>
            <a className="sr2-link" href={relatedService.href}>See the {relatedService.label} engagement</a>
          </aside>
          <section className="mt-16 border-t border-white/10 pt-8">
            <span className="sr2-kicker">Conversation</span>
            <h2>Comments</h2>
            <div className="mt-6"><CommentForm postId={post.id} /></div>
            <ul className="mt-8 space-y-5">
              {comments.map((comment: any) => (
                <li key={comment.id} className="border-t border-white/10 pt-5">
                  <div className="sr2-date">{comment.author} · {new Date(comment.createdAt).toLocaleString()}</div>
                  <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </>
  )
}
