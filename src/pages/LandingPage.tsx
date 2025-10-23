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
            Navigating Climate Transitions
          </h1>
          <p className="text-lg text-rmigray-600 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl
            aliquam nunc, eget aliquam massa nisl quis neque.
          </p>
          <Link
            to="/scenario"
            className="inline-block px-8 py-4 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200 text-lg font-semibold"
          >
            Explore Scenarios
          </Link>
        </div>
        {/* Right Column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <Card
            title="Why Climate Transition Assessments?"
            icon={<TrendingUp className="h-7 w-7 text-energy" />}
            linkText="Learn More →"
            linkHref="https://rmi.org"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam
            euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc.
          </Card>
          <Card
            title="RMI's Motivation"
            icon={<Lightbulb className="h-7 w-7 text-energy" />}
            linkText="Our Methodology →"
            linkHref="https://rmi.org"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl
            aliquam nunc.
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
