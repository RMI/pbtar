import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Markdown from "../components/Markdown";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { Scenario } from "../types";
import { BadgeMaybeAbsent } from "../components/Badge";
import BadgeArray from "../components/BadgeArray";
import {
  geographyKind,
  geographyLabel,
  geographyVariant,
  normalizeGeography,
  sortGeographiesForDetails,
} from "../utils/geographyUtils";
import { ExternalLink, ArrowLeft } from "lucide-react";
import {
  getPathwayTypeTooltip,
  getSectorTooltip,
  getMetricTooltip,
} from "../utils/tooltipUtils";
import DownloadDataset from "../components/DownloadDataset";
import {
  fetchTimeseriesIndex,
  datasetsForPathway,
  summarizeSummary,
} from "../utils/timeseriesIndex";

const PathwayDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pathway, setPathway] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const foundPathway = pathwayMetadata.find((s) => s.id === id) || null;
      setPathway(foundPathway);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // Timeseries index state
  const [tsIndexLoaded, setTsIndexLoaded] = useState(false);
  const [datasets, setDatasets] = useState<
    Array<{
      datasetId: string;
      label?: string;
      path: string;
      summary?: unknown;
    }>
  >([]);

  useEffect(() => {
    let isMounted = true;

    const loadDatasets = async (): Promise<void> => {
      try {
        const idx = await fetchTimeseriesIndex();
        if (!isMounted) return;

        const pathwayId: string = pathway?.id ?? "";

        if (idx && pathwayId) {
          setDatasets(datasetsForPathway(idx, pathwayId));
        } else {
          setDatasets([]);
        }
        setTsIndexLoaded(true);
      } catch (err) {
        console.error("Failed to load timeseries index:", err);
      }
    };

    void loadDatasets(); // explicitly mark ignored promise to satisfy no-floating-promises
    return () => {
      isMounted = false;
    };
  }, [pathway]); // depend on the full object to avoid eslint warning

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-100 rounded w-96 mb-4"></div>
          <div className="h-4 bg-neutral-100 rounded w-64 mb-8"></div>
          <div className="h-32 bg-neutral-100 rounded w-full mb-4"></div>
          <div className="h-32 bg-neutral-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-rmigray-800 mb-4">
          Scenario Not Found
        </h2>
        <p className="text-rmigray-600 mb-6">
          The scenario you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/scenario"
          className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
        >
          <ArrowLeft
            size={16}
            className="mr-2"
          />
          Back to Scenarios
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/scenario"
        className="inline-flex items-center text-rmigray-600 hover:text-energy-700 mb-6 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="mr-1"
        />
        Back to scenarios
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-bluespruce p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {pathway.name}
          </h1>
          <p className="text-white mb-4">{pathway.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <BadgeMaybeAbsent
              tooltip={getPathwayTypeTooltip(pathway.pathwayType)}
              variant="pathwayType"
            >
              {pathway.pathwayType}
            </BadgeMaybeAbsent>
            <BadgeMaybeAbsent variant="year">
              {pathway.modelYearNetzero}
            </BadgeMaybeAbsent>
            <BadgeMaybeAbsent
              variant="temperature"
              toLabel={(t) => {
                const s = String(t);
                return s.endsWith("°C") ? s : `${s}°C`;
              }}
            >
              {pathway.modelTempIncrease}
            </BadgeMaybeAbsent>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
            <p className="mb-1 sm:mb-0">
              <span className="text-white">Publisher:</span> {pathway.publisher}
            </p>
            <p>
              <span className="text-white">Published:</span>{" "}
              {pathway.publicationYear}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
                  Expert Overview
                </h2>
                <div className="prose text-rmigray-700">
                  <Markdown>{pathway.expertOverview}</Markdown>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
                  Data Source
                </h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <div className="text-rmigray-700 mb-4 [&_a]:text-energy [&_a]:hover:text-energy-700">
                    <Markdown>{pathway.dataSource.description}</Markdown>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={pathway.dataSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
                    >
                      <ExternalLink
                        size={16}
                        className="mr-2"
                      />
                      Visit Source
                    </a>
                  </div>
                </div>
              </section>

              {tsIndexLoaded && datasets.length > 0 ? (
                <section className="mt-8">
                  <h3 className="text-sm font-semibold text-neutral-600 mb-3">
                    Related datasets
                  </h3>
                  <div className="grid gap-3">
                    {datasets.map((d) => {
                      const label = d.label ?? d.datasetId;
                      const summary = summarizeSummary(d.summary);
                      return (
                        <DownloadDataset
                          key={d.datasetId}
                          label={label}
                          href={d.path}
                          summary={summary}
                        />
                      );
                    })}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="md:col-span-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Key Features
                </h3>
                {(() => {
                  // Pretty labels for keys from schema (kept small & explicit to avoid surprises)
                  const LABELS: Record<keyof Scenario["keyFeatures"], string> =
                    {
                      emissionsPathway: "Emissions pathway",
                      energyEfficiency: "Energy efficiency",
                      energyDemand: "Energy demand",
                      electrification: "Electrification",
                      policyTypes: "Policy types",
                      technologyCostTrend: "Technology cost trend",
                      technologyDeploymentTrend: "Technology deployment trend",
                      emissionsScope: "Emissions scope",
                      policyAmbition: "Policy ambition",
                      technologyCostsDetail: "Technology costs detail",
                      newTechnologiesIncluded: "New technologies included",
                      supplyChain: "Supply chain",
                      investmentNeeds: "Investment needs",
                      infrastructureRequirements: "Infrastructure requirements",
                    };

                  return Object.entries(
                    pathway.keyFeatures as string | string[],
                  ).map(([rawKey, rawVal]) => {
                    const key = rawKey as keyof Scenario["keyFeatures"];
                    // Normalize to an array of strings for BadgeArray
                    const values = Array.isArray(rawVal) ? rawVal : [rawVal];
                    // Defensive guard for any accidental empties
                    const clean = values.filter((v): v is string =>
                      Boolean(v && String(v).trim()),
                    );
                    if (clean.length === 0) return null;

                    return (
                      <div
                        key={rawKey}
                        className="mb-3"
                      >
                        <p className="text-xs font-medium text-rmigray-500 mb-1">
                          {LABELS[key] ?? rawKey}
                        </p>
                        <BadgeArray
                          variant="keyFeature"
                          visibleCount={Infinity}
                        >
                          {clean}
                        </BadgeArray>
                      </div>
                    );
                  });
                })()}
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Geographies
                </h3>
                <BadgeArray
                  variant={sortGeographiesForDetails(
                    pathway.geography ?? [],
                  ).map(
                    (geo) => geographyVariant(geographyKind(geo)) as string,
                  )}
                  toLabel={(geo) => geographyLabel(normalizeGeography(geo))}
                  visibleCount={Infinity}
                >
                  {sortGeographiesForDetails(pathway.geography ?? [])}
                </BadgeArray>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Sectors
                </h3>
                {/* Sectors section with dynamic badge count */}
                <div className="mb-3">
                  <p className="text-xs font-medium text-rmigray-500 mb-1">
                    Sectors:
                  </p>
                  <BadgeArray
                    variant="sector"
                    tooltipGetter={getSectorTooltip}
                    visibleCount={Infinity}
                  >
                    {pathway.sectors.map((sector) => sector.name)}
                  </BadgeArray>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Benchmark Metrics
                </h3>
                <BadgeArray
                  variant="metric"
                  tooltipGetter={getMetricTooltip}
                  visibleCount={Infinity}
                >
                  {pathway.metric}
                </BadgeArray>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayDetailPage;
