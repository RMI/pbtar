import React from "react";

const ResourcesBenchmarksPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">
        Using pathways as benchmarks
      </h1>
      <p className="text-rmigray-700 max-w-3xl">
        This page provides guidance on how to use transition pathways as
        benchmarks for corporate transition assessments.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
            Scope selection
          </h2>
          <p className="text-rmigray-700">
            Choose pathways that match your sector, geography, and relevant
            metrics. Prefer pathways that are transparent about assumptions.
          </p>
        </div>
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
            Benchmarking approach
          </h2>
          <p className="text-rmigray-700">
            Compare your transition plan against pathway trajectories and
            milestones. Use multiple pathways when appropriate to capture
            uncertainty.
          </p>
        </div>
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
            Reporting
          </h2>
          <p className="text-rmigray-700">
            Document why a pathway was selected, how it was applied, and the
            limitations of the comparison.
          </p>
        </div>
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
            Next steps
          </h2>
          <p className="text-rmigray-700">
            Combine benchmark insights with governance, capital allocation, and
            credible transition actions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesBenchmarksPage;
