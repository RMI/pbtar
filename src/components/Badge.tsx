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

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getVariantStyles()} mr-2 mb-1`}
    >
      {text}
    </span>
  );
};

export default Badge;
