export interface Scenario {
  id: string;
  name: string;
  description: string;
  pathwayType: string;
  modelYearNetzero: string;
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

export interface SearchFilters {
  pathwayType: PathwayType | null;
  modelYearNetzero: YearTarget | null;
  modelTempIncrease: TemperatureTarget | null;
  geography: Geography | null;
  sector: Sector | null;
  searchTerm: string;
}
