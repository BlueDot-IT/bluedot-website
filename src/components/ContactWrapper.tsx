import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact BlueDot IT',
  description: 'Tell BlueDot IT about a reporting bottleneck, repetitive workflow, website, infrastructure problem, or custom software project.',
  openGraph: {
    title: 'Contact | BlueDot IT',
    description: 'Describe the business process or technical problem you need to improve.',
    type: 'website',
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
