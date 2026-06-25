import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { PathwayMetadataType } from "../types";
import { useComparison } from "../context/ComparisonContext";
import {
  fetchTimeseriesIndex,
  datasetsForPathway,
} from "../utils/timeseriesIndex";
import { TimeSeries } from "../components/PlotSelector";
import {
  geographyKind,
  geographyLabel,
  geographyVariant,
  normalizeGeography,
  sortGeographiesForDetails,
} from "../utils/geographyUtils";
import BadgeArray from "../components/BadgeArray";
import Badge from "../components/Badge";
import getTemperatureColor from "../utils/getTemperatureColor";
import { getSectorTooltip, getMetricTooltip } from "../utils/tooltipUtils";
import ComparisonKeyFeatures from "../components/ComparisonKeyFeatures";
import ComparisonPlots, {
  ComparisonPlotsEntry,
} from "../components/ComparisonPlots";

// All known sectors in display order (union source)
const ALL_SECTORS = [
  "Agriculture",
  "Aviation",
  "Buildings",
  "Cement",
  "Chemicals",
  "Coal Mining",
  "Gas (Upstream)",
  "Industry",
  "Land Use",
  "Oil (Upstream)",
  "Power",
  "Rail",
  "Road Transport",
  "Shipping",
  "Steel",
  "Transport",
  "Other",
];

// ── Pathway summary card (compact) ──────────────────────────────────────────

