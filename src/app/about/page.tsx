import Badge from "@/components/ui/Badge"
import { Card, CardHeader, CardContent } from "@/components/ui/Card"
import { Separator } from "@/components/ui/Separator"
import Reveal from "@/components/Reveal"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'About',
  description: 'Jason O’Neal is the founder and primary technical practitioner behind BlueDot IT, focused on secure full-stack applications, AI automation, developer infrastructure, and practical cybersecurity.',
  alternates: {
    canonical: 'https://bluedot.it.com/about',
  },
  openGraph: {
    title: 'About Jason O’Neal | BlueDot IT',
    description: 'Full-stack developer and security-focused systems builder specializing in AI automation.',
    type: 'profile',
    url: 'https://bluedot.it.com/about',
  },
}

const focusAreas = [
  'Frontend applications',
  'Backend services and APIs',
  'Databases and authentication',
  'Deployment and Linux infrastructure',
  'AI tool boundaries and agent workflows',
  'Security controls, validation, and remediation',
]

export default function About() {
  return (
    <div className="page-shell space-y-12">
      <Reveal>
        <div className="text-center space-y-4">
          <span className="kicker">Behind BlueDot IT</span>
          <h1 className="heading-accent text-4xl md:text-5xl font-bold">Full-stack developer and security-focused systems builder specializing in AI automation.</h1>
          <p className="text-base-content/80 max-w-3xl mx-auto">
            I am Jason O&apos;Neal, founder of BlueDot IT. I have been building software since 2002, with current work focused on secure full-stack applications, AI agents and automation, developer infrastructure, and practical cybersecurity.
          </p>
          <p className="text-sm text-base-content/60">Based in North Carolina and working remotely with clients and technical teams.</p>
        </div>
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Reveal>
            <Card>
              <CardHeader className="pb-3">
                <p className="text-xl font-bold text-base-content">Technical focus</p>
              </CardHeader>
              <CardContent className="space-y-4 text-base-content/85">
                <p className="leading-relaxed">
                  BlueDot works across the layers that make a system real: the interface people use, the services and APIs behind it, the data and authentication model, the deployment boundary, and the operational controls that keep the result understandable.
                </p>
                <p className="leading-relaxed">
                  I am also completing formal cybersecurity studies to strengthen and validate the security work already integrated into my development and infrastructure practice.
                </p>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeader className="pb-3">
                <p className="text-xl font-bold text-base-content">How I deliver</p>
              </CardHeader>
              <CardContent className="space-y-4 text-base-content/85">
                <p className="leading-relaxed">Work is scoped around a concrete system, workflow, or security boundary. The implementation is validated against that scope, documented, and handed off with the relevant failure and approval points visible.</p>
                <p className="leading-relaxed">Public repositories provide technical evidence of the kinds of systems and controls I build. They are not presented as client case studies.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <div className="space-y-6">
          <Reveal>
            <Card>
              <CardHeader className="pb-2">
                <p className="text-xl font-bold text-base-content">Where the work happens</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {focusAreas.map((area) => (
                    <div key={area} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-base-content/80">{area}</div>
                  ))}
                </div>
                <Separator className="bg-white/10" />
                <div>
                  <h3 className="font-semibold text-primary mb-2">Languages and frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {["TypeScript", "Python", "React", "Next.js", "Node.js", "PHP"].map((technology) => (
                      <Badge key={technology} variant="accent" size="sm" className="px-3 py-2 bg-white/10 border border-white/10">{technology}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">Infrastructure</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Linux", "Docker", "NGINX", "SQL", "CI/CD"].map((technology) => (
                      <Badge key={technology} variant="accent" size="sm" className="px-3 py-2 bg-white/10 border border-white/10">{technology}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal>
            <Card>
              <CardHeader className="pb-2">
                <p className="text-xl font-bold text-base-content">Outside the system</p>
              </CardHeader>
              <CardContent className="space-y-3 text-base-content">
                <p className="text-base-content/85">Music composition, TTRPG world-building, and mechanical projects remain part of the person behind the work. They stay lower on this page because the professional focus comes first.</p>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
