import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PlotType, TimeSeries } from "./PlotSelector";
import NormalizedStackedAreaChart from "./NormalizedStackedAreaChart";
import MultiLineChart from "./MultiLineChart";
import VerticalBarChart from "./VerticalBarChart";
import { geographyLabel } from "../utils/geographyUtils";

const PLOT_OPTIONS: { value: PlotType; label: string }[] = [
  { value: "technologyMix", label: "Technology Mix" },
  { value: "absoluteEmissions", label: "Absolute Emissions" },
  { value: "emissionsIntensity", label: "Emissions Intensity" },
  { value: "capacity", label: "Capacity" },
  { value: "generation", label: "Generation" },
];

// Width/height per panel depending on how many pathways are compared
const CHART_DIMS: Record<number, { width: number; height: number }> = {
  2: { width: 400, height: 240 },
  3: { width: 270, height: 200 },
};

function hasDataForMetric(data: TimeSeries | null, metric: string): boolean {
  if (!data?.data) return false;
  const filtered = data.data.filter((d) => d.metric === metric);
  if (filtered.length === 0) return false;
  return new Set(filtered.map((d) => d.year)).size > 1;
}

// ── Single pathway plot panel ────────────────────────────────────────────────

interface PlotPanelProps {
  timeseriesdata: TimeSeries | null;
  datasetId?: string;
  plotType: PlotType;
  dims: { width: number; height: number };
}

const PlotPanel: React.FC<PlotPanelProps> = ({
  timeseriesdata,
  datasetId,
  plotType,
  dims,
}) => {
  const availableGeographies = useMemo(() => {
    if (!timeseriesdata?.data) return [];
    return Array.from(
      new Set(timeseriesdata.data.map((d) => d.geography).filter(Boolean)),
    );
  }, [timeseriesdata]);

  const [selectedGeography, setSelectedGeography] = useState<string>("");

  useEffect(() => {
    if (availableGeographies.length > 0) {
      setSelectedGeography(availableGeographies[0]);
    }
  }, [availableGeographies]);

  const filteredData = useMemo(() => {
    if (!timeseriesdata?.data || !selectedGeography) return { data: [] };
    return {
      data: timeseriesdata.data.filter(
        (d) => d.geography === selectedGeography,
      ),
    };
  }, [timeseriesdata, selectedGeography]);

  if (
    !timeseriesdata ||
    !hasDataForMetric(timeseriesdata, plotType) ||
    !selectedGeography
  ) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-rmigray-400 italic">
        No data available
      </div>
    );
  }

  const key = `${datasetId ?? ""}-${plotType}-${selectedGeography}`;

  const renderChart = () => {
    switch (plotType) {
      case "technologyMix":
        return (
          <NormalizedStackedAreaChart
            key={key}
            data={filteredData}
            width={dims.width}
            height={dims.height}
            sector="power"
            metric="technologyMix"
          />
        );
      case "absoluteEmissions":
        return (
          <VerticalBarChart
            key={key}
            data={filteredData}
            width={dims.width}
            height={dims.height}
            metric="absoluteEmissions"
          />
        );
      case "emissionsIntensity":
        return (
          <VerticalBarChart
            key={key}
            data={filteredData}
            width={dims.width}
            height={dims.height}
            metric="emissionsIntensity"
          />
        );
      case "capacity":
        return (
          <MultiLineChart
            key={key}
            data={filteredData}
            width={dims.width}
            height={dims.height}
            metric="capacity"
          />
        );
      case "generation":
        return (
          <MultiLineChart
            key={key}
            data={filteredData}
            width={dims.width}
            height={dims.height}
            metric="generation"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {availableGeographies.length > 1 && (
        <div className="mb-2">
          <label className="text-xs text-rmigray-500 mb-1 block">
            Geography
          </label>
          <select
            value={selectedGeography}
            onChange={(e) => setSelectedGeography(e.target.value)}
            className="block w-full rounded-md border-rmigray-300 shadow-sm focus:border-energy focus:ring-energy text-xs"
          >
            {availableGeographies.map((geo) => (
              <option
                key={geo}
                value={geo}
              >
                {geographyLabel(geo)}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="overflow-x-auto">{renderChart()}</div>
    </div>
  );
};

// ── Shared plot-type selector + N panels ─────────────────────────────────────

export interface ComparisonPlotsEntry {
  pathwayId: string;
  timeseriesdata: TimeSeries | null;
  datasetId?: string;
}

interface ComparisonPlotsProps {
  entries: ComparisonPlotsEntry[];
}

const ComparisonPlots: React.FC<ComparisonPlotsProps> = ({ entries }) => {
  const n = entries.length;
  const dims = CHART_DIMS[n] ?? CHART_DIMS[3];

  // Derive which plot types have data across any pathway
  const availablePlotOptions = useMemo(
    () =>
      PLOT_OPTIONS.filter((opt) =>
        entries.some((e) => hasDataForMetric(e.timeseriesdata, opt.value)),
      ),
    [entries],
  );

  const [selectedPlot, setSelectedPlot] = useState<PlotType>("technologyMix");

  // When available options change, ensure selection is valid
  useEffect(() => {
    if (
      availablePlotOptions.length > 0 &&
      !availablePlotOptions.find((o) => o.value === selectedPlot)
    ) {
      setSelectedPlot(availablePlotOptions[0].value);
    }
  }, [availablePlotOptions, selectedPlot]);

  const hasAnyData = availablePlotOptions.length > 0;

  const handlePlotChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedPlot(e.target.value as PlotType);
    },
    [],
  );

  return (
    <div
      className="grid gap-x-6"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, alignItems: "start" }}
    >
      {/* Shared plot-type selector — spans all pathway columns */}
      <div
        className="mb-4"
        style={{ gridColumn: "1 / -1" }}
      >
        {hasAnyData ? (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-rmigray-700 whitespace-nowrap">
              Plot type
            </label>
            <select
              value={selectedPlot}
              onChange={handlePlotChange}
              className="rounded-md border-rmigray-300 shadow-sm focus:border-energy focus:ring-energy sm:text-sm"
            >
              {availablePlotOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-sm text-rmigray-400 italic">
            No timeseries data available for these pathways.
          </p>
        )}
      </div>

      {/* N chart panels — auto-placed one per column */}
      {entries.map((entry) => (
        <div
          key={entry.pathwayId}
          className="min-w-0"
        >
          <PlotPanel
            timeseriesdata={entry.timeseriesdata}
            datasetId={entry.datasetId}
            plotType={selectedPlot}
            dims={dims}
          />
        </div>
      ))}
    </div>
  );
};

export default ComparisonPlots;
