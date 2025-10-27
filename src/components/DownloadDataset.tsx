// src/components/DownloadDataset.tsx
import React from "react";

type Props = {
  label: string;
  href: string;
  plothref: string;
  summary?: string;
  className?: string;
};

export default function DownloadDataset({
  label,
  href,
  plothref,
  summary,
  className,
}: Props) {
  return (
    <div
      className={[
        "flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4 shadow-sm",
        "bg-white",
        className ?? "",
      ].join(" ")}
    >
      <div className="min-w-0">
        <p className="text-rmigray-700">{label}</p>
        {summary ? (
          <p className="text-xs text-neutral-500 mt-1 truncate">{summary}</p>
        ) : null}
      </div>

      <a
        href={href}
        download
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
      >
        Download
      </a>
      <a
        href={plothref}
        className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
      >
        Plot
      </a>
    </div>
  );
}
