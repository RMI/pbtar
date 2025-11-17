import React, { useMemo } from "react";
import { StepPageDiscrete, StepOption, StepRendererProps } from "./StepPage";

export interface RemapCategory {
  /** The category label shown on the button */
  label: string;
  /** The underlying raw filter values this category represents */
  values: Array<string | number>;
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
    const sel = new Set(value);
    return categories.map((cat) => {
      const catValues = normalize(cat.values);
      const selectedCount = catValues.reduce(
        (acc, v) => acc + (sel.has(v) ? 1 : 0),
        0,
      );
      const total = catValues.length;

      // Show counts in the label; keeps shared UI unchanged
      const labelWithCounts =
        total > 0 ? `${cat.label} (${selectedCount}/${total})` : cat.label;

      return {
        id: cat.label,
        title: labelWithCounts,
        value: cat.label, // we use label as the synthetic value/key
      };
    });
  }, [categories, value, normalize]);

  // A category is "selected" when *all* of its raw values are selected
  const isCategorySelected = (label: string): boolean => {
    const cat = categories.find((c) => c.label === label);
    if (!cat) return false;
    const catValues = normalize(cat.values);
    if (catValues.length === 0) return false;
    const sel = new Set(value);
    return catValues.every((v) => sel.has(v));
  };

  // Toggle: add/remove all mapped values
  const toggleCategory = (label: string) => {
    const cat = categories.find((c) => c.label === label);
    if (!cat) return;
    const catValues = normalize(cat.values);

    const next = new Set(value);
    const allSelected =
      catValues.length > 0 && catValues.every((v) => next.has(v));

    if (allSelected) {
      catValues.forEach((v) => next.delete(v));
    } else {
      catValues.forEach((v) => next.add(v));
    }

    onChange(Array.from(next));
  };

  return (
    <StepPageDiscrete
      title={title}
      description={description}
      options={categoryOptions}
      value={value}
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
