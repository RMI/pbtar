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
  // Normalize inputs to ensure consistent behavior
  const normalizedText = String(text ?? "");
  const normalizedTerm = String(searchTerm ?? "");

  if (!normalizedTerm.trim()) {
    return <span className={className}>{normalizedText}</span>;
  }

  // Split text by the search term (case-insensitive)
  const parts = normalizedText.split(
    new RegExp(
      `(${normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi",
    ),
  );

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.toLowerCase() === normalizedTerm.toLowerCase() ? (
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
