import React from "react";

type UseCaseCardProps = {
  title: string;
  subtitle: string;
  bullets: string[];
};

const UseCaseCard: React.FC<UseCaseCardProps> = ({
  title,
  subtitle,
  bullets,
}) => {
  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h2 className="text-lg font-semibold text-rmigray-800 mb-1">{title}</h2>
      <p className="text-sm text-rmigray-600 mb-4">{subtitle}</p>
      <ul className="list-disc pl-5 space-y-2 text-rmigray-700">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
};

const ResourcesUseCasesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Use Cases</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        Use pathways to make corporate transition assessments more
        decision-useful
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        The Transition Pathways Repository helps financial institutions find and
        compare transition pathways for corporate transition assessments.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        It is designed to make pathway selection faster, more transparent, and
        more practical. Instead of asking only whether a company has a
        transition plan, users can also ask whether that plan looks ambitious,
        feasible, and relevant in the markets where the company operates.
      </p>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Who this is for
        </h2>

        <div className="rounded-lg bg-white shadow p-6">
          <h3 className="text-lg font-semibold text-rmigray-800 mb-2">
            Built first for bank analysts
          </h3>
          <p className="text-rmigray-700">
            TPR is designed primarily for teams in banks that use external
            benchmarks to assess company transition plans and investment
            strategies, especially:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>Sustainability teams</li>
            <li>Risk teams</li>
            <li>Front-office and client coverage teams</li>
          </ul>

          <h3 className="text-lg font-semibold text-rmigray-800 mt-6 mb-2">
            Also useful for
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-rmigray-700">
            <li>Companies improving their transition plans</li>
            <li>Policymakers and regulators tracking sector bottlenecks</li>
            <li>Other financial institutions using transition assessments</li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Main use cases for banks
        </h2>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          <UseCaseCard
            title="Assess target ambition"
            subtitle="Compare a company’s targets with external pathways."
            bullets={[
              "Classify ambition: understand whether targets look leading, lagging, or broadly aligned.",
              "Anchor expectations: use pathway milestones to ground what ‘aligned’ could mean in the company’s sector and region.",
              "Compare across pathways: use more than one pathway when you need to reflect uncertainty or different assumptions.",
            ]}
          />

          <UseCaseCard
            title="Test whether plans look feasible"
            subtitle="Check whether key choices, timelines, and assumptions look realistic."
            bullets={[
              "Technology plausibility: compare technology choices (e.g., fuel switching, electrification, CCUS) to pathway narratives.",
              "Timeline realism: use sector and regional trajectories to see if proposed ramps are consistent with modeled transitions.",
              "Dependency checks: highlight where a plan depends on optimistic policy, market, or technology assumptions.",
            ]}
          />

          <UseCaseCard
            title="Review investment alignment"
            subtitle="Compare capacity and project plans to pathway-aligned investment signals."
            bullets={[
              "Pipeline vs pathway: compare project pipelines or capacity plans against pathway trajectories.",
              "Spot misalignment: identify investments that lock in high-emitting assets or delay necessary transition investments.",
              "Translate to decision points: connect pathway signals to financing conditions, engagement priorities, or escalation.",
            ]}
          />

          <UseCaseCard
            title="Understand policy and market exposure"
            subtitle="Explore how exposed a company may be to changes in regulation, demand, or technology trends."
            bullets={[
              "Regional policy context: use region-specific pathways to understand market/regulatory direction-of-travel.",
              "Demand and price proxies: interpret pathway projections as stress-test inputs (not forecasts).",
              "Risk framing: clarify whether risk comes from policy tightening, technology disruption, or shifting demand.",
            ]}
          />
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          How this fits into a corporate transition assessment
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            TPR is not a company scoring tool. It helps users find the right
            external pathways and benchmarks to support corporate transition
            assessments.
          </p>
          <p className="text-rmigray-700 mt-3">
            Pathways are especially useful when you need to:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>benchmark targets,</li>
            <li>
              understand transition exposure at asset or technology level,
            </li>
            <li>
              assess whether investment plans are aligned with stated goals,
            </li>
            <li>
              test whether plans depend on optimistic technology, market, or
              policy assumptions.
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What TPR helps you do
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <ul className="list-disc pl-5 space-y-1 text-rmigray-700">
            <li>discover relevant pathways by sector and region,</li>
            <li>compare pathway characteristics before choosing one,</li>
            <li>see what benchmark data is available,</li>
            <li>avoid using the same scenario for every question.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 max-w-4xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Why pathway selection matters
        </h2>
        <p>
          Different pathways answer different questions. A global 1.5°C pathway
          may be useful for judging ambition. A regional policy-based pathway
          may be more useful for understanding risk in a specific market.
        </p>
        <p className="mt-3">
          TPR helps you see that difference before you use the pathway.
        </p>

        <div className="mt-5 rounded-md bg-white p-4 shadow-sm">
          <p className="text-rmigray-700">
            <span className="font-semibold">Looking for more detail?</span> Link
            to a downloadable guide such as{" "}
            <span className="font-semibold">
              Using pathways in corporate transition assessments
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesUseCasesPage;
