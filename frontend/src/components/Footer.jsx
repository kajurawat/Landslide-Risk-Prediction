import { Link } from "react-router-dom";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/95">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-600 sm:px-10 lg:px-16 md:flex-row md:items-center md:justify-between">
        <p className="m-0">
          Landslide Risk Prediction Project | A project I make for my love kajal ❣️ {" "}
          {year}
        </p>

      </div>
    </footer>
  );
}
