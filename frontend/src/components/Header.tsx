import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-gradient-to-r from-teal-700 to-blue-900 text-white shadow-md">
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
              Climate Transition Scenarios Repository
            </h1>
            <p className="text-xs md:text-sm text-teal-100">by RMI</p>
          </div>
        </Link>

        <nav className="flex mt-4 md:mt-0">
          <Link
            to="/"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-teal-200 ${
              location.pathname === "/"
                ? "text-teal-200 border-b-2 border-teal-200"
                : "text-white"
            }`}
          >
            Scenarios
          </Link>
          <Link
            to="/about"
            className={`px-4 py-2 text-sm md:text-base font-medium transition-colors duration-200 hover:text-teal-200 ${
              location.pathname === "/about"
                ? "text-teal-200 border-b-2 border-teal-200"
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
