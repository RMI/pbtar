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

const ISO2 = /^[A-Za-z]{2}$/;

export function toISO2(raw: string): string | null {
  const s = normalizeGeography(raw).toUpperCase();
  if (!s) return null;
  return ISO2.test(s) ? s : null;
}

const NAME_CACHE = new Map<string, string>();
export function countryNameFromISO2(code: string): string | null {
  const cc = toISO2(code);
  if (!cc) return null;
  const cached = NAME_CACHE.get(cc);
  if (cached) return cached;
  const name = countries.getName(cc, "en");
  if (!name) return null;
  NAME_CACHE.set(cc, name);
  return name;
}

export function assertKnownCountryISO2(raw: string): string {
  const iso2 = toISO2(raw);
  if (!iso2) {
    throw new Error(`Not an ISO-2 code: ${raw}`);
  }
  const name = countryNameFromISO2(iso2);
  if (!name) {
    throw new Error(`Unknown ISO-2 country code: ${iso2}`);
  }
  return iso2; // normalized uppercase
}

export function geographyKind(raw: string): GeographyKind {
  const s = normalizeGeography(raw ?? "").toLowerCase();
  if (/^global$/i.test(s)) return "global"; // match literal "global"
  if (toISO2(raw) && countryNameFromISO2(raw)) return "country";
  return "region";
}

// TODO: Does not implement ISO Mapping yet.
export function geographyLabel(raw: string): string {
  const s = normalizeGeography(raw);
  if (!s) return "";
  const kind = geographyKind(s);
  if (kind === "global") return "Global";
  const name = countryNameFromISO2(s);
  return name ?? s; // country name if known; else passthrough
}

/** Tooltip: Countries → 'Full name (ISO2)'; else raw text. */
export function geographyTooltip(raw: string): string {
  const s = normalizeGeography(raw);
  if (!s) return "";
  const iso2 = toISO2(s);
  const name = iso2 && countryNameFromISO2(iso2);
  if (iso2 && name) return `${geographyLabel(name)} (${iso2})`;
  return geographyLabel(s);
}

export function sortGeographiesForDetails(input: unknown[]): string[] {
  const annotated = input
    .map((v, idx) => {
      const raw = normalizeGeography(v);
      if (!raw) return null;
      const kind = geographyKind(raw);
      const iso2Maybe = toISO2(raw);
      const iso2 = kind === "country" && iso2Maybe ? iso2Maybe : null;
      const label = geographyLabel(raw); // used for display; sorting uses iso2
      return { idx, raw, kind, iso2, label };
    })
    .filter(
      (
        x,
      ): x is {
        idx: number;
        raw: string;
        kind: GeographyKind;
        iso2: string | null;
        label: string;
      } => !!x,
    );

  const globals = annotated.filter((a) => a.kind === "global"); // keep input order
  const regions = annotated.filter((a) => a.kind === "region"); // keep input order
  const countries = annotated
    .filter((a) => a.kind === "country")
    .sort((a, b) => (a.iso2! < b.iso2! ? -1 : a.iso2! > b.iso2! ? 1 : 0)); // A→Z by ISO2

  return [...globals, ...regions, ...countries].map((a) => a.raw);
}
