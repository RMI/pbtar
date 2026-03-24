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
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Use cases</h1>
      <p className="text-rmigray-700 max-w-4xl">
        Transition pathways can be useful for different types of analysis, at
        different levels. We focus mostly on corporate transition analysis,
        which in turn informs transition plan credibility analysis, risk
        management, and deal structuring. But other prominent use cases are
        portfolio alignment analysis, and sector analysis.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        Generally, pathways do not tend to claim to be forecasts, but rather
        scenarios or exploratory pathways, and they should be understood as such
        regardless of the use case, unless the pathway modellers specifically
        indicate otherwise.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        They are most useful when applied as a structured set of external
        reference points—for targets, trajectories, technology deployment
        expectations, and policy context—alongside an organization’s own plan
        and data. For many applications, it is recommendable to use multiple
        pathways to reflect modelling uncertainty and document why each is
        considered relevant.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UseCaseCard
          title="Corporate Transition Assessments"
          subtitle="Assess the credibility and ambition of corporate transition plans."
          bullets={[
            "Transition Plan Credibility Assessments: compare a company’s transition plan against pathway trajectories to evaluate the feasibility and implementation gaps. Check if the plan addresses the reasons for implementation gaps and if external dependencies are considered.",
            "Risk Management: Derive the corporate's exposure to transition related sectors and technologies and how the asset lifetimes and investment plans impact future risk exposure. Deduce if current exposure and future investment lead to a material risk profile that requires mitigation.",
            "Deal Structuring: Implementation gaps can be a sign that future financing should include transition-related conditions, or that the company may be a less attractive counterparty for transition-related deals. Conversely, credible plans with clear milestones and pathways-aligned trajectories may be a sign of a more attractive counterparty.",
          ]}
        />

        <UseCaseCard
          title="Portfolio Alignment Assessments"
          subtitle="Evaluate alignment of financed emissions and exposures against pathway benchmarks."
          bullets={[
            "Choose pathway coverage: select pathways by sector and geography to match the portfolio’s exposure.",
            "Translate to portfolio signals: derive reference rates of change (e.g., intensity decline, capacity build-out) for holdings/issuers.",
            "Compare by time horizon: assess alignment in 5–10 year windows, not only 2050 endpoints.",
            "Segment and attribute: use pathways to separate sector/region effects from issuer-specific under/over-performance.",
          ]}
        />

        <UseCaseCard
          title="Sector Analyses"
          subtitle="Support sector transition outlooks and strategy by comparing plausible futures."
          bullets={[
            "Bound the space of futures: compare pathways to understand ranges for demand, technology shares, and policy ambition.",
            "Identify common directions of travel: look for consistent signals across pathways (e.g., electrification, efficiency).",
            "Identify opportunities: regional trends across multiple pathways can signal areas of growth. External dependencies of those areas can signal investment opportunities in related infrastructure or supply chain projects.",
            "Signal bottlenecks to regulators and policymakers: some dependencies that companies cannot address directly may be best handled by regulators or policymakers, e.g. permitting requirements in nascent markets. Signalling these bottlenecks to the relevant decision-makers can help drive policy action to address them.",
          ]}
        />
      </div>

      <div className="mt-10 max-w-4xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Practical tips
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Prefer pathways with transparent assumptions and clear documentation
            of scope, geography, and sector coverage.
          </li>
          <li>
            Treat pathways as decision support—not a single “truth”. Use them to
            ask better questions and to structure comparisons.
          </li>
          <li>
            Record how you mapped internal metrics to pathway metrics (units,
            definitions, boundaries) and where uncertainty remains.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResourcesUseCasesPage;
