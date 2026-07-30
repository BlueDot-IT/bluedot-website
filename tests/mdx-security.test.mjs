import assert from "node:assert/strict";
import test from "node:test";
import { serialize } from "next-mdx-remote/serialize";

test("MDX serialization blocks JavaScript expressions and imports", async () => {
  const marker = "BLUEDOT_UNSAFE_MDX_MARKER";
  const expression = await serialize(
    `# Unsafe\n\n{globalThis.${marker} = true}`,
  );
  const importStatement = await serialize(
    `import fs from "node:fs"\n\n# ${marker}`,
  );

  assert.doesNotMatch(expression.compiledSource, new RegExp(marker));
  assert.doesNotMatch(importStatement.compiledSource, /node:fs/);
});
