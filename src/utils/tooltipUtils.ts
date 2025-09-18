import { PathwayType, Sector, Metric } from "../types";

export const pathwayTypeTooltips: Record<PathwayType, string> = {
  "Direct Policy":
    "Outcomes based on legislated policy targets or commitments.",
  "Exploratory": "Examines a range of plausible futures without fixed goals.",
  "Normative": "Starts from a desired end state and works backward to actions.",
  "Predictive":
    "Projects likely futures based on current trends and assumptions.",
};

export const sectorTooltips: Record<Sector, string> = {
  "Agriculture": "Agricultural activities.",
  "Automotive": "Automotive manufacturing.",
  "Aviation": "Logistics of passengers and cargo by airplane.",
  "Buildings": "Residential and commercial buildings. Focus on energy use.",
  "Cement": "Cement manufacturing.",
  "Chemicals":
    "Production of primary chemicals and/or chemicals for end use, such as plastics, fertilizer, pharmaceuticals.",
  "Coal Mining": "Extraction of coal.",
  "Gas (Upstream)": "Extraction of natural gas.",
  "Industry":
    "Focused on manufacturing activities, especially heavy industries and hard-to-abate industries.",
  "Land Use": "Agriculture, Forestry, Fishery, other forms of land use.",
  "Oil (Upstream)": "Extraction of oil.",
  "Other":
    "Other climate relevant sectors that are not covered by any of the available categories.",
  "Power":
    "Includes power generation based on any energy source. Can also include power storage, transmission, and distribution.",
  "Rail": "Logistics of passengers and cargo by train.",
  "Road transport":
    "Logistics of passengers and cargo on the road, by different means, I.e. types of vehicles.",
  "Shipping": "Logistics of passengers and cargo by ship.",
  "Steel":
    "Steel making, both primary and secondary. Can include upstream and downstream activities.",
  "Transport": "Logistics of passengers and cargo.",
};

export const metricTooltips: Record<string, string> = {
  "Emissions Intensity":
    "Amount of greenhouse gases emitted per unit of physical output. Indicates how low-carbon the output production is",
  "Capacity":
    "The maximum output a power plant or energy source can produce under ideal conditions, measured in GW",
  "Generation":
    "The actual amount of electricity produced over a specific period, typically measured in TWh",
  "Technology Mix":
    "The breakdown of energy sources used for electricity generation (e.g., coal, solar, wind, nuclear). Reflects the diversity and sustainability of the energy portfolio",
  "Absolute Emissions":
    "Total greenhouse gas emissions produced, regardless of output. Measured in metric tons of CO₂ equivalent",
  "Carbon Price":
    "The cost assigned to emitting one ton of CO₂, used to incentivize lower emissions through market mechanisms or taxes",
};

export const unknownTooltip = "No tooltip available.";

export const getPathwayTypeTooltip = (type: PathwayType): string => {
  return pathwayTypeTooltips[type] || unknownTooltip;
};

export const getSectorTooltip = (sector: Sector): string => {
  return sectorTooltips[sector] || unknownTooltip;
};

export const getMetricTooltip = (metric: Metric): string => {
  return metricTooltips[metric] || unknownTooltip;
};
