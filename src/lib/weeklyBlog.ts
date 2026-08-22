import { createHash } from "node:crypto";

export type WeeklySourcePacket = {
  id: string; lane: string; slot: string; date: string; summary: string;
  article_path: string; canonical_url: string; source_artifacts: string[];
  source_urls: string[]; claims?: string[]; uncertainties?: string[];
};
export type StagedWeeklyBlog = {
  version: 1; status: "staged"; sourcePacketId: string; sourceSha256: string;
  slug: string; canonicalUrl: string; title: string; excerpt: string;
  category: string; tags: string[]; content: string; claims: string[];
  uncertainties: string[]; stagedAt: string;
  articleSha256: string;
};
export function sha256(value: string): string { return createHash("sha256").update(value).digest("hex"); }
export function publicationMarker(staged: Pick<StagedWeeklyBlog, "sourcePacketId" | "sourceSha256">): string {
  return `weekly-blog-source:${staged.sourcePacketId}:${staged.sourceSha256}`;
}
export async function verifyCanonicalUrl(url: string, staged: Pick<StagedWeeklyBlog, "sourcePacketId" | "sourceSha256">, fetchImpl: typeof fetch = fetch): Promise<void> {
  const expected = new URL(url);
  const response = await fetchImpl(url, { redirect: "manual", signal: AbortSignal.timeout(10_000) });
  if (!response.ok || response.status >= 300) throw new Error("canonical_url_not_ready:" + response.status);
  const finalUrl = response.url ? new URL(response.url) : expected;
  if (finalUrl.origin !== expected.origin || finalUrl.pathname !== expected.pathname) throw new Error("canonical_url_redirected_or_mismatched");
  const body = await response.text();
  if (!body.includes(publicationMarker(staged))) throw new Error("canonical_article_marker_mismatched");
}
export function slugFromCanonical(canonicalUrl: string): string {
  const url = new URL(canonicalUrl);
  if (url.protocol !== "https:" || url.hostname !== "bluedot.it.com" || !url.pathname.startsWith("/blog/")) throw new Error("canonical_url_must_be_bluedot_blog_https_url");
  const slug = url.pathname.slice("/blog/".length).replace(/\/$/, "");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || url.search || url.hash) throw new Error("canonical_url_has_invalid_blog_slug");
  return slug;
}
export function validateSourcePacket(packet: WeeklySourcePacket): void {
  for (const key of ["id", "lane", "slot", "date", "summary", "article_path", "canonical_url"] as const) if (!String(packet[key] || "").trim()) throw new Error("source_packet_missing:" + key);
  if (packet.slot !== "weekly_blog") throw new Error("source_packet_slot_must_be_weekly_blog");
  if (!Array.isArray(packet.source_artifacts) || packet.source_artifacts.length === 0) throw new Error("source_packet_requires_source_artifacts");
  if (packet.source_artifacts.some((artifact) => !/#sha256=[a-f0-9]{64}$/.test(artifact))) throw new Error("source_packet_artifacts_require_sha256");
  if (!Array.isArray(packet.source_urls) || !packet.source_urls.includes(packet.canonical_url)) throw new Error("source_packet_canonical_url_missing_from_source_urls");
  slugFromCanonical(packet.canonical_url);
  if (!/\.(md|mdx)$/i.test(packet.article_path)) throw new Error("source_packet_article_must_be_markdown");
  if (!packet.id.endsWith(packet.date)) throw new Error("source_packet_id_date_mismatch");
}
function frontmatterValue(content: string, key: string): string | undefined {
  const line = content.split(/\r?\n/).find((value) => value.startsWith(key + ":"));
  return line?.slice(key.length + 1).trim().replace(/^["']|["']$/g, "");
}
export function buildStagedBlog(packet: WeeklySourcePacket, article: string, stagedAt: string): StagedWeeklyBlog {
  validateSourcePacket(packet);
  const slug = slugFromCanonical(packet.canonical_url);
  const title = frontmatterValue(article, "title") || article.split(/\r?\n/).find((line) => line.startsWith("# "))?.slice(2).trim();
  if (!title) throw new Error("article_title_missing");
  const content = article.split(/\r?\n/).filter((line) => line.trim() !== "---" && !/^(title|excerpt|category|tags):/.test(line)).join("\n").trim();
  if (content.length < 120) throw new Error("article_content_too_short");
  const sourceSha256 = sha256(JSON.stringify(packet) + "\n" + article);
  return { version: 1, status: "staged", sourcePacketId: packet.id, sourceSha256, articleSha256: sha256(article), slug, canonicalUrl: packet.canonical_url, title, excerpt: frontmatterValue(article, "excerpt") || packet.summary, category: frontmatterValue(article, "category") || "Build", tags: (frontmatterValue(article, "tags") || "weekly review").split(",").map((tag) => tag.trim()).filter(Boolean), content: `${content}\n\n<span data-weekly-blog-source="${publicationMarker({ sourcePacketId: packet.id, sourceSha256 })}"></span>`, claims: packet.claims || [], uncertainties: packet.uncertainties || [], stagedAt };
}

export function assertStagedIntegrity(staged: StagedWeeklyBlog, packet: WeeklySourcePacket, article: string): void {
  const rebuilt = buildStagedBlog(packet, article, staged.stagedAt);
  if (JSON.stringify(rebuilt) !== JSON.stringify(staged)) throw new Error("staged_artifact_integrity_mismatch");
}

export type PublishEffects = {
  mutate(): Promise<{ postId: number; rollbackToken: unknown }>;
  verify(): Promise<void>;
  writeDatabaseReceipt(postId: number, receipt: Record<string, unknown>): Promise<void>;
  writeFilesystemReceipt(receipt: Record<string, unknown>): Promise<void>;
  rollback(token: unknown): Promise<void>;
  clearDatabaseReceipt(): Promise<void>;
  clearFilesystemReceipt(): Promise<void>;
};

/** Coordinates the externally visible mutation. Every post-mutation failure is
 * compensated; cleanup errors are included so operators have a recoverable state. */
export async function publishWithCompensation(staged: StagedWeeklyBlog, effects: PublishEffects, timestamp: string): Promise<Record<string, unknown>> {
  const mutation = await effects.mutate();
  const receipt = { status: "published", sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, postId: mutation.postId, slug: staged.slug, canonicalUrl: staged.canonicalUrl, canonicalVerifiedAt: timestamp, handoffEligible: true };
  try {
    await effects.verify();
    await effects.writeFilesystemReceipt(receipt);
    await effects.writeDatabaseReceipt(mutation.postId, receipt);
    return receipt;
  } catch (cause) {
    const cleanupErrors: string[] = [];
    for (const cleanup of [() => effects.rollback(mutation.rollbackToken), effects.clearDatabaseReceipt, effects.clearFilesystemReceipt]) {
      try { await cleanup(); } catch (error) { cleanupErrors.push(error instanceof Error ? error.message : String(error)); }
    }
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new Error(cleanupErrors.length ? `publish_failed:${message};recovery_required:${cleanupErrors.join("|")}` : `publish_failed_compensated:${message}`);
  }
}
