import { Scenario } from "../types";
import { FileEntry } from "../utils/validateData";
import { assembleData, decideIncludeInvalid } from "../utils/loadData";
import pathwayMetadataSchema from "../schema/pathwayMetadata.v1.json" with { type: "json" };

// 1) Grab every JSON file in this folder **and subfolders**
//    `eager:true` = load at build time (no async), `import:'default'` = get the parsed JSON
const modules = import.meta.glob("./**/*.json", {
  eager: true,
  import: "default",
});

const entries: FileEntry[] = Object.entries(modules)
  .map(([path, data]) => ({
    // Use a stable, relative file path to disambiguate duplicates across subdirs
    // Example: "nested/scenarios_metadata_1.json"
    name: path.replace(/^\.\/?/, ""),
    data, // file contents
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const pathwayMetadata: Scenario[] = assembleData(
  entries,
  pathwayMetadataSchema,
  {
    includeInvalid: decideIncludeInvalid(),
  },
);
