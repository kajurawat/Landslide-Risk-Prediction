import { useEffect, useState } from "react";
import { useLocation, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DatasetPage from "./pages/DatasetPage";
import PredictPage from "./pages/PredictPage";
import IndiaAllLandslidesPage from "./pages/IndiaAllLandslidesPage";
import WorkflowPage from "./pages/WorkflowPage/index.jsx";

function App() {
  const location = useLocation();
  const isWorkflowRoute = location.pathname === "/workflow";
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
    <div className="app-shell flex min-h-screen flex-col bg-slate-50">
      {!isWorkflowRoute ? (
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
      ) : null}
      <div
        className={
          isWorkflowRoute ? "flex-1" : "app-shell-content flex-1 pt-16"
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/predict" element={<PredictPage />} />
          <Route
            path="/india-all-landslides"
            element={<IndiaAllLandslidesPage />}
          />
          <Route path="/workflow" element={<WorkflowPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {!isWorkflowRoute ? <Footer /> : null}
    </div>
  );
}

export default App;
