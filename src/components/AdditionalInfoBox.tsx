// src/components/AdditionalInfoBox.tsx
import React from "react";
import clsx from "clsx";

type Props = {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

/** Shared visual container for PublicationBlock and DownloadDataset */
export default function AdditionalInfoBox({
  title,
  children,
  actions,
  className,
}: Props) {
  return (
    <section className="mt-8">
      {title && (
        <h3 className="text-sm font-semibold text-neutral-600 mb-3">{title}</h3>
      )}
      <div
        className={clsx(
          "w-full bg-white border border-neutral-200 rounded-lg p-4 shadow-sm",
          className,
        )}
      >
        <div className="flex justify-between gap-4">
          <div className="min-w-0 flex-1">{children}</div>
          {actions && (
            <div className="flex flex-col items-end gap-2 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
