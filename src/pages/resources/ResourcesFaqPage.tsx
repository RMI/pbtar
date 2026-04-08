import React, { useMemo, useState } from "react";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

type FaqSection = {
  title: string;
  items: FaqItem[];
};

const SectionCard: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="rounded-lg bg-white shadow">
      <button
        type="button"
        className="w-full flex items-center justify-between gap-4 p-6 text-left"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <h2 className="text-xl font-semibold text-rmigray-800">{title}</h2>
        <span
          className={
            "text-rmigray-500 transition-transform " +
            (isOpen ? "rotate-180" : "rotate-0")
          }
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen && <div className="border-t border-neutral-200 p-6">{children}</div>}
    </div>
  );
};

const FaqItemBlock: React.FC<FaqItem> = ({ question, answer }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-rmigray-800">{question}</h3>
      <div className="mt-2 text-rmigray-700 space-y-3">{answer}</div>
    </div>
  );
};

const ResourcesFaqPage: React.FC = () => {
  const sections = useMemo<FaqSection[]>(
    () => [
      {
        title: "About the TPR",
        items: [
          {
            question: "What is the Transition Pathways Repository (TPR)?",
            answer: (
              <>
                <p>
                  The Transition Pathways Repository is an online tool that
                  helps users find and compare transition pathways.
                </p>
                <p>
                  It is designed to make pathway selection faster, more
                  transparent, and easier to apply in real assessment
                  workflows.
                </p>
              </>
            ),
          },
          {
            question: "What is the TPR for?",
            answer: (
              <>
                <p>
                  TPR helps users identify which pathways are most relevant for
                  a given question.
                </p>
                <p>For example, users may need pathways to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>assess target ambition,</li>
                  <li>test feasibility,</li>
                  <li>understand policy exposure,</li>
                  <li>review investment alignment,</li>
                  <li>compare what benchmark data is available.</li>
                </ul>
              </>
            ),
          },
          {
            question: "Who is the TPR designed for?",
            answer: (
              <>
                <p>
                  TPR is designed primarily for banks and other financial
                  institutions using transition pathways in assessment and
                  decision-making.
                </p>
                <p>It is especially relevant for:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>sustainability teams,</li>
                  <li>risk teams,</li>
                  <li>front-office and client coverage teams.</li>
                </ul>
                <p>
                  It can also be useful for companies, policymakers, regulators,
                  and other users who want to better understand transition
                  dynamics in specific sectors and regions.
                </p>
              </>
            ),
          },
          {
            question: "Is the TPR a database of company transition plans?",
            answer: (
              <>
                <p>
                  No. TPR is a repository of transition pathways, not company
                  plans.
                </p>
                <p>
                  It helps users understand and compare external pathways that
                  can inform assessments.
                </p>
              </>
            ),
          },
        ],
      },
      {
        title: "Using the TPR",
        items: [
          {
            question: "How do I use the TPR?",
            answer: (
              <>
                <p>A simple workflow is:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Start with your question.</li>
                  <li>Explore pathways that look relevant.</li>
                  <li>Compare their classifications and coverage.</li>
                  <li>Review the pathway detail page.</li>
                  <li>
                    Decide which pathway, or combination of pathways, best fits
                    your use case.
                  </li>
                </ol>
              </>
            ),
          },
          {
            question: "What kinds of questions can the TPR help with?",
            answer: (
              <>
                <p>
                  TPR is most useful when you need to choose or interpret a
                  pathway for a specific purpose.
                </p>
                <p>Examples include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Which pathway is most useful for assessing ambition?</li>
                  <li>Which pathway is relevant for a specific country or region?</li>
                  <li>Does this pathway have the benchmark data I need?</li>
                  <li>
                    Is this pathway better suited for policy questions or
                    feasibility questions?
                  </li>
                </ul>
              </>
            ),
          },
          {
            question: "Does the TPR tell me which pathway is best?",
            answer: (
              <>
                <p>
                  No. TPR helps users compare pathways in a structured way, but
                  it does not automatically choose one for you.
                </p>
                <p>
                  The most useful pathway depends on the question you are
                  trying to answer.
                </p>
              </>
            ),
          },
          {
            question: "Why are there different pathway classifications?",
            answer: (
              <>
                <p>
                  Different pathways are built for different purposes and use
                  different assumptions.
                </p>
                <p>
                  The classifications in TPR help users understand how a
                  pathway should be interpreted, what it covers, and what it
                  may be useful for.
                </p>
              </>
            ),
          },
          {
            question: "Why can’t I just use one well-known scenario for everything?",
            answer: (
              <>
                <p>Because different pathways answer different questions.</p>
                <p>
                  A pathway that is useful for assessing target ambition may not
                  be the best fit for assessing policy exposure, local market
                  conditions, or technology feasibility.
                </p>
              </>
            ),
          },
          {
            question: "Why do some pathways have more benchmark data than others?",
            answer: (
              <>
                <p>
                  Not all pathway sources publish the same level of detail.
                </p>
                <p>
                  Some pathways may be robust and useful, but still not provide
                  the exact benchmark data needed for a specific comparison.
                </p>
              </>
            ),
          },
          {
            question: "What is shown on the pathway detail page?",
            answer: (
              <>
                <p>
                  The detail page provides more information about an individual
                  pathway, such as:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>what type of pathway it is,</li>
                  <li>what sectors and geographies it covers,</li>
                  <li>what assumptions or drivers matter most,</li>
                  <li>how granular it is,</li>
                  <li>what benchmark data is available.</li>
                </ul>
              </>
            ),
          },
        ],
      },
      {
        title: "TPR and CTAs",
        items: [
          {
            question: "What is a CTA?",
            answer: (
              <>
                <p>CTA stands for Corporate Transition Assessment.</p>
                <p>
                  A CTA is a structured assessment of how credible, ambitious,
                  and feasible a company’s transition approach appears, usually
                  in the context of climate-related financial decision-making.
                </p>
              </>
            ),
          },
          {
            question: "How does the TPR relate to CTAs?",
            answer: (
              <>
                <p>
                  TPR helps users identify and interpret the external pathways
                  that can inform a CTA.
                </p>
                <p>
                  It does not replace a full CTA methodology. It supports one
                  important part of the process: choosing and understanding
                  suitable pathways and benchmarks.
                </p>
              </>
            ),
          },
          {
            question: "How can the TPR help inform a CTA?",
            answer: (
              <>
                <p>TPR can help users:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>benchmark company targets,</li>
                  <li>assess whether transition assumptions look feasible,</li>
                  <li>understand policy and market context,</li>
                  <li>
                    review whether pathway data is available for the relevant
                    sector and geography.
                  </li>
                </ul>
              </>
            ),
          },
          {
            question: "Is the TPR only useful for CTAs?",
            answer: (
              <>
                <p>No. CTAs are an important use case, but not the only one.</p>
                <p>
                  TPR can also support broader transition-related analysis,
                  including pathway comparison, market context review, and
                  benchmark selection for sector or regional questions.
                </p>
              </>
            ),
          },
          {
            question: "Does the TPR perform a CTA for me?",
            answer: (
              <>
                <p>
                  No. TPR does not generate a company assessment or CTA output.
                </p>
                <p>
                  It helps users choose and interpret pathways that may feed
                  into a broader assessment process.
                </p>
              </>
            ),
          },
        ],
      },
      {
        title: "Coverage and limitations",
        items: [
          {
            question: "What is the current coverage of the TPR?",
            answer: (
              <>
                <p>
                  The current pilot focuses on transition pathways for the
                  Southeast Asian power sector.
                </p>
              </>
            ),
          },
          {
            question: "Will the TPR expand to other sectors and geographies?",
            answer: (
              <>
                <p>Yes. The intention is to expand coverage over time.</p>
                <p>
                  Future development may include additional sectors,
                  geographies, and pathway sources.
                </p>
              </>
            ),
          },
          {
            question: "Can I use the TPR to run company-level analysis directly?",
            answer: (
              <>
                <p>
                  No. TPR does not currently perform company-level analysis
                  against a pathway.
                </p>
                <p>
                  It helps users identify relevant pathways and understand what
                  benchmark data those pathways provide. Any company-level
                  assessment still needs to be carried out separately.
                </p>
              </>
            ),
          },
          {
            question: "Can the TPR tell me whether a company is aligned with a pathway?",
            answer: (
              <>
                <p>Not directly.</p>
                <p>
                  TPR helps users identify pathways and relevant benchmark data,
                  but it does not currently calculate company alignment or
                  produce company scores.
                </p>
              </>
            ),
          },
          {
            question: "Does the TPR replace analyst judgment?",
            answer: (
              <>
                <p>
                  No. TPR is designed to support analyst judgment, not replace
                  it.
                </p>
                <p>
                  Users still need to decide which pathways are appropriate and
                  how to interpret them in context.
                </p>
              </>
            ),
          },
          {
            question: "Can I download all pathway data from the TPR?",
            answer: (
              <>
                <p>
                  Data availability depends on the pathway source and what is
                  currently included in the tool.
                </p>
                <p>
                  Some pathways may have more detailed benchmark data available
                  than others.
                </p>
              </>
            ),
          },
          {
            question: "What should I do if I cannot find the pathway or data I need?",
            answer: (
              <>
                <p>You can contact the team to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>suggest additional pathway sources,</li>
                  <li>highlight missing benchmark data,</li>
                  <li>flag unclear classifications,</li>
                  <li>share feedback on coverage gaps or workflow needs.</li>
                </ul>
              </>
            ),
          },
        ],
      },
    ],
    [],
  );

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => ({
      [sections[0]?.title ?? "About the TPR"]: true,
    }),
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-rmigray-800 mb-4">FAQ</h1>

      <div className="mt-6 space-y-6">
        {sections.map((section) => {
          const isOpen = Boolean(openSections[section.title]);
          return (
            <SectionCard
              key={section.title}
              title={section.title}
              isOpen={isOpen}
              onToggle={() =>
                setOpenSections((current) => ({
                  ...current,
                  [section.title]: !current[section.title],
                }))
              }
            >
              <div className="space-y-8">
                {section.items.map((item) => (
                  <FaqItemBlock
                    key={item.question}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
};

export default ResourcesFaqPage;
