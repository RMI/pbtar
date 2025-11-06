import React from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Lightbulb } from "lucide-react";

const WavePattern: React.FC = () => {
  return (
    <div className="absolute inset-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="gradient1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="rgba(255,255,255,0.04)"
            />
            <stop
              offset="50%"
              stopColor="rgba(255,255,255,0.06)"
            />
            <stop
              offset="100%"
              stopColor="rgba(255,255,255,0.04)"
            />
          </linearGradient>
          <linearGradient
            id="gradient2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="rgba(255,255,255,0.05)"
            />
            <stop
              offset="50%"
              stopColor="rgba(255,255,255,0.1)"
            />
            <stop
              offset="100%"
              stopColor="rgba(255,255,255,0.05)"
            />
          </linearGradient>
          <linearGradient
            id="gradient3"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor="rgba(255,255,255,0.03)"
            />
            <stop
              offset="50%"
              stopColor="rgba(255,255,255,0.07)"
            />
            <stop
              offset="100%"
              stopColor="rgba(255,255,255,0.03)"
            />
          </linearGradient>
        </defs>
        <path
          d="M-10 50 Q 25 20, 50 50 T 110 50 V100 H-10"
          fill="url(#gradient1)"
        >
          <animate
            attributeName="d"
            dur="45s"
            repeatCount="indefinite"
            values="
      M-10 45 Q 25 35, 50 55 T 110 45 V100 H-10;
      M-10 55 Q 20 45, 50 35 T 110 55 V100 H-10;
      M-10 45 Q 30 55, 50 45 T 110 45 V100 H-10;
      M-10 45 Q 25 35, 50 55 T 110 45 V100 H-10"
          />
        </path>
        <path
          d="M-10 50 Q 25 30, 50 50 T 110 50 V100 H-10"
          fill="url(#gradient2)"
        >
          <animate
            attributeName="d"
            dur="30s"
            repeatCount="indefinite"
            values="
      M-10 45 Q 35 40, 50 55 T 110 45 V100 H-10;
      M-10 55 Q 15 50, 50 45 T 110 55 V100 H-10;
      M-10 45 Q 25 40, 50 55 T 110 45 V100 H-10;
      M-10 45 Q 35 40, 50 55 T 110 45 V100 H-10"
          />
        </path>
        <path
          d="M-10 50 Q 25 40, 50 50 T 110 50 V100 H-10"
          fill="url(#gradient3)"
        >
          <animate
            attributeName="d"
            dur="60s"
            repeatCount="indefinite"
            values="
      M-10 52 Q 20 45, 50 48 T 110 52 V100 H-10;
      M-10 48 Q 30 55, 50 52 T 110 48 V100 H-10;
      M-10 52 Q 20 45, 50 48 T 110 52 V100 H-10;
      M-10 52 Q 20 45, 50 48 T 110 52 V100 H-10"
          />
        </path>
      </svg>
    </div>
  );
};

const Card: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  linkText: string;
  linkHref: string;
}> = ({ title, icon, children, linkText, linkHref }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6 flex flex-col">
    {" "}
    {/* Removed mb-6 and h-full */}
    <div className="flex items-center mb-4">
      <span className="text-2xl mr-3">{icon}</span>
      <h2 className="text-xl font-semibold text-rmigray-800">{title}</h2>
    </div>
    <div className="flex-1 text-rmigray-600 mb-4">{children}</div>
    <a
      href={linkHref}
      target="_blank"
      rel="noopener noreferrer"
      className="text-energy-700 font-semibold hover:underline mt-auto"
    >
      {linkText}
    </a>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-rmiblue-800/100"></div>{" "}
      {/* Animated waves */}
      <WavePattern />
      {/* Additional gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-energy/5 to-transparent"></div>
      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4 py-12 min-h-screen flex items-center">
          <div className="flex flex-col md:flex-row gap-10 items-stretch w-full">
            {/* Left Column */}
            <div className="md:w-1/2">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-8 shadow-md flex flex-col h-full">
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-rmigray-800 mb-6">
                    Navigating the Energy Transition
                  </h1>
                  <p className="text-lg text-rmigray-600">
                    Transition pathways illustrate how the energy transition
                    will reshape sectors and systems, giving financial
                    institutions, corporates, and other organizations greater
                    confidence in developing, assessing, and implementing plans
                    in a changing energy landscape.
                  </p>
                </div>
                <div className="mt-auto pt-8">
                  <Link
                    to="/pathway"
                    className="inline-block px-8 py-4 bg-energy-700 text-neutral-300 rounded-md hover:bg-energy-800 transition-colors duration-200 text-lg font-semibold"
                  >
                    Explore Pathways
                  </Link>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="md:w-1/2 flex flex-col gap-6">
              <Card
                title="Creating Transition Intelligence"
                icon={<TrendingUp className="h-7 w-7 text-energy-700" />}
                linkText="Learn more →"
                linkHref="https://rmi.org/insight/creating-transition-intelligence-enhancing-corporate-transition-assessments-for-financial-decision-making"
              >
                Drawing on a range of transition pathways turns corporate data
                into actionable intelligence, helping organizations test
                strategies, manage risks, and engage stakeholders.
              </Card>
              <Card
                title="RMI's Approach"
                icon={<Lightbulb className="h-7 w-7 text-energy-700" />}
                linkText="Learn more →"
                linkHref="https://rmi.org/insight/leveraging-transition-pathways/"
              >
                This repository connects users with the right transition
                pathways for their needs, with structured guidance for
                navigating diverse pathway types, geographies, developers, and
                methodologies.
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
