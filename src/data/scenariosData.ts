import Ajv from "ajv";
import schema from "../../public/schema.json" with { type: "json" };
import { Scenario } from "../types";

// 1) Grab every JSON file in this folder
//    `eager:true` = load at build time (no async), `import:'default'` = get the parsed JSON
const modules = import.meta.glob("./*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const files = Object.entries(modules)
  .map(([path, data]) => ({
    name: path.split("/").pop()!, // e.g. "scenarios_metadata_1.json"
    data,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
const ajv = new Ajv();
const validate = ajv.compile(schema);

const validateData = (data: unknown, filename: string): Scenario[] => {
  if (!validate(data)) {
    const errors = validate.errors
      ?.map((err) => `${err.instancePath} ${err.message}`)
      .join("\n");
    throw new Error(`Schema validation failed for ${filename}:\n${errors}`);
  }
  if (!Array.isArray(data))
    throw new Error(`${filename} did not produce an array`);
  return data as Scenario[];
};

export const scenariosData: Scenario[] = files
  .map(({ data, name }) => validateData(data, name))
  .flat();
