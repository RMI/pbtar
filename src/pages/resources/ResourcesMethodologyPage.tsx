import React from "react";

const ResourcesMethodologyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Methodology</h1>
      <p className="text-rmigray-700 max-w-3xl">
        This page explains how pathways are classified in the Transition
        Pathways Repository, including the definitions used for pathway
        attributes and how to interpret them.
      </p>

      <div className="mt-8 space-y-6 max-w-3xl">
        <section>
          <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
            How pathway types are classified
          </h2>
          <p className="text-rmigray-700">
            We group pathways by their intent and construction approach. For
            example, some pathways explore a range of possible futures
            (exploratory), while others work backward from a target end state
            (normative).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
            Interpreting benchmark fields
          </h2>
          <p className="text-rmigray-700">
            Fields like modeled temperature increase, net-zero year, and key
            features are intended to make pathways comparable at a glance.
            Always consult the original publication for detailed assumptions.
          </p>
        </section>
      </div>
    </div>
  );
};

export default ResourcesMethodologyPage;
