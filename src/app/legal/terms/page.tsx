import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website Terms',
  description: 'Terms governing use of the BlueDot IT public website.',
  alternates: {
    canonical: 'https://bluedot.it.com/legal/terms',
  },
}

const sections = [
  {
    title: 'Website use',
    body: 'These terms govern access to and use of the public BlueDot IT website, including its service information, articles, project examples, account features, and contact forms. By using the website, you agree to use it lawfully and without attempting to disrupt, misuse, or gain unauthorized access to any system or account.',
  },
  {
    title: 'Service information is not a client agreement',
    body: 'Descriptions, starting prices, examples, timelines, and other website content are general information, not a binding quote, warranty, or commitment. Paid work begins only under a separate written agreement or statement of work that defines the parties, deliverables, price, schedule, responsibilities, exclusions, ownership, and acceptance terms.',
  },
  {
    title: 'No legal or security guarantee',
    body: 'Website content is provided for general informational purposes. It is not legal advice, compliance certification, or a guarantee that any system is completely secure, uninterrupted, or error-free. Authorized security testing and implementation work require an expressly agreed scope.',
  },
  {
    title: 'Accounts and comments',
    body: 'If account or comment features are available, you are responsible for accurate information, account security, and content you submit. Do not submit unlawful, infringing, abusive, deceptive, malicious, or confidential third-party material. BlueDot IT may moderate or remove content and restrict misuse.',
  },
  {
    title: 'Intellectual property and links',
    body: 'Unless otherwise identified, website content and branding belong to BlueDot IT or their respective licensors. Public project links may lead to third-party services with their own terms and privacy practices. A link does not imply control of or responsibility for the third-party service.',
  },
  {
    title: 'Availability and liability',
    body: 'The website is provided as available and may change without notice. To the extent permitted by applicable law, BlueDot IT is not liable for indirect, incidental, special, or consequential losses arising solely from use of or inability to use this public website.',
  },
  {
    title: 'Changes and contact',
    body: 'These website terms may be updated as the site and business change. Questions may be sent to jason@bluedot.it.com. Client-specific questions should be resolved under the applicable signed agreement.',
  },
]

export default function Terms() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3">
          <span className="pill">BlueDot IT</span>
          <h1 className="text-4xl font-bold heading-accent">Website Terms</h1>
          <p className="text-base-content/70">Last updated: July 28, 2026</p>
          <p className="text-base-content/80 leading-relaxed">
            These terms apply to the public website. They do not replace a signed client services agreement, statement of work, or other written engagement document.
          </p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-2xl font-semibold text-secondary">{section.title}</h2>
              <p className="text-base-content/80 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="border-t border-white/10 pt-8 text-sm text-base-content/65">
          See the <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link> for information about data handled through this website.
        </p>
      </div>
    </div>
  )
}
