import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Public HTML pages use noindex metadata where removal from search
        // results is useful. Keep those pages crawlable so crawlers can see
        // the directive; disallow server and administrative surfaces here.
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://bluedot.it.com/sitemap.xml',
  }
}
