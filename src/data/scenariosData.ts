import Ajv from "ajv";
import schema from "../../public/schema.json" with { type: "json" };
import { Scenario } from "../types";

import scenarios_metadata_1 from "./scenarios_metadata_1.json" with { type: "json" };
import scenarios_metadata_2 from "./scenarios_metadata_2.json" with { type: "json" };
import scenarios_metadata_3 from "./scenarios_metadata_3.json" with { type: "json" };
import scenarios_metadata_4 from "./scenarios_metadata_4.json" with { type: "json" };
import scenarios_metadata_5 from "./scenarios_metadata_5.json" with { type: "json" };
import scenarios_metadata_6 from "./scenarios_metadata_6.json" with { type: "json" };
import scenarios_metadata_7 from "./scenarios_metadata_7.json" with { type: "json" };
import scenarios_metadata_8 from "./scenarios_metadata_8.json" with { type: "json" };
import scenarios_metadata_minimal from "./scenarios_metadata_minimal.json" with { type: "json" };
import scenarios_metadata_failing from "./scenarios_metadata_failing.json" with { type: "json" };

const ajv = new Ajv();
const validate = ajv.compile(schema);

const validateData = (data: unknown, filename: string): Scenario[] => {
  if (!validate(data)) {
    const errors = validate.errors
      ?.map((err) => `${err.instancePath} ${err.message}`)
      .join("\n");
    throw new Error(`Schema validation failed for ${filename}:\n${errors}`);
  }
  return data as Scenario[];
};

// Validate each data file individually so we can identify which file has issues
const allData = [
  { data: scenarios_metadata_1, name: "scenarios_metadata_1.json" },
  { data: scenarios_metadata_2, name: "scenarios_metadata_2.json" },
  { data: scenarios_metadata_3, name: "scenarios_metadata_3.json" },
  { data: scenarios_metadata_4, name: "scenarios_metadata_4.json" },
  { data: scenarios_metadata_5, name: "scenarios_metadata_5.json" },
  { data: scenarios_metadata_6, name: "scenarios_metadata_6.json" },
  { data: scenarios_metadata_7, name: "scenarios_metadata_7.json" },
  { data: scenarios_metadata_8, name: "scenarios_metadata_8.json" },
  { data: scenarios_metadata_minimal, name: "scenarios_metadata_minimal.json" },
  { data: scenarios_metadata_failing, name: "scenarios_metadata_failing.json" },
].map(({ data, name }) => validateData(data, name));

export const scenariosData: Scenario[] = allData.flat();
