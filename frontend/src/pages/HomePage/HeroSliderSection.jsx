import { useEffect, useState } from "react";

export default function HeroSliderSection({ slideItems }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideItems.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slideItems.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-4 pt-0 sm:px-8 lg:px-12">
      <div className="portal-slider-card overflow-hidden rounded-xl border border-slate-300 bg-white">
        <div className="relative h-57.5 sm:h-72.5 lg:h-82.5">
          {slideItems.map((slide, index) => (
            <figure
              key={slide.title}
              className={[
                "portal-slide absolute inset-0 m-0 transition-opacity duration-700",
                index === activeSlide ? "opacity-100" : "opacity-0",
              ].join(" ")}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
              />
              <figcaption className="portal-slide-caption absolute inset-x-0 bottom-0 px-4 py-3 sm:px-6 sm:py-4">
                <h2 className="text-base font-semibold text-white sm:text-xl">
                  {slide.title}
                </h2>
                <p className="mt-1 text-xs text-slate-100 sm:text-sm">
                  {slide.subtitle}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-slate-50 px-3 py-2">
          {slideItems.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={[
                "h-2.5 w-2.5 rounded-full border transition",
                index === activeSlide
                  ? "border-sky-700 bg-sky-700"
                  : "border-slate-400 bg-white hover:border-sky-500",
              ].join(" ")}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
