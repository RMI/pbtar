import React from "react";

const ResourcesMethodologyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Methodology</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        How pathways are classified in TPR
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        TPR helps users compare pathways in a consistent way. The
        classifications are designed to show what a pathway is useful for, what
        assumptions sit behind it, and what kind of benchmark data it can
        provide.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        The goal is not to tell users which pathway is “best” in general. The
        goal is to help them choose the most useful pathway for their specific
        question.
      </p>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Start with the question
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            Before choosing a pathway, be clear about the question you are
            trying to answer.
          </p>
          <p className="text-rmigray-700 mt-3">For example:</p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>Are you testing target ambition?</li>
            <li>Checking investment alignment?</li>
            <li>Looking at policy exposure?</li>
            <li>Assessing technology feasibility?</li>
          </ul>
          <p className="text-rmigray-700 mt-3">
            The right pathway depends on the use case.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What TPR helps you compare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
              Credibility
            </h3>
            <p className="text-rmigray-700">
              Who produced the pathway, and was it developed through a robust
              process?
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
              Pathway type and features
            </h3>
            <p className="text-rmigray-700">
              What kind of pathway is it, and what drives the results?
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
              Coverage
            </h3>
            <p className="text-rmigray-700">
              Which sectors and geographies are covered?
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
              Granularity
            </h3>
            <p className="text-rmigray-700">
              How detailed is the pathway across technologies, geography, and
              time?
            </p>
          </div>

          <div className="rounded-lg bg-white shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
              Benchmark data availability
            </h3>
            <p className="text-rmigray-700">
              What outputs are actually available for comparison with company
              data?
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Plain-language definitions
        </h2>
        <div className="rounded-lg bg-white shadow p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Transition pathway
            </h3>
            <p className="text-rmigray-700">
              A forward-looking view of how a sector, region, or economy could
              change over time.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Scenario
            </h3>
            <p className="text-rmigray-700">
              A modeled pathway built from a structured set of assumptions.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Benchmark
            </h3>
            <p className="text-rmigray-700">
              A data point from a pathway that can be compared with company
              data.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          How to interpret pathway type
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Predictive
            </h3>
            <p className="text-rmigray-700">
              Shows what the pathway developer thinks is likely to happen.
              Often useful for risk and feasibility questions.
            </p>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Exploratory
            </h3>
            <p className="text-rmigray-700">
              Shows what could happen under a different set of assumptions.
              Useful for testing uncertainty, opportunity, and risk.
            </p>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Normative
            </h3>
            <p className="text-rmigray-700">
              Starts with a target end state, such as a temperature goal, and
              works backward. Often useful for ambition and alignment
              questions.
            </p>
          </div>
          <div className="rounded-lg bg-white shadow p-6">
            <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
              Policy-based
            </h3>
            <p className="text-rmigray-700">
              Derived from stated or expected policy, such as national plans or
              policy commitments. Often useful for policy alignment and
              regulatory risk.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-5xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          How to interpret other classifications
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
                Temperature outcome
              </h3>
              <p className="text-rmigray-700">
                Helpful when the question is about ambition or climate
                alignment. Not every pathway has one.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
                Main drivers of change
              </h3>
              <p className="text-rmigray-700">
                Look at whether the pathway is mainly driven by policy,
                technology cost, deployment rates, or demand shifts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
                Geographic coverage
              </h3>
              <p className="text-rmigray-700">
                Global pathways are not always enough for country or regional
                questions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
                Technology granularity
              </h3>
              <p className="text-rmigray-700">
                A pathway may cover a sector but still be too broad for a
                technology-specific question.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-rmigray-800 mb-1">
                Temporal granularity
              </h3>
              <p className="text-rmigray-700">
                Five-year steps may be fine for some uses, but not for others.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-4xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Important interpretation note
        </h2>
        <p>
          A strong pathway for one task may be weak for another.
        </p>
        <p className="mt-3">
          For example, a global normative pathway may be useful for target
          ambition, while a regional policy-driven pathway may be better for
          assessing local market or regulatory exposure.
        </p>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What TPR does not do
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            TPR helps users choose and interpret pathways. It does not replace
            analyst judgment, company data review, or full transition assessment
            methodology.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-4xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <p>
          <span className="font-semibold">Looking for more detail?</span> Link to a
          downloadable guide such as{" "}
          <span className="font-semibold">Detailed methodology and classification rules</span>.
        </p>
      </div>
    </div>
  );
};

export default ResourcesMethodologyPage;
