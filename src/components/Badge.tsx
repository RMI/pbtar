import React from "react";

interface BadgeProps {
  text: string;
  tooltip?: string;
  variant?:
    | "default"
    | "category"
    | "temperature"
    | "year"
    | "region"
    | "sector";
}

const Badge: React.FC<BadgeProps> = ({ text, tooltip, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "category":
        return "bg-rmipurple-100 text-rmipurple-800 border-rmipurple-200";
      case "temperature":
        return "bg-rmired-100 text-rmired-800 border-rmired-200";
      case "year":
        return "bg-rmiblue-100 text-rmiblue-800 border-rmiblue-200";
      case "region":
        return "bg-pinishgreen-100 text-pinishgreen-800 border-pinishgreen-200";
      case "sector":
        return "bg-solar-100 text-solar-800 border-solar-200";
      default:
        return "bg-rmigray-100 text-rmigray-800 border-rmigray-200";
    }
  };

   // If no tooltip, just return the basic badge
  if (!tooltip) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} mr-2 mb-1`}
    >
      {text}
    </span>
  );
}

 // With tooltip, use a group for hover/focus behavior
  return (
    <div className="relative inline-block group">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} mr-2 mb-1 cursor-help`}
        tabIndex={0} // Make it focusable
      >
        {text}
      </span>
      
      {/* Tooltip that shows on group-hover and group-focus */}
      <div className="absolute z-10 left-full ml-2 top-1/2 transform -translate-y-1/2
                  invisible opacity-0 group-hover:visible group-hover:opacity-100 
                  group-focus-within:visible group-focus-within:opacity-100
                  transition-opacity duration-200 ease-in-out">
        <div className="px-3 py-2 bg-white text-rmigray-500 text-xs rounded shadow-lg max-w-xs">
          {tooltip}
          {/* Arrow */}
          <div className="absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 border-4 border-transparent border-r-white"></div>
        </div>
      </div>
    </div>
  );
};

export default Badge;
