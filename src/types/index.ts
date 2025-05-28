export interface Scenario {
  id: string;
  name: string;
  description: string;
  category: string;
  target_year: string;
  target_temperature: string;
  regions: string[];
  sectors: string[];
  publisher: string;
  published_date: string;
  overview: string;
  expertRecommendation: string;
  dataSource: {
    description: string;
    url: string;
    downloadAvailable: boolean;
  };
}

export type ScenarioCategory = "IAM" | "ITR" | "NDC" | "Other";

export type TemperatureTarget = "1.5C" | "2C" | "2.5C" | "3C" | "4C" | "N/A";

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
  category: ScenarioCategory | null;
  target_year: YearTarget | null;
  target_temperature: TemperatureTarget | null;
  region: Region | null;
  sector: Sector | null;
  searchTerm: string;
}
