import React from "react";

const ResourcesChangelogPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">
        Blog / Changelog
      </h1>
      <p className="text-rmigray-700 max-w-3xl">
        This page will track major updates to the repository, new datasets, and
        improvements to classification and filtering.
      </p>

      <div className="mt-8 max-w-3xl">
        <div className="rounded-lg bg-white shadow p-6">
          <h2 className="text-lg font-semibold text-rmigray-800 mb-1">
            Coming soon
          </h2>
          <p className="text-rmigray-700">
            We’ll publish release notes and short posts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesChangelogPage;
