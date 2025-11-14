import React from "react";

export type StepOption = {
  id: string;
  title: string;
  value: string | number;
};

export interface StepPageProps {
  title: string;
  description?: string;
  options: StepOption[];
  isSelected: (value: string | number) => boolean;
  onSelect: (value: string | number) => void;
}

const StepPageDefault: React.FC<StepPageProps> = ({
  title,
  description,
  options,
  isSelected,
  onSelect,
}) => {
  return (
    <>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-rmigray-800">{title}</h3>
        {description ? <p className="text-rmigray-600">{description}</p> : null}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.value)}
              className={`p-4 border rounded-lg transition-colors bg-gray-50 ${
                selected
                  ? "border-energy bg-energy-50"
                  : "hover:border-energy hover:bg-energy-50"
              }`}
            >
              {option.title}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default StepPageDefault;
