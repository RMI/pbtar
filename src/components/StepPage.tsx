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
    const mapped = mapFn(opt);
    const hits = mapped.filter((v) => selectedSet.has(v)).length;
    if (hits === 0) return "off";
    if (hits === mapped.length) return "on";
    return "partial";
  };

  const handleClick = (opt: string | number) => {
    const mapped = mapFn(opt);
    if (selectionMode === "single") {
      onChange(mapped); // replace selection
      return;
    }
    // Multi: toggle whole mapped set
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

      {/* Use radiogroup semantics for single-select, otherwise a plain group */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        role={selectionMode === "single" ? "radiogroup" : undefined}
        aria-label={selectionMode === "single" ? title : undefined}
      >
        {options.map((option) => {
          const state = computeState(option.value);
          const selected = state === "on";
          const partial = state === "partial";

          // Keep border-2 always to avoid layout shift when selected.
          // Reserve space for the accent bar so nothing moves.
          const baseClasses =
            "relative w-full text-left pl-[12px] p-4 rounded-lg transition-colors border-2 flex flex-col " +
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rmiblue-400 focus-visible:ring-offset-white";

          // Idle = neutral surface with soft brand tint on hover
          const idleClasses =
            "bg-white border-neutral-200 hover:bg-rmiblue-100 hover:border-rmiblue-200";

          // Partial = very light ‘energy’ hint using defined tokens
          const partialClasses = "bg-energy-100 border-energy-400";

          // Selected = brand tint + stronger border; title turns brand-darker
          const selectedClasses = "bg-rmiblue-100 border-rmiblue-400";

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleClick(option.value)}
              // ARIA for a11y without changing behavior
              role={selectionMode === "single" ? "radio" : "button"}
              aria-checked={selectionMode === "single" ? selected : undefined}
              aria-pressed={selectionMode === "multi" ? selected : undefined}
              className={`${baseClasses} ${selected ? selectedClasses : partial ? partialClasses : idleClasses
                }`}
            >

              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${selected ? "text-rmiblue-800" : "text-rmigray-800"
                    }`}
                >
                  {option.title}
                </div>
                {option.description && (
                  <div className="mt-1 text-xs text-rmigray-600">
                    {option.description}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
};
