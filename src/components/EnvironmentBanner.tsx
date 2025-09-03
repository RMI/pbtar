import React from "react";

const EnvironmentBanner: React.FC = () => {
  const mode = (import.meta.env.MODE ?? "development")
  .trim()
  .toLowerCase(); // "development", "production", "staging", etc.

  const isProd = mode==="production"; // boolean at build time
  if (isProd) return null; // hide on real prod builds

  const bgColor =
    mode.startsWith("develop") ? "bg-red-500" :
    mode.startsWith("staging") ? "bg-yellow-500" :
    mode.startsWith("pr-")      ? "bg-indigo-500" :
                                   "bg-pink-500";

  return (
    <div
      className={`${bgColor} text-white text-center py-1 text-sm font-medium sticky top-0 left-0 right-0 z-50`}
    >
      {mode.toUpperCase()} Environment
    </div>
  );
};

export default EnvironmentBanner;
