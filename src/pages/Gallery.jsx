import { useState } from "react";

const ALL = [
  { cat: "Glass", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/11/16437-104_image_0.jpg" },
  { cat: "Glass", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/11/architectural-decorative-glass.jpg" },
  { cat: "Glass", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/glass3-scaled.jpg" },
  { cat: "Glass", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/glass.jpg" },
  { cat: "Glass", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/glassssssss9.jpg" },
  { cat: "Plywood", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/greenply-green-gold-plywood-thick.jpg" },
  { cat: "Plywood", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/plywood3.jpg" },
  { cat: "Plywood", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/plywood4-scaled.jpg" },
  { cat: "Plywood", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/11/p1.jpeg" },
  { cat: "Plywood", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/11/p3.jpeg" },
  { cat: "Doors", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Door7-scaled.jpg" },
  { cat: "Doors", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Door5.jpg" },
  { cat: "Doors", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Door4.jpg" },
  { cat: "Hardware", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Ebco2-1.jpg" },
  { cat: "Hardware", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Ozone1.jpeg" },
  { cat: "Hardware", src: "https://srilakshmiglassandplywoods.com/wp-content/uploads/2024/10/Dorset4.jpeg" },
];

const tabs = ["All", "Glass", "Plywood", "Doors", "Hardware"];

export default function Gallery() {
  const [active, setActive] = useState("All");
  const items = active === "All" ? ALL : ALL.filter((i) => i.cat === active);

  return (
    <div data-testid="gallery-page" className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="label-eyebrow mb-4">Our Gallery</div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-stone-900">
          A peek into our work and showroom.
        </h1>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            data-testid={`gallery-tab-${t.toLowerCase()}`}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              active === t
                ? "bg-emerald-700 text-white"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it, i) => (
          <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-stone-100">
            <img src={it.src} alt={it.cat} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
