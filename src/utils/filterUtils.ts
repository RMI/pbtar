import { pathwayMetadata } from "../data/pathwayMetadata";

export const getUniqueFilterValues = () => {
    const pathwayTypes = new Set<string>();
    const targetYears = new Set<number>();
    const temperatures = new Set<number>();
    const geographies = new Set<string>();
    const sectors = new Set<string>();
    const metrics = new Set<string>();

    pathwayMetadata.forEach((pathway) => {
        if (pathway.pathwayType) pathwayTypes.add(pathway.pathwayType);
        if (pathway.modelYearNetzero) targetYears.add(pathway.modelYearNetzero);
        if (pathway.modelTempIncrease) temperatures.add(pathway.modelTempIncrease);
        pathway.geography.forEach((geo) => geographies.add(geo));
        pathway.sectors.forEach((sector) => sectors.add(sector.name));
        pathway.metric.forEach((metric) => metrics.add(metric));
    });

    return {
        pathwayTypes: Array.from(pathwayTypes).sort(),
        targetYears: Array.from(targetYears).sort(),
        temperatures: Array.from(temperatures).sort(),
        geographies: Array.from(geographies).sort(),
        sectors: Array.from(sectors).sort(),
        metrics: Array.from(metrics).sort(),
    };
};
