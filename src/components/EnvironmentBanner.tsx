import React from "react";

const EnvironmentBanner: React.FC = () => {
  const environment: string = import.meta.env.VITE_BUILD_MODE || "development";

  if (environment === "production") {
    return null;
  }

  const getBgColor = () => {
    const lowerEnv = (environment ?? "").toLowerCase();
    if (lowerEnv.startsWith("develop")) {
      return "bg-red-500";
    } else if (lowerEnv.startsWith("staging")) {
      return "bg-yellow-500";
    } else if (lowerEnv.startsWith("pr-")) {
      return "bg-indigo-500";
    } else {
      return "bg-pink-500";
    }
  };

  return (
    <div
      className={`${getBgColor()} text-white text-center py-1 text-sm font-medium fixed top-0 left-0 right-0 z-50`}
    >
      {environment.toUpperCase()} Environment
    </div>
  );
};

export default EnvironmentBanner;
