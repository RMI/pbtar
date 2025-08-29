// Function to prioritize items that match the search term
export const prioritizeMatches = <T extends string | { name: string }>(
  items: T[],
  searchTerm: string,
): T[] => {
  if (!searchTerm.trim()) return items;

  return [...items].sort((a, b) => {
    const textA = typeof a === "string" ? a : a.name;
    const textB = typeof b === "string" ? b : b.name;

    const matchesA = textA.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesB = textB.toLowerCase().includes(searchTerm.toLowerCase());

    if (matchesA && !matchesB) return -1;
    if (!matchesA && matchesB) return 1;
    return 0;
  });
};
