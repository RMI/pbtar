/// <reference types="vite/client" />
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import ScenarioDetailPage from "./pages/ScenarioDetailPage";
import EnvironmentBanner from "./components/EnvironmentBanner";

// Export the inner content for testing
export const AppContent = () => {
  const environment: string = import.meta.env.VITE_BUILD_MODE;
  const showBanner = environment !== "production";

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-50${showBanner ? " pt-6" : ""}`}
    >
      <EnvironmentBanner />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/scenario/:id"
            element={<ScenarioDetailPage />}
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
        </Routes>
      </main>
      <Footer />
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
