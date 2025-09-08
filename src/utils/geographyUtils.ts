import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
countries.registerLocale(en);

export type GeographyKind = "global" | "region" | "country";

//Normalize to a safe string: accept strings (and basic primitives), drop everything else.
export function normalizeGeography(raw: unknown): string {
  let s = "";
  if (typeof raw === "string") s = raw;
  else if (typeof raw === "number" || typeof raw === "boolean") s = String(raw);
  else return ""; // objects, null, undefined, symbols, functions → treated as empty

  return s.replace(/[\u200B-\u200D\u2060\uFEFF\u00A0]/g, "").trim();
}

export function geographyKind(raw: string): GeographyKind {
  const s = normalizeGeography(raw ?? "").toLowerCase();
  if (/^global$/i.test(s)) return "global"; // match literal "global"
  if (/^[a-z]{2}$/.test(s) && countries.getName(s, "en")) return "country";
  return "region";
}

// TODO: Does not implement ISO Mapping yet.
export function geographyLabel(raw: string): string {
  const s = normalizeGeography(raw);
  const kind = geographyKind(s);
  if (kind === "global") return "Global";
  if (kind === "country") return s;
  return s; // for region, return as-is
}

export function sortGeographiesForDetails(input: unknown[]): string[] {
  // annotate once for stability + easy grouping
  const annotated = input
    .map((v, idx) => {
      const raw = normalizeGeography(v);
      if (!raw) return null; // drop empties
      const kind = geographyKind(raw); // "global" | "region" | "country"
      // label used only for country sorting; for others we keep default order
      const label = kind === "country" ? geographyLabel(raw) || raw : raw;
      return { idx, raw, kind, label };
    })
    .filter(Boolean) as {
    idx: number;
    raw: string;
    kind: GeographyKind;
    label: string;
  }[];

  const globals = annotated.filter((a) => a.kind === "global"); // keep original order
  const regions = annotated.filter((a) => a.kind === "region"); // keep original order
  const countries = annotated
    .filter((a) => a.kind === "country")
    .sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
    ); // A→Z

  return [...globals, ...regions, ...countries].map((a) => a.raw);
}
