import { Link, NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Home" },
    { to: "/predict", label: "Predict" },
    { to: "/dataset", label: "Dataset" },
    { to: "/about", label: "About" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
            <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
                    Landslide Predictor
                </Link>
                <ul className="flex items-center gap-2 sm:gap-3">
                    {links.map((item) => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    [
                                        "rounded-md px-3 py-2 text-sm font-medium transition",
                                        isActive
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                                    ].join(" ")
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}