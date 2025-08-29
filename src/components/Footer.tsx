import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-bluespruce border-t border-basalt mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <BarChart3
              size={24}
              className="text-white mr-2"
            />
            <span className="text-sm font-medium text-white">
              Climate Transition Scenarios Repository
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0">
            <Link
              to="/about"
              className="text-sm text-white hover:text-energy transition-colors duration-200 sm:mr-6"
            >
              About Us
            </Link>
            <a
              href="mailto:contact@rmi.org"
              className="flex items-center text-sm text-white hover:text-energy transition-colors duration-200"
            >
              <Mail
                size={16}
                className="mr-1"
              />
              Contact Us
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-basalt text-center">
          <p className="text-xs text-white">
            &copy; {new Date().getFullYear()} RMI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
