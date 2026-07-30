import { serialize } from "next-mdx-remote/serialize"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import MDXContent from "@/components/MDXContent"
import CommentForm from "@/components/CommentForm"
import ShareButtons from "@/components/ShareButtons"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import { Metadata } from "next"
import { approvedCommentsWhere } from "@/lib/comments"

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
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      type: 'article',
      publishedTime: post.createdAt. toISOString(),
      modifiedTime: post.updatedAt?. toISOString(),
      authors: ['Jason O\'Neal'],
      url: `https://bluedot.it.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.title,
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

  const mdxSource = await serialize(post.content)
  const comments = await prisma.comment.findMany({
    where: approvedCommentsWhere(post.id),
    orderBy: { createdAt: "desc" },
    select: { id: true, content: true, author: true, createdAt: true },
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html:  JSON.stringify(jsonLd) }}
      />
      <div className="page-shell">
        <div className="mx-auto max-w-3xl space-y-12 py-12">
          <Card className="p-8">
            <CardHeader>
              <h1 className="text-3xl font-bold text-base-content">{post.title}</h1>
              <p className="text-sm text-base-content/70">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="prose max-w-none prose-headings:text-base-content prose-p:text-base-content/85 prose-strong:text-primary prose-code:text-primary">
              <MDXContent source={mdxSource} />
            </CardContent>
            <div className="px-4 pb-6 pt-6">
              <ShareButtons
                title={post.title}
                url={`https://bluedot.it.com/blog/${post.slug}`}
              />
            </div>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <h2 className="text-xl font-semibold text-base-content">Comments</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <CommentForm postId={post.id} />
              <Separator className="bg-white/10" />
              <ul className="space-y-4">
                {comments.map((comment: any) => (
                  <li
                    key={comment.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="text-sm text-base-content/70">
                      {comment.author} •{" "}
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                    <p className="mt-1 text-base-content/85 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
