import { Link, NavLink } from "react-router-dom";
import { HiMoon, HiSun } from "react-icons/hi2";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/predict", label: "Predict" },
  { to: "/dataset", label: "Dataset" },
  { to: "/india-all-landslides", label: "India All Landslides" },
];

export default function Navbar({ theme, onToggleTheme }) {
  const isDark = theme === "dark";

  return (
    <header className="app-navbar fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-slate-900"
        >
          <img
            src="/images/logo.png"
            alt="Landslide Predictor logo"
            className="h-11 w-11 rounded-md border border-orange-200 bg-white p-0.5 object-contain shadow-sm"
          />
          <span>Landslide Predictor</span>
        </Link>

        <div className="flex items-center gap-2">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {isDark ? (
              <HiSun className="h-5 w-5" />
            ) : (
              <HiMoon className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
