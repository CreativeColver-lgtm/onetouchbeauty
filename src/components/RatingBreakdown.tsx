"use client";
import { Star } from "lucide-react";

interface RatingBreakdownProps {
  rating: number;
  reviews?: number;
  totalReviews?: number;
  breakdown?: Record<number, number> | { stars: number; count: number }[];
}

export default function RatingBreakdown({ rating, reviews: reviewsProp, totalReviews, breakdown }: RatingBreakdownProps) {
  const reviews = reviewsProp ?? totalReviews ?? 0;
  const defaultBars: Record<number, number> = { 5: 70, 4: 20, 3: 7, 2: 2, 1: 1 };
  const bars: Record<number, number> = !breakdown
    ? defaultBars
    : Array.isArray(breakdown)
      ? Object.fromEntries(breakdown.map((b) => [b.stars, b.count]))
      : breakdown;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-4xl font-extrabold text-foreground">{rating}</span>
        <div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-border"}
              />
            ))}
          </div>
          <p className="text-xs text-text-muted mt-0.5">{reviews} reviews</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-text-muted">{star}</span>
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full"
                style={{ width: `${bars[star] ?? 0}%` }}
              />
            </div>
            <span className="w-8 text-right text-text-muted">{bars[star] ?? 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
