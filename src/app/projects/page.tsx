import Image from 'next/image'
import Link from 'next/link'
import { fetchRepos } from '@/lib/github'
import type { Project } from '@/types/project'
import { featuredProjects } from '@/data/projectCatalog'
import { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Selected Work & Case Studies',
  description: 'Proof-driven BlueDot IT case studies across security engineering and AI automation, with public repositories and inspectable artifacts.',
  alternates: { canonical: 'https://bluedot.it.com/projects' },
  openGraph: {
    title: 'Selected Work & Case Studies | BlueDot IT',
    description: 'Public systems, artifacts, and delivery decisions across security engineering and AI automation.',
    type: 'website',
    url: 'https://bluedot.it.com/projects',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Selected BlueDot IT work' }],
  },
  twitter: { card: 'summary_large_image', title: 'Selected Work & Case Studies | BlueDot IT', description: 'Public systems, artifacts, and delivery decisions across security engineering and AI automation.', images: ['/twitter-image'] },
}

export default async function Projects() {
  let repos: Awaited<ReturnType<typeof fetchRepos>> = []
  try {
    repos = await fetchRepos('BlueDot-IT')
  } catch (error) {
    console.error('Unable to load the public BlueDot-IT repository metadata:', error)
  }

  const repoByName = new Map(repos.map((repo) => [repo.name.toLowerCase(), repo]))
  const projects: Project[] = featuredProjects.map((detail) => {
    const repo = repoByName.get(detail.name.toLowerCase())
    return {
      id: `github:${detail.name}`,
      name: detail.name,
      url: repo?.html_url || detail.url,
      description: detail.description,
      language: repo?.language || detail.language,
      source: 'github' as const,
      subtype: 'repo' as const,
      updatedAt: repo?.updated_at || null,
      category: detail.category,
      demonstrates: detail.demonstrates,
      technologies: detail.technologies,
      concerns: detail.concerns,
      caseStudy: detail.caseStudy,
    }
  })

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: 'BlueDot IT', url: 'https://bluedot.it.com/' }, { name: 'Selected Work', url: 'https://bluedot.it.com/projects' }]} />
      <section className="sr2-page-hero">
        <div className="sr2-wrap sr2-page-hero-grid">
          <div><span className="sr2-kicker">BlueDot IT work</span><h1>Proof, not a <span>repository dump.</span></h1></div>
          <div className="sr2-page-hero-note"><p>Two flagship examples show the problem, the work, the evidence, and the result. They are public engineering artifacts—not disguised client testimonials.</p><Link className="sr2-link" href="/contact">Request a scoped review</Link></div>
        </div>
      </section>

      <section className="sr2-editorial">
        <div className="sr2-wrap">
          <p className="sr2-editorial-intro">The primary work page stays focused on the clearest security and AI automation examples. The broader public repository archive remains available separately.</p>
          <div className="sr2-case-study-list">
            {projects.map((project) => project.caseStudy && (
              <article className="sr2-case-study" key={project.id}>
                <header className="sr2-case-study-head">
                  <div><span className="sr2-project-category">{project.category}</span><h2>{project.name}</h2></div>
                  <a className="sr2-link" href={project.url} target="_blank" rel="noreferrer">Open public repository <span aria-hidden="true">↗</span></a>
                </header>
                <div className="sr2-case-study-grid">
                  <figure className="sr2-case-study-artifact">
                    <Image src={project.caseStudy.artifact} alt={project.caseStudy.artifactAlt} width={900} height={420} />
                    <figcaption>{project.caseStudy.artifactCaption}</figcaption>
                  </figure>
                  <div className="sr2-case-study-copy">
                    <p className="sr2-case-study-lede">{project.description}</p>
                    <dl>
                      <div><dt>Problem</dt><dd>{project.caseStudy.problem}</dd></div>
                      <div><dt>Work</dt><dd>{project.caseStudy.work}</dd></div>
                      <div><dt>Evidence</dt><dd>{project.caseStudy.evidence}</dd></div>
                      <div><dt>Result</dt><dd>{project.caseStudy.result}</dd></div>
                    </dl>
                    <div className="sr2-case-study-stack"><strong>Built with</strong><span>{[project.language, ...project.technologies].filter(Boolean).filter((technology, index, all) => all.indexOf(technology) === index).join(' · ')}</span></div>
                    <p className="sr2-operational-note"><strong>Operational safeguards:</strong> {project.concerns}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sr2-section sr2-section-deep">
        <div className="sr2-wrap sr2-work-archive">
          <div><span className="sr2-kicker">Open source archive</span><h2>The rest of the lab stays inspectable.</h2></div>
          <div><p>Additional public systems cover agent runtimes, model routing, vulnerability intelligence, and reproducible evaluation. They are useful technical evidence, but they do not represent private client outcomes.</p><Link className="sr2-link" href="/open-source">Browse the open-source archive</Link></div>
        </div>
      </section>

      <section className="sr2-close">
        <div className="sr2-wrap sr2-close-copy"><div><span className="sr2-kicker">Next step</span><h2>Need the same discipline applied to your system?</h2></div><div><p>Tell BlueDot what is failing, what is already in place, and what outcome would make the work useful.</p><Link className="sr2-link sr2-link-primary" href="/contact">Request a scoped review</Link></div></div>
      </section>
    </>
  )
}
