import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { prisma } from "../src/lib/prisma";
import {
  clearLoginFailures,
  commentRateLimit,
  isLoginBlocked,
  recordLoginFailure,
} from "../src/lib/rateLimit";

test("rate limits are atomic, shared, and avoid immediate account lockout", async () => {
  const environment = process.env as Record<string, string | undefined>;
  const originalHeader = environment.RATE_LIMIT_IP_HEADER;
  const originalNodeEnv = environment.NODE_ENV;
  environment.RATE_LIMIT_IP_HEADER = "x-forwarded-for";

  try {
    await prisma.rateLimitBucket.deleteMany();

    const request = new NextRequest("http://localhost/api/comments", {
      headers: { "x-forwarded-for": "spoofed, 203.0.113.25" },
    });
    const concurrent = await Promise.all(
      Array.from({ length: 10 }, () => commentRateLimit(request)),
    );
    const limited = concurrent.filter((response) => response?.status === 429).length;
    const routeBucket = await prisma.rateLimitBucket.findFirst();

    assert.equal(routeBucket?.count, 10);
    assert.ok(limited >= 5, `expected at least five limited requests, got ${limited}`);

    await prisma.rateLimitBucket.deleteMany();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      await recordLoginFailure("203.0.113.25", "admin");
    }

    assert.equal(await isLoginBlocked("203.0.113.25", "admin"), true);
    assert.equal(await isLoginBlocked("198.51.100.8", "admin"), false);

    await clearLoginFailures("203.0.113.25", "admin");
    assert.equal(await isLoginBlocked("203.0.113.25", "admin"), false);

    delete environment.RATE_LIMIT_IP_HEADER;
    environment.NODE_ENV = "production";
    const unavailable = await commentRateLimit(
      new NextRequest("http://localhost/api/comments"),
    );
    assert.equal(unavailable?.status, 503);
  } finally {
    if (originalHeader === undefined) delete environment.RATE_LIMIT_IP_HEADER;
    else environment.RATE_LIMIT_IP_HEADER = originalHeader;
    if (originalNodeEnv === undefined) delete environment.NODE_ENV;
    else environment.NODE_ENV = originalNodeEnv;
    await prisma.rateLimitBucket.deleteMany();
    await prisma.$disconnect();
  }
});
