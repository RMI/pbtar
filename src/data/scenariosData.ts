import { Scenario } from "../types";

import scenarios_metadata_1 from "./scenarios_metadata_1.json" with { type: "json" };
import scenarios_metadata_2 from "./scenarios_metadata_2.json" with { type: "json" };
import scenarios_metadata_3 from "./scenarios_metadata_3.json" with { type: "json" };
import scenarios_metadata_4 from "./scenarios_metadata_4.json" with { type: "json" };
import scenarios_metadata_5 from "./scenarios_metadata_5.json" with { type: "json" };
import scenarios_metadata_6 from "./scenarios_metadata_6.json" with { type: "json" };
import scenarios_metadata_7 from "./scenarios_metadata_7.json" with { type: "json" };
import scenarios_metadata_8 from "./scenarios_metadata_8.json" with { type: "json" };

export const scenariosData: Scenario[] = [
  ...scenarios_metadata_1,
  ...scenarios_metadata_2,
  ...scenarios_metadata_3,
  ...scenarios_metadata_4,
  ...scenarios_metadata_5,
  ...scenarios_metadata_6,
  ...scenarios_metadata_7,
  ...scenarios_metadata_8,
];
