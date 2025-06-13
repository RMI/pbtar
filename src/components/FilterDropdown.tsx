import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  selectedValue: string | null;
  onChange: (value: string | null) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option === selectedValue ? null : option);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between min-w-32 px-3 py-2 text-sm font-medium rounded-md border ${
          selectedValue
            ? "text-energy-800 bg-energy-100 border-energy-100"
            : "text-rmigray-700 bg-white border-neutral-300 hover:bg-neutral-100"
        } transition-colors duration-150`}
      >
        <span>{selectedValue || label}</span>
        {selectedValue ? (
          <X
            size={16}
            className="ml-2 text-rmigray-500 hover:text-rmigray-700"
            onClick={handleClear}
          />
        ) : (
          <ChevronDown
            size={16}
            className="ml-2 text-rmigray-500"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-neutral-200 py-1 max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 text-sm cursor-pointer ${
                option === selectedValue
                  ? "bg-energy-100 text-energy-800"
                  : "text-rmigray-700 hover:bg-neutral-100"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
