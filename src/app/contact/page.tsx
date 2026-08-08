import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact BlueDot IT',
  description: 'Tell BlueDot IT what you are building, automating, or securing, including application security, AI automation, full-stack development, APIs, integrations, and production hardening.',
  alternates: {
    canonical: 'https://bluedot.it.com/contact',
  },
  openGraph: {
    title: 'Contact | BlueDot IT',
    description: 'Describe the system, workflow, application, or security boundary you need to improve.',
    type: 'website',
    url: 'https://bluedot.it.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | BlueDot IT',
    description: 'Describe the system, workflow, application, or security boundary you need to improve.',
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

interface ContactPageProps {
  searchParams: Promise<{ service?: string | string[] }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const service = Array.isArray(params.service) ? params.service[0] : params.service
  const initialSubject = service ? serviceSubjects[service] || '' : ''

  return <ContactForm initialSubject={initialSubject} />
}
