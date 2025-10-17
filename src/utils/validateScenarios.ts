import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { SchemaObject } from "ajv";
import pathwayMetadata from "../schema/pathwayMetadata.json" with { type: "json" };
import type { Scenario } from "../types";

export type FileEntry = { name: string; data: Scenario[] };

function makeAjv(schemas: readonly (object | SchemaObject)[]) {
  const ajv = new Ajv({
    allErrors: true,
    strict: true,
    multipleOfPrecision: 12,
  });
  addFormats(ajv);
  for (const s of schemas) ajv.addSchema(s as SchemaObject);
  return ajv;
}

function fmt(errors: any[] | null | undefined): string[] {
  if (!errors || !errors.length) return [];
  return errors.map((e) =>
    `${e.instancePath || "/"} ${e.message ?? "validation error"}`.trim(),
  );
}

/**
 * Generic, schema-routed validator.
 * - Preload *only* the schemas you pass in.
 * - Each entry must include a string `"$schema"` that matches one of those schemas’ `$id`.
 */
export function validateFilesBySchema(
  entries: FileEntry[],
  schemas: readonly (object | SchemaObject)[],
): ValidationOutcome {
  const ajv = makeAjv(schemas);
  const valid: ValidationRecord[] = [];
  const invalid: ValidationProblem[] = [];

  for (const { name, data } of entries) {
    const schemaId = (data as any)?.$schema;
    if (typeof schemaId !== "string" || !schemaId) {
      invalid.push({ name, errors: ['missing or non-string "$schema"'] });
      continue;
    }
    const validate = ajv.getSchema(schemaId);
    if (!validate) {
      invalid.push({
        name,
        errors: [`no schema preloaded for $schema "${schemaId}"`],
        data,
      });
      continue;
    }
    const ok = validate(data);
    if (ok) valid.push({ name, schemaId, data });
    else invalid.push({ name, errors: fmt(validate.errors), data });
  }
  return { valid, invalid };
}

/**
 * Scenario-specific validator:
 *  - Filters to *only* metadata files (`$schema === pathwayMetadata.$id`)
 *  - Validates them using the metadata schema only
 *  - Returns the same {valid, invalid} shape as the generic validator
 *
 * This keeps CI happy (counts still work) and isolates the UI’s eager path.
 */
export function validateScenariosCollect(
  entries: FileEntry[],
): ValidationOutcome {
  const META_ID = String((pathwayMetadata as any).$id);
  const metaEntries = entries.filter(
    (e) =>
      typeof (e.data as any)?.$schema === "string" &&
      (e.data as any).$schema === META_ID,
  );
  return validateFilesBySchema(metaEntries, [pathwayMetadata]);
}
