import ScenarioCard from "../components/ScenarioCard";
import { scenariosData } from "../data/scenariosData";

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Find Climate Transition Scenarios
        </h1>
        <p className="text-gray-600">
          Browse our repository of climate transition scenarios to find the most
          relevant ones for your assessment needs.
        </p>
      </section>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300`}
      >
        {scenariosData.map((scenario) => (
          <ScenarioCard key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
