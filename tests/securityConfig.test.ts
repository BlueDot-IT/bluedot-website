import assert from "node:assert/strict";
import test from "node:test";

import {
  configuredAdminEmails,
  configuredRateLimitIpHeader,
  canSelfRegisterEmail,
  isAdminEmail,
  isPublicRegistrationEnabled,
  requiredSeedAdminConfig,
  trustedClientIdentity,
} from "../src/lib/securityConfig";
import { approvedCommentsWhere } from "../src/lib/comments";

test("admin authorization fails closed without configured addresses", () => {
  assert.equal(isAdminEmail("admin@example.com", {}), false);
  assert.deepEqual([...configuredAdminEmails({})], []);
});

test("admin authorization is case-insensitive and supports an allowlist", () => {
  const environment = {
    ADMIN_EMAIL: "owner@example.com",
    ADMIN_EMAILS: " Security@Example.com, ops@example.com ",
  };

  assert.equal(isAdminEmail("security@example.com", environment), true);
  assert.equal(isAdminEmail("OWNER@EXAMPLE.COM", environment), true);
  assert.equal(isAdminEmail("attacker@example.com", environment), false);
});

test("public registration is disabled unless explicitly enabled", () => {
  assert.equal(isPublicRegistrationEnabled({}), false);
  assert.equal(isPublicRegistrationEnabled({ ALLOW_PUBLIC_REGISTRATION: "false" }), false);
  assert.equal(isPublicRegistrationEnabled({ ALLOW_PUBLIC_REGISTRATION: " true " }), true);
});

test("public registration can never claim an administrator allowlist address", () => {
  const environment = {
    ALLOW_PUBLIC_REGISTRATION: "true",
    ADMIN_EMAILS: "owner@example.com,security@example.com",
  };

  assert.equal(canSelfRegisterEmail("visitor@example.com", environment), true);
  assert.equal(canSelfRegisterEmail("SECURITY@example.com", environment), false);
});

test("rate limiting trusts only an explicitly configured proxy header", () => {
  assert.equal(configuredRateLimitIpHeader({}), null);
  assert.equal(
    configuredRateLimitIpHeader({ RATE_LIMIT_IP_HEADER: " X-Forwarded-For " }),
    "x-forwarded-for",
  );
});

test("production rate limiting fails closed without trusted client identity", () => {
  const headers = new Headers();
  assert.equal(trustedClientIdentity(headers, { NODE_ENV: "production" }), null);

  headers.set("x-forwarded-for", "spoofed, 203.0.113.9");
  assert.equal(
    trustedClientIdentity(headers, {
      NODE_ENV: "production",
      RATE_LIMIT_IP_HEADER: "x-forwarded-for",
    }),
    "203.0.113.9",
  );
});

test("public comment queries require moderation approval", () => {
  assert.deepEqual(approvedCommentsWhere(42), { postId: 42, approved: true });
});

test("administrator seeding has no fallback credentials", () => {
  assert.throws(() => requiredSeedAdminConfig({}), /ADMIN_EMAIL/);
  assert.deepEqual(
    requiredSeedAdminConfig({
      ADMIN_EMAIL: " ADMIN@EXAMPLE.COM ",
      ADMIN_USER: " owner ",
      ADMIN_PASS: "strong-password",
    }),
    {
      email: "admin@example.com",
      username: "owner",
      password: "strong-password",
    },
  );
});
