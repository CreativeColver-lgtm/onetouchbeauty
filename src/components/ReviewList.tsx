"use client";
import { useState } from "react";
import Image from "next/image";
import { Star, BadgeCheck, ThumbsUp, ThumbsDown, ChevronDown, MessageSquare } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  photos?: string[];
  businessReply?: { text: string; date: string };
}

const mockReviews: Review[] = [
  {
    id: 1, name: "Emma Williams", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    rating: 5, date: "2 days ago", text: "Absolutely love my balayage! The team here are so talented and friendly. Really took the time to understand what I wanted. The colour is stunning and exactly what I showed on my Pinterest board. Can't recommend enough!",
    verified: true, helpful: 24, notHelpful: 1,
    businessReply: { text: "Thank you so much Emma! We loved working with you. See you next time! 💕", date: "1 day ago" },
  },
  {
    id: 2, name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 5, date: "1 week ago", text: "Best haircut I've had in years. Really listened to what I wanted and nailed it first time. The salon is gorgeous too — very relaxing atmosphere with great coffee!",
    verified: true, helpful: 18, notHelpful: 0,
  },
  {
    id: 3, name: "James Okafor", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 4, date: "2 weeks ago", text: "Great colour work on my partner's highlights, they look so natural. The only reason for 4 stars is the wait was slightly longer than expected, but the result was absolutely worth it.",
    verified: true, helpful: 12, notHelpful: 2,
    businessReply: { text: "Thanks for the feedback James! We apologise for the wait — we've adjusted our scheduling to avoid this. Hope to see you both again!", date: "1 week ago" },
  },
  {
    id: 4, name: "Amara Osei", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5, date: "3 weeks ago", text: "My go-to salon! Always leave feeling amazing. The Olaplex treatment saved my damaged hair after years of bleaching. The staff genuinely care about hair health.",
    verified: true, helpful: 31, notHelpful: 0,
  },
  {
    id: 5, name: "Lucy Matthews", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 5, date: "1 month ago", text: "Had my bridal hair trial here and I'm over the moon! They were so patient with all my Pinterest inspo photos and created something even better than I imagined.",
    verified: true, helpful: 45, notHelpful: 1,
  },
  {
    id: 6, name: "Kate Palmer", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face",
    rating: 3, date: "1 month ago", text: "The cut was fine but nothing special. I felt a bit rushed and didn't get the blow-dry style I asked for. The receptionist was lovely though.",
    verified: false, helpful: 5, notHelpful: 3,
    businessReply: { text: "We're sorry you didn't have the best experience Kate. We'd love the chance to make it right — please reach out to us directly and we'll arrange a complimentary style. 🙏", date: "3 weeks ago" },
  },
  {
    id: 7, name: "Rachel Green", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    rating: 5, date: "5 weeks ago", text: "Took my daughter for her first proper haircut and they were brilliant with her. So gentle and patient. She loved every second of it!",
    verified: true, helpful: 22, notHelpful: 0,
  },
  {
    id: 8, name: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 4, date: "6 weeks ago", text: "Good beard trim and shape up. The hot towel treatment was a nice touch. Slightly pricey compared to others in the area but the quality is there.",
    verified: true, helpful: 8, notHelpful: 1,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 178 },
  { stars: 4, count: 38 },
  { stars: 3, count: 12 },
  { stars: 2, count: 4 },
  { stars: 1, count: 2 },
];
const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0);
const avgRating = ratingBreakdown.reduce((s, r) => s + r.stars * r.count, 0) / totalReviews;

type SortOption = "recent" | "highest" | "helpful";

export default function ReviewList() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterStars, setFilterStars] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, "up" | "down">>({});
  const [showAll, setShowAll] = useState(false);

  const sorted = [...mockReviews]
    .filter((r) => (filterStars ? r.rating === filterStars : true))
    .sort((a, b) => {
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "helpful") return b.helpful - a.helpful;
      return 0; // "recent" = default order
    });

  const visible = showAll ? sorted : sorted.slice(0, 4);

  const vote = (id: number, type: "up" | "down") => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: prev[id] === type ? undefined! : type }));
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Average Score */}
          <div className="text-center sm:text-left shrink-0">
            <p className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</p>
            <div className="flex gap-0.5 justify-center sm:justify-start mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className={s <= Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-border"} />
              ))}
            </div>
            <p className="text-sm text-text-muted mt-1">{totalReviews} reviews</p>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 w-full space-y-1.5">
            {ratingBreakdown.map((r) => {
              const pct = (r.count / totalReviews) * 100;
              const isActive = filterStars === r.stars;
              return (
                <button
                  key={r.stars}
                  onClick={() => setFilterStars(isActive ? null : r.stars)}
                  className={`w-full flex items-center gap-2 py-0.5 rounded transition hover:bg-surface ${isActive ? "bg-primary/5" : ""}`}
                >
                  <span className="text-xs text-text-muted w-3 text-right">{r.stars}</span>
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <div className="flex-1 h-2.5 bg-surface rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isActive ? "bg-primary" : "bg-amber-400"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted w-8">{r.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter */}
        {filterStars && (
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-sm text-foreground">
              Showing {filterStars}-star reviews ({sorted.length})
            </span>
            <button
              onClick={() => setFilterStars(null)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-text-muted">Sort by:</span>
        {([["recent", "Most recent"], ["highest", "Highest rated"], ["helpful", "Most helpful"]] as const).map(
          ([value, label]) => (
            <button
              key={value}
              onClick={() => setSortBy(value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                sortBy === value
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text-muted hover:border-primary hover:text-primary"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {visible.map((review) => (
          <div key={review.id} className="bg-surface-elevated border border-border rounded-2xl p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden relative ring-2 ring-primary/10">
                  <Image src={review.avatar} alt={review.name} fill className="object-cover" unoptimized />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{review.name}</span>
                    {review.verified && (
                      <span className="flex items-center gap-0.5 text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">
                        <BadgeCheck size={10} /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={12} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-text-muted leading-relaxed mb-4">{review.text}</p>

            {/* Business Reply */}
            {review.businessReply && (
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-4 ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-primary" />
                  <span className="text-xs font-bold text-primary">Business reply</span>
                  <span className="text-[10px] text-text-muted">{review.businessReply.date}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{review.businessReply.text}</p>
              </div>
            )}

            {/* Helpful Voting */}
            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <span className="text-xs text-text-muted">Was this helpful?</span>
              <button
                onClick={() => vote(review.id, "up")}
                className={`flex items-center gap-1 text-xs font-medium transition ${
                  helpfulVotes[review.id] === "up"
                    ? "text-accent"
                    : "text-text-muted hover:text-accent"
                }`}
              >
                <ThumbsUp size={13} className={helpfulVotes[review.id] === "up" ? "fill-accent" : ""} />
                {review.helpful + (helpfulVotes[review.id] === "up" ? 1 : 0)}
              </button>
              <button
                onClick={() => vote(review.id, "down")}
                className={`flex items-center gap-1 text-xs font-medium transition ${
                  helpfulVotes[review.id] === "down"
                    ? "text-red-400"
                    : "text-text-muted hover:text-red-400"
                }`}
              >
                <ThumbsDown size={13} className={helpfulVotes[review.id] === "down" ? "fill-red-400" : ""} />
                {review.notHelpful + (helpfulVotes[review.id] === "down" ? 1 : 0)}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {sorted.length > 4 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition"
        >
          <ChevronDown size={16} className={`transition-transform ${showAll ? "rotate-180" : ""}`} />
          {showAll ? "Show less" : `Show all ${sorted.length} reviews`}
        </button>
      )}
    </div>
  );
}
