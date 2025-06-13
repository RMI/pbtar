import React from "react";
import { Link } from "react-router-dom";
import { Scenario } from "../types";
import Badge from "./Badge";
import { ChevronRight } from "lucide-react";

interface ScenarioCardProps {
  scenario: Scenario;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
      <div className="p-5 flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-bluespruce mb-2">
            {scenario.name}
          </h2>
          <p className="text-rmigray-600 text-sm line-clamp-2">
            {scenario.description}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Category:</p>
          <div className="flex flex-wrap">
            <Badge
              text={scenario.category}
              variant="category"
            />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Targets:</p>
          <div className="flex flex-wrap">
            <Badge
              text={scenario.target_year}
              variant="year"
            />
            <Badge
              text={scenario.target_temperature}
              variant="temperature"
            />
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-rmigray-500 mb-1">Regions:</p>
          <div className="flex flex-wrap">
            {scenario.regions.slice(0, 3).map((region) => (
              <Badge
                key={region}
                text={region}
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
            {scenario.sectors.slice(0, 3).map((sector, index) => (
              <Badge
                key={index}
                text={sector}
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
                {scenario.publisher}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-rmigray-500">Published:</p>
              <p className="text-sm font-medium text-rmigray-800">
                {scenario.published_date}
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
