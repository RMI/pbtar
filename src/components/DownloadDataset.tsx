// src/components/DownloadDataset.tsx
import React from "react";
import AdditionalInfoBox from "./AdditionalInfoBox";

type Props = {
  label: string;
  href: string;
  summary?: string;
  className?: string;
};

export default function DownloadDataset({
  label,
  href,
  summary,
  className,
}: Props) {
  return (
    <AdditionalInfoBox
      title="Related Dataset"
      className={className}
      actions={
        <a
          href={href}
          download
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
        >
          Download
        </a>
      }
    >
      <p className="text-rmigray-700">{label}</p>
      {summary && (
        <p className="text-xs text-neutral-500 mt-1 truncate">{summary}</p>
      )}
      <p className="text-xs text-rmigray-700 mt-1">
        Note: Minor deviations from the source data may occur due to light processing required for standardizing pathways to a common format.
      </p>
    </AdditionalInfoBox>
  );
}
