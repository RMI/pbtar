import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-bluespruce text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-3 group transition-all duration-300"
        >
          <BarChart3
            size={32}
            className="text-white group-hover:scale-110 transition-transform duration-300"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              PBTAR-SEMVER-02
            </h1>
            <p className="text-xs md:text-sm text-white">by RMI</p>
          </div>
        </Link>

        <nav className="flex mt-4 md:mt-0">
          <Link
            to="/"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-energy ${
              location.pathname === "/"
                ? "text-energy border-b-2 border-energy"
                : "text-white"
            }`}
          >
            Scenarios
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-energy ${
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
