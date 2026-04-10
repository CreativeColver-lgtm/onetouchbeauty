"use client";
import { Star, ThumbsUp, MessageSquare, TrendingUp } from "lucide-react";

const reviews = [
  { id: 1, client: "Sophie W.", rating: 5, text: "Absolutely loved my balayage! Will definitely be back.", service: "Balayage", date: "2 days ago", replied: true },
  { id: 2, client: "Emma T.", rating: 5, text: "Best gel manicure I've had in ages. Beautiful work.", service: "Gel Manicure", date: "5 days ago", replied: false },
  { id: 3, client: "Hannah P.", rating: 4, text: "Great facial, really refreshing. Slightly rushed at the end but overall lovely.", service: "Hydrafacial", date: "1 week ago", replied: true },
  { id: 4, client: "Amara C.", rating: 5, text: "My bridal trial was perfect. So happy I found this salon!", service: "Bridal Makeup", date: "2 weeks ago", replied: true },
];

export default function ReviewsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-text-muted mt-1">Manage and respond to client feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Average Rating", value: "4.9", icon: Star, sub: "Last 30 days" },
          { label: "Total Reviews", value: "234", icon: MessageSquare, sub: "All time" },
          { label: "Response Rate", value: "92%", icon: ThumbsUp, sub: "Last 30 days" },
          { label: "Trend", value: "+12%", icon: TrendingUp, sub: "vs last month" },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-elevated border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-text-muted mb-2">
              <stat.icon size={16} className="text-primary" />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{review.client}</p>
                <p className="text-xs text-text-muted">{review.service} · {review.date}</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                ))}
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{review.text}</p>
            <div className="flex items-center gap-3 mt-4">
              {review.replied ? (
                <span className="text-xs text-primary font-medium">✓ Replied</span>
              ) : (
                <button className="text-xs font-semibold text-primary hover:underline">Reply</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
