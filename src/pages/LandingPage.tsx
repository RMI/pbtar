import React from "react";
import { Link } from "react-router-dom";
import { HeaderBrand } from "../components/Header";

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

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-lg bg-white shadow p-6">
    <h3 className="text-sm font-semibold text-rmiblue-800 mb-3 text-center">
      {title}
    </h3>
    <div className="text-sm text-rmigray-700 text-center">{children}</div>
  </div>
);

const LandingPage: React.FC = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="relative overflow-x-hidden">
        <div className="absolute inset-0 bg-rmiblue-800/100" />
        <WavePattern />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-energy/5 to-transparent" />

        <div className="relative text-white">
          <div className="container mx-auto px-4 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <HeaderBrand to="/" />
              <nav className="flex flex-wrap items-center gap-2 text-sm">
                <Link
                  to="/pathway"
                  className="inline-flex items-center rounded-md px-3 py-2 font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Pathways
                </Link>
                <Link
                  to="/resources/methodology"
                  className="inline-flex items-center rounded-md px-3 py-2 font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Methodology
                </Link>
                <Link
                  to="/resources/use-cases"
                  className="inline-flex items-center rounded-md px-3 py-2 font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Resources
                </Link>
                <Link
                  to="/resources/contact"
                  className="inline-flex items-center rounded-md px-3 py-2 font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>
          </div>

          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Transition Pathways Repository
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">
                Find and compare transition pathways for corporate transition
                assessments.
              </p>

              <p className="mt-8 text-sm md:text-base text-white/85 max-w-3xl mx-auto">
                Built first for financial institutions, TPR helps
                sustainability, risk, and front-office teams identify pathways
                that fit their assessment question. Use it to benchmark
                ambition, test feasibility, assess policy exposure, and
                understand what benchmark data a pathway can provide.
              </p>

              <div className="mt-10">
                <Link
                  to="/pathway"
                  className="inline-block px-8 py-4 bg-energy-700 text-neutral-300 rounded-md hover:bg-energy-800 transition-colors duration-200 text-lg font-semibold"
                >
                  Explore Pathways
                </Link>
              </div>

              <p className="mt-6 text-sm italic text-white/80">
                Start with pathways for the Southeast Asian power sector.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <section className="pb-10 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-3">
              What is TPR?
            </h2>
            <p className="text-rmigray-700 max-w-4xl">
              TPR is an online repository that helps users identify and
              interpret transition pathways relevant to their needs. It is
              designed to make pathway selection faster, more transparent, and
              easier to apply in real assessment workflows.
            </p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-3">
              Why it matters
            </h2>
            <p className="text-rmigray-700 max-w-4xl">
              Different pathways answer different questions. One may be useful
              for assessing target ambition, while another may be better for
              understanding regional policy or market risk. TPR helps users
              compare those differences before choosing a pathway.
            </p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-3">
              Who is it for?
            </h2>
            <p className="text-rmigray-700 max-w-4xl">
              TPR is designed primarily for banks and other financial
              institutions conducting corporate transition assessments.
            </p>
            <p className="text-rmigray-700 max-w-4xl mt-3">
              It is especially relevant for:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1 text-rmigray-700 max-w-4xl">
              <li>sustainability teams,</li>
              <li>risk teams,</li>
              <li>front-office and client coverage teams.</li>
            </ul>
            <p className="text-rmigray-700 max-w-4xl mt-4">
              It can also support companies, policymakers, and regulators
              seeking a clearer view of transition dynamics in specific sectors
              and regions.
            </p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-6">
              What you can do here
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard title="Compare pathways">
                Review pathway type, geography, granularity, and benchmark data
                availability in one place.
              </InfoCard>
              <InfoCard title="Match pathways to your use case">
                Use different pathways for ambition, feasibility, investment
                alignment, or policy exposure.
              </InfoCard>
              <InfoCard title="Reduce research time">
                Find relevant pathways faster and understand what they can
                realistically tell you.
              </InfoCard>
            </div>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-3">
              Methodology
            </h2>
            <p className="text-rmigray-700 max-w-4xl">
              TPR uses a structured approach to pathway comparison. It helps
              users assess credibility, pathway features, granularity, and
              benchmark data availability so they can choose pathways that fit
              the question at hand.
            </p>
            <div className="mt-4">
              <Link
                to="/resources/methodology"
                className="text-energy-700 font-semibold hover:underline"
              >
                Learn more about the methodology
              </Link>
            </div>
          </section>

          <section className="py-10">
            <h2 className="text-xl font-semibold text-rmiblue-800 mb-3">
              Resources
            </h2>
            <ul className="space-y-2 text-rmigray-700">
              <li>
                <Link
                  to="/resources/use-cases"
                  className="text-energy-700 hover:underline"
                >
                  How banks use transition pathways
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/methodology"
                  className="text-energy-700 hover:underline"
                >
                  How pathways are classified
                </Link>
              </li>
              <li>
                <Link
                  to="/resources/contact"
                  className="text-energy-700 hover:underline"
                >
                  Questions or feedback
                </Link>
              </li>
            </ul>

            <div className="mt-12 pt-10 border-t border-neutral-200 text-center">
              <h2 className="text-2xl font-semibold text-rmigray-800">
                Ready to explore?
              </h2>
              <p className="mt-3 text-rmigray-700 max-w-2xl mx-auto">
                Compare pathways and find the ones that best fit your assessment
                question.
              </p>
              <div className="mt-8">
                <Link
                  to="/pathway"
                  className="inline-block px-8 py-4 bg-energy-700 text-neutral-300 rounded-md hover:bg-energy-800 transition-colors duration-200 text-lg font-semibold"
                >
                  Explore Pathways
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
