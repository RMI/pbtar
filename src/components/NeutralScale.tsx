import React from "react";
import TextWithTooltip from "./TextWithTooltip";
import Badge from "./Badge";

export const NEUTRAL_SELECTED_COLOR = {
  bg: "bg-rmiblue-400",
  text: "text-rmiblue-400",
};

interface NeutralScaleProps {
  /** Ordered scale values, excluding "No information" */
  values: string[];
  selectedValue: string;
  tooltipGetter?: (value: string) => string;
  /** When false, suppresses the label/badge rendered below the scale bars */
  showLabel?: boolean;
}

const NeutralScale: React.FC<NeutralScaleProps> = ({
  values,
  selectedValue,
  tooltipGetter,
  showLabel = true,
}) => {
  const isNoInfo =
    selectedValue === "No information" || !values.includes(selectedValue);
  const selectedIndex = values.indexOf(selectedValue);

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
              className={`${isSelected ? "h-3" : "h-1.5"} rounded-sm ${
                isSelected ? "bg-rmiblue-400" : "bg-neutral-200"
              }`}
            />
          );
        })}
      </div>
      {showLabel && (
        <div className="mt-1.5">
          {isNoInfo ? (
            <Badge>No information</Badge>
          ) : selectedValue && selectedIndex >= 0 ? (
            tooltip ? (
              <TextWithTooltip
                text={
                  <span className={`text-xs font-semibold cursor-help ${NEUTRAL_SELECTED_COLOR.text}`}>
                    {selectedValue}
                  </span>
                }
                tooltip={tooltip}
                position="right"
              />
            ) : (
              <span className={`text-xs font-semibold ${NEUTRAL_SELECTED_COLOR.text}`}>{selectedValue}</span>
            )
          ) : null}
        </div>
      )}
    </div>
  );
};

export default NeutralScale;
