import { spawnSync } from "node:child_process";

const severityRank = { info: 0, low: 1, moderate: 2, high: 3, critical: 4 };

const allowedAdvisories = new Map();

const audit = spawnSync("npm", ["audit", "--omit=dev", "--json"], {
  encoding: "utf8",
  env: process.env,
  maxBuffer: 20 * 1024 * 1024,
});

let report;
try {
  report = JSON.parse(audit.stdout);
} catch (error) {
  console.error("Unable to parse npm audit output.");
  if (audit.stdout) console.error(audit.stdout);
  if (audit.stderr) console.error(audit.stderr);
  process.exit(1);
}

if (report.error || !report.metadata?.vulnerabilities) {
  console.error("npm audit did not return a complete vulnerability report.");
  console.error(JSON.stringify(report.error || report, null, 2));
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities || {};

function advisoriesFor(packageName, seen = new Set()) {
  if (seen.has(packageName)) return [];
  seen.add(packageName);

  const vulnerability = vulnerabilities[packageName];
  if (!vulnerability) return [];

  return (vulnerability.via || []).flatMap((entry) => {
    if (typeof entry === "string") return advisoriesFor(entry, seen);
    return [entry];
  });
}

const blocked = new Map();
const ignored = new Map();

for (const packageName of Object.keys(vulnerabilities)) {
  for (const advisory of advisoriesFor(packageName)) {
    const url = advisory.url || `npm-advisory:${advisory.source}`;
    const key = `${url}:${packageName}`;

    const exception = allowedAdvisories.get(url);
    if (exception && Date.now() <= Date.parse(`${exception.expires}T23:59:59Z`)) {
      ignored.set(key, { packageName, advisory, exception });
      continue;
    }

    if ((severityRank[advisory.severity] || 0) >= severityRank.high) {
      blocked.set(key, { packageName, advisory });
    }
  }
}

for (const { packageName, advisory, exception } of ignored.values()) {
  console.warn(
    `ALLOWLISTED ${advisory.severity}: ${packageName} — ${advisory.title}\n` +
      `  ${advisory.url}\n` +
      `  ${exception.reason}\n` +
      `  Exception expires: ${exception.expires}`,
  );
}

if (blocked.size > 0) {
  console.error("High or critical production dependency advisories detected:");
  for (const { packageName, advisory } of blocked.values()) {
    console.error(
      `- ${advisory.severity}: ${packageName} — ${advisory.title}\n  ${advisory.url}`,
    );
  }
  process.exit(1);
}

const totals = report.metadata?.vulnerabilities || {};
console.log(
  `Production dependency audit passed policy (${totals.total || 0} total advisories; ` +
    `${ignored.size} explicitly allowlisted package paths).`,
);
