import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How BlueDot IT handles information submitted through its public website.',
  alternates: {
    canonical: 'https://bluedot.it.com/legal/privacy',
  },
}

const sections = [
  {
    title: 'Information you provide',
    body: 'BlueDot IT may receive your name, email address, message, project details, newsletter preference, account information, and other information you choose to submit. Do not send passwords, credentials, regulated data, customer records, or other sensitive information through the public contact form.',
  },
  {
    title: 'Technical information',
    body: 'The hosting, security, and application layers may process IP address, browser and device information, request metadata, timestamps, error information, and security events needed to operate, protect, and troubleshoot the website.',
  },
  {
    title: 'Optional analytics',
    body: 'Google Analytics remains disabled unless you select Accept in the analytics notice. If accepted, Google may process page visits, device and browser information, approximate location derived from IP address, and related analytics data under its own terms. You may decline and continue using the public site. The Analytics settings control remains available after your choice so you can withdraw or reconsider it.',
  },
  {
    title: 'How information is used',
    body: 'Information may be used to respond to inquiries, evaluate requested work, deliver website features, manage subscriptions or accounts, maintain security, prevent abuse, troubleshoot failures, improve public content, and comply with legal obligations.',
  },
  {
    title: 'Service providers and disclosure',
    body: 'BlueDot IT may use hosting, email, database, authentication, security, and analytics providers that process limited information to deliver those functions. Information is not sold. It may be disclosed when required by law, to protect rights and systems, or as part of a legitimate business transfer.',
  },
  {
    title: 'Retention and security',
    body: 'Information is retained only as long as reasonably needed for the purpose collected, operational records, legal obligations, dispute handling, and security. Reasonable safeguards are used, but no internet service can promise absolute security.',
  },
  {
    title: 'Your choices',
    body: 'You may decline analytics, unsubscribe from optional email, or request access, correction, or deletion of personal information where applicable. Some records may need to be retained for security, legal, contractual, or accounting reasons.',
  },
  {
    title: 'Contact',
    body: 'Privacy questions or requests may be sent to jason@bluedot.it.com. BlueDot IT may update this policy as the website, providers, or business operations change.',
  },
]

export default function Privacy() {
  return (
    <div className="page-shell">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3">
          <span className="pill">BlueDot IT</span>
          <h1 className="text-4xl font-bold heading-accent">Privacy Policy</h1>
          <p className="text-base-content/70">Last updated: July 28, 2026</p>
          <p className="text-base-content/80 leading-relaxed">
            This policy explains how information is handled through the public BlueDot IT website. A client agreement may contain additional project-specific privacy and confidentiality terms.
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
      </div>
    </div>
  )
}