const PathwaySummaryCard: React.FC<{ pathway: PathwayMetadataType }> = ({
  pathway,
}) => {
  const formattedTemp = pathway.modelTempIncrease
    ? `${pathway.modelTempIncrease}°C`
    : null;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col h-full">
      {/* Type / temp / net-zero header bar */}
      <div className="flex items-stretch">
        <div className="px-4 py-2 bg-neutral-100 flex-grow flex items-center min-w-0">
          <span className="text-xs font-medium text-rmigray-700 uppercase truncate">
            {pathway.pathwayType} Pathway
          </span>
        </div>
        <div className="flex items-stretch">
          {formattedTemp && (
            <div
              className={`px-3 py-2 flex items-center justify-center ${getTemperatureColor(pathway.modelTempIncrease)}`}
            >
              <span className="text-xs font-medium text-rmigray-700">
                {formattedTemp}
              </span>
            </div>
          )}
          {pathway.modelYearNetzero && (
            <div className="px-3 py-2 flex items-center bg-rmiblue-100">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-rmigray-600 leading-tight whitespace-nowrap">
                  Net Zero By
                </span>
                <span className="text-xs font-medium text-rmigray-700">
                  {pathway.modelYearNetzero}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-bluespruce mb-1.5 leading-snug">
          {(pathway.publication.publisher.short ??
            pathway.publication.publisher.full) +
            ": " +
            pathway.name.full}
        </h3>
        <p className="text-xs text-rmigray-600 line-clamp-3 mb-3">
          {pathway.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2 text-xs text-rmigray-500">
            <span>
              Publication:{" "}
              <span className="font-medium text-rmigray-700">
                {pathway.publication.title.short ??
                  pathway.publication.title.full}
              </span>
            </span>
            <span>{pathway.publication.year}</span>
          </div>
          <Link
            to={`/pathway/${pathway.id}`}
            className="bg-rmiblue-100 hover:bg-rmiblue-200 transition-colors h-9 flex items-center justify-center w-full rounded-sm"
          >
            <span className="text-xs text-bluespruce font-medium">
              View Details
            </span>
            <ChevronRight
              size={14}
              className="ml-1 text-bluespruce"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Sectors comparison: union of all sectors, yellow = included, grey = not ──

interface ComparisonSectorsProps {
  pathways: PathwayMetadataType[];
}

const ComparisonSectors: React.FC<ComparisonSectorsProps> = ({ pathways }) => {
  // Union of all sector names across compared pathways
  const unionSectors = useMemo(() => {
    const present = new Set<string>();
    pathways.forEach((p) => p.sectors.forEach((s) => present.add(s.name)));
    return ALL_SECTORS.filter((s) => present.has(s));
  }, [pathways]);

  const n = pathways.length;

  return (
    <div
      className="grid gap-x-6"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {unionSectors.map((sectorName) =>
        pathways.map((pathway, i) => {
          const hasIt = pathway.sectors.some((s) => s.name === sectorName);
          return (
            <div
              key={`${sectorName}-${i}`}
              className="pb-1"
            >
              <Badge
                variant={hasIt ? "sector" : "default"}
                tooltip={hasIt ? getSectorTooltip(sectorName) : undefined}
              >
                {sectorName}
              </Badge>
            </div>
          );
        }),
      )}
    </div>
  );
};

// ── Geographies: one BadgeArray per pathway column ───────────────────────────

interface ComparisonGeographiesProps {
  pathways: PathwayMetadataType[];
}

const ComparisonGeographies: React.FC<ComparisonGeographiesProps> = ({
  pathways,
}) => (
  <>
    {pathways.map((pathway) => {
      const sorted = sortGeographiesForDetails(pathway.geography ?? []);
      return (
        <div
          key={pathway.id}
          className="min-w-0"
        >
          <BadgeArray
            variant={sorted.map(
              (geo) => geographyVariant(geographyKind(geo)) as string,
            )}
            toLabel={(geo) => geographyLabel(normalizeGeography(geo ?? ""))}
            visibleCount={Infinity}
          >
            {sorted}
          </BadgeArray>
        </div>
      );
    })}
  </>
);

// ── Section heading that spans all columns ───────────────────────────────────

const SectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div
    className="mt-6 mb-3 pb-2 border-b border-neutral-200"
    style={{ gridColumn: "1 / -1" }}
  >
    <h2 className="text-base font-semibold text-rmigray-800">{children}</h2>
  </div>
);

// ── Column heading (pathway name in its column) ───────────────────────────────

const ColumnHeading: React.FC<{ pathway: PathwayMetadataType }> = ({
  pathway,
}) => (
  <h3 className="text-xs font-semibold text-rmigray-500 mb-2 uppercase tracking-wide truncate">
    {pathway.publication.publisher.short ?? pathway.publication.publisher.full}
  </h3>
);

// ── Main page ────────────────────────────────────────────────────────────────

const ComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { setComparedPathwayIds } = useComparison();

  // Parse IDs from URL — the source of truth for which pathways to compare
  const ids = useMemo(() => {
    const raw = searchParams.get("ids");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }, [searchParams]);

  // Sync URL IDs back into context so the ribbon stays current
  useEffect(() => {
    if (ids.length >= 2) {
      setComparedPathwayIds(ids);
    }
  }, [ids, setComparedPathwayIds]);

  const pathways = useMemo(
    () =>
      ids
        .map((id) => pathwayMetadata.find((p) => p.id === id))
        .filter((p): p is PathwayMetadataType => p !== undefined),
    [ids],
  );

  const n = pathways.length;

  // Timeseries data state: one entry per pathway
  const [plotEntries, setPlotEntries] = useState<ComparisonPlotsEntry[]>([]);

  useEffect(() => {
    if (pathways.length === 0) return;
    let cancelled = false;

    const load = async () => {
      const idx = await fetchTimeseriesIndex();
      const results = await Promise.all(
        pathways.map(async (p) => {
          const datasets = datasetsForPathway(idx, p.id);
          if (datasets.length === 0) {
            return {
              pathwayId: p.id,
              timeseriesdata: null,
              datasetId: undefined,
            };
          }
          const first = datasets[0];
          try {
            const resp = await fetch(first.path.replace(/\.csv$/, ".json"));
            const data: TimeSeries = resp.ok
              ? ((await resp.json()) as TimeSeries)
              : { data: [] };
            return {
              pathwayId: p.id,
              timeseriesdata: data,
              datasetId: first.datasetId,
            };
          } catch {
            return {
              pathwayId: p.id,
              timeseriesdata: null,
              datasetId: first.datasetId,
            };
          }
        }),
      );
      if (!cancelled) setPlotEntries(results);
    };

    void load();
    return () => {
      cancelled = true;
    };
    // depend on stable joined string so this only re-runs when pathway set changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathways.map((p) => p.id).join(",")]);

  // Guard: need at least 2 valid pathways
  if (ids.length < 2) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-rmigray-600 mb-4">
          Select at least 2 pathways to compare.
        </p>
        <Link
          to="/pathway"
          className="inline-flex items-center text-bluespruce hover:text-energy"
        >
          <ArrowLeft
            size={16}
            className="mr-1"
          />
          Back to pathways
        </Link>
      </div>
    );
  }

  const colClass =
    n === 2 ? "grid grid-cols-2 gap-6" : "grid grid-cols-3 gap-6";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        to="/pathway"
        className="inline-flex items-center text-rmigray-600 hover:text-energy-700 mb-6 transition-colors"
      >
        <ArrowLeft
          size={16}
          className="mr-1"
        />
        Back to pathways
      </Link>

      {/* ── Pathway summary cards ── */}
      <div className={colClass}>
        {pathways.map((p) => (
          <PathwaySummaryCard
            key={p.id}
            pathway={p}
          />
        ))}
      </div>

      {/* ── Key Features (subgrid-aligned) ── */}
      <div
        className="grid gap-x-6 mt-8"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        <SectionHeading>Key Features</SectionHeading>
        {/* Span all columns so ComparisonKeyFeatures's own N-column grid fills full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <ComparisonKeyFeatures pathways={pathways} />
        </div>
      </div>

      {/* ── Benchmark Metric Plots ── */}
      <div
        className="grid gap-x-6 mt-8"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        <SectionHeading>Benchmark Metric Plots</SectionHeading>
        {/* Span all columns so ComparisonPlots's own N-column grid fills full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <ComparisonPlots entries={plotEntries} />
        </div>
      </div>

      {/* ── Benchmark Metrics (badge arrays) ── */}
      <div
        className="grid gap-x-6 mt-8"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        <SectionHeading>Benchmark Metrics</SectionHeading>
        {pathways.map((p) => (
          <div
            key={p.id}
            className="min-w-0"
          >
            <ColumnHeading pathway={p} />
            <BadgeArray
              variant="metric"
              tooltipGetter={getMetricTooltip}
              visibleCount={Infinity}
            >
              {p.metric}
            </BadgeArray>
          </div>
        ))}
      </div>

      {/* ── Geographies ── */}
      <div
        className="grid gap-x-6 mt-8"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        <SectionHeading>Geographies</SectionHeading>
        <ComparisonGeographies pathways={pathways} />
      </div>

      {/* ── Sectors ── */}
      <div
        className="grid gap-x-6 mt-8"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        <SectionHeading>Sectors</SectionHeading>
        {/* Column headings */}
        {pathways.map((p) => (
          <ColumnHeading
            key={p.id}
            pathway={p}
          />
        ))}
        {/* Sector rows: union, yellow = covered, grey = not — span all columns so
            ComparisonSectors's own N-column grid fills full width */}
        <div style={{ gridColumn: "1 / -1" }}>
          <ComparisonSectors pathways={pathways} />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
