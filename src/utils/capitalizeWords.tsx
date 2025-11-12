/**
 * Capitalizes words in a string, handling both space-separated and camelCase strings
 */
export const capitalizeWords = (str: string): string => {
  // First convert camelCase to space-separated
  const withSpaces = str.replace(/([A-Z])/g, " $1");

  return withSpaces
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim();
};
