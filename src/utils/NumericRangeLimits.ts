import { getGlobalFacetOptions } from "../utils/searchUtils";
import { pathwayMetadata } from "../data/pathwayMetadata";

const globalFacetOptions = getGlobalFacetOptions(pathwayMetadata);

export const limitMinTempIncrease = Math.min(
  0,
  Math.floor(
    globalFacetOptions["temperatureOptions"].reduce((min, current) => {
      return current.value < min.value ? current : min;
    }).value,
  ),
);

export const limitMaxTempIncrease = Math.ceil(
  globalFacetOptions["temperatureOptions"].reduce((max, current) => {
    return current.value > max.value ? current : max;
  }).value * 1.1,
);
