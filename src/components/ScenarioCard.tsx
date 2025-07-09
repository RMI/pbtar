import React from "react";
import { Link } from "react-router-dom";
import { Scenario } from "../types";
import Badge from "./Badge";
import { ChevronRight } from "lucide-react";
import HighlightedText from "./HighlightedText";

interface ScenarioCardProps {
  scenario: Scenario;
  searchTerm?: string;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  searchTerm = "",
}) => {
  // Function to prioritize items that match the search term
  const prioritizeMatches = <T extends string | { name: string }>(
    items: T[],
    searchTerm: string
  ): T[] => {
    if (!searchTerm.trim()) return items;
    
    return [...items].sort((a, b) => {
      const textA = typeof a === 'string' ? a : a.name;
      const textB = typeof b === 'string' ? b : b.name;
      
      const matchesA = textA.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesB = textB.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (matchesA && !matchesB) return -1;
      if (!matchesA && matchesB) return 1;
      return 0;
    });
  };
  
  // Sort regions and sectors to prioritize matches
  const sortedRegions = prioritizeMatches(scenario.regions, searchTerm);
  const sortedSectors = prioritizeMatches(scenario.sectors, searchTerm);

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
          <p className="text-xs font-medium text-rmigray-500 mb-1">Category:</p>
          <div className="flex flex-wrap">
            <Badge
              text={
                searchTerm &&
                scenario.category
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ? (
                  <HighlightedText
                    text={scenario.category}
                    searchTerm={searchTerm}
                  />
                ) : (
                  scenario.category
                )
              }
              tooltip={scenario.category_tooltip}
              variant="category"
            />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Targets:</p>
          <div className="flex flex-wrap">
            <Badge
              text={
                searchTerm &&
                scenario.target_year
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ? (
                  <HighlightedText
                    text={scenario.target_year}
                    searchTerm={searchTerm}
                  />
                ) : (
                  scenario.target_year
                )
              }
              variant="year"
            />
            <Badge
              text={
                searchTerm &&
                scenario.target_temperature
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()) ? (
                  <HighlightedText
                    text={scenario.target_temperature}
                    searchTerm={searchTerm}
                  />
                ) : (
                  scenario.target_temperature
                )
              }
              variant="temperature"
            />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Regions:</p>
          <div className="flex flex-wrap">
            {sortedRegions.slice(0, 3).map((region) => (
              <Badge
                key={region}
                text={
                  searchTerm &&
                  region.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <HighlightedText
                      text={region}
                      searchTerm={searchTerm}
                    />
                  ) : (
                    region
                  )
                }
                variant="region"
              />
            ))}
            {scenario.regions.length > 3 && (
              <span className="text-xs text-rmigray-500 ml-1 self-center">
                +{scenario.regions.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Sectors:</p>
          <div className="flex flex-wrap">
            {sortedSectors.slice(0, 3).map((sector) => (
              <Badge
                key={sector.name}
                text={
                  searchTerm &&
                  sector.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ? (
                    <HighlightedText
                      text={sector.name}
                      searchTerm={searchTerm}
                    />
                  ) : (
                    sector.name
                  )
                }
                tooltip={sector.tooltip}
                variant="sector"
              />
            ))}
            {scenario.sectors.length > 3 && (
              <span className="text-xs text-rmigray-500 ml-1 self-center">
                +{scenario.sectors.length - 3} more
              </span>
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
