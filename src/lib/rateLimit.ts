import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { trustedClientIdentity } from "@/lib/securityConfig";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

const loginClientConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
};

const loginAccountConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase().slice(0, 512) || "unknown";
}

function bucketKey(namespace: string, value: string) {
  return createHash("sha256")
    .update(`${namespace}:${normalizeKey(value)}`)
    .digest("hex");
}

async function consume(namespace: string, value: string, config: RateLimitConfig) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + config.windowMs);
  const key = bucketKey(namespace, value);

  await prisma.$executeRaw`
    INSERT INTO \`RateLimitBucket\` (\`key\`, \`count\`, \`resetAt\`, \`updatedAt\`)
    VALUES (${key}, 1, ${resetAt}, ${now})
    ON DUPLICATE KEY UPDATE
      \`count\` = IF(\`resetAt\` <= ${now}, 1, \`count\` + 1),
      \`resetAt\` = IF(\`resetAt\` <= ${now}, ${resetAt}, \`resetAt\`),
      \`updatedAt\` = ${now}
  `;

  const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });
  if (!bucket) throw new Error("Rate-limit bucket was not persisted");

  if (bucket.count === 1) {
    const staleBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    void prisma.rateLimitBucket
      .deleteMany({ where: { resetAt: { lt: staleBefore } } })
      .catch(() => undefined);
  }

  return {
    limited: bucket.count > config.maxRequests,
    resetTime: bucket.resetAt.getTime(),
  };
}

async function bucketIsBlocked(
  namespace: string,
  value: string,
  config: RateLimitConfig,
) {
  const key = bucketKey(namespace, value);
  const bucket = await prisma.rateLimitBucket.findUnique({ where: { key } });
  if (!bucket || bucket.resetAt.getTime() <= Date.now()) return false;
  return bucket.count >= config.maxRequests;
}

function rateLimitResponse(config: RateLimitConfig, resetTime: number) {
  const retryAfter = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

  return NextResponse.json(
    {
      error: config.message || "Too many requests, please try again later.",
      retryAfter,
    },
    {
      status: 429,
      headers: {
        "Retry-After": retryAfter.toString(),
        "X-RateLimit-Limit": config.maxRequests.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": new Date(resetTime).toISOString(),
      },
    },
  );
}

function unavailableResponse() {
  return NextResponse.json(
    { error: "Request protection is temporarily unavailable." },
    { status: 503 },
  );
}

export function createRateLimiter(namespace: string, config: RateLimitConfig) {
  return async function rateLimit(request: NextRequest) {
    const identity = trustedClientIdentity(request.headers);
    if (!identity) return unavailableResponse();

    try {
      const result = await consume(namespace, identity, config);
      return result.limited ? rateLimitResponse(config, result.resetTime) : null;
    } catch (error) {
      console.error(`Rate limiter unavailable for ${namespace}:`, error);
      return unavailableResponse();
    }
  };
}

function loginClientValue(clientIdentity: string, account: string) {
  return `${normalizeKey(clientIdentity)}:${normalizeKey(account)}`;
}

export async function isLoginBlocked(clientIdentity: string, account: string) {
  const clientValue = loginClientValue(clientIdentity, account);
  const [clientBlocked, accountBlocked] = await Promise.all([
    bucketIsBlocked("login-client", clientValue, loginClientConfig),
    bucketIsBlocked("login-account", account, loginAccountConfig),
  ]);
  return clientBlocked || accountBlocked;
}

export async function recordLoginFailure(clientIdentity: string, account: string) {
  const clientValue = loginClientValue(clientIdentity, account);
  await Promise.all([
    consume("login-client", clientValue, loginClientConfig),
    consume("login-account", account, loginAccountConfig),
  ]);
}

export async function clearLoginFailures(clientIdentity: string, account: string) {
  await prisma.rateLimitBucket.deleteMany({
    where: {
      key: {
        in: [
          bucketKey("login-client", loginClientValue(clientIdentity, account)),
          bucketKey("login-account", account),
        ],
      },
    },
  });
}

export const commentRateLimit = createRateLimiter("comment", {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many comments, please wait before posting again.",
});

export const registrationRateLimit = createRateLimiter("registration", {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many registration attempts, please try again later.",
});

export const contactRateLimit = createRateLimiter("contact", {
  windowMs: 60 * 1000,
  maxRequests: 5,
  message: "Too many contact requests, please try again later.",
});

export const newsletterRateLimit = createRateLimiter("newsletter", {
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many subscription attempts, please try again later.",
});

export const apiRateLimit = createRateLimiter("api", {
  windowMs: 60 * 1000,
  maxRequests: 100,
  message: "Too many requests, please slow down.",
});
