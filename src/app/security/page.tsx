import Link from 'next/link'
import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: 'Security and Vulnerability Reporting',
  description: 'BlueDot IT guidance for vulnerability reports, authorized testing, inquiry data handling, and secure exchange of project materials.',
  alternates: {
    canonical: 'https://bluedot.it.com/security',
  },
  openGraph: {
    title: 'Security and Vulnerability Reporting | BlueDot IT',
    description: 'How to report a vulnerability and how BlueDot IT handles security-related inquiries and project materials.',
    type: 'website',
    url: 'https://bluedot.it.com/security',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BlueDot IT security and vulnerability reporting' }],
  },
  twitter: { card: 'summary_large_image', title: 'Security and Vulnerability Reporting | BlueDot IT', description: 'How to report a vulnerability and how BlueDot handles security-related information.', images: ['/twitter-image'] },
}

const sections = [
  {
    title: 'Report a vulnerability',
    body: (
      <>
        Use the <Link href="/contact">BlueDot contact page</Link> for non-sensitive triage of a suspected vulnerability in a BlueDot-controlled public service or to ask about a security review. Include the affected URL or component, a concise description, and safe reproduction details. For sensitive reports, use the <a href="http://w4rnwsxctthctfroeltj7d75wi7npdnllj5owy5okjwgj5jpjmlli7qd.onion/submit" rel="noreferrer">ciphertext-only onion disclosure drop</a> or encrypt the report with the <a href="/.well-known/bluedot-disclosure-public-key.asc">published public key</a> before sending it through an agreed secure channel. Do not include passwords, private keys, access tokens, customer records, regulated data, or other secrets in the public form.
      </>
    ),
  },
  {
    title: 'Authorized disclosure and testing',
    body: 'Only test systems when you have explicit permission from the system owner and a written scope that identifies the authorized targets, methods, dates, access boundaries, and exclusions. Do not access, alter, copy, or retain data outside that scope. If testing reveals sensitive information or an unexpected impact, stop the activity, preserve only the minimum evidence needed, and report the issue through the agreed channel. Coordinated disclosure is expected before public release of details.',
  },
  {
    title: 'Inquiry data handling',
    body: (
      <>
        Security inquiries are handled as project or operational information rather than as a place to deposit sensitive material. BlueDot collects the information needed to understand and respond to the request. The public contact form is not an encrypted vulnerability-submission portal; follow the instruction not to submit credentials, regulated data, customer records, or other sensitive content. See the <Link href="/legal/privacy">Privacy Policy</Link> for website information handling.
      </>
    ),
  },
  {
    title: 'Retention and deletion',
    body: 'Inquiry and vulnerability-report information is retained only as long as reasonably needed to triage, respond, maintain operational records, handle disputes, meet legal obligations, and protect systems. Project materials are handled according to the applicable written agreement. Deletion requests are considered where applicable, although security, legal, contractual, or accounting records may need to be retained.',
  },
  {
    title: 'Authorization records',
    body: 'Security testing and access to client systems require a documented authorization record. The written scope should identify the owner or approving authority, targets, permitted actions, credentials or access method, testing window, emergency contact, data-handling expectations, and stop conditions. A message sent through the public contact form does not by itself authorize testing.',
  },
  {
    title: 'Secure file exchange',
    body: 'Do not attach sensitive reports, source code, credentials, exports, or customer data to an initial public inquiry. After an engagement is scoped, BlueDot and the client can agree on a secure file-exchange method appropriate to the material, access needs, retention requirements, and client policy. The exchange method and handling expectations should be recorded with the engagement scope.',
  },
]

export default function SecurityPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Security', url: 'https://bluedot.it.com/security' }]} />
      <article className="sr2-document">
      <div className="sr2-wrap sr2-document-inner">
        <header>
          <span className="sr2-kicker">BlueDot IT</span>
          <h1>Security and Vulnerability Reporting</h1>
          <p className="sr2-date">Last updated: August 14, 2026</p>
          <p className="mt-4">
            This page describes how to report a security concern, what authorization means for testing, and how security-related information is handled before and during an engagement.
          </p>
        </header>

        <div>
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t border-white/10 pt-8 text-sm">
          See the <Link href="/.well-known/security.txt" className="text-[color:var(--signal-lime)] hover:underline">security.txt policy record</Link>, <Link href="/legal/privacy" className="text-[color:var(--signal-lime)] hover:underline">Privacy Policy</Link>, and <Link href="/legal/terms" className="text-[color:var(--signal-lime)] hover:underline">Website Terms</Link>. For a scoped review or a non-sensitive initial report, <Link href="/contact" className="text-[color:var(--signal-lime)] hover:underline">contact BlueDot IT</Link>.
        </p>
      </div>
      </article>
    </>
  )
}
