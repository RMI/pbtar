import React from "react";
import type { FacetMode } from "../utils/searchUtils";

export type Option<T extends string | number = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type Props<T extends string | number = string> = {
  label?: string;
  options: Option<T>[];
  value?: T | T[] | null | undefined; // Accept null/undefined; emit T[] via onChange
  onChange: (next: T[]) => void;
  placeholder?: string;
  className?: string;

  // Optional ANY/ALL control (unused by default)
  mode?: FacetMode;
  onModeChange?: (m: FacetMode) => void;
  showModeToggle?: boolean;
  closeOnSelect?: boolean;
};

export default function MultiSelectDropdown<
  T extends string | number = string,
>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  className,
  mode = "ANY",
  onModeChange,
  showModeToggle = false,
  closeOnSelect = false,
}: Props<T>) {
  // --- Controlled open state with outside-click handling ---
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const t = e.target as Node;
      if (menuRef.current?.contains(t)) return; // clicks inside menu: keep open
      if (triggerRef.current?.contains(t)) return; // clicks on trigger: keep open
      setOpen(false); // outside: close
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Coerce scalar/null/undefined → T[]
  const current = React.useMemo<T[]>(
    () =>
      Array.isArray(value) ? value : value != null ? ([value] as T[]) : [],
    [value],
  );

  // We compare using string forms to support number values safely
  const toKey = React.useCallback((v: T) => String(v), []);
  const selectedSet = React.useMemo(
    () => new Set(current.map(toKey)),
    [current, toKey],
  );

  const toggle = (v: T) => {
    const next: T[] = [];
    const key = toKey(v);
    const wasSelected = selectedSet.has(key);

    if (wasSelected) {
      for (const item of current) if (toKey(item) !== key) next.push(item);
    } else {
      next.push(...current, v);
    }

    onChange(next);
    if (closeOnSelect) setOpen(false);
  };

  const enabled = options.filter((o) => !o.disabled);
  const allSelected =
    enabled.length > 0 && enabled.every((o) => selectedSet.has(toKey(o.value)));

  const clear = () => onChange([]);
  const selectAll = () => onChange(enabled.map((o) => o.value));

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 text-sm font-medium text-rmigray-700">{label}</div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        className="rounded-xl border px-3 py-2 text-sm bg-white shadow-sm flex items-center justify-between w-72"
        onClick={() => setOpen(true)} // only opens; closing is via outside click/Escape
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">
          {current.length === 0 ? placeholder : `${current.length} selected`}
        </span>
        <span
          aria-hidden
          className="ml-2"
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="relative z-20"
        >
          <div className="absolute mt-2 w-72 rounded-xl border bg-white shadow-lg p-2">
            <div className="flex items-center justify-between px-2 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="underline disabled:opacity-50"
                  onClick={selectAll}
                  disabled={allSelected || enabled.length === 0}
                >
                  Select all
                </button>
                <button
                  type="button"
                  className="underline disabled:opacity-50"
                  onClick={clear}
                  disabled={current.length === 0}
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

            <ul
              className="max-h-64 overflow-auto"
              role="listbox"
              aria-multiselectable="true"
            >
              {options.map((o) => {
                const checked = selectedSet.has(toKey(o.value));
                return (
                  <li key={toKey(o.value)}>
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
        </div>
      )}
    </div>
  );
}
