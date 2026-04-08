import React from "react";
import { Link } from "react-router-dom";

type StepCardProps = {
  title: string;
  children: React.ReactNode;
};

const StepCard: React.FC<StepCardProps> = ({ title, children }) => {
  return (
    <div className="rounded-lg bg-white shadow p-6">
      <h3 className="text-lg font-semibold text-rmigray-800 mb-2">{title}</h3>
      <div className="text-rmigray-700">{children}</div>
    </div>
  );
};

const ResourcesHowToChoosePathwayPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">
        How to Choose a Pathway
      </h1>

      <h2 className="text-xl font-semibold text-rmigray-800 mb-2">
        Use the five-step process to find pathways that fit your assessment
        question
      </h2>
      <p className="text-rmigray-700 max-w-5xl">
        Different pathways answer different questions. A pathway that is useful
        for assessing target ambition may not be the best fit for assessing
        policy exposure or technology feasibility.
      </p>
      <p className="text-rmigray-700 max-w-5xl">
        TPR helps you compare pathways in a more structured way, so you can
        choose the ones that are most useful for your application.
      </p>

      <div className="mt-10 max-w-5xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          Start with the question
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            Before selecting a pathway, be clear about what you are trying to
            assess.
          </p>
          <p className="text-rmigray-700 mt-3">For example:</p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>Are you testing target ambition?</li>
            <li>
              Are you checking whether investment plans are aligned with stated
              goals?
            </li>
            <li>Are you looking at technology or market feasibility?</li>
            <li>Are you trying to understand policy exposure?</li>
          </ul>
          <p className="text-rmigray-700 mt-3">
            The more specific the question, the easier it is to identify what
            matters in a pathway.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          The five-step process
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
          <StepCard title="Step 1: Define the intended application">
            <p>Start with the question you need the pathway to help answer.</p>
            <p className="mt-3">
              This may sound obvious, but it is the most important step.
              Pathways differ in what they are designed to show. In practice,
              this means the “right” pathway depends on the use case.
            </p>
          </StepCard>

          <StepCard title="Step 2: Check credibility">
            <p>
              Review who produced the pathway and whether it was developed
              through a robust process.
            </p>
            <p className="mt-3">Useful questions include:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>
                Was it developed by an organization with strong technical
                expertise?
              </li>
              <li>Was it reviewed by relevant experts or stakeholders?</li>
              <li>Does the methodology appear technically sound?</li>
            </ul>
          </StepCard>

          <StepCard title="Step 3: Review pathway features">
            <p>Look at the main characteristics of the pathway.</p>
            <p className="mt-3">These include:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>pathway type,</li>
              <li>sector and geographic coverage,</li>
              <li>main drivers of change,</li>
              <li>temperature outcome, where available.</li>
            </ul>
            <p className="mt-3">
              These features help you understand what the pathway is useful for
              and how results should be interpreted.
            </p>
          </StepCard>

          <StepCard title="Step 4: Check granularity">
            <p>
              A pathway may be credible and still be too broad for your
              question.
            </p>
            <p className="mt-3">Check whether it is detailed enough across:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>geography,</li>
              <li>technology,</li>
              <li>time.</li>
            </ul>
            <p className="mt-3">
              For example, a pathway that groups all renewables together may not
              be detailed enough for a technology-feasibility question.
            </p>
          </StepCard>

          <div className="lg:col-span-2">
            <StepCard title="Step 5: Confirm benchmark data availability">
              <p>Finally, check whether the pathway provides the actual output data you need.</p>
              <p className="mt-3">
                A pathway may model a sector in detail but still not publish the
                specific benchmark needed for comparison with company data.
              </p>
              <p className="mt-3">Useful checks include:</p>
              <ul className="mt-3 list-disc pl-5 space-y-1">
                <li>metric availability,</li>
                <li>sector scope compatibility,</li>
                <li>technology availability,</li>
                <li>geographic availability,</li>
                <li>temporal availability.</li>
              </ul>
            </StepCard>
          </div>
        </div>
      </div>

      <div className="mt-10 max-w-5xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          How this relates to TPR
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <p className="text-rmigray-700">
            TPR is designed to make this process faster and easier.
          </p>
          <p className="text-rmigray-700 mt-3">
            It helps users compare pathways in a consistent way, especially
            across:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700">
            <li>pathway features,</li>
            <li>granularity,</li>
            <li>benchmark data availability.</li>
          </ul>
          <p className="text-rmigray-700 mt-3">
            TPR does not replace analyst judgment. It helps users narrow down
            which pathways are worth using and understand how they differ.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          A simple way to start
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          <StepCard title="If your question is about target ambition">
            <p>Prioritize:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>temperature outcome,</li>
              <li>pathway type,</li>
              <li>benchmark availability.</li>
            </ul>
          </StepCard>

          <StepCard title="If your question is about policy exposure">
            <p>Prioritize:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>policy-driven assumptions,</li>
              <li>geographic relevance,</li>
              <li>
                benchmark data for the markets where the company operates.
              </li>
            </ul>
          </StepCard>

          <StepCard title="If your question is about technology or market feasibility">
            <p>Prioritize:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>technology granularity,</li>
              <li>deployment assumptions,</li>
              <li>temporal detail.</li>
            </ul>
          </StepCard>

          <StepCard title="If your question is about investment alignment">
            <p>Prioritize:</p>
            <ul className="mt-3 list-disc pl-5 space-y-1">
              <li>benchmark availability,</li>
              <li>technology detail,</li>
              <li>compatibility with company pipeline data.</li>
            </ul>
          </StepCard>
        </div>
      </div>

      <div className="mt-10 max-w-5xl rounded-lg bg-neutral-100 p-6 text-rmigray-700">
        <h2 className="text-lg font-semibold text-rmigray-800 mb-2">
          Important interpretation note
        </h2>
        <p>No single pathway is best for every use case.</p>
        <p className="mt-3">
          In many cases, it is helpful to use more than one pathway. For
          example, a global 1.5°C pathway may be useful for ambition, while a
          regional policy-driven pathway may be more useful for understanding
          local policy or market risk.
        </p>
      </div>

      <div className="mt-10 max-w-5xl">
        <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
          What to do next
        </h2>
        <div className="rounded-lg bg-white shadow p-6">
          <ul className="list-disc pl-5 space-y-2 text-rmigray-700">
            <li>
              <Link
                to="/pathway"
                className="text-energy-700 hover:text-energy-800 underline underline-offset-2"
              >
                Explore pathways in TPR
              </Link>
            </li>
            <li>
              <Link
                to="/resources/methodology"
                className="text-energy-700 hover:text-energy-800 underline underline-offset-2"
              >
                Read the Methodology page for detailed classification
                definitions
              </Link>
            </li>
            <li>
              <Link
                to="/resources/use-cases"
                className="text-energy-700 hover:text-energy-800 underline underline-offset-2"
              >
                Visit the Use Cases page for examples of how pathways support
                corporate transition assessments
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResourcesHowToChoosePathwayPage;
