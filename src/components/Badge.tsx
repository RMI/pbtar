import React from "react";
import TextWithTooltip from "./TextWithTooltip";
import { coalesceOptional, isAbsent } from "../utils/absent";

interface BadgeProps {
  children: React.ReactNode;
  tooltip?: string;
  variant?:
    | "default"
    | "pathwayType"
    | "temperature"
    | "year"
    | "geographyGlobal"
    | "geographyRegion"
    | "geographyCountry"
    | "sector";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  tooltip,
  variant = "default",
  className,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "pathwayType":
        return "bg-rmipurple-100 text-rmipurple-800 border-rmipurple-200";
      case "temperature":
        return "bg-rmired-100 text-rmired-800 border-rmired-200";
      case "year":
        return "bg-rmiblue-100 text-rmiblue-800 border-rmiblue-200";
      case "geographyGlobal":
        return "bg-pinishgreen-800 text-pinishgreen-100 border-pinishgreen-100";
      case "geographyRegion":
        return "bg-pinishgreen-200 text-pinishgreen-800 border-pinishgreen-800";
      case "geographyCountry":
        return "bg-pinishgreen-100 text-pinishgreen-800 border-pinishgreen-200";
      case "sector":
        return "bg-solar-100 text-solar-800 border-solar-200";
      default:
        return "bg-rmigray-100 text-rmigray-800 border-rmigray-200";
    }
  };

  const badgeStylesBase = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} mr-2 mb-1`;
  const badgeStyles = className
    ? `${badgeStylesBase} ${className}`
    : badgeStylesBase;

  // If no tooltip, just return the basic badge
  // If no tooltip, just return the basic badge
  if (!tooltip) {
    return <span className={badgeStyles}>{children}</span>;
  }

  // With tooltip, use the TextWithTooltip component
  return (
    <TextWithTooltip
      text={<span className={badgeStyles}>{children}</span>}
      tooltip={tooltip}
      position="right"
    />
  );
};

export default Badge;
// --- value-aware helpers (schema-agnostic) --------------------

export type BadgeMaybeAbsentProps<T> = React.ComponentProps<typeof Badge> & {
  /** Scalar value to show inside the badge. If null/undefined -> renders "None". */
  children: T | null | undefined;
  /** Optional labeler for non-absent values (e.g., pretty format). */
  toLabel?: (v: T) => string;
  /** Visible text for the "None" case (default "None"). */
  noneLabel?: string;
  /** Optional decorator for the final label (e.g., highlight search matches). */
  renderLabel?: (label: string, isAbsent: boolean) => React.ReactNode;
};

export function BadgeMaybeAbsent<T>({
  children,
  toLabel,
  noneLabel,
  renderLabel,
  ...rest
}: BadgeMaybeAbsentProps<T>) {
  const normalized = coalesceOptional(children as T | null | undefined);
  const absent = isAbsent(normalized);

  let base: React.ReactNode;
  if (absent) {
    base = noneLabel ?? "None";
  } else if (toLabel) {
    base = toLabel(children as T);
  } else if (typeof children === "string" || typeof children === "number") {
    base = String(children);
  } else {
    // Already a React node (e.g., <HighlightedText />) — use as-is
    base = children as React.ReactNode;
  }

  const content =
    renderLabel && typeof base === "string" ? renderLabel(base, absent) : base;
  return <Badge {...rest}>{content}</Badge>;
}
