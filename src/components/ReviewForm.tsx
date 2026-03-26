"use client";
import { useState } from "react";
import { Star, Upload, BadgeCheck, Check, Loader2, X, Camera } from "lucide-react";

interface ReviewFormProps {
  salonName?: string;
  onSubmit?: (review: { rating: number; text: string }) => void;
  isVerifiedBooking?: boolean;
}

export default function ReviewForm({
  salonName = "this salon",
  onSubmit,
  isVerifiedBooking = true,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const maxChars = 500;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    onSubmit?.({ rating, text });
  };

  if (submitted) {
    return (
      <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Check size={32} className="text-accent" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Thank you for your review!</h3>
        <p className="text-sm text-text-muted">Your feedback helps other clients find great beauty professionals.</p>
        <div className="flex justify-center gap-0.5 mt-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={18} className={s <= rating ? "text-amber-400 fill-amber-400" : "text-border"} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-foreground text-lg">Write a Review</h3>
        {isVerifiedBooking && (
          <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            <BadgeCheck size={12} /> Verified Booking
          </span>
        )}
      </div>

      <p className="text-sm text-text-muted mb-4">How was your experience at {salonName}?</p>

      {/* Star Rating */}
      <div className="flex items-center gap-1 mb-5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            onMouseEnter={() => setHoveredRating(s)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(s)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={`transition-colors ${
                s <= (hoveredRating || rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-border hover:text-amber-200"
              }`}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-sm text-text-muted ml-2">
            {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
          </span>
        )}
      </div>

      {/* Text Input */}
      <div className="relative mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, maxChars))}
          placeholder="Tell others about your experience..."
          rows={4}
          className="w-full p-4 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary resize-none transition"
        />
        <span className={`absolute bottom-3 right-3 text-xs ${text.length > maxChars * 0.9 ? "text-red-400" : "text-text-muted"}`}>
          {text.length}/{maxChars}
        </span>
      </div>

      {/* Photo Upload Dropzone */}
      <div className="mb-5">
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition">
            <Camera size={20} className="text-primary" />
          </div>
          <p className="text-sm font-medium text-foreground">Add photos</p>
          <p className="text-xs text-text-muted mt-1">Drop images here or click to upload</p>
          <input type="file" accept="image/*" multiple className="hidden" onChange={() => {
            // Mock: just show placeholder
            setPhotos((prev) => [...prev, `photo-${prev.length + 1}`]);
          }} />
        </label>
        {photos.length > 0 && (
          <div className="flex gap-2 mt-3">
            {photos.map((p, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload size={16} className="text-primary/50" />
                <button
                  onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
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
