import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { FileEntry } from "../src/utils/validateScenarios.ts";
import {
  assembleScenarios,
  decideIncludeInvalid,
} from "../src/utils/loadScenarios.ts";

async function main() {
  const dir = process.argv[2] ?? "src/data"; // default if not provided
  const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));

  const entries: FileEntry[] = [];
  for (const name of names) {
    const raw = await fs.readFile(join(dir, name), "utf8");
    entries.push({ name, data: JSON.parse(raw) });
  }

  const includeInvalid = decideIncludeInvalid();

  const scenarios = assembleScenarios(entries, {
    includeInvalid,
    warn: (msg: string) => console.warn(msg),
  });
  // Check for invalid scenarios
  const invalidScenarios = scenarios.filter((s: any) => s && s.valid === false);
  if (invalidScenarios.length > 0) {
    console.error(
      `✖ Found ${invalidScenarios.length} invalid scenario(s) in ${dir}:`,
    );
    for (const s of invalidScenarios) {
      console.error(`  - ${s.name || "(unnamed scenario)"}`);
    }
    process.exit(1);
  } else {
    console.log(
      `✔ Validated ${names.length} data file(s) from ${dir} against schema.`,
    );
  }
}

main().catch((e) => {
  console.error(String(e?.stack || e));
  process.exit(1);
});
