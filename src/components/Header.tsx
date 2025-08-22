import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  return (
  <header className="bg-bluespruce text-white shadow-token-md transition-colors transition-base ease-standard">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-3 group transition-all transition-base ease-standard"
        >
          <BarChart3
            size={32}
            className="text-white group-hover:scale-110 transition-transform transition-base ease-emphasized"
          />
          <div>
            <h1 className="text-title tracking-tight">
              Climate Transition Scenarios Repository
            </h1>
            <p className="text-meta text-white">by RMI</p>
          </div>
        </Link>

        <nav className="flex mt-4 md:mt-0">
          <Link
            to="/"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-energy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bluespruce rounded-sm ${
              location.pathname === "/"
                ? "text-energy border-b-2 border-energy"
                : "text-white"
            }`}
          >
            Scenarios
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-energy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bluespruce rounded-sm ${
              location.pathname === "/about"
                ? "text-energy border-b-2 border-energy"
                : "text-white"
            }`}
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
