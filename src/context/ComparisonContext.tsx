import React, { createContext, use, useState, useCallback } from "react";

const SESSION_KEY = "pathway-comparison";
export const MAX_COMPARED = 3;

function loadFromSession(): string[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? (parsed as string[])
          .filter((x) => typeof x === "string")
          .slice(0, MAX_COMPARED)
      : [];
  } catch {
    return [];
  }
}

interface ComparisonContextValue {
  comparedPathwayIds: string[];
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;
  isInComparison: (id: string) => boolean;
  setComparedPathwayIds: (ids: string[]) => void;
}

const ComparisonContext = createContext<ComparisonContextValue | null>(null);
ComparisonContext.displayName = "ComparisonContext";

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comparedPathwayIds, setIds] = useState<string[]>(loadFromSession);

  const addToComparison = useCallback((id: string) => {
    setIds((prev) => {
      if (prev.includes(id) || prev.length >= MAX_COMPARED) return prev;
      const next = [...prev, id];
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const removeFromComparison = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearComparison = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
    setIds([]);
  }, []);

  const isInComparison = useCallback(
    (id: string) => comparedPathwayIds.includes(id),
    [comparedPathwayIds],
  );

  const setComparedPathwayIds = useCallback((ids: string[]) => {
    const next = ids.slice(0, MAX_COMPARED);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {}
    setIds(next);
  }, []);

  return (
    <ComparisonContext
      value={{
        comparedPathwayIds,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        setComparedPathwayIds,
      }}
    >
      {children}
    </ComparisonContext>
  );
};

export function useComparison(): ComparisonContextValue {
  const ctx = use(ComparisonContext);
  if (!ctx)
    throw new Error("useComparison must be used within a ComparisonProvider");
  return ctx;
}
