import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Badge, { BadgeMaybeAbsent } from "./Badge";
import TextWithTooltip from "./TextWithTooltip";

type Variant = React.ComponentProps<typeof Badge>["variant"];
type Scalar = string | number;

export type BadgeArrayProps<T extends string | number> = Omit<
  React.ComponentProps<typeof BadgeMaybeAbsent>,
  "tooltip"
> & {
  /** Provide an array of scalar-ish values as children: {['A', 'B', null, 42]} */
  children: Array<T | null | undefined>;
  /** Single variant for all badges or an array with the same length as children */
  variant?: Variant | Variant[];
  visibleCount?: number;
  tooltipGetter?: (item: T) => React.ReactNode;
  maxRows?: number; // default 1; use Infinity for no limit
};

export default function BadgeArray<T extends Scalar = Scalar>({
  children,
  variant,
  visibleCount,
  tooltipGetter,
  maxRows = 1,
  ...rest
}: BadgeArrayProps<T>) {
  const arr: ReadonlyArray<T | null | undefined> = Array.isArray(children)
    ? children
    : [children];

  // Runtime guard: only scalars/nullish are allowed
  const badIdx = arr.findIndex(
    (v) => v != null && typeof v !== "string" && typeof v !== "number",
  );
  if (badIdx !== -1) {
    throw new Error(
      "BadgeArray: children must be string | number | null | undefined",
    );
  }

  let variants: Variant[];
  if (Array.isArray(variant)) {
    if (variant.length !== arr.length) {
      throw new Error(
        "BadgeArray: when 'variant' is an array, its length must match children length",
      );
    }
    variants = variant;
  } else {
    variants = arr.map(() => variant);
  }

  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const moreMeasureRef = useRef<HTMLSpanElement | null>(null);

  // Auto-fit computation state (only used when visibleCount is undefined)
  const [autoVisible, setAutoVisible] = useState<number | null>(null);

  // Refs array length sync
  itemRefs.current = useMemo(
    () => Array(arr.length).fill(null) as (HTMLSpanElement | null)[],
    [arr.length],
  );

  // Decide how many to show (auto-fit) based on real layout
  useLayoutEffect(() => {
    if (typeof visibleCount === "number") {
      setAutoVisible(null);
      return;
    }
    if (!containerRef.current) return;
    if (!arr.length) {
      setAutoVisible(0);
      return;
    }
    // If unlimited rows requested, show all without "+n more"
    if (!Number.isFinite(maxRows)) {
      setAutoVisible(arr.length);
      return;
    }

    const container = containerRef.current;
    const childrenEls = itemRefs.current.filter(Boolean) as HTMLSpanElement[];
    if (!childrenEls.length) return;

    // Build row mapping using offsetTop buckets
    const rowTops: number[] = [];
    const rowOf = (el: HTMLElement) => {
      const top = el.offsetTop;
      let idx = rowTops.findIndex((t) => Math.abs(t - top) <= 1);
      if (idx === -1) {
        rowTops.push(top);
        rowTops.sort((a, b) => a - b);
        idx = rowTops.findIndex((t) => t === top);
      }
      return idx;
    };

    const containerWidth = container.clientWidth || 0;
    const moreWidth = moreMeasureRef.current?.offsetWidth ?? 0;

    let keep = 0;
    let lastAllowedRow = Math.max(1, Math.floor(maxRows));
    // Pass 1: determine which items can be kept within allowed rows
    // For the last allowed row, reserve space for "+n more" if any items will overflow.
    // We'll do a greedy pass from left to right.
    let seenRows = 0;
    for (let i = 0; i < childrenEls.length; i++) {
      const el = childrenEls[i]!;
      const r = rowOf(el);
      // rows are 0-indexed; allowed rows are 0..(lastAllowedRow-1)
      if (r + 1 > lastAllowedRow) break;

      // For the final allowed row, ensure leaving space for "+n more" *if* there will be overflow.
      if (r + 1 === lastAllowedRow) {
        // Compute right edge if we include this element
        const rightEdge = el.offsetLeft + el.offsetWidth;
        // Will there be overflow if we include this item? (i < last)
        const willOverflow = i < childrenEls.length - 1;
        const reserve = willOverflow ? moreWidth : 0;
        if (rightEdge + reserve > containerWidth) {
          // Can't fit this item while keeping space for the "+n more" token
          break;
        }
      }
      keep = i + 1;
      seenRows = Math.max(seenRows, r + 1);
    }

    // If everything fits within allowed rows, show all
    if (keep === childrenEls.length) {
      setAutoVisible(keep);
    } else {
      // Ensure at least one item is shown
      setAutoVisible(Math.max(1, keep));
    }
  }, [arr, visibleCount, maxRows]);

  // Recompute on resize & on font load
  useEffect(() => {
    if (typeof visibleCount === "number") return;
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // let layout settle
      requestAnimationFrame(() => {
        // force useLayoutEffect to run by touching state via dependency changes:
        setAutoVisible((v) => (v === null ? v : v)); // no-op, but keeps hook active
      });
    });
    ro.observe(el);
    let cancelled = false;
    // fonts can change badge widths
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) {
          requestAnimationFrame(() => {
            setAutoVisible((v) => (v === null ? v : v));
          });
        }
      });
    }
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [visibleCount]);

  const finalVisible =
    typeof visibleCount === "number"
      ? visibleCount
      : (autoVisible ?? arr.length);
  const showMore =
    finalVisible < arr.length && Number.isFinite(maxRows) && finalVisible >= 0;

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap"
    >
      {/* Hidden measurer for "+n more" width (use a conservative max like +99 more) */}
      <span
        ref={moreMeasureRef}
        aria-hidden="true"
        className="invisible absolute whitespace-nowrap text-xs"
        style={{ position: "absolute" }}
      >
        +99 more
      </span>
      {arr.slice(0, finalVisible).map((value, idx) => (
        <span
          key={idx}
          ref={(el) => (itemRefs.current[idx] = el)}
          className="inline-block"
        >
          <BadgeMaybeAbsent
            variant={variants[idx]}
            tooltip={tooltipGetter?.(value as T)}
            {...rest} // <-- forwards toLabel / renderLabel down
          >
            {value}
          </BadgeMaybeAbsent>
        </span>
      ))}
      {showMore && (
        <TextWithTooltip
          text={
            <span className="text-xs text-rmigray-500 ml-1 self-center">
              +{arr.length - finalVisible} more
            </span>
          }
          tooltip={
            <span>
              {arr.slice(finalVisible).map((value, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && ", "}
                  <span className="whitespace-nowrap">{value}</span>
                </React.Fragment>
              ))}
            </span>
          }
        />
      )}
    </div>
  );
}
