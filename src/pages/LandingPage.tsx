import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-rmigray-800 mb-6">
        Welcome to Climate Transition Scenario Explorer
      </h1>
      <p className="text-xl text-rmigray-600 mb-8 max-w-2xl mx-auto">
        Explore and analyze climate transition scenarios to support your
        assessment needs.
      </p>
      <Link
        to="/scenario"
        className="inline-block px-6 py-3 bg-energy text-white rounded-md hover:bg-energy-700 transition-colors duration-200 text-lg"
      >
        Browse Scenarios
      </Link>
    </div>
  );
};

export default LandingPage;
