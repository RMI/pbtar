import React from "react";
import type { FacetMode } from "../utils/searchUtils";
import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";

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
  /** Minimum width for the trigger button (Tailwind class). Defaults to 'min-w-32'. */
  triggerMinWidthClassName?: string;
  /** Optional fixed width class for the menu panel (e.g., 'w-96'). If omitted, we compute a minWidth >= trigger width. */
  menuWidthClassName?: string;
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
  placeholder = "Select",
  className,
  triggerMinWidthClassName = "min-w-32",
  menuWidthClassName,
  mode = "ANY",
  onModeChange,
  showModeToggle = false,
  closeOnSelect = false,
}: Props<T>) {
  // --- Controlled open state with outside-click handling ---
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const [menuMinWidthPx, setMenuMinWidthPx] = React.useState<number>(0);

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
  // Normalize current values to an array for easy checks
  const current = React.useMemo<T[]>(
    () =>
      Array.isArray(value)
        ? value.filter((v): v is T => v !== null && v !== undefined)
        : value === null || value === undefined
          ? []
          : [value],
    [value],
  );

  const isActive = current.length > 0;

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

  // Track trigger width so the menu can be at least that wide.
  const updateMenuMinWidth = React.useCallback(() => {
    if (triggerRef.current) {
      const w = triggerRef.current.getBoundingClientRect().width;
      // floor to integer to avoid flapping styles in tests
      setMenuMinWidthPx(Math.max(0, Math.floor(w)));
    }
  }, []);

  React.useEffect(() => {
    updateMenuMinWidth();
    const onResize = () => updateMenuMinWidth();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateMenuMinWidth]);

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        className={clsx(
          "inline-flex w-auto items-center justify-between rounded-md px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
          isActive
            ? "text-energy-800 bg-energy-100 border border-energy-100"
            : "text-rmigray-800 bg-white border border-gray-300 hover:bg-gray-50",
          triggerMinWidthClassName,
        )}
        onClick={() => setOpen(true)} // ← always opens, regardless of isActive
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate inline-flex items-baseline">
          <span className="relative inline-block [font-variant-numeric:tabular-nums]">
            {/* Reserve space for label + ': 99' */}
            <span
              aria-hidden
              className="opacity-0 select-none whitespace-pre"
            >
              {label ?? placeholder}: 99
            </span>

            {/* Actual content, overlayed */}
            <span className="absolute inset-0 whitespace-pre">
              {current.length === 0
                ? `${label ?? placeholder}...`
                : `${label ?? placeholder}: `}
              {current.length > 0 && <strong>{current.length}</strong>}
            </span>
          </span>
        </span>

        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center flex-shrink-0">
          {isActive ? (
            <span
              role="button"
              aria-label={`Clear ${label ?? "filter"}`}
              className="inline-flex h-5 w-5 items-center justify-center rounded cursor-pointer hover:bg-energy-200 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation(); // don't open the menu
                onChange([]);
              }}
              onMouseDown={(e) => e.preventDefault()} // prevent focusing/activating parent button
            >
              <X
                size={16}
                aria-hidden
              />
            </span>
          ) : (
            <ChevronDown
              size={16}
              aria-hidden
            />
          )}
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="relative z-20"
        >
          <div
            className={clsx(
              // enforce a sensible base width so the header can show L/R columns
              "absolute z-20 mt-2 origin-top-right rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none",
              // If a fixed width is provided, use it; else rely on minWidth style below
              menuWidthClassName ?? null,
            )}
            style={
              menuWidthClassName
                ? undefined
                : {
                    minWidth: menuMinWidthPx
                      ? `${menuMinWidthPx}px`
                      : undefined,
                  }
            }
          >
            <div className="flex items-start justify-between px-2 pb-2 text-xs gap-2">
              {/* Left column: actions. Allow wrapping, but keep "Select all" on one line */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <button
                  type="button"
                  className="underline disabled:opacity-50 whitespace-nowrap"
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

              {/* Right column: bordered, right-justified explainer */}
              {showModeToggle && onModeChange ? (
                <div className="text-right text-rmigray-500 px-0 py-0 inline-block">
                  <div className="whitespace-nowrap">
                    Show scenarios matching
                  </div>
                  <div
                    className="mt-1 flex items-center justify-end gap-1"
                    data-testid="mode-explainer"
                  >
                    <div
                      className="border border-gray-200 rounded-md cursor-pointer select-none"
                      data-testid="mode-toggle"
                      role="button"
                      aria-label={`Toggle match mode (currently ${mode === "ANY" ? "Any" : "All"})`}
                      aria-live="polite"
                      tabIndex={0}
                      onClick={() =>
                        onModeChange?.(mode === "ANY" ? "ALL" : "ANY")
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onModeChange?.(mode === "ANY" ? "ALL" : "ANY");
                        }
                      }}
                    >
                      <span
                        className={clsx(
                          "px-[2px] py-[2px] rounded",
                          mode === "ANY" && "bg-gray-100",
                        )}
                      >
                        Any
                      </span>
                      <span
                        className={clsx(
                          "px-[2px] py-[2px] rounded",
                          mode === "ALL" && "bg-gray-100",
                        )}
                      >
                        All
                      </span>
                    </div>
                    <span>selected</span>
                  </div>
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
