import type { FacetMode } from "../utils/searchUtils";
import type { PathwayMetadataV1 } from "./pathwayMetadata.v1";

// Re-export the (current) versioned pathway metadata type as generic
export type PathwayMetadata = PathwayMetadataV1;

export type Scenario = Pick<
  PathwayMetadata,
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
export type PathwayType = PathwayMetadata["pathwayType"];
export type Geography = PathwayMetadata["geography"][number];
export type Sector = PathwayMetadata["sectors"][number]["name"];
export type Metric = PathwayMetadata["metric"][number];

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
