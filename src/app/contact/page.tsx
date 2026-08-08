import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact BlueDot IT',
  description: 'Tell BlueDot IT about a reporting bottleneck, repetitive workflow, website, infrastructure problem, or custom software project.',
  alternates: {
    canonical: 'https://bluedot.it.com/contact',
  },
  openGraph: {
    title: 'Contact | BlueDot IT',
    description: 'Describe the business process or technical problem you need to improve.',
    type: 'website',
    url: 'https://bluedot.it.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | BlueDot IT',
    description: 'Describe the business process or technical problem you need to improve.',
  },
}

const serviceSubjects: Record<string, string> = {
  'operations-sprint': 'Operations Automation & Reporting Sprint',
  'operations-automation-reporting': 'Operations Automation & Reporting Sprint',
  'workflow-automation': 'Workflow Automation',
  'security-reviews': 'Security Review',
  'server-hardening': 'Server Hardening',
  'nextjs-security-hardening': 'Next.js Security Hardening',
  'mcp-security-consulting': 'MCP Security Consulting',
  'small-business-websites': 'Small Business Website',
  'ai-security-tooling': 'AI Security Tooling',
}

interface ContactPageProps {
  searchParams: Promise<{ service?: string | string[] }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const service = Array.isArray(params.service) ? params.service[0] : params.service
  const initialSubject = service ? serviceSubjects[service] || '' : ''

  return <ContactForm initialSubject={initialSubject} />
}
