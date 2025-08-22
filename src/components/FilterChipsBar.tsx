import React from "react";
import { X } from "lucide-react";
import { SearchFilters } from "../types";

export interface FilterChipsBarProps {
  filters: SearchFilters;
  onRemove: (key: keyof SearchFilters) => void;
  onClearAll: () => void;
  count?: number;
  showCount?: boolean;
  className?: string;
}

interface ChipItem {
  key: keyof SearchFilters;
  label: string;
  value: string;
}

const buildChips = (filters: SearchFilters): ChipItem[] => {
  const chips: ChipItem[] = [];
  if (filters.searchTerm) {
    chips.push({ key: "searchTerm", label: "Search", value: filters.searchTerm });
  }
  if (filters.pathwayType) {
    chips.push({ key: "pathwayType", label: "Pathway", value: filters.pathwayType });
  }
  if (filters.modelYearEnd) {
    chips.push({ key: "modelYearEnd", label: "Year", value: filters.modelYearEnd });
  }
  if (filters.modelTempIncrease != null) {
    chips.push({ key: "modelTempIncrease", label: "Temp", value: `${filters.modelTempIncrease}°C` });
  }
  if (filters.region) {
    chips.push({ key: "region", label: "Region", value: filters.region });
  }
  if (filters.sector) {
    chips.push({ key: "sector", label: "Sector", value: filters.sector });
  }
  return chips;
};

const FilterChipsBar: React.FC<FilterChipsBarProps> = ({
  filters,
  onRemove,
  onClearAll,
  count,
  showCount = true,
  className = "",
}) => {
  const chips = buildChips(filters);
  const hasChips = chips.length > 0;
  if (!hasChips && !showCount) return null;

  const countText = typeof count === "number" && showCount
    ? `${count} scenario${count === 1 ? "" : "s"}${hasChips ? " matching filters" : ""}`
    : null;

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mt-4 ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        {countText && (
          <span aria-live="polite" className="text-count whitespace-nowrap">{countText}</span>
        )}
        {hasChips && (
          <div role="list" aria-label="Active filters" className="flex flex-wrap gap-2 items-center">
        {chips.map((chip) => (
        <div
          key={chip.key}
          role="listitem"
          className="group inline-flex items-center gap-1 pl-2 pr-1 py-1 radius-full bg-energy-100 text-energy-800 border border-energy-100 shadow-token-xs transition-colors transition-fast ease-standard text-xs font-medium"
        >
          <span className="whitespace-nowrap">
            <span className="opacity-70 mr-1">{chip.label}:</span>{chip.value}
          </span>
          <button
            type="button"
            aria-label={`Remove filter: ${chip.label} ${chip.value}`}
            onClick={() => onRemove(chip.key)}
            className="inline-flex items-center justify-center radius-full p-0.5 text-energy-700 hover:text-energy-800 hover:bg-energy-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy-400 focus-visible:ring-offset-1 focus-visible:ring-offset-white transition-colors transition-fast ease-standard"
          >
            <X size={14} />
          </button>
        </div>
      ))}
          </div>
        )}
      </div>
      {chips.length > 1 && (
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-energy hover:text-energy-700 underline-offset-2 hover:underline transition-colors transition-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterChipsBar;
