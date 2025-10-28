import { scenariosData } from "../data/scenariosData";

export const getUniqueFilterValues = () => {
    const pathwayTypes = new Set<string>();
    const targetYears = new Set<number>();
    const temperatures = new Set<number>();
    const geographies = new Set<string>();
    const sectors = new Set<string>();
    const metrics = new Set<string>();

    scenariosData.forEach((scenario) => {
        if (scenario.pathwayType) pathwayTypes.add(scenario.pathwayType);
        if (scenario.modelYearNetzero) targetYears.add(scenario.modelYearNetzero);
        if (scenario.modelTempIncrease) temperatures.add(scenario.modelTempIncrease);
        scenario.geography.forEach((geo) => geographies.add(geo));
        scenario.sectors.forEach((sector) => sectors.add(sector.name));
        scenario.metric.forEach((metric) => metrics.add(metric));
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
