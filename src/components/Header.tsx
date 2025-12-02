import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-bluespruce text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link
          to="/pathway"
          className="flex items-center space-x-3 group transition-all duration-300"
        >
          <img
            src="/RMILogo-white.svg"
            alt="RMI logo"
            className="h-8 w-auto mr-2 group-hover:scale-110 transition-transform duration-300"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              Climate Transition Pathways Repository
            </h1>
            <p className="text-xs md:text-sm text-white">by RMI</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
