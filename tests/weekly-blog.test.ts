import assert from "node:assert/strict";
import test from "node:test";
import { buildStagedBlog, slugFromCanonical, validateSourcePacket, verifyCanonicalUrl } from "../src/lib/weeklyBlog";

const packet = {
  id: "week-in-review-2026-08-22", lane: "build", slot: "weekly_blog", date: "2026-08-22",
  summary: "A grounded weekly summary.", article_path: "/tmp/week.md",
  canonical_url: "https://bluedot.it.com/blog/week-in-review-2026-08-22",
  source_artifacts: ["/tmp/week.md"], source_urls: ["https://bluedot.it.com/blog/week-in-review-2026-08-22"],
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

test("rejects a canonical URL with query or unsafe slug", () => {
  assert.throws(() => slugFromCanonical("https://bluedot.it.com/blog/Weekly-Review?draft=1"), /canonical_url_has_invalid_blog_slug/);
});

test("rejects short or ungrounded article material", () => {
  assert.throws(() => buildStagedBlog(packet, "# Title\nshort", "now"), /article_content_too_short/);
});

test("canonical verification rejects unavailable and redirected pages", async () => {
  const unavailable = async () => new Response("missing", { status: 404 });
  await assert.rejects(() => verifyCanonicalUrl(packet.canonical_url, unavailable as typeof fetch), /canonical_url_not_ready:404/);
  const redirected = async () => new Response(null, { status: 302, headers: { location: "/blog/elsewhere" } });
  await assert.rejects(() => verifyCanonicalUrl(packet.canonical_url, redirected as typeof fetch), /canonical_url_not_ready:302/);
});
