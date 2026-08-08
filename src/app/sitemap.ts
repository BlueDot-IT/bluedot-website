import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const baseUrl = 'https://bluedot.it.com'
export const dynamic = 'force-dynamic'

// Keep these dates tied to the content change being deployed. A fixed date is
// preferable to claiming that every request changed the page, but it must be
// advanced whenever the corresponding static content changes.
const lastContentUpdate = new Date('2026-08-02')
const lastLegalUpdate = new Date('2026-08-02')
const servicePageSlugs = [
  'operations-automation-reporting',
  'security-reviews',
  'server-hardening',
  'nextjs-security-hardening',
  'workflow-automation',
  'mcp-security-consulting',
  'small-business-websites',
  'ai-security-tooling',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastContentUpdate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastContentUpdate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: lastLegalUpdate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: lastLegalUpdate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]

  const servicePages: MetadataRoute.Sitemap = servicePageSlugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: lastContentUpdate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  let blogPosts: MetadataRoute.Sitemap = []

  if (!process.env.DATABASE_URL) {
    return [...staticPages, ...servicePages]
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    blogPosts = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error)
  }

  return [...staticPages, ...servicePages, ...blogPosts]
}
