import React from "react";

const ResourcesChangelogPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Changelog</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        What’s changed in TPR
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        This page tracks major updates to repository coverage, classifications,
        features, and documentation.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        We publish major updates here so users can quickly understand what
        changed and whether it affects their workflow.
      </p>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What we track
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Coverage updates
            </h3>
            <p className="text-rmigray-700">
              New sectors, regions, pathway sources, or benchmark datasets.
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Classification updates
            </h3>
            <p className="text-rmigray-700">
              Changes to pathway tags, definitions, or interpretation guidance.
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Product updates
            </h3>
            <p className="text-rmigray-700">
              Changes to filtering, search, detail view, downloads, or
              navigation.
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Documentation updates
            </h3>
            <p className="text-rmigray-700">
              Updates to methodology, use cases, or contact guidance.
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Known limitations
            </h3>
            <p className="text-rmigray-700">
              Important gaps users should be aware of.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Entry format
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700 mb-3">Each update includes:</p>
          <ul className="list-disc pl-5 space-y-1 text-rmigray-700">
            <li>date,</li>
            <li>short headline,</li>
            <li>one-sentence explanation,</li>
            <li>update type.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourcesChangelogPage;
