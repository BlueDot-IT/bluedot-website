import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Contact BlueDot IT',
  description: 'Tell BlueDot IT what you are building, automating, or securing, including application security, AI automation, full-stack development, APIs, integrations, and production hardening.',
  alternates: { canonical: 'https://bluedot.it.com/contact' },
  openGraph: {
    title: 'Contact | BlueDot IT',
    description: 'Describe the system, workflow, application, or security concern you need to improve.',
    type: 'website',
    url: 'https://bluedot.it.com/contact',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Request a scoped review from BlueDot IT' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | BlueDot IT',
    description: 'Describe the system, workflow, application, or security concern you need to improve.',
    images: ['/twitter-image'],
  },
}

const serviceSubjects: Record<string, string> = {
  'operations-sprint': 'Operations Automation & Reporting Sprint',
  'operations-automation-reporting': 'Operations Automation & Reporting Sprint',
  'workflow-automation': 'Workflow Automation',
  'ai-automation-discovery': 'AI Automation Discovery and Prototype',
  'security-reviews': 'Security Review',
  'security-review': 'Security Review',
  'server-hardening': 'Server Hardening',
  'nextjs-security-hardening': 'Next.js Security Hardening',
  'mcp-security-consulting': 'MCP Security Consulting',
  'full-stack-development': 'Full-Stack Application Development',
  'full-stack-build-sprint': 'Full-Stack Build Sprint',
  'small-business-websites': 'Full-Stack Application Development',
  'ai-security-tooling': 'AI Security Tooling',
}

const serviceSelections: Record<string, string> = {
  'operations-sprint': 'ai-automation',
  'operations-automation-reporting': 'ai-automation',
  'workflow-automation': 'ai-automation',
  'ai-automation-discovery': 'ai-automation',
  'security-reviews': 'security-review',
  'security-review': 'security-review',
  'server-hardening': 'security-review',
  'nextjs-security-hardening': 'security-review',
  'mcp-security-consulting': 'ai-automation',
  'full-stack-development': 'full-stack-development',
  'full-stack-build-sprint': 'full-stack-development',
  'small-business-websites': 'full-stack-development',
  'ai-security-tooling': 'ai-automation',
}

interface ContactPageProps {
  searchParams: Promise<{ service?: string | string[] }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const service = Array.isArray(params.service) ? params.service[0] : params.service
  return <><BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Contact', url: 'https://bluedot.it.com/contact' }]} /><ContactForm initialSubject={service ? serviceSubjects[service] || '' : ''} initialService={service ? serviceSelections[service] || '' : ''} /></>
}
