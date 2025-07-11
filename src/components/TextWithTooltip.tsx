import React, { useId, useMemo } from "react";

interface TextWithTooltipProps {
  text: React.ReactNode;
  tooltip: React.ReactNode;
  className?: string;
  position?: "right" | "top" | "bottom" | "left";
}

const TextWithTooltip: React.FC<TextWithTooltipProps> = ({
  text,
  tooltip,
  className = "",
  position = "right",
}) => {
  // Generate a unique ID for this tooltip instance
  const tooltipId = useId();

  // Handle click to blur (remove focus) from tooltip trigger
  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.blur();
  };

  // Handle keydown to allow dismissing tooltip with Escape key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  // Arrow position styles based on tooltip position
  const arrowStyles = useMemo(() => {
    switch (position) {
      case "right":
        return "top-1/2 left-0 transform -translate-x-full -translate-y-1/2 border-r-rmigray-100";
      case "left":
        return "top-1/2 right-0 transform translate-x-full -translate-y-1/2 border-l-rmigray-100";
      case "top":
        return "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-t-rmigray-100";
      case "bottom":
        return "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-b-rmigray-100";
      default:
        return "top-1/2 left-0 transform -translate-x-full -translate-y-1/2 border-r-rmigray-100";
    }
  }, [position]);

  // Tooltip position styles
  const positionStyles = useMemo(() => {
    switch (position) {
      case "right":
        return "left-full ml-0 top-1/2 transform -translate-y-1/2";
      case "left":
        return "right-full mr-0 top-1/2 transform -translate-y-1/2";
      case "top":
        return "bottom-full mb-0 left-1/2 transform -translate-x-1/2";
      case "bottom":
        return "top-full mt-0 left-1/2 transform -translate-x-1/2";
      default:
        return "left-full ml-0 top-1/2 transform -translate-y-1/2";
    }
  }, [position]);

  return (
    <div className={`relative inline-block group ${className}`}>
      <span
        className="cursor-help"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-describedby={tooltipId}
      >
        {text}
      </span>

      {/* Tooltip that shows on group-hover and group-focus */}
      <div
        className={`absolute z-10 ${positionStyles}
                  invisible opacity-0 group-hover:visible group-hover:opacity-100 
                  group-focus-within:visible group-focus-within:opacity-100
                  transition-opacity duration-200 ease-in-out`}
      >
        <div
          className="px-3 py-2 bg-white text-rmigray-500 text-xs rounded shadow-lg max-w-xs opacity-95 border border-rmigray-100"
          id={tooltipId}
          role="tooltip"
        >
          {tooltip}
          {/* Arrow */}
          <div
            className={`absolute border-4 border-transparent ${arrowStyles} opacity-95`}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TextWithTooltip;
