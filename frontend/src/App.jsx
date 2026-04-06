import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DatasetPage from "./pages/DatasetPage";
import PredictPage from "./pages/PredictPage";
import IndiaAllLandslidesPage from "./pages/IndiaAllLandslidesPage";

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell min-h-screen bg-slate-50">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <div className="app-shell-content pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route
            path="/india-all-landslides"
            element={<IndiaAllLandslidesPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
