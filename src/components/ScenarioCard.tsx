import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { BadgeMaybeAbsent } from "./Badge";
import BadgeArray from "./BadgeArray";
import {
  geographyKind,
  geographyLabel,
  geographyVariant,
  normalizeGeography,
  sortGeographiesForDetails,
} from "../utils/geographyUtils";
import { Scenario } from "../types";
import { ChevronRight } from "lucide-react";
import HighlightedText from "./HighlightedText";
import { prioritizeMatches, prioritizeGeographies } from "../utils/sortUtils";
import {
  getPathwayTypeTooltip,
  getSectorTooltip,
  getMetricTooltip,
} from "../utils/tooltipUtils";

interface ScenarioCardProps {
  scenario: Scenario;
  searchTerm?: string;
}

// Custom hook to measure container width and calculate how many badges will fit

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  searchTerm = "",
}) => {
  // Sort geography and sectors to prioritize matches
  const sortedGeography = useMemo(
    () =>
      prioritizeGeographies(
        sortGeographiesForDetails(scenario.geography),
        searchTerm,
      ),
    [scenario.geography, searchTerm],
  );

  const sortedSectors = useMemo(
    () => prioritizeMatches(scenario.sectors, searchTerm),
    [scenario.sectors, searchTerm],
  );

  // Helper function to conditionally highlight text based on search term
  const highlightTextIfSearchMatch = (
    value: string | number | undefined | null | boolean,
  ) => {
    // If value is null or undefined, return empty string, otherwise cast to string.
    const text = value == null ? "" : String(value);

    // If there's a search term and it matches the text
    if (searchTerm && text.toLowerCase().includes(searchTerm.toLowerCase())) {
      return (
        <HighlightedText
          text={text}
          searchTerm={searchTerm}
        />
      );
    }
    // Otherwise return the plain text
    return text;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
      <div className="p-5 flex flex-col h-full">
        <div className="mb-4">
          <Link to={`/scenario/${scenario.id}`}>
            <h2 className="text-xl font-semibold text-bluespruce mb-2">
              <HighlightedText
                text={scenario.name}
                searchTerm={searchTerm}
              />
            </h2>
          </Link>
          <p className="text-rmigray-600 text-sm line-clamp-2">
            <HighlightedText
              text={scenario.description}
              searchTerm={searchTerm}
            />
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">
            Pathway type:
          </p>
          <div className="flex flex-wrap gap-2">
            <BadgeMaybeAbsent
              tooltip={getPathwayTypeTooltip(scenario.pathwayType)}
              variant="pathwayType"
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
            >
              {scenario.pathwayType}
            </BadgeMaybeAbsent>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Targets:</p>
          <div className="flex flex-wrap">
            <BadgeMaybeAbsent
              variant="year"
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
            >
              {scenario.modelYearNetzero}
            </BadgeMaybeAbsent>
            <BadgeMaybeAbsent
              variant="temperature"
              toLabel={(t) => {
                const s = String(t);
                return s.endsWith("°C") ? s : `${s}°C`;
              }}
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
            >
              {scenario.modelTempIncrease}
            </BadgeMaybeAbsent>
          </div>
        </div>

        {/* Geographies section with dynamic badge count */}
        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">
            Geographies:
          </p>
          <div className="flex flex-wrap">
            <BadgeArray
              variant={sortedGeography.map(
                (geo) => geographyVariant(geographyKind(geo)) as string,
              )}
              toLabel={(geo) => geographyLabel(normalizeGeography(geo))}
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
              maxRows={2}
            >
              {sortedGeography}
            </BadgeArray>
          </div>
        </div>

        {/* Sectors section with dynamic badge count */}
        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Sectors:</p>
          <div className="flex flex-wrap">
            <BadgeArray
              variant="sector"
              tooltipGetter={getSectorTooltip}
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
              maxRows={2}
            >
              {sortedSectors.map((sector) => sector.name)}
            </BadgeArray>
          </div>
        </div>

        {/* Metrics section with dynamic badge count */}
        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">
            Benchmark Metrics:
          </p>
          <div className="flex flex-wrap">
            <BadgeArray
              variant="metric"
              tooltipGetter={getMetricTooltip}
              renderLabel={(label) => highlightTextIfSearchMatch(label)}
              maxRows={2}
            >
              {scenario.metric}
            </BadgeArray>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-rmigray-500">Publisher:</p>
              <p className="text-sm font-medium text-rmigray-800">
                <HighlightedText
                  text={scenario.publisher}
                  searchTerm={searchTerm}
                />
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-rmigray-500">Published:</p>
              <p className="text-sm font-medium text-rmigray-800">
                <HighlightedText
                  text={scenario.publicationYear}
                  searchTerm={searchTerm}
                />
              </p>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <Link
              to={`/scenario/${scenario.id}`}
              className="text-energy text-sm font-medium flex items-center transition-colors duration-200 hover:text-energy-700"
            >
              <span className="flex items-center">
                View details
                <ChevronRight
                  size={16}
                  className="ml-1"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
