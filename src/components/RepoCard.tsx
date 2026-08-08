import { getLanguageColor } from "@/lib/utility"
import { Card, CardContent } from "@/components/ui/Card"
import type { Project } from "@/types/project"

export default function RepoCard({ repo }: { repo: Project }) {
  const cta =
    repo.source === "github"
      ? "View on GitHub"
      : repo.subtype === "space"
      ? "Open Space"
      : "View on Hugging Face"

  return (
    <Card
      className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(5,12,26,0.45)]"
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-5 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{repo.category}</p>
            <h3 className="text-xl font-bold text-base-content">{repo.name}</h3>
          </div>
          <div className="text-xs font-semibold px-2 py-1 rounded-full bg-accent/10 text-accent border border-accent/40">
            {repo.source === "github" ? "GitHub" : "Hugging Face"}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-base-content/55">What it is</p>
            <p className="text-sm text-base-content/80 leading-relaxed">{repo.description || "Public BlueDot IT repository."}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-base-content/55">What it demonstrates</p>
            <p className="text-sm text-base-content/75 leading-relaxed">{repo.demonstrates}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-base-content/55">Relevant stack</p>
            <div className="flex flex-wrap gap-2">
              {repo.technologies.map((technology) => (
                <span key={technology} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-base-content/75">{technology}</span>
              ))}
            </div>
          </div>
          <p className="border-l border-primary/40 pl-4 text-sm text-base-content/65 leading-relaxed">{repo.concerns}</p>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ring-1 ring-base-300/60 ${getLanguageColor(
                repo.language
              )}`}
            />
            <span className="text-sm text-base-content font-medium">
              {repo.language || "Unknown"}
            </span>
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:text-accent text-sm font-medium group-hover:underline transition-colors duration-200 whitespace-nowrap"
          >
            {cta} →
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
