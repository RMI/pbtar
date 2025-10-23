import type { FacetMode } from "../utils/searchUtils";
import type { PBTARScenariosMetadataSchema } from "./pathwayMetadata.v1";

export type Scenario = Pick<
  PBTARScenariosMetadataSchema,
  | "id"
  | "name"
  | "description"
  | "pathwayType"
  | "modelYearNetzero"
  | "modelTempIncrease"
  | "geography"
  | "metric"
  | "sectors"
  | "publisher"
  | "publicationYear"
  | "scenarioOverview"
  | "expertOverview"
  | "dataSource"
>;

// Enum-like types derived from the schema
export type PathwayType = PBTARScenariosMetadataSchema["pathwayType"];
export type Geography = PBTARScenariosMetadataSchema["geography"][number];
export type Sector = PBTARScenariosMetadataSchema["sectors"][number]["name"];
export type Metric = PBTARScenariosMetadataSchema["metric"][number];

export type TemperatureTarget = number;

export type YearTarget =
  | "2030"
  | "2040"
  | "2050"
  | "2060"
  | "2070"
  | "2100"
  | "N/A";

export interface SearchFilters {
  pathwayType?: string | string[] | null;
  modelYearNetzero?: number | (number | string)[] | null;
  modelTempIncrease?: number | string | (number | string)[] | null;
  geography?: string | string[] | null;
  sector?: string | string[] | null;
  metric?: string | string[] | null;
  searchTerm: string;
  // Optional per-facet mode (used later by a UI toggle)
  modes?: {
    pathwayType?: FacetMode;
    modelYearNetzero?: FacetMode;
    modelTempIncrease?: FacetMode;
    geography?: FacetMode;
    sector?: FacetMode;
    metric?: FacetMode;
  } | null;
}

export type { PBTARScenariosMetadataSchema };
