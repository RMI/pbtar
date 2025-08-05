import React from "react";

interface HighlightedTextProps {
  text: string;
  searchTerm: string;
  className?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  searchTerm,
  className = "",
}) => {
  if (!searchTerm.trim()) {
    return <span className={className}>{text}</span>;
  }

  // Split text by the search term (case-insensitive)
  const parts = text.split(
    new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
  );

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <mark
            key={i}
            className="bg-energy-100 text-energy-800 px-0.5 rounded-sm font-medium"
          >
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default HighlightedText;
