import React, { useMemo, useRef, useState, useEffect, RefObject } from "react";
import { Link } from "react-router-dom";
import { Scenario } from "../types";
import Badge from "./Badge";
import { ChevronRight } from "lucide-react";
import HighlightedText from "./HighlightedText";
import { prioritizeMatches } from "../utils/sortUtils";
import TextWithTooltip from "./TextWithTooltip";

interface ScenarioCardProps {
  scenario: Scenario;
  searchTerm?: string;
}

type MaybeHTMLElement = HTMLElement | null;

// Custom hook to measure container width and calculate how many badges will fit
const useAvailableBadgeCount = (
  containerRef: RefObject<MaybeHTMLElement>,
  itemWidth = 100,
  gap = 8,
) => {
  const [availableBadgeCount, setAvailableBadgeCount] = useState(3); // Default to 3 as minimum

  useEffect(() => {
    if (!containerRef.current) return;

    const updateBadgeCount = () => {
      const containerWidth = containerRef.current?.clientWidth || 0;
      const possibleBadges = Math.floor(
        (containerWidth + gap) / (itemWidth + gap),
      );

      // Ensure we show at least 1 badge, and cap at a reasonable maximum (e.g., 8)
      const badgeCount = Math.max(1, Math.min(possibleBadges, 8));
      setAvailableBadgeCount(badgeCount);
    };

    // Calculate on mount
    updateBadgeCount();

    // Recalculate when window resizes
    const resizeObserver = new ResizeObserver(updateBadgeCount);
    const observedElement = containerRef.current;
    if (observedElement) {
      resizeObserver.observe(observedElement);
    }

    return () => {
      if (observedElement) {
        resizeObserver.unobserve(observedElement);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef, itemWidth, gap]);

  return availableBadgeCount;
};

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  searchTerm = "",
}) => {
  // Sort regions and sectors to prioritize matches
  const sortedRegions = useMemo(
    () => prioritizeMatches(scenario.regions, searchTerm),
    [scenario.regions, searchTerm],
  );

  const sortedSectors = useMemo(
    () => prioritizeMatches(scenario.sectors, searchTerm),
    [scenario.sectors, searchTerm],
  );

  // Refs for the container elements
  const regionsContainerRef = useRef<HTMLDivElement>(null);
  const sectorsContainerRef = useRef<HTMLDivElement>(null);

  // Calculate how many badges can fit in each container
  const regionBadgeWidth = 90; // Estimated average width of a region badge in pixels
  const sectorBadgeWidth = 80; // Estimated average width of a sector badge in pixels

  const visibleRegionsCount = useAvailableBadgeCount(
    regionsContainerRef,
    regionBadgeWidth,
  );
  const visibleSectorsCount = useAvailableBadgeCount(
    sectorsContainerRef,
    sectorBadgeWidth,
  );

  // Helper function to conditionally highlight text based on search term
  const highlightTextIfSearchMatch = (text: string) => {
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
          <h2 className="text-xl font-semibold text-bluespruce mb-2">
            <HighlightedText
              text={scenario.name}
              searchTerm={searchTerm}
            />
          </h2>
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
          <div className="flex flex-wrap">
            <Badge
              text={highlightTextIfSearchMatch(scenario.pathway_type)}
              tooltip={scenario.pathway_type_tooltip}
              variant="pathway_type"
            />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Targets:</p>
          <div className="flex flex-wrap">
            <Badge
              text={highlightTextIfSearchMatch(scenario.target_year)}
              variant="year"
            />
            {scenario.modeled_temperature_increase && (
              <Badge
                text={highlightTextIfSearchMatch(
                  `${scenario.modeled_temperature_increase.toString()}°C`,
                )}
                variant="temperature"
              />
            )}
          </div>
        </div>

        {/* Regions section with dynamic badge count */}
        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Regions:</p>
          <div
            className="flex flex-wrap"
            ref={regionsContainerRef}
          >
            {sortedRegions.slice(0, visibleRegionsCount).map((region) => (
              <Badge
                key={region}
                text={highlightTextIfSearchMatch(region)}
                variant="region"
              />
            ))}
            {scenario.regions.length > visibleRegionsCount && (
              <TextWithTooltip
                text={
                  <span className="text-xs text-rmigray-500 ml-1 self-center">
                    +{scenario.regions.length - visibleRegionsCount} more
                  </span>
                }
                tooltip={
                  <span>
                    {sortedRegions
                      .slice(visibleRegionsCount)
                      .map((region, idx) => (
                        <React.Fragment key={region}>
                          {idx > 0 && ", "}
                          <span className="whitespace-nowrap">{region}</span>
                        </React.Fragment>
                      ))}
                  </span>
                }
              />
            )}
          </div>
        </div>

        {/* Sectors section with dynamic badge count */}
        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Sectors:</p>
          <div
            className="flex flex-wrap"
            ref={sectorsContainerRef}
          >
            {sortedSectors.slice(0, visibleSectorsCount).map((sector) => (
              <Badge
                key={sector.name}
                text={highlightTextIfSearchMatch(sector.name)}
                tooltip={sector.tooltip}
                variant="sector"
              />
            ))}
            {scenario.sectors.length > visibleSectorsCount && (
              <TextWithTooltip
                text={
                  <span className="text-xs text-rmigray-500 ml-1 self-center">
                    +{scenario.sectors.length - visibleSectorsCount} more
                  </span>
                }
                tooltip={
                  <span>
                    {sortedSectors
                      .slice(visibleSectorsCount)
                      .map((sector, idx) => (
                        <React.Fragment key={sector.name}>
                          {idx > 0 && ", "}
                          <span className="whitespace-nowrap">
                            {sector.name}
                          </span>
                        </React.Fragment>
                      ))}
                  </span>
                }
              />
            )}
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
                  text={scenario.published_date}
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
