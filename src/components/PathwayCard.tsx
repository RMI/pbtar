import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import BadgeArray from "./BadgeArray";
import {
  geographyKind,
  geographyLabel,
  geographyVariant,
  normalizeGeography,
  sortGeographiesForDetails,
} from "../utils/geographyUtils";
import { PathwayMetadataType } from "../types";
import { ChevronRight } from "lucide-react";
import HighlightedText from "./HighlightedText";
import { prioritizeMatches, prioritizeGeographies } from "../utils/sortUtils";
import { getSectorTooltip, getMetricTooltip } from "../utils/tooltipUtils";

interface PathwayCardProps {
  pathway: PathwayMetadataType;
  searchTerm?: string;
}

const getTemperatureColor = (temp: number): string => {
  // Define temperature ranges and corresponding colors
  // Using colors from the style guide
  if (temp <= 1.5) return "bg-pinishgreen-100"; // Yellowish
  if (temp <= 2.0) return "bg-solar-100";
  if (temp <= 2.5) return "bg-solar-200";
  if (temp <= 3.0) return "bg-rmired-100"; // Orange
  if (temp <= 3.5) return "bg-rmired-200";
  return "bg-rmired-400"; // Red for higher temperatures
};

const PathwayCard: React.FC<PathwayCardProps> = ({
  pathway,
  searchTerm = "",
}) => {
  // Sort geography and sectors to prioritize matches
  const sortedGeography = useMemo(
    () =>
      prioritizeGeographies(
        sortGeographiesForDetails(pathway.geography),
        searchTerm,
      ),
    [pathway.geography, searchTerm],
  );

  const sortedSectors = useMemo(
    () => prioritizeMatches(pathway.sectors, searchTerm),
    [pathway.sectors, searchTerm],
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

  // Format temperature with °C
  const formattedTemp = pathway.modelTempIncrease
    ? `${pathway.modelTempIncrease}°C`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
      <div className="flex items-stretch">
        <div className="px-5 py-3 bg-neutral-100 flex-grow flex items-center">
          <span className="text-sm font-medium text-rmigray-700 uppercase">
            {highlightTextIfSearchMatch(pathway.pathwayType)} Pathway
          </span>
        </div>
        <div className="flex items-stretch h-[44px]">
          {" "}
          {/* Fixed height container */}
          {formattedTemp ? (
            <div
              className={`px-5 py-3 flex items-center justify-center ${getTemperatureColor(pathway.modelTempIncrease)}`}
            >
              <span className="text-sm font-medium text-rmigray-700">
                {highlightTextIfSearchMatch(formattedTemp)}
              </span>
            </div>
          ) : null}
          {pathway.modelYearNetzero ? (
            <div className="px-5 py-3 flex items-center bg-rmiblue-100">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-rmigray-600 leading-tight h-[14px]">
                  Net Zero By
                </span>
                <span className="text-sm font-medium text-rmigray-700">
                  {highlightTextIfSearchMatch(pathway.modelYearNetzero)}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5 flex flex-col h-full">
        <div className="mb-4">
          <Link to={`/pathway/${pathway.id}`}>
            <h2 className="text-xl font-semibold text-bluespruce mb-2">
              <HighlightedText
                text={pathway.name}
                searchTerm={searchTerm}
              />
            </h2>
          </Link>
          <p className="text-rmigray-600 text-sm line-clamp-2">
            <HighlightedText
              text={pathway.description}
              searchTerm={searchTerm}
            />
          </p>
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
              {pathway.metric}
            </BadgeArray>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-rmigray-500">Publisher:</p>
                  <p className="text-sm font-medium text-rmigray-800">
                    <HighlightedText
                      text={
                        pathway.publication.publisher.short ||
                        pathway.publication.publisher.full
                      }
                      searchTerm={searchTerm}
                    />
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rmigray-500">Published:</p>
                  <p className="text-sm font-medium text-rmigray-800">
                    <HighlightedText
                      text={pathway.publication.year}
                      searchTerm={searchTerm}
                    />
                  </p>
                </div>
              </div>
            </div>
            <Link
              to={`/pathway/${pathway.id}`}
              className="bg-rmiblue-100 hover:bg-rmiblue-200 transition-colors duration-200 h-12 flex items-center justify-center w-full"
            >
              <span className="text-bluespruce font-medium">View Details</span>
              <ChevronRight
                size={20}
                className="ml-2 text-bluespruce"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathwayCard;
