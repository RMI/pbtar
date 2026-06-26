import React from "react";
import TextWithTooltip from "./TextWithTooltip";
import Badge from "./Badge";

// Segment colors ordered from unfavorable (index 0) to favorable (index n-1)
const COLORS_7 = [
  "bg-rmired-400",
  "bg-rmired-200",
  "bg-rmired-100",
  "bg-neutral-400",
  "bg-success-400",
  "bg-success-600",
  "bg-success-800",
];

const COLORS_3 = ["bg-rmired-400", "bg-neutral-400", "bg-success-600"];

interface SentimentScaleProps {
  /** Ordered scale values, excluding "No information" */
  values: string[];
  selectedValue: string;
  /** Which end of the values array is the favorable/green end */
  greenEnd: "first" | "last";
  tooltipGetter?: (value: string) => string;
}

const SentimentScale: React.FC<SentimentScaleProps> = ({
  values,
  selectedValue,
  greenEnd,
  tooltipGetter,
}) => {
  const isNoInfo = selectedValue === "No information";
  const selectedIndex = values.indexOf(selectedValue);

  // Build per-position color array. Base is unfavorable→favorable; reverse if first value is favorable.
  const baseColors = values.length === 3 ? [...COLORS_3] : [...COLORS_7];
  const colors = greenEnd === "first" ? baseColors.reverse() : baseColors;

  const tooltip =
    !isNoInfo && selectedValue && tooltipGetter
      ? tooltipGetter(selectedValue)
      : undefined;

  return (
    <div>
      <div className="flex gap-0.5 items-center">
        {values.map((value, i) => {
          const isSelected = !isNoInfo && i === selectedIndex;
          return (
            <div
              key={value}
              style={{ flex: 1 }}
              className={`${isSelected ? "h-3" : "h-1.5"} rounded-sm ${colors[i] ?? "bg-neutral-400"} ${
                isNoInfo || !isSelected ? "opacity-20" : ""
              }`}
            />
          );
        })}
      </div>
      <div className="mt-1.5">
        {isNoInfo ? (
          <Badge>No information</Badge>
        ) : selectedValue && selectedIndex >= 0 ? (
          tooltip ? (
            <TextWithTooltip
              text={
                <span className="text-xs text-rmigray-500 cursor-help">
                  {selectedValue}
                </span>
              }
              tooltip={tooltip}
              position="right"
            />
          ) : (
            <span className="text-xs text-rmigray-500">{selectedValue}</span>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SentimentScale;
