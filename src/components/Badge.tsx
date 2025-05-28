import React from "react";

interface BadgeProps {
  text: string;
  variant?:
    | "default"
    | "category"
    | "temperature"
    | "year"
    | "region"
    | "sector";
}

const Badge: React.FC<BadgeProps> = ({ text, variant = "default" }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "category":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "temperature":
        return "bg-red-100 text-red-800 border-red-200";
      case "year":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "region":
        return "bg-green-100 text-green-800 border-green-200";
      case "sector":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} mr-2 mb-1`}
    >
      {text}
    </span>
  );
};

export default Badge;
