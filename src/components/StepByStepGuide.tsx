import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileDown,
  GitFork,
  Home,
  ScrollText,
  Thermometer,
} from "lucide-react";
import { SearchFilters } from "../types";
import { pathwayMetadata } from "../data/pathwayMetadata";
import { getGlobalFacetOptions } from "../utils/searchUtils";
import { StepPageDiscrete, StepOption, StepRendererProps } from "./StepPage";
import StepPageRemap, { RemapCategory } from "./StepPageRemap";
import StepPageNumericRange from "./StepPageNumericRange";

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
  const globalFacetOptions = useMemo(
    () => getGlobalFacetOptions(pathwayMetadata),
    [],
  );

  // Normalize provider options -> tile-ready {id,title,value}
  const normalize = (
    arr: Array<{ value: string | number; label: string }>,
  ): StepOption[] =>
    arr.map((o) => ({ id: String(o.value), title: o.label, value: o.value }));

  // Options by facet for easy access
  const optionsByFacet: Record<string, StepOption[]> = useMemo(
    () => ({
      pathwayType: normalize(globalFacetOptions["pathwayTypeOptions"]),
      modelTempIncrease: normalize(globalFacetOptions["temperatureOptions"]),
      geography: normalize(globalFacetOptions["geographyOptions"]),
      metric: normalize(globalFacetOptions["metricOptions"]),
      emissionsTrajectory: normalize(
        globalFacetOptions["emissionsTrajectoryOptions"],
      ),
      policyAmbition: normalize(globalFacetOptions["policyAmbitionOptions"]),
      dataAvailability: normalize(
        globalFacetOptions["dataAvailabilityOptions"],
      ),
    }),
    [globalFacetOptions],
  );

  // Small adapter that fixes the prop wiring for modelTempIncrease
  const StepPageNumericRangeModelTemp: React.FC<StepRendererProps> = (
    props,
  ) => {
    const values = optionsByFacet["modelTempIncrease"]
      .map((o) => Number(o.value))
      .filter((v) => !isNaN(v));

    const minBound = Math.min(...values);
    const maxBound = Math.max(...values);

    return (
      <StepPageNumericRange
        title={props.title}
        description={props.description}
        value={props.value}
        onChange={props.onChange}
        minBound={minBound}
        maxBound={maxBound}
        stepKey="temp"
      />
    );
  };

  console.log(
    optionsByFacet["modelTempIncrease"].reduce((max, current) => {
      return current.value > max.value ? current : max;
    }),
  );

  const descriptions: Record<string, Record<string, string>> = {
    pathwayType: {
      "Direct Policy": "Sourced directly from policy frameworks",
      "Exploratory": "Future states under explicit assumptions",
      "Normative": "Pre-determined target outcome",
      "Predictive": "Extrapolates from current trends.",
    },
    emissionsTrajectory: {
      "Significant increase": "Grow more than 50% by 2050",
      "Moderate increase": "Grow 15%-50% by 2050",
      "Minor increase": "Grow 5% -15% by 2050",
      "Low or no change": "Change less than 5% by 2050",
      "Minor decrease": "Decrease 5%-15% by 2050",
      "Moderate decrease": "Decrease 15%-50% by 2050",
      "Significant decrease": "Decrease more than 50% by 2050",
    },
    policyAmbition: {
      "No policies included": "Excludes policy impacts.",
      "Current/legislated policies": "Only policies already in place.",
      "Current and drafted policies": "Includes in-process policy drafts.",
      "NDCs, unconditional only": "Policies to reach unconditional targets",
      "NDCs incl. conditional targets": "Policies to reach all targets",
      "Normative/Optimization-based": "Policies to reach a climate outcome.",
      "Other policy ambition": "See pathway details",
    },
    metric: {
      "Capacity": "Generation capacity by technology/fuel",
      "Generation": "Generation by technology/fuel",
      "Absolute Emissions": "Total GHG emissions",
      "Emissions Intensity": "GHG emissions per quantity of generation",
      "Technology Mix": "Share of generation by technology/fuel",
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
      id: "modelTempIncrease",
      title: "Temperature Rise",
      description:
        "Pathways project different total temperature change by 2100, describing different levels of climate ambition and system change. Many regional and country pathways do not model a temperature rise.",
      icon: <Thermometer className="h-8 w-8" />,
      multi: false,
      component: StepPageNumericRangeModelTemp,
    },
    {
      id: "policyAmbition",
      title: "Policy Ambition",
      description:
        "Pathways differ in the types of policies included, providing benchmarks for different policy action scenarios. This is relevant both for setting appropriately ambitious targets and for policy alignment analysis.",
      icon: <ScrollText className="h-8 w-8" />,
      multi: false,
      component: StepPageDiscrete,
      options: (() => {
        return [...(optionsByFacet["policyAmbition"] ?? [])]
          .map((o) => ({
            ...o,
            description: descriptions["policyAmbition"][o.title] || undefined,
          }))
          .concat({
            id: "__policyAmbition_clear__",
            title: "Include any policy ambition",
            value: null, // null value clears the filter
          });
      })(),
    },
    {
      id: "dataAvailability",
      title: "Data Availability",
      description:
        "Pathways differ in the availability of their benchmark data for access, which may limit user applications. Some pathway data is freely available in standardized format, other data needs to be acquired from third parties.",
      icon: <FileDown className="h-8 w-8" />,
      multi: false,
      options: optionsByFacet["dataAvailability"],
      component: (props) => {
        const categories: RemapCategory[] = [
          {
            label: "Freely available",
            values: ["Download"],
            description: "from this repository",
          },
          {
            label: "Available",
            values: ["Download", "Link"],
            description: "from this repository or elsewhere",
          },
          {
            // Use a null array to unset filter
            label: "Benchmark data availability not relevant",
            values: [null],
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
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-lg bg-white border border-neutral-200/70 p-4 md:p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="w-12" />

            <h2 className="text-2xl md:text-3xl font-semibold text-bluespruce tracking-tight text-center mx-auto max-w-prose">
              Choose the right pathways for your needs
            </h2>

            <div className="w-12 flex justify-end">
              {isCollapsed ? (
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="flex items-center gap-2 text-energy hover:text-energy-700 whitespace-nowrap flex-shrink-0"
                >
                  <ChevronDown className="h-5 w-5" />
                  <span>Show guide</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="text-energy hover:text-energy-700"
                  aria-label="Collapse guide"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {!isCollapsed ? (
            <>
              {currentView === "home" ? (
                <div className="space-y-6">
                  <div className="max-w-5xl mx-auto">
                    <p className="text-base text-rmigray-600 leading-[1.6] tracking-normal mb-2">
                      Different pathways are suited to different applications.
                      All users should be mindful of the model types and
                      geographic coverage of the pathways they select.
                    </p>
                    <p className="text-base text-rmigray-600 leading-[1.6] tracking-normal mb-2">
                      Users interested in assessing the ambition of transition
                      strategies may wish to select pathways with suitable
                      temperature rise or emissions changes, while those
                      interested in assessing potential policy exposure or
                      technical feasibility may prioritize models with the
                      relevant policy assumption set.
                    </p>
                    <p className="text-base text-rmigray-600 leading-[1.6] tracking-normal mb-2">
                      The following steps guide users through key pathway
                      features, while filters below offer additional options.
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      {steps.map((step, index) => {
                        return (
                          <button
                            type="button"
                            key={step.id}
                            onClick={() => setCurrentView(index)}
                            aria-label={step.title}
                            title={step.title}
                            className="group relative cursor-pointer w-full pl-10 pr-4 py-3 rounded-lg bg-white text-rmigray-600 shadow-sm
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-rmiblue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                              flex flex-col items-center justify-center gap-2 min-h-[76px]
                              border-2 border-transparent hover:border-neutral-300
                              transition-colors duration-150 ease-in-out hover:shadow-sm"
                          >
                            <div
                              className="flex items-center justify-center h-9 w-9 rounded-full bg-rmiblue-100 text-bluespruce
             group-hover:bg-rmiblue-200 group-focus:bg-rmiblue-200 transition-colors"
                              aria-hidden="true"
                            >
                              {React.isValidElement(step.icon)
                                ? React.cloneElement(step.icon, {
                                    className: "h-4 w-4 stroke-current",
                                  })
                                : step.icon}
                            </div>

                            {/* Button label: match home view typography */}
                            <div className="mt-1 text-base font-medium text-rmigray-800 text-center tracking-normal">
                              {step.title}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const step = steps[currentView];
                    const Comp = step.component ?? StepPageDiscrete;
                    const currentArray = Array.isArray(filters[step.id])
                      ? ((filters[step.id] as (string | number)[]) ?? [])
                      : filters[step.id] != null
                        ? [filters[step.id] as string | number]
                        : [];

                    const selectionMode: "single" | "multi" =
                      (step.multi ?? false) ? "multi" : "single";

                    // Unified array-based filters: always emit arrays
                    const onChange = (next: Array<string | number>) =>
                      onFilterChange(step.id, next);

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
                          className={`w-2 h-2 rounded-full ${currentView === index ? "bg-energy" : "bg-gray-300"}`}
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
                          setCurrentView(Math.max(0, currentView - 1))
                        }
                        disabled={currentView === 0}
                        className="p-2 hover:text-energy disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentView(
                            Math.min(steps.length - 1, currentView + 1),
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
            </>
          ) : null}
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
};

export default StepByStepGuide;
