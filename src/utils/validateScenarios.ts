import Ajv from "ajv";
import type { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import schema from "../schema/schema.json" with { type: "json" };
import type { Scenario } from "../types";

export type FileEntry = { name: string; data: Scenario[] };

export type ValidationProblem = {
  name: string;
  errors: string[];
  /** Provided only when the blob is at least an array (even if schema-invalid). */
  data?: Scenario[];
};

export type ValidationOutcome = {
  valid: Scenario[];
  invalid: ValidationProblem[];
};

function makeValidator() {
  const ajv = new Ajv({
    allErrors: true,
    strict: true,
    multipleOfPrecision: 12,
  });
  addFormats(ajv);
  return ajv.compile(schema);
}

export function validateScenariosCollect(
  entries: FileEntry[],
  validator: ValidateFunction = makeValidator(),
): ValidationOutcome {
  const valid: Scenario[] = [];
  const invalid: ValidationProblem[] = [];

  for (const { name, data } of entries) {
    const ok = validator(data);
    if (!ok || !Array.isArray(data)) {
      const msgs =
        validator.errors?.map((e) =>
          `${e.instancePath || "/"} ${e.message ?? ""}`.trim(),
        ) ?? [];
      invalid.push({
        name,
        errors: msgs.length ? msgs : ["unknown validation error"],
        data: Array.isArray(data) ? data : undefined,
      });
      continue;
    }
    valid.push(...data);
  }
  return { valid, invalid };
}

export function validateScenarios(entries: FileEntry[]): Scenario[] {
  const { valid, invalid } = validateScenariosCollect(entries);
  if (invalid.length) {
    const problems = invalid
      .map((p) => `✖ ${p.name}\n  ${p.errors.join("\n  ")}`)
      .join("\n\n");
    throw new Error(`Schema validation failed:\n\n${problems}\n`);
  }
  return valid;
}
