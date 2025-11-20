import React, { useMemo } from "react";

export type StepOption = {
  id: string;
  title: string;
  value: string | number;
  description?: string;
};

/** Unified renderer props for any step (discrete or remap). */
export interface StepRendererProps {
  title: string;
  description?: string;
  options: StepOption[]; // tiles to display
  value: (string | number)[]; // currently selected underlying values
  selectionMode: "single" | "multi"; // click behavior
  mapSelect?: (opt: string | number) => (string | number)[]; // default: identity
  onChange: (next: (string | number)[]) => void; // emit new underlying values
  /** Optional: visual state hook for partial selection */
  getState?: (
    opt: string | number,
    selected: ReadonlySet<string | number>,
  ) => "on" | "partial" | "off";
}

export const StepPageDiscrete: React.FC<StepRendererProps> = ({
  title,
  description,
  options,
  value,
  selectionMode,
  mapSelect,
  onChange,
  getState,
}) => {
  const selectedSet = useMemo(() => new Set(value), [value]);
  const mapFn = mapSelect ?? ((opt: string | number) => [opt]); // identity for pure discrete steps

  const computeState = (opt: string | number): "on" | "partial" | "off" => {
    if (getState) return getState(opt, selectedSet);
    const mapped = mapFn(opt).filter((v) => v != null); // ignore null/undefined
    const hits = mapped.filter((v) => selectedSet.has(v)).length;
    if (hits === 0) return "off";
    if (hits === mapped.length) return "on";
    return "partial";
  };

  const handleClick = (opt: string | number) => {
    // Normalize mapped values; treat null/undefined as “no selection”
    const mapped = mapFn(opt).filter((v) => v != null);
    if (selectionMode === "single") {
      // In single mode, clicking the already-selected option clears (toggle off).
      const fullySelected =
        mapped.length > 0 &&
        mapped.every((v) => selectedSet.has(v)) &&
        selectedSet.size === mapped.length;
      onChange(fullySelected ? [] : mapped);
      return;
    }
    // Multi: toggle the whole mapped set
    const next = new Set(selectedSet);
    const allSelected = mapped.every((v) => next.has(v));
    if (allSelected) mapped.forEach((v) => next.delete(v));
    else mapped.forEach((v) => next.add(v));
    onChange(Array.from(next));
  };

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-rmigray-800">{title}</h3>
        {description ? <p className="text-rmigray-600">{description}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-3">
        {options.map((option) => {
          const state = computeState(option.value);
          const selected = state === "on";
          const partial = state === "partial";
          return (
            <button
              key={option.id}
              onClick={() => handleClick(option.value)}
              className={`group relative w-full text-left pl-10 pr-4 py-3 min-h-[76px] rounded-lg flex flex-col justify-center gap-2 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-rmiblue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                border-2 ${selected
                  ? "border-rmiblue-800 bg-rmiblue-100"
                  : partial
                    ? "border-rmiblue-400 bg-rmiblue-100"
                    : "border-transparent shadow-sm hover:border-neutral-300 hover:shadow-sm bg-white"
                }`}
            >
              {selected && (
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-rmiblue-800 text-sm font-semibold"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
              <div className="text-sm font-medium text-rmigray-800">
                {option.title}
              </div>
              {option.description && (
                <div className="text-xs text-rmigray-600 mt-1">
                  {option.description}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
