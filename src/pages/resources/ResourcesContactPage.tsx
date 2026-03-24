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
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">Contact Us</h1>
      <p className="text-rmigray-700 max-w-3xl">
        RMI encourages users of the Transition Pathways Repository to reach out
        with any feedback you may have on this tool. We would like to hear from
        you how you use the tool, what you think could be improved, and if you
        find any issues - both content and functionality.
      </p>
      <p className="text-rmigray-700 max-w-3xl">
        Different types of organisations likely engage with the Transition
        Pathways Repository in different ways. Please let us know what matters
        most to your organisation.
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <AudienceCard
          title="Banks"
          bullets={[
            "How do you currently use transition pathways in your organization? Risk management, deal structuring, portfolio alignment?",
            "What information is missing from the Transition Pathways Repository that would make it more useful for your daily work?",
            "Clarifications on data provenance and assumptions",
          ]}
        />
        <AudienceCard
          title="Corporates"
          bullets={[
            "How do you currently use pathways in your transition plans?",
            "Guidance on interpreting metrics and trajectories",
            "Suggestions for improving usability and reporting",
          ]}
        />
        <AudienceCard
          title="Pathway developers"
          bullets={[
            "Do you want to contribute your pathways to the repository? We can help you understand the current scope and the classification and metadata requirements.",
            "Requests for new fields or classification improvements",
            "Feedback on metadata conventions and documentation",
          ]}
        />
      </div>
    </div>
  );
};

export default ResourcesContactPage;
