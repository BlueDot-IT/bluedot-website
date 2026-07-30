type Environment = Record<string, string | undefined>;
type HeaderSource =
  | { get(name: string): string | null }
  | Record<string, string | string[] | undefined>;

export function configuredAdminEmails(
  environment: Environment = process.env,
): Set<string> {
  const configured = [environment.ADMIN_EMAILS, environment.ADMIN_EMAIL]
    .filter(Boolean)
    .join(",");

  return new Set(
    configured
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminEmail(
  email: string | null | undefined,
  environment: Environment = process.env,
): boolean {
  if (!email) return false;
  return configuredAdminEmails(environment).has(email.trim().toLowerCase());
}

export function isPublicRegistrationEnabled(
  environment: Environment = process.env,
): boolean {
  return environment.ALLOW_PUBLIC_REGISTRATION?.trim().toLowerCase() === "true";
}

export function canSelfRegisterEmail(
  email: string | null | undefined,
  environment: Environment = process.env,
): boolean {
  return isPublicRegistrationEnabled(environment) && !isAdminEmail(email, environment);
}

export function configuredRateLimitIpHeader(
  environment: Environment = process.env,
): string | null {
  const value = environment.RATE_LIMIT_IP_HEADER?.trim().toLowerCase();
  return value || null;
}

function readHeader(headers: HeaderSource, name: string): string | null {
  if ("get" in headers && typeof headers.get === "function") {
    return headers.get(name);
  }

  const entry = Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  )?.[1];
  if (Array.isArray(entry)) return entry.join(",");
  return entry || null;
}

export function trustedClientIdentity(
  headers: HeaderSource,
  environment: Environment = process.env,
): string | null {
  const configuredHeader = configuredRateLimitIpHeader(environment);
  if (!configuredHeader) {
    return environment.NODE_ENV === "production" ? null : "development";
  }

  const rawValue = readHeader(headers, configuredHeader);
  if (!rawValue) {
    return environment.NODE_ENV === "production" ? null : "development";
  }

  const identity = (rawValue.split(",").at(-1) || "").trim().toLowerCase();
  return identity.slice(0, 256) || null;
}

export function requiredSeedAdminConfig(
  environment: Environment = process.env,
) {
  const email = environment.ADMIN_EMAIL?.trim().toLowerCase();
  const username = environment.ADMIN_USER?.trim();
  const password = environment.ADMIN_PASS;

  if (!email || !username || !password) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_USER, and ADMIN_PASS are required to seed an administrator",
    );
  }

  return { email, username, password };
}
