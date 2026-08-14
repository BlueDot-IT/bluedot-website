import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact BlueDot IT',
  description: 'Tell BlueDot IT what you are building, automating, or securing, including application security, AI automation, full-stack development, APIs, integrations, and production hardening.',
  openGraph: {
    title: 'Contact | BlueDot IT',
  description: 'Describe the system, workflow, application, or security concern you need to improve.',
    type: 'website',
    url: 'https://bluedot.it.com/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | BlueDot IT',
    description: 'Describe the system, workflow, application, or security concern you need to improve.',
  },
  alternates: {
    canonical: 'https://bluedot.it.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
