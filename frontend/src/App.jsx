import React from "react";
import ScenariosGrid from "./components/ScenariosGrid.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Pathways-based Transition Assessment Repository
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4">
        <ScenariosGrid />
      </main>
    </div>
  );
}

export default App;
