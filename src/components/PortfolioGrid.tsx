"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface PortfolioItem {
  src: string;
  alt: string;
  category: string;
}

const defaultItems: PortfolioItem[] = [
  { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop", alt: "Salon styling", category: "Hair" },
  { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop", alt: "Hair colour", category: "Colour" },
  { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop", alt: "Facial treatment", category: "Skincare" },
  { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop", alt: "Nail art", category: "Nails" },
  { src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop", alt: "Spa treatment", category: "Spa" },
  { src: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=500&fit=crop", alt: "Makeup artistry", category: "Makeup" },
  { src: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop", alt: "Nail design", category: "Nails" },
  { src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop", alt: "Bridal look", category: "Bridal" },
  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=400&fit=crop", alt: "Body massage", category: "Spa" },
  { src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=500&fit=crop", alt: "Hair styling", category: "Hair" },
  { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=400&fit=crop", alt: "Salon atmosphere", category: "Salon" },
  { src: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=500&fit=crop", alt: "Hair cutting", category: "Hair" },
];

export default function PortfolioGrid({ items = defaultItems }: { items?: PortfolioItem[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category)))];

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (lightbox === null) return;
      setLightbox((prev) => {
        if (prev === null) return null;
        const next = prev + dir;
        if (next < 0) return filtered.length - 1;
        if (next >= filtered.length) return 0;
        return next;
      });
    },
    [lightbox, filtered.length]
  );

  return (
    <div>
      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === cat
                ? "bg-primary text-white shadow-md"
                : "bg-surface border border-border text-text-muted hover:border-primary hover:bg-primary/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((item, i) => (
          <button
            key={`${item.src}-${i}`}
            onClick={() => openLightbox(i)}
            className="break-inside-avoid rounded-xl overflow-hidden relative group block w-full cursor-pointer"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={400}
              height={item.src.includes("h=500") ? 500 : 400}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
              <div className="p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-full">
                <span className="text-white text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Heart size={18} className="text-white drop-shadow-lg" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-50"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-50"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition z-50"
          >
            <ChevronRight size={20} />
          </button>

          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].src.replace(/w=\d+/, "w=1200").replace(/h=\d+/, "h=900")}
              alt={filtered[lightbox].alt}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              unoptimized
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-white text-sm font-bold px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                {filtered[lightbox].category}
              </span>
              <span className="text-white/60 text-sm">
                {lightbox + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
