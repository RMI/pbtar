import React, { useCallback, useEffect, useState, useMemo } from "react";
import NormalizedStackedAreaChart from "./NormalizedStackedAreaChart";
import MultiLineChart from "./MultiLineChart";
import VerticalBarChart from "./VerticalBarChart";

interface DataPoint {
  sector: string;
  metric: string;
  year: string;
  technology: string;
  value: number;
  unit: string;
}

interface TimeSeries {
  data: DataPoint[];
}

type PlotType =
  | "composition"
  | "emissionsVolume"
  | "emissionsEfficiency"
  | "supply";

const PLOT_OPTIONS = [
  { value: "composition", label: "Energy Composition" },
  { value: "emissionsVolume", label: "Emissions Volume" },
  { value: "emissionsEfficiency", label: "Emissions Efficiency" },
  { value: "supply", label: "Supply" },
] as const;

interface PlotSelectorProps {
  timeseriesdata: TimeSeries | null;
  datasetId?: string;
  className?: string;
}

export const PlotSelector: React.FC<PlotSelectorProps> = ({
  timeseriesdata,
  datasetId,
  className = "",
}) => {
  const [selectedPlot, setSelectedPlot] = useState<PlotType>("composition");

  // Helper function to check if data exists for a specific metric
  const hasDataForMetric = useCallback(
    (data: TimeSeries | null, metric: string): boolean => {
      if (!data?.data) return false;
      return data.data.some((d) => d.metric === metric);
    },
    [],
  );

  // Helper function to get available plot options based on data
  const getAvailablePlotOptions = useCallback(
    (data: TimeSeries | null): (typeof PLOT_OPTIONS)[number][] => {
      if (!data) return [];

      return PLOT_OPTIONS.filter((option) => {
        switch (option.value) {
          case "composition":
            return hasDataForMetric(data, "capacity");
          case "emissionsVolume":
            return hasDataForMetric(data, "absoluteEmissions");
          case "emissionsEfficiency":
            return hasDataForMetric(data, "emissionsIntensity");
          case "supply":
            return hasDataForMetric(data, "capacity");
          default:
            return false;
        }
      });
    },
    [hasDataForMetric],
  );

  // Memoize the available options
  const availablePlotOptions = useMemo(
    () => getAvailablePlotOptions(timeseriesdata),
    [timeseriesdata, getAvailablePlotOptions]
  );

  // Update selected plot if current selection becomes invalid
  useEffect(() => {
    if (timeseriesdata && availablePlotOptions.length > 0) {
      if (!availablePlotOptions.find((opt) => opt.value === selectedPlot)) {
        setSelectedPlot(availablePlotOptions[0].value);
      }
    }
  }, [timeseriesdata, selectedPlot, availablePlotOptions]);

  if (!timeseriesdata || availablePlotOptions.length === 0) {
    return null;
  }

  const renderPlot = () => {
    if (!timeseriesdata) return null;

    switch (selectedPlot) {
      case "composition":
        return (
          <div className="flex flex-col items-center">
            <NormalizedStackedAreaChart
              key={`${datasetId}-composition`}
              data={timeseriesdata}
              width={450}
              height={300}
            />
          </div>
        );
      case "emissionsVolume":
        return (
          <div className="flex flex-col items-center">
            <VerticalBarChart
              key={`${datasetId}-emissions-volume`}
              data={timeseriesdata}
              width={450}
              height={300}
              metric="absoluteEmissions"
            />
          </div>
        );
      case "emissionsEfficiency":
        return (
          <div className="flex flex-col items-center">
            <VerticalBarChart
              key={`${datasetId}-emissions-efficiency`}
              data={timeseriesdata}
              width={450}
              height={300}
              metric="emissionsIntensity"
            />
          </div>
        );
      case "supply":
        return (
          <div className="flex flex-col items-center">
            <MultiLineChart
              key={`${datasetId}-supply`}
              data={timeseriesdata}
              width={450}
              height={300}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!timeseriesdata || getAvailablePlotOptions(timeseriesdata).length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-neutral-50 border border-neutral-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex flex-col mb-4">
        <label
          htmlFor="plot-select"
          className="text-sm font-medium text-rmigray-700 mb-2"
        >
          Select Plot
        </label>
        <select
          id="plot-select"
          value={selectedPlot}
          onChange={(e) => setSelectedPlot(e.target.value as PlotType)}
          className="block w-full rounded-md border-rmigray-300 shadow-sm focus:border-energy focus:ring-energy sm:text-sm"
        >
          {getAvailablePlotOptions(timeseriesdata).map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">{renderPlot()}</div>
    </div>
  );
};

export type { TimeSeries, DataPoint };
