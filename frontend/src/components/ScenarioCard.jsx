import React from "react";

const ScenarioCard = ({ scenario }) => {
  let icon;
  switch (scenario.nature) {
    case "Normative":
      icon = "🎯";
      break;
    case "Descriptive":
      icon = "📊";
      break;
    case "Exploratory":
      icon = "🔍";
      break;
    default:
      icon = "";
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-900">
              {scenario.name}
            </h3>
            <div className="flex gap-2 mt-1">
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                {scenario.nature}
              </span>
              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 gap-1">
                {scenario.target_temperature}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {scenario.description}
      </p>

      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <span className="font-medium text-gray-500">Publisher:</span>
          <span className="ml-2 text-emerald-800">{scenario.source}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">
            Published: {scenario.created_on}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Target: {scenario.time_horizon}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex flex-wrap gap-1">
            Usage:{" "}
            <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600">
              {scenario.usage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
