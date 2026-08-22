# Weekly blog automation

This is an offline-first, fail-closed pipeline for the official BlueDot IT blog.

## Flow

1. Prepare a source packet JSON and a Markdown/MDX article. The packet must include the exact official canonical URL, source artifacts recorded as `PATH#sha256=<64 lowercase hex characters>`, source URLs, a date-suffixed ID, and claims/uncertainties. Its `article_path` must resolve to the same file passed to both commands.
2. Stage locally. This only reads the supplied files and writes a staged article plus a JSON receipt:
   `npm run weekly-blog -- stage --source-packet ./packet.json --article ./article.md`
3. Review the staged JSON and receipt. Nothing is sent externally.
4. Publish/upsert with the repository's Prisma client. The original inputs are
   mandatory and are rebuilt byte-for-byte before any database write:
   `npm run weekly-blog -- publish --staged ops/weekly-blog/staged/<packet-id>.json --source-packet ./packet.json --article ./article.md`
5. The publish command verifies the exact canonical origin/path and the unique
   source-packet/hash marker rendered in that page. A generic 2xx or stale page
   cannot pass. Only successful verification writes `handoffEligible: true`.

## Safety properties

- The packet and article are hashed. Publish requires the original packet and
  article, rebuilds the staged object, and rejects any changed source or staged
  field before loading Prisma.
- The Post upsert key is the slug; rerunning the same staged input updates one post instead of creating duplicates.
- WeeklyBlogRun is unique on source packet ID and records the post, source hash, canonical URL, status, and receipt.
- Invalid packets, malformed canonical URLs, short articles, unavailable canonical URLs, redirects, and mismatched paths fail closed with `handoffEligible: false`.
- Publication commits the post so the web process can observe it, then verifies the exact canonical URL. A failed verification immediately deletes a new post or restores the previous post and tag state.
- Filesystem receipt and database run-record failures use the same compensating
  rollback. Cleanup failures are reported as `recovery_required` and no success
  receipt or social handoff is emitted.
- Prisma/database configuration is loaded only by the publish command; staging works offline.

## Unattended Friday runner contract

The OpenClaw job is a **singleton** scheduled for `0 9 * * 5` in
`America/New_York`. The scheduler definition is operational configuration and
is intentionally not installed by this repository.

For each run, the isolated runner must:

1. Create a date-scoped working directory and acquire a non-overlapping job
   lock. If another Friday run is active, exit without publishing.
2. Gather only real BlueDot work evidence from the approved weekly window.
   Copy immutable evidence references into a source packet; include claims and
   uncertainties. Missing or insufficient evidence is a normal fail-closed run.
3. Write the source packet and grounded Markdown article to that directory.
   Generation must not invent client names, outcomes, metrics, or work.
4. Run `stage`, then run `publish` with the staged path **and the same original
   packet/article paths**. Any nonzero exit stops the workflow.
5. Require both the published database run and filesystem receipt to match the
   source hash and contain `handoffEligible: true`. The live canonical page must
   contain the same publication marker.
6. Only then enqueue social adaptations. Social delivery is a separate adapter
   and must never run from a staged or failed-closed receipt.
7. Preserve sanitized evidence, staged data, and receipts for diagnosis. Alert
   on failure without including secrets or private source material.

The runner must use the deployed release directory, host-owned environment
configuration, bounded timeouts, and a single retry of the identical immutable
inputs. It must not regenerate content between retries. Scheduler activation
requires a separately verified production deployment and migration.

### Recovery

`publish_failed_compensated` means the post and both receipt locations were
restored/cleared. `recovery_required` means at least one compensation failed:
disable the job, inspect the post by slug and the `WeeklyBlogRun` by packet ID,
reconcile both receipts, and do not hand off socially until they all match.

Apply the migration before the first publish with the repository's normal Prisma migration process. Do not deploy or hand the article to social channels until the receipt is published and canonical verification has passed.
