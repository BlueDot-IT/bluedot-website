#!/usr/bin/env tsx
import { readFile, writeFile, mkdir, rename, unlink } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import type { Prisma } from "@prisma/client";
import { assertStagedIntegrity, buildStagedBlog, publishWithCompensation, slugFromCanonical, verifyCanonicalUrl, type StagedWeeklyBlog, type WeeklySourcePacket } from "@/lib/weeklyBlog";
const DEFAULT_ROOT = "ops/weekly-blog";
const now = () => new Date().toISOString();
const arg = (args: string[], name: string) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
async function json<T>(path: string): Promise<T> { return JSON.parse(await readFile(resolve(path), "utf8")) as T; }
async function writeJson(path: string, value: unknown) {
  const target = resolve(path); await mkdir(dirname(target), { recursive: true });
  const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2) + "\n", "utf8");
  await rename(temporary, target);
}
async function verifySourceArtifacts(packet: WeeklySourcePacket) {
  for (const artifact of packet.source_artifacts) {
    const marker = artifact.lastIndexOf("#sha256=");
    if (marker < 1) throw new Error("source_packet_artifacts_require_sha256");
    const path = artifact.slice(0, marker); const expected = artifact.slice(marker + 8);
    const actual = createHash("sha256").update(await readFile(resolve(path))).digest("hex");
    if (actual !== expected) throw new Error(`source_artifact_integrity_mismatch:${path}`);
  }
}
function usage(): never { throw new Error("usage: weekly-blog stage --source-packet PATH --article PATH [--output PATH] | publish --staged PATH --source-packet PATH --article PATH [--verify-url URL]"); }
async function stage(args: string[]) {
  const packetPath = arg(args, "--source-packet"); const articlePath = arg(args, "--article"); if (!packetPath || !articlePath) usage();
  const packet = await json<WeeklySourcePacket>(packetPath); if (resolve(packet.article_path) !== resolve(articlePath)) throw new Error("article_path_does_not_match_source_packet"); await verifySourceArtifacts(packet);
  const staged = buildStagedBlog(packet, await readFile(resolve(articlePath), "utf8"), now());
  const output = arg(args, "--output") || DEFAULT_ROOT + "/staged/" + staged.sourcePacketId + ".json"; await writeJson(output, staged);
  await writeJson(DEFAULT_ROOT + "/receipts/" + staged.sourcePacketId + ".json", { status: "staged", sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, canonicalUrl: staged.canonicalUrl, stagedPath: output, stagedAt: staged.stagedAt });
  console.log(JSON.stringify({ status: "staged", output, sourcePacketId: staged.sourcePacketId }));
}
async function publish(args: string[]) {
  const stagedPath = arg(args, "--staged"); const packetPath = arg(args, "--source-packet"); const articlePath = arg(args, "--article");
  if (!stagedPath || !packetPath || !articlePath) usage(); const staged = await json<StagedWeeklyBlog>(stagedPath);
  if (staged.status !== "staged" || slugFromCanonical(staged.canonicalUrl) !== staged.slug) throw new Error("staged_article_invalid");
  const packet = await json<WeeklySourcePacket>(packetPath); if (resolve(packet.article_path) !== resolve(articlePath)) throw new Error("article_path_does_not_match_source_packet"); await verifySourceArtifacts(packet);
  assertStagedIntegrity(staged, packet, await readFile(resolve(articlePath), "utf8"));
  const { prisma } = await import("@/lib/prisma");
  const verifyUrl = arg(args, "--verify-url") || staged.canonicalUrl;
  const previous = await prisma.post.findUnique({
    where: { slug: staged.slug },
    include: { tags: true },
  });
  const previousRun = await prisma.weeklyBlogRun.findUnique({ where: { sourcePacketId: staged.sourcePacketId } });
  const receiptPath = DEFAULT_ROOT + "/receipts/" + staged.sourcePacketId + ".json";
  const mutate = async () => prisma.$transaction(async (tx) => {
    const category = await tx.category.upsert({ where: { name: staged.category }, update: {}, create: { name: staged.category } });
    const tags = await Promise.all(staged.tags.map((name) => tx.tag.upsert({ where: { name }, update: {}, create: { name } })));
    const tagLinks = { create: tags.map((tag) => ({ tag: { connect: { id: tag.id } } })) };
    return tx.post.upsert({
      where: { slug: staged.slug },
      update: { title: staged.title, excerpt: staged.excerpt, content: staged.content, categoryId: category.id, tags: { deleteMany: {}, ...tagLinks } },
      create: { title: staged.title, slug: staged.slug, excerpt: staged.excerpt, content: staged.content, categoryId: category.id, tags: tagLinks },
    });
  });
  const rollback = async (postId: unknown) => prisma.$transaction(async (tx) => {
      if (!previous) {
        await tx.post.deleteMany({ where: { id: Number(postId) } });
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
  const receipt = await publishWithCompensation(staged, {
    mutate: async () => { const post = await mutate(); return { postId: post.id, rollbackToken: post.id }; },
    verify: () => verifyCanonicalUrl(verifyUrl, staged),
    writeFilesystemReceipt: (value) => writeJson(receiptPath, { ...value, stagedPath }),
    writeDatabaseReceipt: async (postId, value) => { await prisma.weeklyBlogRun.upsert({
      where: { sourcePacketId: staged.sourcePacketId },
      update: { sourceSha256: staged.sourceSha256, slug: staged.slug, canonicalUrl: staged.canonicalUrl, status: "PUBLISHED", postId, receipt: value as Prisma.InputJsonValue },
      create: { sourcePacketId: staged.sourcePacketId, sourceSha256: staged.sourceSha256, slug: staged.slug, canonicalUrl: staged.canonicalUrl, status: "PUBLISHED", postId, receipt: value as Prisma.InputJsonValue },
    }); },
    rollback,
    clearDatabaseReceipt: async () => { if (previousRun) await prisma.weeklyBlogRun.update({ where: { sourcePacketId: staged.sourcePacketId }, data: { sourceSha256: previousRun.sourceSha256, slug: previousRun.slug, canonicalUrl: previousRun.canonicalUrl, status: previousRun.status, postId: previousRun.postId, receipt: previousRun.receipt as Prisma.InputJsonValue } }); else await prisma.weeklyBlogRun.deleteMany({ where: { sourcePacketId: staged.sourcePacketId } }); },
    clearFilesystemReceipt: async () => { try { await unlink(resolve(receiptPath)); } catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; } },
  }, now());
  console.log(JSON.stringify({ ...receipt, stagedPath }));
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
