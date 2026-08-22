#!/usr/bin/env tsx
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { buildStagedBlog, slugFromCanonical, verifyCanonicalUrl, type StagedWeeklyBlog, type WeeklySourcePacket } from "@/lib/weeklyBlog";
const DEFAULT_ROOT = "ops/weekly-blog";
const now = () => new Date().toISOString();
const arg = (args: string[], name: string) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
async function json<T>(path: string): Promise<T> { return JSON.parse(await readFile(resolve(path), "utf8")) as T; }
async function writeJson(path: string, value: unknown) { await mkdir(dirname(resolve(path)), { recursive: true }); await writeFile(resolve(path), JSON.stringify(value, null, 2) + "\n", "utf8"); }
function usage(): never { throw new Error("usage: weekly-blog stage --source-packet PATH --article PATH [--output PATH] | publish --staged PATH [--verify-url URL]"); }
async function stage(args: string[]) {
  const packetPath = arg(args, "--source-packet"); const articlePath = arg(args, "--article"); if (!packetPath || !articlePath) usage();
  const packet = await json<WeeklySourcePacket>(packetPath); const staged = buildStagedBlog(packet, await readFile(resolve(articlePath), "utf8"), now());
  const output = arg(args, "--output") || DEFAULT_ROOT + "/staged/" + staged.sourcePacketId + ".json"; await writeJson(output, staged);
  await writeJson(DEFAULT_ROOT + "/receipts/" + staged.sourcePacketId + ".json", { status: "staged", sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, canonicalUrl: staged.canonicalUrl, stagedPath: output, stagedAt: staged.stagedAt });
  console.log(JSON.stringify({ status: "staged", output, sourcePacketId: staged.sourcePacketId }));
}
async function publish(args: string[]) {
  const stagedPath = arg(args, "--staged"); if (!stagedPath) usage(); const staged = await json<StagedWeeklyBlog>(stagedPath);
  if (staged.status !== "staged" || slugFromCanonical(staged.canonicalUrl) !== staged.slug) throw new Error("staged_article_invalid");
  const { prisma } = await import("@/lib/prisma");
  const verifyUrl = arg(args, "--verify-url") || staged.canonicalUrl;
  const previous = await prisma.post.findUnique({
    where: { slug: staged.slug },
    include: { tags: true },
  });
  const post = await prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({ where: { name: staged.category }, update: {}, create: { name: staged.category } });
    const tags = await Promise.all(staged.tags.map((name) => tx.tag.upsert({ where: { name }, update: {}, create: { name } })));
    const tagLinks = { create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })) };
    return tx.post.upsert({
      where: { slug: staged.slug },
      update: { title: staged.title, excerpt: staged.excerpt, content: staged.content, categoryId: category.id, tags: { deleteMany: {}, ...tagLinks } },
      create: { title: staged.title, slug: staged.slug, excerpt: staged.excerpt, content: staged.content, categoryId: category.id, tags: tagLinks },
    });
  });
  try {
    await verifyCanonicalUrl(verifyUrl);
  } catch (error) {
    // The web process cannot observe an uncommitted row. Compensate immediately if
    // the exact canonical page is not live after commit.
    await prisma.$transaction(async (tx) => {
      if (!previous) {
        await tx.post.deleteMany({ where: { id: post.id } });
        return;
      }
      await tx.post.update({
        where: { id: previous.id },
        data: {
          title: previous.title,
          excerpt: previous.excerpt,
          content: previous.content,
          categoryId: previous.categoryId,
          tags: { deleteMany: {}, create: previous.tags.map(({ tagId }) => ({ tag: { connect: { id: tagId } } })) },
        },
      });
    });
    throw error;
  }
  const receipt = { status: "published", sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, postId: post.id, slug: staged.slug, canonicalUrl: staged.canonicalUrl, canonicalVerifiedAt: now(), handoffEligible: true, stagedPath };
  await prisma.weeklyBlogRun.upsert({
      where: { sourcePacketId: staged.sourcePacketId },
      update: { sourceSha256: staged.sourceSha256, slug: staged.slug, canonicalUrl: staged.canonicalUrl, status: "PUBLISHED", postId: post.id, receipt },
      create: { sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, slug: staged.slug, canonicalUrl: staged.canonicalUrl, status: "PUBLISHED", postId: post.id, receipt },
  });
  await writeJson(DEFAULT_ROOT + "/receipts/" + staged.sourcePacketId + ".json", receipt); console.log(JSON.stringify(receipt));
}
async function main() { const command = process.argv[2]; const args = process.argv.slice(3); if (command === "stage") return stage(args); if (command === "publish") return publish(args); usage(); }
main().catch(async (error) => {
  let sourcePacketId = arg(process.argv.slice(2), "--source-packet");
  const stagedPath = arg(process.argv.slice(2), "--staged");
  if (!sourcePacketId && stagedPath) { try { sourcePacketId = (await json<StagedWeeklyBlog>(stagedPath)).sourcePacketId; } catch { /* preserve the original failure */ } }
  const receipt = { status: "failed_closed", sourcePacketId, error: error instanceof Error ? error.message : String(error), handoffEligible: false, failedAt: now() };
  if (sourcePacketId) await writeJson(DEFAULT_ROOT + "/receipts/" + sourcePacketId + ".json", receipt);
  console.error(JSON.stringify(receipt)); process.exitCode = 1;
});
