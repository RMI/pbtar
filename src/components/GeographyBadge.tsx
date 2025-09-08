import React from "react";
import {
  geographyKind,
  GeographyKind,
  normalizeGeography,
  geographyLabel,
  geographyTooltip,
} from "../utils/geographyUtils.ts";
import Badge from "./Badge";

function variantFor(
  kind: GeographyKind,
): React.ComponentProps<typeof Badge>["variant"] {
  // Pick names that fit your existing design tokens.
  // If your Badge has a strict union, add these variants there.
  switch (kind) {
    case "global":
      return "geographyGlobal"; // e.g., neutral/gray
    case "region":
      return "geographyRegion"; // e.g., indigo/blue
    case "country":
      return "geographyCountry"; // e.g., green
  }
}

interface GeographyBadgeProps {
  text: string;
  display?: React.ReactNode;
}

const GeographyBadge: React.FC<GeographyBadgeProps> = ({ text, display }) => {
  // Trim whitespace and handle empty strings (do not render)
  const text_clean = normalizeGeography(text);
  if (!text_clean) return null;

  const kind = geographyKind(text_clean);
  return (
    <Badge
      variant={variantFor(kind)}
      text={display ?? geographyLabel(text_clean)}
      tooltip={geographyTooltip(text_clean)}
    ></Badge>
  );
};

export default GeographyBadge;
