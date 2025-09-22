import type { FacetMode } from "../utils/searchUtils";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  pathwayType: string;
  modelYearEnd: string;
  modelTempIncrease?: number;
  geography: string[];
  sectors: {
    name: Sector;
  }[];
  publisher: string;
  publicationYear: string;
  overview: string;
  expertRecommendation: string;
  dataSource: {
    description: string;
    url: string;
    downloadAvailable: boolean;
  };
}

export type PathwayType = "Normative" | "Projection" | "Policy" | "Exploration";

export type TemperatureTarget = number;

export type YearTarget =
  | "2030"
  | "2040"
  | "2050"
  | "2060"
  | "2070"
  | "2100"
  | "N/A";

export type Geography =
  | "Global"
  | "EU"
  | "SEA"
  | "Americas"
  | "Africa"
  | "Asia Pacific"
  | "N/A";

export type Sector =
  | "Power"
  | "Oil & Gas"
  | "Coal"
  | "Renewables"
  | "Industrial"
  | "Transport"
  | "Buildings"
  | "Agriculture"
  | "N/A";

export type Metric =
  | "Emissions Intensity"
  | "Capacity"
  | "Generation"
  | "Technology Mix"
  | "Absolute Emissions"
  | "Carbon Price";

export interface SearchFilters {
  pathwayType?: string | string[] | null;
  modelYearEnd?: number | (number | string)[] | null;
  modelTempIncrease?: number | string | (number | string)[] | null;
  geography?: string | string[] | null;
  sector?: string | string[] | null;
  searchTerm: string;
  // Optional per-facet mode (used later by a UI toggle)
  modes?: {
    pathwayType?: FacetMode;
    modelYearEnd?: FacetMode;
    modelTempIncrease?: FacetMode;
    geography?: FacetMode;
    sector?: FacetMode;
  } | null;
}
