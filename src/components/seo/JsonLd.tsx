export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://bluedot.it.com/#organization',
        name: 'BlueDot IT',
        url: 'https://bluedot.it.com/',
        description: 'BlueDot IT provides application security, AI agent and workflow automation, and full-stack software development for startups, technical teams, and growing businesses.',
        logo: 'https://bluedot.it.com/bluedot-logo.png',
        founder: {
          '@id': 'https://bluedot.it.com/#person',
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
          'https://github.com/jason-allen-oneal',
          'https://huggingface.co/jason-oneal',
        ],
      },
      {
        '@type': 'Person',
        '@id': 'https://bluedot.it.com/#person',
        name: "Jason O'Neal",
        url: 'https://bluedot.it.com/about',
        worksFor: {
          '@id': 'https://bluedot.it.com/#organization',
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
        '@id': 'https://bluedot.it.com/#website',
        url: 'https://bluedot.it.com/',
        name: 'BlueDot IT',
        publisher: {
          '@id': 'https://bluedot.it.com/#organization',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
