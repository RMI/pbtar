import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Lightbulb } from "lucide-react";

const Card: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  linkText: string;
  linkHref: string;
}> = ({ title, icon, children, linkText, linkHref }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <h2 className="text-xl font-semibold text-rmigray-800">{title}</h2>
    </div>
    <div className="flex-1 text-rmigray-600 mb-4">{children}</div>
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className="text-energy font-semibold hover:underline mt-auto"
    >
      {linkText}
    </a>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-10 items-stretch">
        {/* Left Column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-rmigray-800 mb-6">
            Navigating the Energy Transition
          </h1>
          <p className="text-lg text-rmigray-600 mb-8">
            Transition pathways illustrate how the energy transition will
            reshape sectors and systems, giving financial institutions,
            corporates, and other organizations greater confidence in
            developing, assessing, and implementing plans in a changing energy
            landscape.
          </p>
          <Link
            to="/scenario"
            className="inline-block px-8 py-4 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200 text-lg font-semibold"
          >
            Explore Pathways
          </Link>
        </div>
        {/* Right Column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <Card
            title="Creating Transition Intelligence"
            icon={<TrendingUp className="h-7 w-7 text-energy" />}
            linkText="Learn more →"
            linkHref="https://rmi.org/insight/creating-transition-intelligence-enhancing-corporate-transition-assessments-for-financial-decision-making"
          >
            Drawing on a range of transition pathways turns corporate data into
            actionable intelligence, helping organizations test strategies,
            manage risks, and engage stakeholders.
          </Card>
          <Card
            title="RMI’s Approach"
            icon={<Lightbulb className="h-7 w-7 text-energy" />}
            linkText="Learn more →"
            linkHref="https://rmi.org/insight/leveraging-transition-pathways/"
          >
            This repository connects users with the right transition pathways
            for their needs, with structured guidance for navigating diverse
            pathway types, geographies, developers, and methodologies.
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
