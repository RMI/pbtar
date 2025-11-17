import React, { useMemo, useState } from "react";
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
import { pathwayMetadata } from "../data/pathwayMetadata";
import { getGlobalFacetOptions } from "../utils/searchUtils";
import StepPageDefault, { StepOption } from "./StepPage";

export interface GuideStep {
  id: keyof SearchFilters;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** allow selecting multiple values on this page; default single */
  multi?: boolean;
  /** optional custom renderer; defaults to StepPage */
  component?: React.FC<{
    step: GuideStep;
    options: StepOption[];
    isSelected: (value: string | number) => boolean;
    onSelect: (value: string | number) => void;
  }>;
}

interface StepByStepGuideProps {
  filters: SearchFilters;
  onFilterChange: <T extends string | number | (string | number)[] | null>(
    key: keyof SearchFilters,
    value: T | null,
  ) => void;
}

const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | number>("home");
  // Single source of truth for all facet options
  const {
    pathwayTypeOptions,
    modelYearNetzeroOptions,
    temperatureOptions,
    geographyOptions,
    sectorOptions,
    metricOptions,
  } = useMemo(() => getGlobalFacetOptions(pathwayMetadata), []);

  // Normalize provider options -> tile-ready {id,title,value}
  const normalize = (
    arr: Array<{ value: string | number; label: string }>,
  ): StepOption[] =>
    arr.map((o) => ({ id: String(o.value), title: o.label, value: o.value }));
  const optionsByFacet: Record<string, StepOption[]> = useMemo(
    () => ({
      pathwayType: normalize(pathwayTypeOptions),
      modelYearNetzero: normalize(modelYearNetzeroOptions),
      modelTempIncrease: normalize(temperatureOptions),
      geography: normalize(geographyOptions),
      sector: normalize(sectorOptions),
      metric: normalize(metricOptions),
    }),
    [
      pathwayTypeOptions,
      modelYearNetzeroOptions,
      temperatureOptions,
      geographyOptions,
      sectorOptions,
      metricOptions,
    ],
  );

  const steps: GuideStep[] = [
    {
      id: "pathwayType",
      title: "Pathway Type",
      description:
        "Different pathway types tell different stories about the future.",
      icon: <GitFork className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
    {
      id: "modelYearNetzero",
      title: "Target Year",
      description: "Choose pathways based on their target net-zero year.",
      icon: <Timer className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
    {
      id: "modelTempIncrease",
      title: "Temperature Outcome",
      description:
        "Choose pathways aligned with different temperature outcomes.",
      icon: <Thermometer className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
    {
      id: "geography",
      title: "Geography",
      description: "Select pathways for specific geographical areas.",
      icon: <Earth className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
    {
      id: "sector",
      title: "Sector",
      description: "Focus on pathways covering specific economic sectors.",
      icon: <Factory className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
    {
      id: "metric",
      title: "Benchmark Metric",
      description: "Choose pathways with specific benchmark indicators.",
      icon: <Ruler className="h-8 w-8" />,
      multi: false,
      component: StepPageDefault,
    },
  ];

  const handleOptionSelect = (
    stepId: keyof SearchFilters,
    optionValue: string | number,
  ) => {
    // Cast numeric steps
    const normalized =
      stepId === "modelYearNetzero" || stepId === "modelTempIncrease"
        ? Number(optionValue)
        : optionValue;

    const multi = steps.find((s) => s.id === stepId)?.multi ?? false;
    const curr = Array.isArray(filters[stepId])
      ? ((filters[stepId] as (string | number)[]) ?? [])
      : [];

    if (multi) {
      const next = curr.includes(normalized)
        ? curr.filter((v) => v !== normalized)
        : [...curr, normalized];
      onFilterChange(stepId, next);
    } else {
      const next = filters[stepId] === normalized ? null : normalized;
      onFilterChange(stepId, next);
    }
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
          {(() => {
            const step = steps[currentView];
            const Comp = step.component ?? StepPageDefault;
            const opts = optionsByFacet[step.id] ?? [];
            const isSelected = (v: string | number) =>
              Array.isArray(filters[step.id])
                ? (filters[step.id] as (string | number)[]).includes(v)
                : filters[step.id] === v;
            return (
              <Comp
                step={step}
                options={opts}
                isSelected={isSelected}
                onSelect={(v) => handleOptionSelect(step.id, v)}
                title={step.title}
                description={step.description}
              />
            );
          })()}

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
                onClick={() => setCurrentView(Math.max(0, currentView - 1))}
                disabled={currentView === 0}
                className="p-2 hover:text-energy disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  setCurrentView(Math.min(steps.length - 1, currentView + 1))
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
