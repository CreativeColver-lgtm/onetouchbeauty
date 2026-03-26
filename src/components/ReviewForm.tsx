"use client";
import { useState } from "react";
import { Star, BadgeCheck, Camera, X, Loader2, Check, Upload } from "lucide-react";

interface ReviewFormProps {
  salonName?: string;
  onSubmit?: (review: { rating: number; text: string }) => void;
}

export default function ReviewForm({ salonName = "this salon", onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const maxChars = 500;
  const activeRating = hoverRating || rating;

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  const handleSubmit = async () => {
    if (rating === 0 || text.trim().length < 10) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    onSubmit?.({ rating, text });
  };

  if (submitted) {
    return (
      <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Thank you for your review!</h3>
        <p className="text-sm text-text-muted">Your feedback helps others find great salons and helps businesses improve.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-lg">Write a Review</h3>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
          <BadgeCheck size={12} /> Verified Booking
        </span>
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Your rating</label>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  size={28}
                  className={`transition-colors ${
                    s <= activeRating
                      ? "text-amber-400 fill-amber-400"
                      : "text-border hover:text-amber-200"
                  }`}
                />
              </button>
            ))}
          </div>
          {activeRating > 0 && (
            <span className="text-sm font-medium text-foreground animate-fade-in">
              {ratingLabels[activeRating]}
            </span>
          )}
        </div>
      </div>

      {/* Text Review */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Your review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          placeholder={`Tell others about your experience at ${salonName}...`}
          rows={4}
          className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none transition"
        />
        <div className="flex justify-between text-xs">
          <span className={text.length < 10 && text.length > 0 ? "text-red-400" : "text-text-muted"}>
            {text.length < 10 && text.length > 0 ? "Minimum 10 characters" : ""}
          </span>
          <span className={`${text.length > maxChars * 0.9 ? "text-amber-500" : "text-text-muted"}`}>
            {text.length}/{maxChars}
          </span>
        </div>
      </div>

      {/* Photo Upload Dropzone */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Add photos (optional)</label>
        {photos.length > 0 && (
          <div className="flex gap-2 mb-2">
            {photos.map((_, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Camera size={20} className="text-primary/40" />
                <button
                  onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setPhotos([...photos, "placeholder"])}
          className="w-full border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-6 flex flex-col items-center gap-2 transition group"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
            <Upload size={18} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-text-muted group-hover:text-foreground transition">
            Click to upload photos
          </p>
          <p className="text-xs text-text-muted">JPG, PNG up to 5MB each</p>
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || text.trim().length < 10 || submitting}
        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Star size={16} />
            Submit Review
          </>
        )}
      </button>
    </div>
  );
}
