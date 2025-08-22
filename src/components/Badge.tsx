import React from "react";
import TextWithTooltip from "./TextWithTooltip";

interface BadgeProps {
  text: React.ReactNode;
  tooltip?: string;
  icon?: React.ReactNode; // optional leading icon (small, ~14px) rendered before text
  variant?:
    | "default"
    | "pathwayType"
    | "temperature"
    | "year"
    | "region"
    | "sector";
}

/*
  Flat, material-style badge implementation
  -------------------------------------------------
  Goals:
  - Simple, unobtrusive, consistent with filter dropdown button aesthetics
  - Uses subtle neutral border + soft background tint per variant
  - Accessible contrast for text
  - Minimal motion; rely on global focus-visible styles provided elsewhere
*/
const Badge: React.FC<BadgeProps> = ({
  text,
  tooltip,
  icon,
  variant = "default",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "pathwayType":
    return "bg-rmipurple-100 text-rmipurple-800 border-rmipurple-200 hover:bg-rmipurple-200";
      case "temperature":
    return "bg-rmired-100 text-rmired-800 border-rmired-200 hover:bg-rmired-200";
      case "year":
    return "bg-rmiblue-100 text-rmiblue-800 border-rmiblue-200 hover:bg-rmiblue-200";
      case "region":
    return "bg-pinishgreen-100 text-pinishgreen-800 border-pinishgreen-200 hover:bg-pinishgreen-200";
      case "sector":
    return "bg-solar-100 text-solar-800 border-solar-200 hover:bg-solar-200";
      default:
    return "bg-rmigray-100 text-rmigray-800 border-rmigray-200 hover:bg-rmigray-200";
    }
  };

  // Flat material style
  const badgeStyles = `inline-flex items-center gap-1 h-6 leading-none px-2 rounded-md text-xs font-medium border ${getVariantStyles()} mr-2 mb-1 select-none whitespace-nowrap transition-colors transition-transform duration-150 ease-standard hover:-translate-y-0.5 hover:shadow-token-sm`;

  const content = (
    <span className={badgeStyles}>
      {icon && (
        <span
          className="inline-flex items-center justify-center w-3.5 h-3.5 aria-hidden [&_svg]:w-3.5 [&_svg]:h-3.5 [&_svg]:block [&_svg]:align-middle"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {text}
    </span>
  );

  if (!tooltip) {
    return content;
  }

  return (
    <TextWithTooltip
      text={content}
      tooltip={tooltip}
      position="right"
    />
  );
};

export default Badge;
