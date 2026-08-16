const baseUrl = 'https://bluedot.it.com'
const organizationId = `${baseUrl}/#organization`

const services = [
  {
    name: 'Application and Infrastructure Security Reviews',
    description: 'Review a website, API, application, deployment, AI integration, or supporting host and turn the evidence into prioritized fixes you can act on.',
    serviceType: 'Security engineering',
    url: `${baseUrl}/services/security-reviews`,
  },
  {
    name: 'Workflow Automation and API Integrations',
    description: 'Turn repetitive workflows into reliable automations with clear handoffs, logs, permissions, and human review where it matters.',
    serviceType: 'AI automation',
    url: `${baseUrl}/services/workflow-automation`,
  },
  {
    name: 'Full-Stack Application Development',
    description: 'Design, build, deploy, and improve full-stack applications, APIs, dashboards, internal platforms, integrations, and production services.',
    serviceType: 'Full-stack development',
    url: `${baseUrl}/services/full-stack-development`,
  },
] as const

export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': organizationId,
        name: 'BlueDot IT, LLC',
        legalName: 'BlueDot IT, LLC',
        url: `${baseUrl}/`,
        description: 'BlueDot IT, LLC helps technical founders and lean teams harden production applications, replace fragile manual workflows, and build maintainable software from interface to infrastructure.',
        logo: `${baseUrl}/bluedot-logo.png`,
        founder: {
          '@id': `${baseUrl}/#person`,
        },
        areaServed: 'United States',
        serviceType: [
          'Security engineering',
          'Application and API security',
          'AI automation and agent systems',
          'Workflow automation',
          'Full-stack application development',
          'Secure deployment and infrastructure hardening',
          'MCP security consulting',
        ],
        sameAs: [
          'https://github.com/BlueDot-IT',
          'https://github.com/jason-allen-oneal',
          'https://huggingface.co/jason-oneal',
        ],
      },
      {
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: "Jason O'Neal",
        url: `${baseUrl}/about`,
        worksFor: {
          '@id': organizationId,
        },
        knowsAbout: [
          'Security engineering',
          'Full-stack development',
          'AI automation',
          'AI agent systems',
          'TypeScript',
          'React',
          'Next.js',
          'Node.js',
          'Python',
          'Linux',
          'NGINX',
          'Docker',
          'Model Context Protocol',
          'AI security tooling',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: `${baseUrl}/`,
        name: 'BlueDot IT',
        publisher: {
          '@id': organizationId,
        },
      },
      ...services.map((service) => ({
        '@type': 'Service',
        '@id': `${service.url}#service`,
        name: service.name,
        description: service.description,
        serviceType: service.serviceType,
        url: service.url,
        provider: {
          '@id': organizationId,
        },
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; url: string }> }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  const serialized = JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialized }} />
}
