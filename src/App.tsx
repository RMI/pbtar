/// <reference types="vite/client" />
// App.tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import ScenarioSearch from "./pages/ScenarioSearch";
import PathwayDetailPage from "./pages/PathwayDetailPage";
import LandingPage from "./pages/LandingPage";
import EnvironmentBanner from "./components/EnvironmentBanner";

// Export the inner content for testing
export const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <EnvironmentBanner />
      {!isLandingPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<LandingPage />}
          />
          <Route
            path="/scenario"
            element={<ScenarioSearch />}
          />
          <Route
            path="/scenario/:id"
            element={<PathwayDetailPage />}
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
        </Routes>
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
