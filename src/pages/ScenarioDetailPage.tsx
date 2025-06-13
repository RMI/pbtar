import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { scenariosData } from "../data/scenariosData";
import { Scenario } from "../types";
import Badge from "../components/Badge";
import { Download, ExternalLink, ArrowLeft } from "lucide-react";

const ScenarioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      const foundScenario = scenariosData.find((s) => s.id === id) || null;
      setScenario(foundScenario);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-100 rounded w-96 mb-4"></div>
          <div className="h-4 bg-neutral-100 rounded w-64 mb-8"></div>
          <div className="h-32 bg-neutral-100 rounded w-full mb-4"></div>
          <div className="h-32 bg-neutral-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-rmigray-800 mb-4">
          Scenario Not Found
        </h2>
        <p className="text-rmigray-600 mb-6">
          The scenario you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
        >
          <ArrowLeft
            size={16}
            className="mr-2"
          />
          Back to Scenarios
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-rmigray-600 hover:text-energy-700 mb-6 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="mr-1"
        />
        Back to scenarios
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-bluespruce p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {scenario.name}
          </h1>
          <p className="text-white mb-4">{scenario.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              text={scenario.category}
              variant="category"
            />
            <Badge
              text={scenario.target_year}
              variant="year"
            />
            <Badge
              text={scenario.target_temperature}
              variant="temperature"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
            <p className="mb-1 sm:mb-0">
              <span className="text-white">Publisher:</span>{" "}
              {scenario.publisher}
            </p>
            <p>
              <span className="text-white">Published:</span>{" "}
              {scenario.published_date}
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
                  Scenario Overview
                </h2>
                <div className="prose text-rmigray-700">
                  <p>{scenario.overview}</p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
                  Expert Recommendations
                </h2>
                <div className="prose text-rmigray-700">
                  <p>{scenario.expertRecommendation}</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-rmigray-800 mb-3">
                  Data Source
                </h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                  <p className="text-rmigray-700 mb-4">
                    {scenario.dataSource.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={scenario.dataSource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200"
                    >
                      <ExternalLink
                        size={16}
                        className="mr-2"
                      />
                      Visit Source
                    </a>

                    {scenario.dataSource.downloadAvailable && (
                      <button className="inline-flex items-center px-4 py-2 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200">
                        <Download
                          size={16}
                          className="mr-2"
                        />
                        Download Data
                      </button>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="md:col-span-4">
              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Regions
                </h3>
                <div className="flex flex-wrap">
                  {scenario.regions.map((region, index) => (
                    <Badge
                      key={index}
                      text={region}
                      variant="region"
                    />
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-rmigray-800 mb-3">
                  Sectors
                </h3>
                <div className="flex flex-wrap">
                  {scenario.sectors.map((sector, index) => (
                    <Badge
                      key={index}
                      text={sector}
                      variant="sector"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetailPage;
