import Link from 'next/link'
import { Metadata } from 'next'
import { fetchRepos } from '@/lib/github'
import { openSourceProjects } from '@/data/projectCatalog'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Open-Source Archive',
  description: 'The broader BlueDot IT public repository archive across AI systems, security engineering, infrastructure, and technical evaluation.',
  alternates: { canonical: 'https://bluedot.it.com/open-source' },
  openGraph: {
    title: 'Open-Source Archive | BlueDot IT',
    description: 'Public repositories across AI systems, security engineering, infrastructure, and evaluation.',
    type: 'website',
    url: 'https://bluedot.it.com/open-source',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'BlueDot IT open-source archive' }],
  },
  twitter: { card: 'summary_large_image', title: 'Open-Source Archive | BlueDot IT', description: 'Public repositories across AI systems, security engineering, infrastructure, and evaluation.', images: ['/twitter-image'] },
}

export default async function OpenSourcePage() {
  let repos: Awaited<ReturnType<typeof fetchRepos>> = []
  try {
    repos = await fetchRepos('BlueDot-IT')
  } catch (error) {
    console.error('Unable to load public BlueDot-IT repository metadata:', error)
  }

  const repoByName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]))

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Selected Work', url: 'https://bluedot.it.com/projects' }, { name: 'Open-Source Archive', url: 'https://bluedot.it.com/open-source' }]} />
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">Public repository archive</span><h1>The lab remains <span>inspectable.</span></h1></div>
          <div className="sr2-page-hero-note"><p>These projects show the systems, controls, and evaluation work behind the practice. They are not client testimonials, production guarantees, or evidence of customer adoption.</p><a className="sr2-link" href="https://github.com/BlueDot-IT" target="_blank" rel="noreferrer">Open BlueDot IT on GitHub <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <div className="sr2-archive-list">
            {openSourceProjects.map((project) => {
              const repo = repoByName.get(project.name.toLowerCase())
              return (
                <article className="sr2-archive-entry" key={project.name}>
                  <div><span className="sr2-project-category">{project.category}</span><h2>{project.name}</h2><p>{project.description}</p></div>
                  <div><p><strong>Demonstrates:</strong> {project.demonstrates}</p><p><strong>Operational safeguards:</strong> {project.concerns}</p><p className="sr2-archive-stack">{[repo?.language || project.language, ...project.technologies].filter(Boolean).filter((technology, index, all) => all.indexOf(technology) === index).join(' · ')}</p><a className="sr2-link" href={repo?.html_url || project.url} target="_blank" rel="noreferrer">Inspect repository <span aria-hidden="true">↗</span></a></div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sr2-close"><div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Looking for delivery?</span><h2>Public code is evidence of approach. Your system needs a scope.</h2></div><div><p>Bring the application, workflow, or security concern that needs a useful next move.</p><Link className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</Link></div></div></section>
    </>
  )
}
