import React from "react";

type AudienceCardProps = {
  title: string;
  bullets: string[];
};

const AudienceCard: React.FC<AudienceCardProps> = ({ title, bullets }) => {
  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h2 className="text-lg font-semibold text-rmigray-800 mb-3">{title}</h2>
      <ul className="list-disc pl-5 space-y-2 text-rmigray-700">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
};

const ResourcesContactPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Contact</h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        Get in touch
      </h2>
      <p className="text-rmigray-700 max-w-4xl">
        We are building the Transition Pathways Repository to make transition
        pathways easier to find, compare, and use.
      </p>
      <p className="text-rmigray-700 max-w-4xl">
        We welcome feedback, questions, and collaboration ideas.
      </p>

      <div className="mt-4 rounded-md bg-neutral-100 p-4 max-w-3xl text-rmigray-700">
        <p className="font-semibold">How to reach us</p>
        <p className="mt-1">
          For now, please{" "}
          <a
            href="mailto:tomwhite+pbtar@rmi.org"
            className="text-energy-700 hover:text-energy-800 underline underline-offset-2"
          >
            contact the project team
          </a>{" "}
          via your existing RMI point of contact, or open an issue on the GitHub
          repository with a short description of your request.
        </p>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Why contact us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AudienceCard
            title="For bank analysts"
            bullets={[
              "Want to understand which pathways are best for a specific assessment use case",
              "Have feedback on sector, region, or benchmark coverage",
              "Want to share how your team uses pathways in risk, sustainability, or front-office workflows",
              "Are interested in pilot use cases or collaboration",
            ]}
          />
          <AudienceCard
            title="For companies"
            bullets={[
              "Want to understand how transition pathways can inform transition planning",
              "Want to explore which market or technology trends are most relevant for your sector",
              "Want to suggest pathway sources that should be included",
            ]}
          />
          <AudienceCard
            title="For policymakers and regulators"
            bullets={[
              "Want to understand what the repository shows about sectoral transition bottlenecks",
              "Want to discuss how policy-based pathways are represented",
              "Want to explore how pathways can support supervisory or policy analysis",
            ]}
          />
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What feedback is most helpful
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700 mb-3">
            We are especially interested in hearing about:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-rmigray-700">
            <li>missing pathways or benchmarks,</li>
            <li>unclear classifications,</li>
            <li>gaps in sector or regional coverage,</li>
            <li>workflow pain points,</li>
            <li>requests for training or guidance.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Collaboration
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            We are particularly interested in hearing from financial
            institutions using pathways in corporate transition assessments,
            including sustainability, risk, and client-facing teams.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Contact options
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            Use the contact route that best matches your request:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>General questions</li>
            <li>Feedback on the repository</li>
            <li>Partnership and collaboration</li>
            <li>Report an issue</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 max-w-4xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <p>
          <span className="font-semibold">
            Looking for more background first?
          </span>{" "}
          Link to downloadable resources such as{" "}
          <span className="font-semibold">
            Using pathways in corporate transition assessments
          </span>{" "}
          or{" "}
          <span className="font-semibold">
            Detailed methodology and classification rules
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default ResourcesContactPage;
