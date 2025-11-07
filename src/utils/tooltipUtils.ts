import type {
  Metric,
  PathwayMetadataType,
  PathwayType,
  Sector,
} from "../types";

export const unknownTooltip = "No tooltip available.";

export const pathwayTypeTooltips: Record<PathwayType, string> = {
  "Direct Policy":
    "Outcomes based on legislated policy targets or commitments.",
  "Exploratory": "Examines a range of plausible futures without fixed goals.",
  "Normative": "Starts from a desired end state and works backward to actions.",
  "Predictive":
    "Projects likely futures based on current trends and assumptions.",
};

export const getPathwayTypeTooltip = (type: PathwayType): string => {
  return pathwayTypeTooltips[type] || unknownTooltip;
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

export const getSectorTooltip = (sector: Sector): string => {
  return sectorTooltips[sector] || unknownTooltip;
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
};

export const getMetricTooltip = (metric: Metric): string => {
  return metricTooltips[metric] || unknownTooltip;
};

export type KeyFeatureSection = keyof PathwayMetadataType["keyFeatures"];

/**
 * Subsection-aware tooltip resolver for Key Features.
 * Collisions are resolved by looking up [sectionKey][value].
 */
export function getKeyFeatureTooltip(
  sectionKey: KeyFeatureSection,
  value: string,
): string {
  // NOTE: Fill in real copy later — these are just placeholders.
  // Use the exact enum strings from your schema/data as the nested keys.
  const MAP: Partial<Record<KeyFeatureSection, Record<string, string>>> = {
    emissionsPathway: {
      // e.g. "Significant decrease": "Real copy about what this means in emissions pathways."
    },
    energyEfficiency: {
      // e.g. "High": "Real copy describing high efficiency assumptions."
    },
    energyDemand: {
      // e.g. "Increasing": "Real copy describing demand trajectory and drivers."
    },
    electrification: {
      // e.g. "Aggressive": "Real copy about electrification pace/scope."
    },
    policyTypes: {
      // e.g. "Carbon pricing": "Real copy about the policy instrument."
    },
    technologyCostTrend: {
      // e.g. "Rapid decline": "Real copy about cost learning rates / drivers."
    },
    technologyDeploymentTrend: {
      // e.g. "Accelerating": "Real copy about S-curve adoption dynamics."
    },
    emissionsScope: {
      // e.g. "All GHGs": "Real copy about scope coverage and exclusions."
    },
    policyAmbition: {
      // e.g. "High": "Real copy about ambition level / coverage."
    },
    technologyCostsDetail: {
      // e.g. "Capex only": "Real copy clarifying cost boundary."
    },
    newTechnologiesIncluded: {
      // e.g. "DAC": "Real copy about inclusion assumptions and constraints."
    },
    supplyChain: {
      // e.g. "Constrained": "Real copy about supply chain risks/assumptions."
    },
    investmentNeeds: {
      // e.g. "Very high": "Real copy about scale, timing, beneficiaries."
    },
    infrastructureRequirements: {
      // e.g. "Grid expansion": "Real copy about infra dependencies."
    },
  };

  const v = String(value).trim();
  const section = MAP[sectionKey];
  if (section?.[v]) return section[v];

  // Fallback: safe generic placeholder with the raw value.
  return `${v} Tooltip TKTK`;
}
