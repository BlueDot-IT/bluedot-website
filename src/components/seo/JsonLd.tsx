export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': 'https://bluedot.it.com/#organization',
        name: 'BlueDot IT',
        url: 'https://bluedot.it.com/',
        logo: 'https://bluedot.it.com/bluedot-logo.png',
        founder: {
          '@id': 'https://bluedot.it.com/#person',
        },
        areaServed: [
          {
            '@type': 'AdministrativeArea',
            name: 'Caldwell County, North Carolina',
          },
          'United States',
        ],
        serviceType: [
          'Operations automation and reporting',
          'Cybersecurity consulting',
          'Secure web development',
          'Infrastructure hardening',
          'Workflow automation',
          'AI security tooling',
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
          'Cybersecurity',
          'Full-stack development',
          'TypeScript',
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
