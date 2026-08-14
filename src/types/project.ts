export type Project = {
  id: string
  name: string
  url: string
  description: string | null
  language: string | null
  source: "github" | "huggingface"
  subtype?: "repo" | "model" | "space"
  updatedAt: string | null
  category: string
  demonstrates: string
  technologies: string[]
  concerns: string
  caseStudy?: {
    problem: string
    work: string
    evidence: string
    result: string
    artifact: string
    artifactAlt: string
    artifactCaption: string
  }
}
