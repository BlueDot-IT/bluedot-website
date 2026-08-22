import assert from "node:assert/strict";
import test from "node:test";
import { assertStagedIntegrity, buildStagedBlog, publicationMarker, publishWithCompensation, slugFromCanonical, validateSourcePacket, verifyCanonicalUrl } from "../src/lib/weeklyBlog";

const packet = {
  id: "week-in-review-2026-08-22", lane: "build", slot: "weekly_blog", date: "2026-08-22",
  summary: "A grounded weekly summary.", article_path: "/tmp/week.md",
  canonical_url: "https://bluedot.it.com/blog/week-in-review-2026-08-22",
  source_artifacts: [`/tmp/week.md#sha256=${"a".repeat(64)}`], source_urls: ["https://bluedot.it.com/blog/week-in-review-2026-08-22"],
  claims: ["A checked claim"], uncertainties: ["An explicit uncertainty"],
};

test("accepts a grounded packet and stages deterministic content", () => {
  const article = "---\ntitle: Weekly review\ncategory: Build\ntags: build, operations\n---\n\n# Weekly review\n\n" + "A grounded paragraph ".repeat(12);
  const staged = buildStagedBlog(packet, article, "2026-08-22T00:00:00.000Z");
  assert.equal(staged.slug, "week-in-review-2026-08-22");
  assert.equal(staged.title, "Weekly review");
  assert.deepEqual(staged.tags, ["build", "operations"]);
  assert.equal(staged.claims.length, 1);
  assert.match(staged.sourceSha256, /^[a-f0-9]{64}$/);
});

test("rejects a packet whose canonical URL is outside the official blog", () => {
  assert.throws(() => validateSourcePacket({ ...packet, canonical_url: "http://example.test/blog/post", source_urls: ["http://example.test/blog/post"] }), /canonical_url_must_be_bluedot_blog_https_url/);
});

test("rejects source artifacts without immutable content hashes", () => {
  assert.throws(() => validateSourcePacket({ ...packet, source_artifacts: ["/tmp/evidence.md"] }), /source_packet_artifacts_require_sha256/);
});

test("rejects a canonical URL with query or unsafe slug", () => {
  assert.throws(() => slugFromCanonical("https://bluedot.it.com/blog/Weekly-Review?draft=1"), /canonical_url_has_invalid_blog_slug/);
});

test("rejects short or ungrounded article material", () => {
  assert.throws(() => buildStagedBlog(packet, "# Title\nshort", "now"), /article_content_too_short/);
});

test("canonical verification rejects unavailable and redirected pages", async () => {
  const staged = buildStagedBlog(packet, "# Title\n" + "grounded material ".repeat(12), "now");
  const unavailable = async () => new Response("missing", { status: 404 });
  await assert.rejects(() => verifyCanonicalUrl(packet.canonical_url, staged, unavailable as typeof fetch), /canonical_url_not_ready:404/);
  const redirected = async () => new Response(null, { status: 302, headers: { location: "/blog/elsewhere" } });
  await assert.rejects(() => verifyCanonicalUrl(packet.canonical_url, staged, redirected as typeof fetch), /canonical_url_not_ready:302/);
});

test("canonical verification proves the staged article marker is live", async () => {
  const staged = buildStagedBlog(packet, "# Title\n" + "grounded material ".repeat(12), "now");
  await verifyCanonicalUrl(packet.canonical_url, staged, (async () => new Response(`<html>${publicationMarker(staged)}</html>`, { status: 200 })) as typeof fetch);
  await assert.rejects(() => verifyCanonicalUrl(packet.canonical_url, staged, (async () => new Response("stale page", { status: 200 })) as typeof fetch), /canonical_article_marker_mismatched/);
});

test("publish rejects changed packet, article, or staged fields", () => {
  const article = "# Title\n" + "grounded material ".repeat(12);
  const staged = buildStagedBlog(packet, article, "now");
  assert.doesNotThrow(() => assertStagedIntegrity(staged, packet, article));
  assert.throws(() => assertStagedIntegrity({ ...staged, title: "tampered" }, packet, article), /staged_artifact_integrity_mismatch/);
  assert.throws(() => assertStagedIntegrity(staged, packet, article + "changed"), /staged_artifact_integrity_mismatch/);
});

test("successful publish orders mutation, verification and durable receipts", async () => {
  const staged = buildStagedBlog(packet, "# Title\n" + "grounded material ".repeat(12), "now");
  const events: string[] = [];
  await publishWithCompensation(staged, {
    mutate: async () => { events.push("mutate"); return { postId: 7, rollbackToken: 7 }; },
    verify: async () => { events.push("verify"); },
    writeFilesystemReceipt: async () => { events.push("filesystem"); },
    writeDatabaseReceipt: async () => { events.push("database"); },
    rollback: async () => { events.push("rollback"); }, clearDatabaseReceipt: async () => {}, clearFilesystemReceipt: async () => {},
  }, "timestamp");
  assert.deepEqual(events, ["mutate", "verify", "filesystem", "database"]);
});

test("verification or receipt failure compensates post and receipts", async () => {
  for (const failure of ["verify", "filesystem", "database"]) {
    const staged = buildStagedBlog(packet, "# Title\n" + "grounded material ".repeat(12), "now");
    const events: string[] = [];
    await assert.rejects(() => publishWithCompensation(staged, {
      mutate: async () => ({ postId: 7, rollbackToken: 7 }),
      verify: async () => { if (failure === "verify") throw new Error(failure); },
      writeFilesystemReceipt: async () => { if (failure === "filesystem") throw new Error(failure); },
      writeDatabaseReceipt: async () => { if (failure === "database") throw new Error(failure); },
      rollback: async () => { events.push("post"); }, clearDatabaseReceipt: async () => { events.push("database"); }, clearFilesystemReceipt: async () => { events.push("filesystem"); },
    }, "timestamp"), /publish_failed_compensated/);
    assert.deepEqual(events, ["post", "database", "filesystem"]);
  }
});

test("idempotent retry uses the DB adapter once per invocation and reports cleanup failures", async () => {
  const staged = buildStagedBlog(packet, "# Title\n" + "grounded material ".repeat(12), "now");
  let upserts = 0;
  const effects = () => ({ mutate: async () => ({ postId: (++upserts, 7), rollbackToken: 7 }), verify: async () => {}, writeFilesystemReceipt: async () => {}, writeDatabaseReceipt: async () => {}, rollback: async () => {}, clearDatabaseReceipt: async () => {}, clearFilesystemReceipt: async () => {} });
  await Promise.all([publishWithCompensation(staged, effects(), "one"), publishWithCompensation(staged, effects(), "two")]);
  assert.equal(upserts, 2);
  await assert.rejects(() => publishWithCompensation(staged, { ...effects(), verify: async () => { throw new Error("bad"); }, rollback: async () => { throw new Error("rollback unavailable"); } }, "three"), /recovery_required:rollback unavailable/);
});
