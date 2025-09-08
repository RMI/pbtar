import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
countries.registerLocale(en);

export type GeographyKind = "global" | "region" | "country";

export function geographyKind(raw: string): GeographyKind {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (/^global$/i.test(s)) return "global"; // match literal "global"
  if (/^[a-z]{2}$/.test(s) && countries.getName(s, "en")) return "country";
  return "region";
}
