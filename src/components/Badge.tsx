import React from "react";
import TextWithTooltip from "./TextWithTooltip";

interface BadgeProps {
  text: React.ReactNode;
  tooltip?: string;
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
const Badge: React.FC<BadgeProps> = ({ text, tooltip, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "pathwayType":
        return "bg-rmipurple-100 text-rmipurple-800 border-rmipurple-200";
      case "temperature":
        return "bg-rmired-100 text-rmired-800 border-rmired-200";
      case "year":
        return "bg-rmiblue-100 text-rmiblue-800 border-rmiblue-200";
      case "region":
        return "bg-pinishgreen-100 text-pinishgreen-800 border-pinishgreen-200";
      case "sector":
        return "bg-solar-100 text-solar-800 border-solar-200";
      default:
        return "bg-rmigray-100 text-rmigray-800 border-rmigray-200";
    }
  };

  // Flat material style
  const badgeStyles = `inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getVariantStyles()} mr-2 mb-1 select-none whitespace-nowrap`;

  if (!tooltip) {
    return <span className={badgeStyles}>{text}</span>;
  }

  return (
    <TextWithTooltip
      text={<span className={badgeStyles}>{text}</span>}
      tooltip={tooltip}
      position="right"
    />
  );
};

export default Badge;
