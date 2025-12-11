import React from "react";
import { Link } from "react-router-dom";

export const HeaderBrand: React.FC = () => {
  return (
    <div>
      <Link
        to="/pathway"
        className="flex items-center space-x-3 group transition-all duration-300"
      >
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Transition Pathways Repository
        </h1>
      </Link>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs md:text-sm text-white/80">Created by</span>
        <Link
          to="https://rmi.org"
          className="flex items-center space-x-3 group transition-all duration-300"
        >
          <img
            src="/RMILogo-white.svg"
            alt="RMI logo"
            className="h-4 md:h-5 w-auto"
          />
        </Link>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  return (
    <header className="bg-bluespruce text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <HeaderBrand />
      </div>
    </header>
  );
};

export default Header;
