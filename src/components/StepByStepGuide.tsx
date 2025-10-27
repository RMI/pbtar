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

export interface FilterStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  options: Array<{
    id: string;
    title: string;
    value: string;
  }>;
}

const steps: FilterStep[] = [
  {
    id: "pathway-type",
    title: "Pathway Type",
    description:
      "Different pathway types tell different stories about the future.",
    icon: <GitFork className="h-6 w-6" />,
    options: [
      { id: "forecasting", title: "Forecasting", value: "forecasting" },
      { id: "backcasting", title: "Backcasting", value: "backcasting" },
    ],
  },
  {
    id: "model-year-netzero",
    title: "Target Year",
    description: "Choose scenarios based on their target net-zero year.",
    icon: <Timer className="h-6 w-6" />,
    options: [
      { id: "2030", title: "2030", value: "2030" },
      { id: "2040", title: "2040", value: "2040" },
      { id: "2050", title: "2050", value: "2050" },
    ],
  },
  {
    id: "temperature",
    title: "Temperature Outcome",
    description:
      "Choose scenarios aligned with different temperature outcomes.",
    icon: <Thermometer className="h-6 w-6" />,
    options: [
      { id: "1.5", title: "1.5°C", value: "1.5" },
      { id: "2.0", title: "2°C", value: "2.0" },
    ],
  },
  {
    id: "geography",
    title: "Geography",
    description: "Select scenarios for specific geographical areas.",
    icon: <Earth className="h-6 w-6" />,
    options: [
      { id: "global", title: "Global", value: "global" },
      { id: "regional", title: "Regional", value: "regional" },
    ],
  },
  {
    id: "sector",
    title: "Sector",
    description: "Focus on scenarios covering specific economic sectors.",
    icon: <Factory className="h-6 w-6" />,
    options: [
      { id: "energy", title: "Energy", value: "energy" },
      { id: "industry", title: "Industry", value: "industry" },
      { id: "transport", title: "Transport", value: "transport" },
    ],
  },
  {
    id: "metric",
    title: "Benchmark Metric",
    description: "Choose scenarios with specific benchmark indicators.",
    icon: <Ruler className="h-6 w-6" />,
    options: [
      { id: "emissions", title: "Emissions", value: "emissions" },
      { id: "energy", title: "Energy Use", value: "energy" },
    ],
  },
];

interface StepByStepGuideProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  onFilterChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | number>("home");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const handleOptionSelect = (stepId: string, optionValue: string) => {
    setSelectedFilters((prev) => {
      const current = prev[stepId] || [];
      const updated = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];

      const newFilters = {
        ...prev,
        [stepId]: updated,
      };

      onFilterChange(newFilters);
      return newFilters;
    });
  };

  if (isCollapsed) {
    return (
      <div className="bg-white shadow-md p-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center text-energy hover:text-energy-700"
        >
          <ChevronDown className="h-5 w-5 mr-2" />
          Show guide
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1" /> {/* Left spacer */}
        <h2 className="text-2xl font-bold text-bluespruce text-center">
          Choose the right scenarios for your needs
        </h2>
        <div className="flex-1 flex justify-end">
          {" "}
          {/* Right container with chevron */}
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
            Selecting the right scenarios is the most critical step for a
            successful assessment. A scenario is a story for a possible future.
            Use our filters to find the scenarios that best fit the story you
            want to tell.
          </p>
          <div className="grid grid-cols-6 gap-10">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentView(index)}
                className="aspect-square p-6 border rounded-lg hover:border-energy hover:bg-energy-50 transition-colors flex flex-col items-center justify-center"
              >
                <div className="flex flex-col items-center text-center">
                  {step.icon}
                  <span className="mt-2 text-sm font-medium">{step.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-rmigray-800">
              {steps[currentView as number].title}
            </h3>
            <p className="text-rmigray-600">
              {steps[currentView as number].description}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {steps[currentView as number].options.map((option) => {
              const isSelected = selectedFilters[
                steps[currentView as number].id
              ]?.includes(option.value);
              return (
                <button
                  key={option.id}
                  onClick={() =>
                    handleOptionSelect(
                      steps[currentView as number].id,
                      option.value,
                    )
                  }
                  className={`p-4 border rounded-lg transition-colors ${
                    isSelected
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
                  className={`w-2 h-2 rounded-full ${
                    currentView === index ? "bg-energy" : "bg-gray-300"
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
                  setCurrentView(Math.max(0, (currentView as number) - 1))
                }
                disabled={currentView === 0}
                className="p-2 hover:text-energy disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentView(
                    Math.min(steps.length - 1, (currentView as number) + 1),
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
