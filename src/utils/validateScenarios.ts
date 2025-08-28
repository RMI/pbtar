import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../schema/schema.json" with { type: "json" };
import type { Scenario } from "../types";

export type FileEntry = { name: string; data: Scenario[] };

function makeValidator() {
  const ajv = new Ajv({
    allErrors: true,
    strict: true,
    multipleOfPrecision: 12,
  });
  addFormats(ajv);
  return ajv.compile(schema);
}

// Validate a list of {name, data} blobs against the schema.
// Returns a single flattened Scenario[] or throws with a nice aggregated error.
export function validateScenarios(entries: FileEntry[]): Scenario[] {
  const validate = makeValidator();
  const out: Scenario[] = [];
  const problems: string[] = [];

  for (const { name, data } of entries) {
    const ok = validate(data);
    if (!ok) {
      const msgs = (validate.errors ?? [])
        .map((e) => `${e.instancePath || "/"} ${e.message}`)
        .join("\n  ");
      problems.push(`✖ ${name}\n  ${msgs}`);
      continue;
    }
    if (!Array.isArray(data)) {
      problems.push(`✖ ${name}\n  expected an array of Scenario items`);
      continue;
    }
    out.push(...data);
  }

  if (problems.length) {
    throw new Error(`Schema validation failed:\n\n${problems.join("\n\n")}\n`);
  }

  return out;
}
