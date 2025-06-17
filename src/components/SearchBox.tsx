import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div
      className={`flex items-center w-full max-w-2xl rounded-md border transition-all duration-200 bg-white ${
        isFocused
          ? "border-energy-400 ring-2 ring-energy-100"
          : "border-neutral-300"
      }`}
    >
      <div className="pl-3 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Search scenarios..."
        className="w-full py-3 px-3 text-rmigray-700 focus:outline-none text-sm md:text-base"
        maxLength={250}
      />
      {value && (
        <button
          onClick={onClear}
          className="pr-3 text-rmigray-400 hover:text-rmigray-600 transition-colors duration-150"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBox;
