import React, { useState, useEffect } from "react";
import ScenarioCard from "./ScenarioCard.jsx";
import { callApi } from "../utils/api.jsx";

const ScenariosGrid = () => {
  const [scenarios, setScenarios] = useState([]);
  const [apiKey, setApiKey] = useState("abc123");
  const [route, setRoute] = useState("/scenarios");
  const [jsonData, setJsonData] = useState("");

  const loadData = async () => {
    try {
      const data = await callApi(route, apiKey);
      if (Array.isArray(data)) {
        setScenarios(data);
      } else {
        setScenarios([]);
      }
      setJsonData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mx-auto">
      <details>
        <summary>developer</summary>
        <div className="mb-3">
          <div className="flex items-center mb-3">
            <span className="mr-2">API key:</span>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              onKeyDown={(e) => e.key === "Enter" && loadData()}
            />
          </div>
          <div className="flex items-center mb-3">
            <span className="mr-2">route:</span>
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
              onKeyDown={(e) => e.key === "Enter" && loadData()}
            />
          </div>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Load Data
          </button>
        </div>
        <div>
          <p>JSON response:</p>
          <pre>
            <code>{jsonData}</code>
          </pre>
        </div>
      </details>

      <hr className="my-4" />

      <div id="cards-grid" className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <ScenarioCard key={scenario.id || index} scenario={scenario} />
        ))}
      </div>
    </div>
  );
};

export default ScenariosGrid;
