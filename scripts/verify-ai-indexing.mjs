#!/usr/bin/env node
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const sitemap = read('src/app/sitemap.ts')
assert.match(sitemap, /url:\s*`?\$?\{?baseUrl\}?\/services`?/, 'sitemap must include /services')
assert.match(sitemap, /url:\s*`?\$?\{?baseUrl\}?\/legal\/privacy`?/, 'sitemap must include /legal/privacy')
assert.match(sitemap, /url:\s*`?\$?\{?baseUrl\}?\/legal\/terms`?/, 'sitemap must include /legal/terms')
assert.doesNotMatch(sitemap, /lastModified:\s*new Date\(\)/, 'sitemap static pages must not use new Date() on every request')
assert.doesNotMatch(sitemap, /2026-07-28/, 'sitemap must not retain the superseded static content date')
assert.match(sitemap, /prisma\.post\.findMany/, 'sitemap should fetch blog posts directly from Prisma')
assert.match(sitemap, /orderBy:\s*{\s*updatedAt:\s*['"]desc['"]\s*}/, 'sitemap should order blog posts consistently by updatedAt')

assert.ok(existsSync(join(root, 'src/app/llms.txt/route.ts')) || existsSync(join(root, 'public/llms.txt')), 'llms.txt route or public file must exist')
const llms = existsSync(join(root, 'src/app/llms.txt/route.ts'))
  ? read('src/app/llms.txt/route.ts')
  : read('public/llms.txt')
assert.match(llms, /BlueDot IT/, 'llms.txt must name BlueDot IT')
assert.match(llms, /https:\/\/bluedot\.it\.com\/services/, 'llms.txt must link services')
assert.match(llms, /jason@bluedot\.it\.com/, 'llms.txt must expose the clean contact email')
assert.match(llms, /Security Engineering/, 'llms.txt must describe security engineering')
assert.match(llms, /AI Automation/, 'llms.txt must describe AI automation')
assert.match(llms, /Full-Stack Development/, 'llms.txt must describe full-stack development')
assert.doesNotMatch(llms, /Lenoir|Caldwell County/, 'llms.txt primary positioning must not be locally targeted')

const loginCandidates = ['src/app/login/layout.tsx', 'src/app/login/page.tsx']
const loginNoindex = loginCandidates.filter((path) => existsSync(join(root, path))).some((path) => /robots:\s*{[\s\S]*index:\s*false[\s\S]*follow:\s*false/.test(read(path)))
assert.ok(loginNoindex, 'login page must export noindex,nofollow metadata')
const adminCandidates = ['src/app/admin/layout.tsx', 'src/app/admin/page.tsx']
const adminNoindex = adminCandidates.filter((path) => existsSync(join(root, path))).some((path) => /robots:\s*{[\s\S]*index:\s*false[\s\S]*follow:\s*false/.test(read(path)))
assert.ok(adminNoindex, 'admin surfaces must export noindex,nofollow metadata')

assert.ok(existsSync(join(root, 'src/components/seo/JsonLd.tsx')), 'site-level JSON-LD component must exist')
const siteJsonLd = read('src/components/seo/JsonLd.tsx')
assert.match(siteJsonLd, /ProfessionalService/, 'site JSON-LD must include ProfessionalService')
assert.match(siteJsonLd, /#organization/, 'site JSON-LD must define organization id')
assert.match(siteJsonLd, /#person/, 'site JSON-LD must define person id')
assert.match(read('src/app/layout.tsx'), /<JsonLd\s*\/>/, 'Root layout must render site JSON-LD')

const blogPost = read('src/app/blog/[slug]/page.tsx')
assert.match(blogPost, /['"]@type['"]:\s*['"]Article['"]/, 'blog post JSON-LD must use Article schema')
assert.match(blogPost, /publisher:[\s\S]*Organization/, 'blog post JSON-LD must publish as BlueDot IT organization')
assert.match(blogPost, /mainEntityOfPage/, 'blog post JSON-LD must include mainEntityOfPage')

const contact = `${read('src/app/contact/page.tsx')}\n${read('src/components/ContactForm.tsx')}`
assert.match(contact, /href:\s*["']mailto:jason@bluedot\.it\.com["']|href=["']mailto:jason@bluedot\.it\.com["']/, 'contact page must render a clean mailto link')
assert.doesNotMatch(contact, /bluedot\.it\.\s+com/, 'contact page must not split bluedot.it.com with whitespace')

const indexNowFiles = ['public/indexnow.txt', ...['public'].flatMap(() => [])]
assert.ok(existsSync(join(root, 'public/indexnow.txt')), 'stable IndexNow key file public/indexnow.txt must exist')
const indexNow = read('public/indexnow.txt').trim()
assert.match(indexNow, /^[a-f0-9]{32,64}$/i, 'IndexNow key must be a stable hex token')
assert.ok(existsSync(join(root, 'scripts/submit-indexnow.mjs')), 'IndexNow submission script must exist')

const serviceLanding = read('src/components/services/ServiceLandingPage.tsx')
for (const path of [
  'src/app/services/security-reviews/page.tsx',
  'src/app/services/server-hardening/page.tsx',
  'src/app/services/nextjs-security-hardening/page.tsx',
  'src/app/services/workflow-automation/page.tsx',
  'src/app/services/mcp-security-consulting/page.tsx',
  'src/app/services/ai-security-tooling/page.tsx',
  'src/app/services/full-stack-development/page.tsx',
]) {
  assert.ok(existsSync(join(root, path)), `${path} must exist`)
  const page = read(path)
  const slug = path.split('/').at(-2)
  assert.match(page, /renderServicePage/, `${path} must render the shared service landing template`)
  assert.match(sitemap, new RegExp(slug), `sitemap must include ${slug}`)
  assert.match(serviceLanding, new RegExp(`['"]${slug}['"]`), `service data must include ${slug}`)
}
const legacyService = read('src/app/services/small-business-websites/page.tsx')
assert.match(legacyService, /permanentRedirect/, 'replaced website route must permanently redirect')
assert.doesNotMatch(sitemap, /small-business-websites/, 'replaced website route must not remain in the sitemap')
assert.match(serviceLanding, /<h1[\s\S]*?>[\s\S]*?<\/h1>/, 'service landing template must render one clear H1')
assert.match(serviceLanding, /Questions|FAQ/i, 'service landing template must include an FAQ section')
assert.match(serviceLanding, /\/contact/, 'service landing template must link to contact')
assert.match(serviceLanding, /Review methodology/, 'security reviews must explain the review methodology')
assert.match(serviceLanding, /Scope and handoff/, 'service landing template must explain scope and handoff')
assert.match(serviceLanding, /destructive testing/, 'security reviews must state meaningful scope exclusions')

const rootMetadata = read('src/app/layout.tsx')
assert.match(rootMetadata, /Security, AI Automation, and Full-Stack Development/, 'root metadata must use the new positioning')
assert.doesNotMatch(rootMetadata, /Business Automation in Lenoir|Caldwell County/, 'root metadata must not lead with local positioning')

assert.ok(existsSync(join(root, 'docs/ai-indexing-content-checklist.md')), 'future AI-answerable content checklist must exist')

console.log('AI indexing verification passed')
