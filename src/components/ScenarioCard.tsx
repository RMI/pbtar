import React, { useMemo, useRef, useState, useEffect, RefObject } from "react";
import { Link } from "react-router-dom";
import Badge from "./Badge";
import TextWithTooltip from "./TextWithTooltip";
import { Scenario, PathwayType } from "../types";
import { ChevronRight } from "lucide-react";
import HighlightedText from "./HighlightedText";
import WorldCoverageMap from "./WorldCoverageMap";
import { prioritizeMatches } from "../utils/sortUtils";
import { getPathwayTypeTooltip, getSectorTooltip } from "../utils/tooltipUtils";
import { getSectorIcon } from "../utils/sectorIcons";

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

  const labelCls = "text-[10px] font-semibold tracking-wide text-rmigray-500 mb-1 uppercase";
  return (
    <div
  className="group relative bg-white radius-xl shadow-token-sm overflow-hidden flex flex-col h-full border border-neutral-200 transition-all transition-base ease-standard hover:shadow-token-md hover:-translate-y-0.5 focus-within:shadow-token-md focus-within:-translate-y-0.5 focus-within:ring-2 focus-within:ring-energy-400/60"
      aria-label={`Scenario: ${scenario.name}`}
    >
      {/* Accent bar using gradient token */}
      <div className="relative h-1 w-full bg-gradient-accent transition-base ease-standard">
        <span className="absolute inset-0 sheen-overlay opacity-0 group-hover:opacity-60 transition-opacity transition-slow ease-emphasized" />
      </div>
      <div className="p-5 flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-subtitle text-bluespruce mb-2">
            <HighlightedText
              text={scenario.name}
              searchTerm={searchTerm}
            />
          </h2>
          <p className="text-body text-rmigray-600 line-clamp-2" title={scenario.description}>
            <HighlightedText
              text={scenario.description}
              searchTerm={searchTerm}
            />
          </p>
        </div>

        {/* Unified grid so map aligns with top of Pathway Type */}
        <div className="mb-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 items-start">
          {/* Row 1 Left: Pathway Type */}
          <div>
            <p className={`text-section-label uppercase ${labelCls.replace(/text-\[10px].*/, '')}`}>Pathway Type</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                text={highlightTextIfSearchMatch(scenario.pathwayType)}
                tooltip={getPathwayTypeTooltip(
                  scenario.pathwayType as PathwayType,
                )}
                variant="pathwayType"
              />
            </div>
          </div>
          {/* Right column spanning rows 1-3: Map */}
          <div className="lg:row-span-3 lg:col-start-2 flex lg:justify-end">
            <WorldCoverageMap regions={scenario.regions} />
          </div>
          {/* Row 2 Left: Targets */}
          <div>
            <p className={`text-section-label uppercase ${labelCls.replace(/text-\[10px].*/, '')}`}>Targets</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                text={highlightTextIfSearchMatch(scenario.modelYearEnd)}
                variant="year"
              />
              {scenario.modelTempIncrease && (
                <Badge
                  text={highlightTextIfSearchMatch(
                    `${scenario.modelTempIncrease.toString()}°C`,
                  )}
                  variant="temperature"
                />
              )}
            </div>
          </div>
          {/* Row 3 Left: Regions */}
            <div>
              <p className={`text-section-label uppercase ${labelCls.replace(/text-\[10px].*/, '')}`}>Regions</p>
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
          {/* Row 4 (spanning both columns): Sectors */}
          <div className="lg:col-span-2">
            <p className={`text-section-label uppercase ${labelCls.replace(/text-\[10px].*/, '')}`}>Sectors</p>
            <div
              className="flex flex-wrap"
              ref={sectorsContainerRef}
            >
              {sortedSectors.slice(0, visibleSectorsCount).map((sector) => (
                <Badge
                  key={sector.name}
                  text={highlightTextIfSearchMatch(sector.name)}
                  tooltip={getSectorTooltip(sector.name)}
                  variant="sector"
                  icon={getSectorIcon(sector.name as any)}
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
        </div>

    <div className="mt-auto pt-3 border-t border-neutral-100">
          <div className="flex justify-between items-center">
            <div>
  <p className={`text-section-label uppercase mb-0.5`}>Publisher</p>
      <p className="text-sm font-medium text-rmigray-800 leading-snug">
                <HighlightedText
                  text={scenario.publisher}
                  searchTerm={searchTerm}
                />
              </p>
            </div>
            <div className="text-right">
  <p className={`text-section-label uppercase mb-0.5`}>Published</p>
      <p className="text-sm font-medium text-rmigray-800 leading-snug">
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
  className="relative inline-flex items-center gap-1 text-energy text-sm font-medium transition-all transition-fast ease-standard hover:text-energy-700 group-hover:translate-x-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-energy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-full px-2 py-1"
            >
      <span>View details</span>
  <ChevronRight size={16} className="transition-transform transition-fast ease-standard group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
