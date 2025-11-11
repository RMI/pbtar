import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  GitFork,
  Thermometer,
  Earth,
  Factory,
  ChevronUp,
  ChevronDown,
  Timer,
  Ruler,
} from "lucide-react";
import { SearchFilters } from "../types";
import { getUniqueFilterValues } from "../utils/filterUtils";

export interface FilterStep {
  id: keyof SearchFilters;
  title: string;
  description: string;
  icon: React.ReactNode;
  options: Array<{
    id: string;
    title: string;
    value: string | number;
  }>;
}

interface StepByStepGuideProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | number>("home");
  const filterValues = getUniqueFilterValues();

  const steps: FilterStep[] = [
    {
      id: "pathwayType",
      title: "Pathway Type",
      description:
        "Different pathway types tell different stories about the future.",
      icon: <GitFork className="h-8 w-8" />,
      options: filterValues.pathwayTypes.map((type) => ({
        id: type,
        title: type,
        value: type,
      })),
    },
    {
      id: "modelYearNetzero",
      title: "Target Year",
      description: "Choose pathways based on their target net-zero year.",
      icon: <Timer className="h-8 w-8" />,
      options: filterValues.targetYears.map((year) => ({
        id: year.toString(),
        title: year.toString(),
        value: year,
      })),
    },
    {
      id: "modelTempIncrease",
      title: "Temperature Outcome",
      description:
        "Choose pathways aligned with different temperature outcomes.",
      icon: <Thermometer className="h-8 w-8" />,
      options: filterValues.temperatures.map((temp) => ({
        id: temp.toString(),
        title: `${temp}°C`,
        value: temp,
      })),
    },
    {
      id: "geography",
      title: "Geography",
      description: "Select pathways for specific geographical areas.",
      icon: <Earth className="h-8 w-8" />,
      options: filterValues.geographies.map((geo) => ({
        id: geo,
        title: geo,
        value: geo,
      })),
    },
    {
      id: "sector",
      title: "Sector",
      description: "Focus on pathways covering specific economic sectors.",
      icon: <Factory className="h-8 w-8" />,
      options: filterValues.sectors.map((sector) => ({
        id: sector,
        title: sector,
        value: sector,
      })),
    },
    {
      id: "metric",
      title: "Benchmark Metric",
      description: "Choose pathways with specific benchmark indicators.",
      icon: <Ruler className="h-8 w-8" />,
      options: filterValues.metrics.map((metric) => ({
        id: metric,
        title: metric,
        value: metric,
      })),
    },
  ];

  const handleOptionSelect = (
    stepId: keyof SearchFilters,
    optionValue: string | number,
  ) => {
    const newFilters = { ...filters };

    // Convert string values to numbers for numeric fields
    const value =
      stepId === "modelYearNetzero" || stepId === "modelTempIncrease"
        ? Number(optionValue)
        : optionValue;

    if (Array.isArray(filters[stepId])) {
      // Handle array values
      const currentValues = (filters[stepId] as (string | number)[]) || [];
      if (currentValues.includes(value)) {
        newFilters[stepId] = currentValues.filter((v) => v !== value);
      } else {
        newFilters[stepId] = [...currentValues, value];
      }
    } else {
      // Handle single values
      newFilters[stepId] = filters[stepId] === value ? null : value;
    }

    onFilterChange(newFilters);
  };

  const isOptionSelected = (
    stepId: keyof SearchFilters,
    value: string | number,
  ) => {
    const currentValue = filters[stepId];
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    return currentValue === value;
  };

  if (isCollapsed) {
    return (
      <div className="bg-gray-50 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="w-12" />
          <div className="w-12 flex justify-end">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center text-energy hover:text-energy-700"
            >
              <ChevronDown className="h-5 w-5 mr-2" />
              Show guide
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="w-12" />
        <h2 className="text-2xl font-bold text-bluespruce text-center mx-auto">
          Choose the right pathways for your needs
        </h2>
        <div className="w-12 flex justify-end">
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-energy hover:text-energy-700"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>
      </div>

      {currentView === "home" ? (
        <div className="space-y-6">
          <p className="text-rmigray-600">
            Selecting the right pathways is the most critical step for a
            successful assessment. A pathway is a story for a possible future.
            Use our filters to find the pathways that best fit the story you
            want to tell.
          </p>
          <div className="grid grid-cols-6 gap-10">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentView(index)}
                className="aspect-square p-6 border rounded-lg bg-gray-50 hover:border-energy hover:bg-energy-50 transition-colors flex flex-col items-center justify-center"
              >
                <div className="flex flex-col items-center text-center">
                  {step.icon}
                  <span className="mt-2 text-lg font-normal">{step.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-rmigray-800">
              {steps[currentView].title}
            </h3>
            <p className="text-rmigray-600">
              {steps[currentView].description}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {steps[currentView].options.map((option) => {
              const isSelected = isOptionSelected(
                steps[currentView].id,
                option.value,
              );
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    handleOptionSelect(
                      steps[currentView].id,
                      option.value,
                    )
                  }
                  className={`p-4 border rounded-lg transition-colors bg-gray-50 ${isSelected
                    ? "border-energy bg-energy-50"
                    : "hover:border-energy hover:bg-energy-50"
                    }`}
                >
                  {option.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentView(index)}
                  className={`w-2 h-2 rounded-full ${currentView === index ? "bg-energy" : "bg-gray-300"
                    }`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("home")}
                className="p-2 hover:text-energy"
              >
                <Home className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentView(Math.max(0, (currentView) - 1))
                }
                disabled={currentView === 0}
                className="p-2 hover:text-energy disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentView(
                    Math.min(steps.length - 1, (currentView) + 1),
                  )
                }
                disabled={currentView === steps.length - 1}
                className="p-2 hover:text-energy disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepByStepGuide;
