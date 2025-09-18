import React from "react";

export type Option = { value: string; label: string; disabled?: boolean };

export type FacetMode = "ANY" | "ALL";

type Props = {
  label?: string;
  options: Option[];
  value: string[]; // controlled
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;

  // Optional AND/OR control (off by default)
  mode?: FacetMode;
  onModeChange?: (m: FacetMode) => void;
  showModeToggle?: boolean;
};

export default function MultiSelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  mode = "ANY",
  onModeChange,
  showModeToggle = false,
}: Props) {
  const toggle = (v: string) => {
    const set = new Set(value);
    if (set.has(v)) {
      set.delete(v);
    } else {
      set.add(v);
    }
    onChange([...set]);
  };

  const allEnabled = options.filter((o) => !o.disabled);
  const allSelected = value.length > 0 && value.length === allEnabled.length;

  const clear = () => onChange([]);
  const selectAll = () => onChange(allEnabled.map((o) => o.value));

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 text-sm font-medium text-rmigray-700">{label}</div>
      ) : null}

      <details className="relative">
        <summary className="list-none cursor-pointer rounded-xl border px-3 py-2 text-sm bg-white shadow-sm flex items-center justify-between">
          <span className="truncate">
            {value.length === 0 ? placeholder : `${value.length} selected`}
          </span>
          <span
            aria-hidden
            className="ml-2"
          >
            ▾
          </span>
        </summary>

        <div className="absolute z-20 mt-2 w-72 rounded-xl border bg-white shadow-lg p-2">
          <div className="flex items-center justify-between px-2 pb-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="underline disabled:opacity-50"
                onClick={selectAll}
                disabled={allSelected}
              >
                Select all
              </button>
              <button
                type="button"
                className="underline disabled:opacity-50"
                onClick={clear}
                disabled={value.length === 0}
              >
                Clear
              </button>
            </div>

            {showModeToggle && onModeChange ? (
              <div
                className="flex items-center gap-1"
                role="group"
                aria-label="Match mode"
              >
                <button
                  type="button"
                  className={`px-2 py-1 rounded ${mode === "ANY" ? "bg-gray-100" : ""}`}
                  onClick={() => onModeChange("ANY")}
                  aria-pressed={mode === "ANY"}
                  title="Match any (OR)"
                >
                  Any
                </button>
                <button
                  type="button"
                  className={`px-2 py-1 rounded ${mode === "ALL" ? "bg-gray-100" : ""}`}
                  onClick={() => onModeChange("ALL")}
                  aria-pressed={mode === "ALL"}
                  title="Match all (AND)"
                >
                  All
                </button>
              </div>
            ) : null}
          </div>

          <ul className="max-h-64 overflow-auto">
            {options.map((o) => {
              const checked = value.includes(o.value);
              return (
                <li key={o.value}>
                  <label
                    className={`flex items-center gap-2 px-2 py-1 ${o.disabled ? "opacity-50" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={o.disabled}
                      onChange={() => toggle(o.value)}
                    />
                    <span className="text-sm">{o.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </div>
  );
}
