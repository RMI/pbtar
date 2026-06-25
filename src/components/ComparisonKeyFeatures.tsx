import React from "react";
import { PathwayMetadataType } from "../types";
import { GROUPS, FeatureItem } from "./KeyFeatures";

interface ComparisonKeyFeaturesProps {
  pathways: PathwayMetadataType[];
}

const ComparisonKeyFeatures: React.FC<ComparisonKeyFeaturesProps> = ({
  pathways,
}) => {
  const n = pathways.length;

  return (
    <div
      className="grid gap-x-6"
      style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
    >
      {GROUPS.map((group) => (
        <React.Fragment key={group.label}>
          {/* Group header — spans all pathway columns */}
          <div
            className="border-t border-neutral-200 pt-3 pb-1 mt-2"
            style={{ gridColumn: "1 / -1" }}
          >
            <h4 className="text-xs font-semibold text-rmigray-500 uppercase tracking-wide">
              {group.label}
            </h4>
          </div>

          {/* One row per feature: N cells auto-placed side by side.
              CSS grid assigns them to the same row; row height = tallest cell. */}
          {group.features.flatMap((feature) =>
            pathways.map((pathway, i) => (
              <div
                key={`${feature.key}-${i}`}
                className="pb-4 min-w-0"
              >
                <FeatureItem
                  feature={feature}
                  keyFeatures={pathway.keyFeatures}
                />
              </div>
            )),
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ComparisonKeyFeatures;
