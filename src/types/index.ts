export interface Scenario {
  id: string;
  name: string;
  description: string;
  pathwayType: string;
  modelYearEnd: string;
  modelTempIncrease?: number;
  regions: string[];
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

export type Region =
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

export interface SearchFilters {
  pathwayType: PathwayType | null;
  modelYearEnd: YearTarget | null;
  modelTempIncrease: TemperatureTarget | null;
  region: Region | null;
  sector: Sector | null;
  searchTerm: string;
}
