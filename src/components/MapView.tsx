"use client";
import Image from "next/image";
import { MapPin, Star, Info } from "lucide-react";
import { useState } from "react";

interface SalonPin {
  name: string;
  rating: number;
  top: string;
  left: string;
}

const defaultPins: SalonPin[] = [
  { name: "Glow Studio", rating: 4.9, top: "35%", left: "52%" },
  { name: "Nail Artistry", rating: 4.8, top: "28%", left: "38%" },
  { name: "Pure Skin Clinic", rating: 4.9, top: "55%", left: "30%" },
  { name: "Curl & Co", rating: 4.7, top: "40%", left: "48%" },
  { name: "Blush Beauty Bar", rating: 4.8, top: "25%", left: "40%" },
  { name: "Polish Perfect", rating: 4.9, top: "30%", left: "42%" },
];

export default function MapView({ pins = defaultPins }: { pins?: SalonPin[] }) {
  const [activePin, setActivePin] = useState<number | null>(null);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-surface-elevated">
      {/* Map background */}
      <div className="relative aspect-[2/1] min-h-[300px] max-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=600&fit=crop"
          alt="Map view"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />

        {/* Pins */}
        {pins.map((pin, i) => (
          <button
            key={pin.name}
            className="absolute z-10 group"
            style={{ top: pin.top, left: pin.left, transform: "translate(-50%, -100%)" }}
            onClick={() => setActivePin(activePin === i ? null : i)}
          >
            {/* Pin marker */}
            <div className={`relative transition-transform duration-200 ${activePin === i ? "scale-125" : "group-hover:scale-110"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                activePin === i ? "bg-primary" : "bg-white"
              }`}>
                <MapPin size={16} className={activePin === i ? "text-white" : "text-primary"} />
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit rotate-45 -mt-1" />
            </div>

            {/* Info tooltip */}
            {activePin === i && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-xl shadow-xl p-3 min-w-[160px] animate-slide-up">
                <p className="font-bold text-gray-900 text-sm whitespace-nowrap">{pin.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold text-gray-700">{pin.rating}</span>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 -mt-1.5" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Notice bar */}
      <div className="px-5 py-3 bg-surface flex items-center gap-3 border-t border-border">
        <Info size={16} className="text-primary shrink-0" />
        <p className="text-sm text-text-muted">
          <span className="font-semibold text-foreground">Map view coming soon</span> — we&apos;re integrating Google Maps for full interactive browsing
        </p>
      </div>
    </div>
  );
}
