import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export const HeaderBrand: React.FC = () => {
  return (
    <Link
      to="/pathway"
      className="flex items-center space-x-3 group transition-all duration-300"
    >
      <div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Transition Pathways Repository
        </h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs md:text-sm text-white/80">Created by</span>
          <img
            src="/RMILogo-white.svg"
            alt="RMI logo"
            className="h-4 md:h-5 w-auto"
          />
        </div>
      </div>
    </Link>
  );
};

const Header: React.FC = () => {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!resourcesOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setResourcesOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [resourcesOpen]);

  return (
    <header className="bg-bluespruce text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <HeaderBrand />

        <nav className="mt-3 md:mt-0 flex items-center gap-2">
          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              aria-haspopup="menu"
              aria-expanded={resourcesOpen}
              onClick={() => setResourcesOpen((v) => !v)}
            >
              Resources
              <span className="text-white/70">▾</span>
            </button>

            {resourcesOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-72 overflow-hidden rounded-md bg-white text-rmigray-800 shadow-lg ring-1 ring-black/5"
              >
                <Link
                  role="menuitem"
                  to="/resources/methodology"
                  className="block px-4 py-3 text-sm hover:bg-neutral-100"
                  onClick={() => setResourcesOpen(false)}
                >
                  Methodology
                </Link>
                <Link
                  role="menuitem"
                  to="/resources/use-cases"
                  className="block px-4 py-3 text-sm hover:bg-neutral-100"
                  onClick={() => setResourcesOpen(false)}
                >
                  Use cases
                </Link>
                <Link
                  role="menuitem"
                  to="/resources/changelog"
                  className="block px-4 py-3 text-sm hover:bg-neutral-100"
                  onClick={() => setResourcesOpen(false)}
                >
                  Blog / Changelog
                </Link>
                <Link
                  role="menuitem"
                  to="/resources/contact"
                  className="block px-4 py-3 text-sm hover:bg-neutral-100"
                  onClick={() => setResourcesOpen(false)}
                >
                  Contact
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
