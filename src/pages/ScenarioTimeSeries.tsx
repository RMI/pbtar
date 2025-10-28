import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { scenariosData } from "../data/scenariosData";
import { Scenario } from "../types";
import {
  fetchTimeseriesIndex,
  datasetsForPathway,
} from "../utils/timeseriesIndex";
import DonutChart from "../components/DonutChart";
import MultiLineChart from "../components/MultiLineChart";
import NormalizedStackedAreaChart from "../components/NormalizedStackedAreaChart";
import RadarChart from "../components/RadarChart";
import VerticalBarChart from "../components/VerticalBarChart";

const ScenarioTimeSeries: React.FC = () => {
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

  // Timeseries index state
  const [datasets, setDatasets] = useState<
    Array<{
      datasetId: string;
      label?: string;
      path: string;
      summary?: unknown;
    }>
  >([]);

  useEffect(() => {
    let isMounted = true;

    const loadDatasets = async (): Promise<void> => {
      try {
        const idx = await fetchTimeseriesIndex();
        if (!isMounted) return;

        const pathwayId: string = scenario?.id ?? "";

        if (idx && pathwayId) {
          setDatasets(datasetsForPathway(idx, pathwayId));
        } else {
          setDatasets([]);
        }
      } catch (err) {
        console.error("Failed to load timeseries index:", err);
      }
    };

    void loadDatasets(); // explicitly mark ignored promise to satisfy no-floating-promises
    return () => {
      isMounted = false;
    };
  }, [scenario]); // depend on the full object to avoid eslint warning

  const [timeseriesdata, setTimeseriesdata] = useState();
  useEffect(() => {
    if (datasets.length > 0) {
      fetch(datasets[0].path)
        .then((response) => response.json())
        .then((data) => {
          setTimeseriesdata(data);
        })
        .catch((error) => console.error("Error fetching JSON:", error));
    }
  }, [datasets]);

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

  if (!timeseriesdata) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-rmigray-800 mb-4">
          Timeseries Not Found
        </h2>
        <p className="text-rmigray-600 mb-6">
          The timeseries you're looking for doesn't exist or has been removed.
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
    <div class="container mx-auto px-4 py-8">

      <Link
        to={'/scenario/' + id}
        className="inline-flex items-center text-rmigray-600 hover:text-energy-700 mb-6 transition-colors duration-200"
      >
        <ArrowLeft
          size={16}
          className="mr-1"
        />
        Back to scenario detail
      </Link>

      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 transition-opacity duration-300 opacity-100">

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-bluespruce mb-2">
                  <span class="">
                    {timeseriesdata.name}
                  </span>
                </h2>
                <p class="text-rmigray-600 text-sm line-clamp-2">
                  <span class="">
                    {timeseriesdata.description}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Global filters/selectors
                  </span>
                </h2>
                <select>
                  <option value="someOption">Some option</option>
                  <option value="otherOption">Other option</option>
                </select>
                <select>
                  <option value="someOption">Some option</option>
                  <option value="otherOption">Other option</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Normalized stacked area chart
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <NormalizedStackedAreaChart
                  key={datasets[0].datasetId}
                  data={timeseriesdata}
                />
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Donut chart
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <DonutChart
                  key={datasets[0].datasetId}
                  data={timeseriesdata}
                />
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Multi line chart
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <MultiLineChart
                  key={datasets[0].datasetId}
                  data={timeseriesdata}
                />
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Vertical bar chart
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <VerticalBarChart
                  key={datasets[0].datasetId}
                  data={timeseriesdata}
                />
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-lg font-semibold text-bluespruce mb-2">
                  <span class="">
                    Radar chart
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <RadarChart
                  key={datasets[0].datasetId}
                  data={timeseriesdata}
                />
              </div>
            </div>
          </div>
        ) : null}

        {timeseriesdata ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-neutral-200">
            <div class="p-5 flex flex-col h-full">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-bluespruce mb-2">
                  <span class="">
                    Metadata
                  </span>
                </h2>
              </div>
              <div class="mb-3">
                <span class="">
                  <pre>
                    <code>
                      {JSON.stringify(
                        Object.keys(timeseriesdata)
                          .filter((key) => key != "data")
                          .reduce((obj, key) => {
                            return {
                              ...obj,
                              [key]: timeseriesdata[key],
                            };
                          }, {}),
                        null,
                        4,
                      )}
                    </code>
                  </pre>
                </span>
              </div>
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default ScenarioTimeSeries;
