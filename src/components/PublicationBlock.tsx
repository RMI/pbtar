import React from "react";
import { ExternalLink } from "lucide-react";

/** Matches $defs.name in the schema */
export interface NameObj {
  fullName: string;
  shortName?: string;
}

/** Matches $defs.publication in the schema */
export interface Publication {
  title: NameObj; // required
  subtitle?: string;
  author?: string[];
  publisher: NameObj; // required
  year: number; // required
  month?: number;
  day?: number;
  city?: string;
  doi?: string;
  isbn?: string;
  links?: Array<{
    description?: string;
    url: string; // required per item
  }>;
}

/** Prefer short when present, otherwise full name */
function preferShortName(n: NameObj): string {
  return n.shortName?.trim() || n.fullName;
}

/** Title with optional short in parentheses: "Long Title (SHORT)" */
function formatTitleWithShort(title: NameObj, subtitle?: string): string {
  const base = subtitle ? `${title.fullName} (${subtitle})` : title.fullName;
  return title.shortName ? `${base} (${title.shortName})` : base;
}

function formatAuthors(authors?: string[]): string | undefined {
  if (!authors || authors.length === 0) return undefined;
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
  const head = authors.slice(0, -1).join(", ");
  const tail = authors[authors.length - 1];
  return `${head}, & ${tail}`;
}

/** YYYY or YYYY-MM or YYYY-MM-DD if month/day available */
function formatDate(year: number, month?: number, day?: number): string {
  if (!month) return `${year}`;
  const mm = String(month).padStart(2, "0");
  if (!day) return `${year}-${mm}`;
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

/** Label for link button */
function linkLabel(url: string, description?: string): string {
  if (description && description.trim()) return description;
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "Open link";
  }
}

export function formatCitation(pub: Publication): string {
  const lead = preferShortName(pub.publisher); // ACE
  const date = formatDate(pub.year, pub.month, pub.day); // "2024" or "2024-10"
  const title = formatTitleWithShort(pub.title, pub.subtitle); // "8th ASEAN Energy Outlook (AEO8)"
  const pubTail = pub.publisher.shortName
    ? `${pub.publisher.fullName} (${pub.publisher.shortName})`
    : pub.publisher.fullName;
  const city = pub.city ? `, ${pub.city}` : "";
  // Optional authors before title if you ever want them:
  // const authors = formatAuthors(pub.author);
  // const leadSegment = authors ? `${authors} (${date}).` : `${lead} (${date}).`;
  // return `${leadSegment} ${title}. ${pubTail}${city}.`;
  return `${lead} (${date}). ${title}. ${pubTail}${city}.`;
}

export default function PublicationBlock({
  publication,
}: {
  publication: Publication;
}) {
  const links = publication.links ?? [];
  const authors = formatAuthors(publication.author);

  return (
    <section>
      <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
        Data Source
      </h2>

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <div className="text-rmigray-700 mb-3 leading-relaxed">
          <p>{formatCitation(publication)}</p>

          {(publication.doi || publication.isbn || authors) && (
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-rmigray-700">
              {authors && (
                <span className="inline-block rounded bg-neutral-100 px-2 py-1 border border-neutral-200">
                  {authors}
                </span>
              )}
              {publication.doi && (
                <span className="inline-block rounded bg-neutral-100 px-2 py-1 border border-neutral-200">
                  DOI: {publication.doi}
                </span>
              )}
              {publication.isbn && (
                <span className="inline-block rounded bg-neutral-100 px-2 py-1 border border-neutral-200">
                  ISBN: {publication.isbn}
                </span>
              )}
            </div>
          )}
        </div>

        {links.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            {links.map((l, i) => (
              <a
                key={`${l.url}-${i}`}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
              >
                <ExternalLink
                  size={16}
                  className="mr-2"
                />
                {linkLabel(l.url, l.description)}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
