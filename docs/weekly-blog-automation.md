# Weekly blog automation

This is an offline-first, fail-closed pipeline for the official BlueDot IT blog.

## Flow

1. Prepare a source packet JSON and a Markdown/MDX article. The packet must include the exact official canonical URL, source artifacts, source URLs, a date-suffixed ID, and claims/uncertainties.
2. Stage locally. This only reads the supplied files and writes a staged article plus a JSON receipt:
   `npm run weekly-blog -- stage --source-packet ./packet.json --article ./article.md`
3. Review the staged JSON and receipt. Nothing is sent externally.
4. Publish/upsert with the repository's Prisma client:
   `npm run weekly-blog -- publish --staged ops/weekly-blog/staged/<packet-id>.json`
5. The publish command verifies the canonical URL with an exact-origin/path GET. Only a successful verification writes `handoffEligible: true` to the receipt. The command never invokes a social adapter.

## Safety properties

- The packet, article, and staged content are hashed in the receipt.
- The Post upsert key is the slug; rerunning the same staged input updates one post instead of creating duplicates.
- WeeklyBlogRun is unique on source packet ID and records the post, source hash, canonical URL, status, and receipt.
- Invalid packets, malformed canonical URLs, short articles, unavailable canonical URLs, redirects, and mismatched paths fail closed with `handoffEligible: false`.
- Publication commits the post so the web process can observe it, then verifies the exact canonical URL. A failed verification immediately deletes a new post or restores the previous post and tag state.
- Prisma/database configuration is loaded only by the publish command; staging works offline.

Apply the migration before the first publish with the repository's normal Prisma migration process. Do not deploy or hand the article to social channels until the receipt is published and canonical verification has passed.
