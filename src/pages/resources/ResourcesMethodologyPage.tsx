import React from "react";
import { Link } from "react-router-dom";

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h3 className="text-lg font-semibold text-rmigray-800 mb-2">{title}</h3>
      <div className="text-rmigray-700">{children}</div>
    </div>
  );
};

const ResourcesMethodologyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Methodology</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        How TPR classifies pathways and how to interpret those classifications
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        TPR uses a structured classification approach to help users compare
        pathways consistently.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        These classifications are designed to support pathway selection and
        interpretation. They do not determine a single “best” pathway. The
        relevance of any classification depends on the question the user is
        trying to answer.
      </p>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Core definitions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Transition pathway">
            <p>
              A broad term for forward-looking descriptions of how companies,
              sectors, or regions may evolve over time.
            </p>
            <p className="mt-3">
              This can include anything from detailed models to simple policy
              targets.
            </p>
          </InfoCard>

          <InfoCard title="Scenario">
            <p>A subset of pathways derived from systematic modeling.</p>
            <p className="mt-3">
              Scenarios are often more structured and detailed than other
              pathway types.
            </p>
          </InfoCard>

          <InfoCard title="Benchmark">
            <p>
              A specific data point from a pathway that can be compared with
              company data.
            </p>
            <p className="mt-3">
              A single pathway may provide many possible benchmarks, while
              others may provide only a few.
            </p>
          </InfoCard>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 1: Pathway features
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          These classifications help explain how a pathway was constructed, what
          type of information it can provide, and how results should be
          interpreted.
        </p>

        <div className="mt-6 max-w-5xl">
          <h3 className="text-lg font-semibold text-rmigray-800 mb-3">
            Pathway type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Predictive">
              <p>
                Predictive pathways begin with assumptions considered probable
                by the developer and project likely future outcomes.
              </p>
              <p className="mt-3">
                These are often useful for assessing risk and feasibility.
              </p>
            </InfoCard>

            <InfoCard title="Exploratory">
              <p>
                Exploratory pathways test the impact of different assumptions
                that are plausible but not necessarily predicted.
              </p>
              <p className="mt-3">
                These are often useful for assessing risks and opportunities
                under alternative policy, market, or technology conditions.
              </p>
            </InfoCard>

            <InfoCard title="Normative">
              <p>
                Normative pathways begin with a target end state, often a
                climate outcome such as 1.5°C, and work backward to produce a
                pathway consistent with that goal.
              </p>
              <p className="mt-3">
                These are often useful for ambition and alignment questions.
              </p>
            </InfoCard>

            <InfoCard title="Policy-based">
              <p>
                Policy-based pathways derive benchmarks directly from legal or
                announced policy, such as national plans or NDCs.
              </p>
              <p className="mt-3">
                These are often useful for policy alignment and regulatory risk
                questions.
              </p>
            </InfoCard>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          <InfoCard title="Temperature outcome">
            <p>
              Where available, temperature outcome acts as a proxy for pathway
              ambition.
            </p>
            <p className="mt-3">
              It is most commonly associated with global pathways that can be
              linked to a carbon budget.
            </p>
            <p className="mt-3">
              Many regional or sector-specific pathways do not have a clear
              temperature outcome, even when they are still useful for other
              applications.
            </p>
          </InfoCard>

          <InfoCard title="Pathway coverage">
            <p>
              This classification describes which sectors and geographies are in
              scope.
            </p>
            <p className="mt-3">
              Coverage matters because a pathway is only useful if it includes
              the relevant sector and geographic context for the question at
              hand.
            </p>
          </InfoCard>

          <InfoCard title="Main drivers of change">
            <p>
              Pathways typically rely on a small number of core drivers to
              produce results.
            </p>
            <p className="mt-3">These may include:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>policy assumptions,</li>
              <li>technology costs,</li>
              <li>technology deployment,</li>
              <li>demand shifts.</li>
            </ul>
            <p className="mt-3">
              The main drivers of change strongly shape how a pathway should be
              interpreted. For example, a pathway driven by aggressive policy
              assumptions may be useful for assessing regulatory exposure,
              while a pathway driven by breakthrough technology assumptions may
              be less useful for judging near-term feasibility.
            </p>
          </InfoCard>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 2: Granularity
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          Granularity refers to the level of detail in pathway inputs,
          assumptions, and outputs.
        </p>
        <p className="text-rmigray-700 max-w-5xl">
          This matters because a pathway can appear relevant at a high level
          but still be too coarse for the intended application.
        </p>

        <div className="mt-6 max-w-5xl">
          <h3 className="text-lg font-semibold text-rmigray-800 mb-3">
            Key pathway elements to review
          </h3>
          <div className="rounded-lg bg-white shadow p-6">
            <p className="text-rmigray-700">
              Depending on the pathway, relevant elements may include:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
              <li>policy factors,</li>
              <li>technology costs,</li>
              <li>technology deployment rates,</li>
              <li>demand changes,</li>
              <li>upstream supply,</li>
              <li>enabling infrastructure.</li>
            </ul>
            <p className="text-rmigray-700 mt-3">
              The importance of each element depends on the question being
              asked.
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-5xl">
          <h3 className="text-lg font-semibold text-rmigray-800 mb-3">
            Dimensions of granularity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Definition of element">
              <p>
                Different pathways may define the same element differently.
              </p>
              <p className="mt-3">
                For example, one pathway may define policy narrowly as carbon
                pricing only, while another includes mandates and subsidies.
              </p>
            </InfoCard>

            <InfoCard title="Geographic granularity">
              <p>
                This refers to the spatial resolution of pathway assumptions and
                outputs.
              </p>
              <p className="mt-3">
                A pathway may use global averages, regional values, national
                assumptions, or subnational detail.
              </p>
            </InfoCard>

            <InfoCard title="Technological granularity">
              <p>This refers to how finely technologies are broken down.</p>
              <p className="mt-3">
                For example, a pathway may model wind as a single category or
                separate onshore and offshore wind.
              </p>
            </InfoCard>

            <InfoCard title="Temporal granularity">
              <p>This refers to how often results are provided over time.</p>
              <p className="mt-3">
                A pathway may provide annual data, 5-year increments, or wider
                intervals.
              </p>
            </InfoCard>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
          Classification group 3: Benchmark data availability
        </h2>
        <p className="text-rmigray-700 max-w-5xl">
          A pathway may be technically sophisticated but still not provide the
          output data needed for benchmarking.
        </p>
        <p className="text-rmigray-700 max-w-5xl">
          TPR therefore separates pathway detail from benchmark availability.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          <InfoCard title="Metric availability">
            <p>
              The pathway should provide the specific metric needed for
              comparison, or enough information to derive it.
            </p>
            <p className="mt-3">Examples include:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>emissions intensity,</li>
              <li>capacity,</li>
              <li>generation,</li>
              <li>technology share,</li>
              <li>retirement timing.</li>
            </ul>
          </InfoCard>

          <InfoCard title="Sector scope compatibility">
            <p>
              Benchmark data should match the relevant scope of economic
              activity.
            </p>
            <p className="mt-3">
              For example, a sector benchmark that includes upstream activities
              may not be directly comparable to a company benchmark that does
              not.
            </p>
          </InfoCard>

          <InfoCard title="Emissions scope compatibility">
            <p>
              For emissions-based benchmarks, the greenhouse gases included may
              differ across sources.
            </p>
            <p className="mt-3">
              This affects comparability and may require adjustment.
            </p>
          </InfoCard>

          <InfoCard title="Technology availability">
            <p>
              Some use cases require data disaggregated by technology rather
              than sector totals.
            </p>
            <p className="mt-3">
              Technology availability depends partly on the granularity of the
              underlying pathway and partly on what outputs are published.
            </p>
          </InfoCard>

          <InfoCard title="Geographic availability">
            <p>
              Benchmark data may be available only at global or regional level,
              even when a user needs country-level comparison.
            </p>
            <p className="mt-3">
              This can limit usefulness for policy, risk, or feasibility
              questions.
            </p>
          </InfoCard>

          <InfoCard title="Temporal availability">
            <p>
              Some pathways provide values only for selected years.
              Interpolation may be possible in some cases, but wide gaps
              increase uncertainty.
            </p>
          </InfoCard>
        </div>
      </div>

      <div className="mt-10 max-w-5xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Interpretation notes
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-rmigray-800">
              A credible pathway may still be the wrong fit
            </h3>
            <p className="mt-2">
              Credibility is necessary, but not sufficient.
            </p>
            <p className="mt-2">
              A pathway can be robust and well developed, yet still be too
              broad, too generic, or missing the benchmark data needed for a
              given application.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-rmigray-800">
              Multiple pathways can complement each other
            </h3>
            <p className="mt-2">
              Different pathways can help answer different parts of the same
              assessment question.
            </p>
            <p className="mt-2">
              For example, one pathway may be useful for ambition and another
              for regional policy risk.
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold text-rmigray-800">
              Classifications support comparison, not automatic selection
            </h3>
            <p className="mt-2">
              TPR classifications are meant to make comparison easier and more
              transparent.
            </p>
            <p className="mt-2">
              They help users understand what a pathway can and cannot tell
              them, but they do not replace analyst judgment.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-5xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Looking for practical guidance?
        </h2>
        <p>
          Visit{" "}
          <Link
            to="/resources/how-to-choose-a-pathway"
            className="text-energy-700 hover:text-energy-800 underline underline-offset-2 font-semibold"
          >
            How to Choose a Pathway
          </Link>
          {" "}for a simpler, step-by-step guide to applying these
          classifications in TPR.
        </p>
      </div>
    </div>
  );
};

export default ResourcesMethodologyPage;
