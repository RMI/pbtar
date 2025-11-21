import React, { useMemo } from "react";
import { StepPageDiscrete, StepOption, StepRendererProps } from "./StepPage";

export interface RemapCategory {
  /** The category label shown on the button */
  label: string;
  /** The underlying raw filter values this category represents */
  values: Array<string | number>;
  description?: string;
}

export type StepPageRemapProps = StepRendererProps & {
  /** Category → raw values remapping */
  categories: RemapCategory[];
  /** Clamp category values to those present in options */
  clampToAvailable?: boolean;
};

const StepPageRemap: React.FC<StepPageRemapProps> = ({
  title,
  description,
  options,
  value,
  selectionMode,
  onChange,
  categories,
  clampToAvailable = true,
}) => {
  // quick lookup of available values (from global options provider)
  const available = useMemo(
    () => new Set(options.map((o) => o.value)),
    [options],
  );

  const normalize = (vals: Array<string | number>) =>
    clampToAvailable ? vals.filter((v) => available.has(v)) : vals;

  // Build synthetic UI options: each category becomes a single tile option
  const categoryOptions: StepOption[] = useMemo(() => {
    return categories.map((cat) => {
      return {
        id: cat.label,
        title: cat.label,
        description: cat.description,
        value: cat.label, // we use label as the synthetic value/key
      };
    });
  }, [categories]);

  return (
    <StepPageDiscrete
      title={title}
      description={description}
      options={categoryOptions}
      value={value}
      selectionMode={selectionMode}
      mapSelect={(label) => {
        const cat = categories.find((c) => c.label === String(label));
        return cat ? normalize(cat.values) : [];
      }}
      /* Omit getState — StepPageDiscrete will compute partial/on/off using mapSelect */
      onChange={onChange}
    />
  );
};

export default StepPageRemap;
