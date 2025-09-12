import { promises as fs } from "node:fs";
import { join } from "node:path";
import { validateScenarios } from "../src/utils/validateScenarios.ts";
import type { FileEntry } from "../src/utils/validateScenarios.ts";

async function main() {
  const dir = process.argv[2] ?? "src/data"; // default if not provided
  const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));

  const entries: FileEntry[] = [];
  for (const name of names) {
    const raw = await fs.readFile(join(dir, name), "utf8");
    entries.push({ name, data: JSON.parse(raw) });
  }

  // throws (non-zero exit) on any problem
  validateScenarios(entries);
  console.log(
    `✔ Validated ${names.length} data file(s) from ${dir} against schema.`,
  );
}

main().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
