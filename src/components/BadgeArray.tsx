import React from "react";
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
};

export default function BadgeArray<T extends Scalar = Scalar>({
  children,
  variant,
  visibleCount,
  tooltipGetter,
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

  return (
    <div className="flex flex-wrap">
      {arr.slice(0, visibleCount).map((value, idx) => (
        <BadgeMaybeAbsent
          key={idx}
          variant={variants[idx]}
          tooltip={tooltipGetter?.(value as T)}
          {...rest}
        >
          {value}
        </BadgeMaybeAbsent>
      ))}
      {typeof visibleCount === "number" && arr.length > visibleCount && (
        <TextWithTooltip
          text={
            <span className="text-xs text-rmigray-500 ml-1 self-center">
              +{arr.length - visibleCount} more
            </span>
          }
          tooltip={
            <span>
              {arr.slice(visibleCount).map((value, idx) => (
                <React.Fragment key={value}>
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
