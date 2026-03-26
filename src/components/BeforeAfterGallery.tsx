"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";

interface Transformation {
  before: string;
  after: string;
  title: string;
  description: string;
}

const defaultTransformations: Transformation[] = [
  {
    before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    title: "Balayage Transformation",
    description: "From flat colour to sun-kissed dimension",
  },
];

export default function BeforeAfterGallery({
  transformations = defaultTransformations,
  compact = false,
}: {
  transformations?: Transformation[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-6" : "space-y-8"}>
      {transformations.map((t, i) => (
        <BeforeAfterSlider key={i} transformation={t} compact={compact} />
      ))}
    </div>
  );
}

function BeforeAfterSlider({
  transformation,
  compact,
}: {
  transformation: Transformation;
  compact: boolean;
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div>
      {!compact && (
        <div className="mb-3">
          <h3 className="font-bold text-foreground text-lg">{transformation.title}</h3>
          <p className="text-sm text-text-muted">{transformation.description}</p>
        </div>
      )}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-2xl cursor-col-resize select-none touch-none ${
          compact ? "aspect-[3/2]" : "aspect-[3/2] max-h-[500px]"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* After image (full background) */}
        <Image
          src={transformation.after}
          alt="After"
          fill
          className="object-cover"
          unoptimized
          draggable={false}
        />

        {/* Before image (clipped) */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <Image
            src={transformation.before}
            alt="Before"
            fill
            className="object-cover"
            unoptimized
            draggable={false}
          />
        </div>

        {/* Slider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
          style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
        >
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7 4L3 10L7 16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 4L17 10L13 16" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm z-10">
          Before
        </span>
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm z-10">
          After
        </span>
      </div>
      {compact && (
        <p className="mt-2 text-sm font-medium text-foreground">{transformation.title}</p>
      )}
    </div>
  );
}
