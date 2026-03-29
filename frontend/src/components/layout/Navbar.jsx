import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/predict", label: "Predict" },
  { to: "/dataset", label: "Dataset" },
  { to: "/about", label: "About" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .lc-navbar * { box-sizing: border-box; }
  .lc-navbar { font-family: 'Inter', system-ui, sans-serif; }

  .lc-nav-link {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #3d3d3d;
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .lc-nav-link:hover {
    color: #111;
    background: #f3f4f6;
  }
  .lc-nav-link.active {
    color: #f97316;
    background: #fff7ed;
    font-weight: 600;
  }

  .lc-hamburger { display: none !important; }

  @media (max-width: 768px) {
    .lc-desktop-links { display: none !important; }
    .lc-hamburger { display: inline-flex !important; }
  }

  .lc-mobile-menu {
    display: none;
    flex-direction: column;
    gap: 2px;
    padding: 8px 16px 14px;
    border-top: 1px solid #f0f0f0;
  }
  .lc-mobile-menu.open { display: flex; }
  .lc-mobile-link {
    display: block;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #3d3d3d;
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
  }
  .lc-mobile-link:hover { color: #111; background: #f3f4f6; }
  .lc-mobile-link.active { color: #f97316; background: #fff7ed; font-weight: 600; }

  .lc-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px; height: 34px;
    border-radius: 6px;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #6b7280;
    transition: color 0.15s, background 0.15s;
  }
  .lc-icon-btn:hover { color: #111; background: #f3f4f6; }
`;

function LogoIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M3 20L9 8l4 7 3-5 5 10H3Z" fill="#f97316" />
      <path d="M9 8l4 7 3-5" stroke="#fff" strokeWidth="0.8" fill="none" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <><path d="M3 3l12 12M15 3L3 15" /></>
      ) : (
        <><path d="M2 4.5h14M2 9h14M2 13.5h14" /></>
      )}
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{css}</style>

      <header
        className="lc-navbar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            height: "60px",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          {/* ── Logo (left) ── */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <LogoIcon />
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#111", letterSpacing: "-0.01em" }}>
              Landslide<span style={{ color: "#f97316" }}>.</span>
            </span>
          </Link>

          {/* ── Nav links (right) ── */}
          <nav
            className="lc-desktop-links"
            style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "auto" }}
          >
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => "lc-nav-link" + (isActive ? " active" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="lc-icon-btn lc-hamburger"
            style={{ marginLeft: "auto" }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        <div className={`lc-mobile-menu${mobileOpen ? " open" : ""}`}>
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => "lc-mobile-link" + (isActive ? " active" : "")}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>
    </>
  );
}