import React from "react";
import { ExternalLink, Mail } from "lucide-react";
import Colophon from "../components/Colophon";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-rmigray-800 mb-6">
          About the Climate Transition Scenarios Repository
        </h1>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-rmigray-800 mb-4">
            Purpose
          </h2>
          <p className="text-rmigray-700 mb-4">
            The Climate Transition Scenarios Repository is designed to help
            financial institutions efficiently discover, compare, and utilize
            diverse climate transition scenarios for their assessments.
          </p>
          <p className="text-rmigray-700 mb-4">
            Our goal is to simplify the process of finding relevant scenarios
            and understanding their applications, enabling analysts to make more
            informed decisions when evaluating transition plans and
            climate-related financial risks.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-rmigray-800 mb-4">
            Climate Transition Assessments
          </h2>
          <p className="text-rmigray-700 mb-4">
            Climate Transition Assessments (CTAs) are valuable tools that help
            financial institutions evaluate how well their clients or
            investments are positioned for the transition to a low-carbon
            economy.
          </p>
          <p className="text-rmigray-700 mb-4">
            At RMI, we believe that CTAs are most effective when they consider
            multiple transition scenarios, as this provides a more comprehensive
            view of potential futures and addresses data gaps that may exist in
            any single scenario.
          </p>
          <p className="text-rmigray-700 mb-4">
            By providing access to diverse scenarios with expert analysis and
            recommendations, we aim to reduce the barriers to creating robust
            CTAs and improve the quality of climate-related financial analysis.
          </p>
          <div className="mt-6">
            <a
              href="https://rmi.org/transitionfinance/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-energy hover:text-energy-700 transition-colors duration-200"
            >
              Learn more about Climate Transition Assessments
              <ExternalLink
                size={16}
                className="ml-2"
              />
            </a>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-rmigray-800 mb-4">
            How to Use This Repository
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-rmigray-800 mb-2">
                1. Browse Scenarios
              </h3>
              <p className="text-rmigray-700">
                Browse our curated list of climate transition scenarios to get a
                broad understanding of what's available.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-rmigray-800 mb-2">
                2. Filter and Search
              </h3>
              <p className="text-rmigray-700">
                Use our search and filter tools to narrow down scenarios based
                on specific criteria such as regions, sectors, temperature
                targets, or other attributes relevant to your assessment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-rmigray-800 mb-2">
                3. Compare Scenarios
              </h3>
              <p className="text-rmigray-700">
                Read detailed information about each scenario, including RMI's
                expert analysis of their strengths, limitations, and appropriate
                use cases.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-rmigray-800 mb-2">
                4. Access Data
              </h3>
              <p className="text-rmigray-700">
                Find information on how to access the underlying data for
                scenarios you're interested in, either through direct downloads
                or links to original sources.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-rmigray-800 mb-4">
            Contact Us
          </h2>
          <p className="text-rmigray-700 mb-4">
            If you have questions, feedback, or would like to learn more about
            how RMI can support your climate transition assessment work, please
            reach out to our team.
          </p>
          <a
            href="mailto:jhoffart@rmi.org"
            className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
          >
            <Mail
              size={16}
              className="mr-2"
            />
            Contact Us
          </a>
        </section>

        <div className="mt-8">
          <Colophon />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
