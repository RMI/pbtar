import React from "react";
import {
  Zap,
  Flame,
  Factory,
  Leaf,
  Cable,
  Truck,
  Building2,
  Sprout,
  CircleSlash,
} from "lucide-react";
import { Sector } from "../types";

// Lightweight icon mapping for the high-level Sector union used in filters & badges.
// Icons are chosen to be intuitive, distinct at small sizes (12-14px), and visually balanced.
// If a sector has no perfect semantic icon in lucide, we choose the closest recognizable metaphor.
// Core mapping for canonical Sector union values
const sectorIconMap: Record<Sector, React.ReactElement> = {
  Power: <Zap size={14} aria-hidden="true" className="shrink-0" />,
  "Oil & Gas": <Flame size={14} aria-hidden="true" className="shrink-0" />,
  Coal: <Factory size={14} aria-hidden="true" className="shrink-0" />,
  Renewables: <Leaf size={14} aria-hidden="true" className="shrink-0" />,
  Industrial: <Factory size={14} aria-hidden="true" className="shrink-0" />,
  Transport: <Truck size={14} aria-hidden="true" className="shrink-0" />,
  Buildings: <Building2 size={14} aria-hidden="true" className="shrink-0" />,
  Agriculture: <Sprout size={14} aria-hidden="true" className="shrink-0" />,
  "N/A": <CircleSlash size={14} aria-hidden="true" className="shrink-0" />,
};

// Extended mapping for additional sector labels present in data/tooltips but
// not included in the narrowed Sector union type (e.g., 'Industry', 'Real Estate').
// This avoids widening the union while still giving icons to those labels.
const extendedSectorIconMap: Record<string, React.ReactElement> = {
  Industry: <Factory size={14} aria-hidden="true" className="shrink-0" />,
  "Real Estate": <Building2 size={14} aria-hidden="true" className="shrink-0" />,
};

export const getSectorIcon = (sector: string): React.ReactElement | null => {
  return (sectorIconMap as Record<string, React.ReactElement>)[sector] || extendedSectorIconMap[sector] || null;
};

export default sectorIconMap;