import React from "react";
import TextWithTooltip from "./TextWithTooltip";
import Badge from "./Badge";

interface NeutralScaleProps {
  /** Ordered scale values, excluding "No information" */
  values: string[];
  selectedValue: string;
  tooltipGetter?: (value: string) => string;
}

const NeutralScale: React.FC<NeutralScaleProps> = ({
  values,
  selectedValue,
  tooltipGetter,
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

export default NeutralScale;
