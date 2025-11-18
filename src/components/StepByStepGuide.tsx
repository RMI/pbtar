import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  GitFork,
  Thermometer,
  Earth,
  ChevronUp,
  ChevronDown,
  Ruler,
} from "lucide-react";
import { SearchFilters } from "../types";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { getGlobalFacetOptions } from "../utils/searchUtils";
import { StepPageDiscrete, StepOption, StepRendererProps } from "./StepPage";
import StepPageRemap, { RemapCategory } from "./StepPageRemap";

export interface GuideStep {
  id: keyof SearchFilters;
  title: string;
  description: string;
  icon: React.ReactNode;
  /** allow selecting multiple values on this page; default single */
  multi?: boolean;
  /** Optional custom renderer; defaults to StepPageDiscrete. */
  component?: React.FC<StepRendererProps>;
  options?: StepOption[];
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

  const descriptions = {
    pathwayType: {
      "Direct Policy": "Foo",
      "Exploratory": "Bar",
      "Normative": "Baz",
      "Predictive": "Qux",
    },
  };

  const steps: GuideStep[] = [
    {
      id: "pathwayType",
      title: "Pathway Type",
      description:
        "Different pathway types are constructed with different objectives, making them suited for different analytical applications. Analyses of ambitious scenarios, such as strategic target setting, often use normative pathways. Risk analyses often use predictive or explorative pathways.",
      icon: <GitFork className="h-8 w-8" />,
      multi: false,
      component: StepPageDiscrete,
      options: optionsByFacet["pathwayType"].map((o) => ({
        ...o,
        description: descriptions["pathwayType"][o.title] || undefined,
      })),
    },
    {
      id: "geography",
      title: "Geography",
      description: "Select pathways for specific geographical areas.",
      icon: <Earth className="h-8 w-8" />,
      multi: false,
      // Use the remap renderer via the component field:
      component: (props) => {
        // Define your categories here (labels -> raw values).
        // Use the raw values present in props.options[].value.
        const values = (needle: string) =>
          props.options
            .filter((o) =>
              String(o.title).toLowerCase().includes(needle.toLowerCase()),
            )
            .map((o) => o.value);

        const categories: RemapCategory[] = [
          {
            label: "World / Global",
            values: ["Global"],
          },
          {
            label: "South America",
            values: [
              "AR",
              "BO",
              "BR",
              "CL",
              "CO",
              "EC",
              "GY",
              "PE",
              "PY",
              "SR",
              "UY",
              "VE",
            ],
          },
          {
            label: "Oceania",
            values: ["AU", "NZ", "FJ", "PG", "East Asia and Pacific"],
          },
        ];

        return (
          <StepPageRemap
            {...props}
            categories={categories}
            clampToAvailable
          />
        );
      },
    },
    {
      id: "modelTempIncrease",
      title: "Temperature Rise",
      description:
        "Pathways project different total temperature change by 2100, describing different levels of climate ambition and system change. Many regional and country pathways do not model a temperature rise.",
      icon: <Thermometer className="h-8 w-8" />,
      multi: false,
      component: StepPageDiscrete,
      options: optionsByFacet["modelTempIncrease"],
    },
    {
      id: "metric",
      title: "Benchmark Metric",
      description:
        "Pathways differ in the metrics they make available. Users interested in benchmarking applications should select their comparison metric. Investment-related analyses often use physical output metrics, climate targets often use emissions-related metrics.",
      icon: <Ruler className="h-8 w-8" />,
      multi: false,
      component: StepPageDiscrete,
      options: optionsByFacet["metric"],
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
            Different pathways are suited to different applications. All users
            should be mindful of the model types and geographic coverage of the
            pathways they select. Users interested in assessing the ambition of
            transition strategies may wish to select pathways with suitable
            temperature rise or emissions changes, while those interested in
            assessing potential policy exposure or technical feasibility may
            prioritize models with the relevant policy assumption set. The
            following steps guide users through key pathway features, while
            filters below offer additional options.
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
            const Comp = step.component ?? StepPageDiscrete;
            const opts = optionsByFacet[step.id] ?? [];
            const currentArray = Array.isArray(filters[step.id])
              ? ((filters[step.id] as (string | number)[]) ?? [])
              : filters[step.id] != null
                ? [filters[step.id] as string | number]
                : [];

            const selectionMode: "single" | "multi" =
              (step.multi ?? false) ? "multi" : "single";

            const onChange = (next: Array<string | number>) => {
              // Geography is array-valued even in "single" category mode
              if (step.id === "geography") {
                onFilterChange(step.id, next);
                return;
              }
              onFilterChange(
                step.id,
                selectionMode === "single"
                  ? next.length === 0
                    ? null
                    : (next[0] as any)
                  : (next as any),
              );
            };

            return (
              <Comp
                title={step.title}
                description={step.description}
                options={step.options}
                value={currentArray}
                selectionMode={selectionMode}
                onChange={onChange}
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
