// scripts/schema-check-files.ts
import { promises as fs } from "node:fs";
import { join } from "node:path";
import type { FileEntry } from "../src/utils/validateScenarios.ts";
import { validateScenariosCollect } from "../src/utils/validateScenarios.ts";
import { decideIncludeInvalid } from "../src/utils/loadScenarios.ts";

async function run(dir: string) {

  const names = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));

  const entries: FileEntry[] = [];
  for (const name of names) {
    const raw = await fs.readFile(join(dir, name), "utf8");
    entries.push({ name, data: JSON.parse(raw) });
  }

  const { valid, invalid } = validateScenariosCollect(entries);
  return { dir, validCount: valid.length, invalid };
}

async function main() {
  const args = process.argv.slice(2);
  const dirs = args.length ? args : ["src/data"]; // default if none provided
  const strict = !decideIncludeInvalid();
  const inCI =
    String(process.env.GITHUB_ACTIONS || "").toLowerCase() === "true";

  let totalValid = 0;
  let totalInvalid = 0;

  const results = await Promise.all(dirs.map(run));

  // Emit human summary + GH annotations (without failing yet)
  for (const r of results) {
    totalValid += r.validCount;
    totalInvalid += r.invalid.length;

    if (r.invalid.length === 0) {
      // eslint-disable-next-line no-console
      console.log(`✔ ${r.dir}: OK (${r.validCount} items)`);
      continue;
    }

    // eslint-disable-next-line no-console
    console.error(
      `✖ ${r.dir}: ${r.invalid.length} schema-invalid file(s) found:`,
    );

    for (const p of r.invalid) {
      // Emit up to N errors per file as GH annotations
      const file = join(r.dir, p.name);
      const errs = p.errors.slice(0, 50);
      for (const e of errs) {
        // eslint-disable-next-line no-console
        console.log(`::warning file=${file}::${e}`);
      }
      if (p.errors.length > errs.length) {
        // eslint-disable-next-line no-console
        console.log(
          `::notice file=${file}::…and ${
            p.errors.length - errs.length
          } more error(s)`,
        );
      }
    }
  }

  // Final summary
  // eslint-disable-next-line no-console
  console.log(
    `\nSummary: ${totalValid} valid item(s), ${totalInvalid} invalid file(s) across ${dirs.length} director${
      dirs.length === 1 ? "y" : "ies"
    }.`,
  );

  // Optional failure gate
  if (strict && totalInvalid > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(String(e?.stack || e));
  process.exit(1);
});
