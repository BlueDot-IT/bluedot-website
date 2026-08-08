import RepoCard from "@/components/RepoCard";
import { fetchRepos } from "@/lib/github";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import type { Project } from "@/types/project";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata:  Metadata = {
  title: 'Selected Work',
  description: 'Selected public systems from BlueDot IT demonstrating workflow automation, secure development, observability, infrastructure, and practical product engineering.',
  alternates: {
    canonical: 'https://bluedot.it.com/projects',
  },
  openGraph: {
    title: 'Selected Work | BlueDot IT',
    description: 'Public engineering work demonstrating automation, secure development, observability, and practical systems delivery.',
    type: 'website',
    url: 'https://bluedot.it.com/projects',
  }
}

const featuredNames = [
  "Odinn-Forge",
  "SignalGate",
  "GhostMCP",
  "security-middleware",
  "agent-benchmarks",
];

export default async function Projects() {
  let repos: Awaited<ReturnType<typeof fetchRepos>> = []
  try {
    repos = await fetchRepos("BlueDot-IT")
  } catch (error) {
    console.error("Unable to load the curated BlueDot-IT repository list:", error)
  }
  const featuredOrder = new Map(featuredNames.map((name, index) => [name.toLowerCase(), index]))

  const projects: Project[] = repos
    .filter((repo) => featuredOrder.has(repo.name.toLowerCase()))
    .sort((a, b) => (
      featuredOrder.get(a.name.toLowerCase())! - featuredOrder.get(b.name.toLowerCase())!
    ))
    .map((repo) => ({
      id: `github:${repo.id}`,
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      language: repo.language,
      source: "github" as const,
      subtype: "repo" as const,
      updatedAt: repo.updated_at,
    }))

  const totalStars = projects.reduce((sum, repo) => sum + repo.stars, 0)
  const totalLangs = new Set(
    projects.map((r) => r.language).filter(Boolean)
  ).size

  const stats = [
    { label: "Selected systems", value: projects.length },
    { label: "Public stars", value: totalStars },
    { label: "Languages / stacks", value: totalLangs },
  ]

  return (
    <div className="page-shell space-y-14">
      <Reveal>
        <div className="text-center space-y-4">
          <span className="kicker">Bluedot builds</span>
          <h1 className="heading-accent text-4xl md:text-5xl font-bold">Selected systems with public evidence.</h1>
          <p className="text-base-content/80 max-w-3xl mx-auto">
            A curated set of BlueDot IT projects showing how I approach automation, maintainability, observability, secure defaults, and operational control. These are engineering examples, not representations of private client work.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Reveal key={stat.label} className="h-full">
              <Card
                className="text-center h-full"
              >
                <CardContent className="pt-6 pb-5 space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-base-content/70 text-xs uppercase tracking-[0.2em]">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Reveal>


        {projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((repo) => (
              <Reveal key={repo.id} className="h-full">
                <RepoCard repo={repo} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-base-content/75">
              The public project feed is temporarily unavailable. The service pages and contact form remain available.
            </CardContent>
          </Card>
        )}
      

      <Reveal>
        <Card className="text-center">
          <CardHeader>
            <p className="text-2xl font-bold text-base-content">
              Have a business process that needs the same discipline?
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base-content/80 max-w-2xl mx-auto">
              Tell me what happens today, where the data lives, and what should be easier or clearer afterward.
            </p>
            <Link href="/contact">
              <Button>Describe the problem</Button>
            </Link>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
