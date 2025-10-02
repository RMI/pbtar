import { Scenario } from "../types";
import {
  validateScenariosCollect,
  FileEntry,
} from "../utils/validateScenarios";

// 1) Grab every JSON file in this folder
//    `eager:true` = load at build time (no async), `import:'default'` = get the parsed JSON
const modules = import.meta.glob("./*.json", {
  eager: true,
  import: "default",
});

const entries: FileEntry[] = Object.entries(modules)
  .map(([path, data]) => ({
    name: path.split("/").pop()!, // e.g. "scenarios_metadata_1.json"
    data, // file contents
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const { valid, invalid } = validateScenariosCollect(entries);

export const scenariosData: Scenario[] = valid;
