const getTemperatureColor = (temp: number): string => {
  // Define temperature ranges and corresponding colors
  // Using colors from the style guide
  if (temp <= 1.5) return "bg-pinishgreen-100"; // Yellowish
  if (temp <= 2.0) return "bg-solar-100";
  if (temp <= 2.5) return "bg-solar-200";
  if (temp <= 3.0) return "bg-rmired-100"; // Orange
  if (temp <= 3.5) return "bg-rmired-200";
  return "bg-rmired-400"; // Red for higher temperatures
};

export default getTemperatureColor;
