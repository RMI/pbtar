import React from "react";
import { geographyKind, GeographyKind } from "../utils/geographyUtils.ts";
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
}

const GeographyBadge: React.FC<GeographyBadgeProps> = ({ text }) => {
  const kind = geographyKind(text);
  return (
    <Badge
      variant={variantFor(kind)}
      text={text}
      tooltip={text}
    ></Badge>
  );
};

export default GeographyBadge;
