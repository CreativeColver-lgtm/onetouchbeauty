"use client";
import { useState, useEffect, useCallback } from "react";
import { X, CheckCircle2 } from "lucide-react";

const bookings = [
  { name: "Sarah", city: "London", service: "balayage", salon: "Glow Studio" },
  { name: "Emma", city: "Manchester", service: "gel manicure", salon: "Nail Artistry" },
  { name: "Jade", city: "Bristol", service: "hydrafacial", salon: "Pure Skin Clinic" },
  { name: "Amara", city: "Edinburgh", service: "lash extensions", salon: "Lash & Brow Bar" },
  { name: "Lucy", city: "Leeds", service: "hot stone massage", salon: "Zen Body Spa" },
  { name: "Hannah", city: "Liverpool", service: "bridal makeup", salon: "Blush Beauty Bar" },
  { name: "Olivia", city: "Glasgow", service: "keratin treatment", salon: "Mane Attraction" },
  { name: "Sophie", city: "Birmingham", service: "nail art", salon: "Polish Perfect" },
  { name: "Mia", city: "Cardiff", service: "chemical peel", salon: "Face Forward" },
  { name: "Charlotte", city: "Nottingham", service: "Brazilian blowout", salon: "Curl & Co" },
];

export default function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const showNext = useCallback(() => {
    if (dismissed) return;
    setCurrentIdx((prev) => (prev + 1) % bookings.length);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 4000);
    return timer;
  }, [dismissed]);

  useEffect(() => {
    if (dismissed) return;

    // Initial delay before first notification
    const initialTimer = setTimeout(() => {
      setVisible(true);
      const hideTimer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(hideTimer);
    }, 3000);

    // Recurring interval
    const interval = setInterval(() => {
      showNext();
    }, 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed, showNext]);

  if (dismissed) return null;

  const booking = bookings[currentIdx];
  const timeAgo = `${Math.floor(Math.random() * 10) + 1} min ago`;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-sm transition-all duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-surface-elevated border border-border rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 size={20} className="text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-snug">
            <span className="font-bold">{booking.name}</span> from{" "}
            <span className="font-semibold">{booking.city}</span> just booked a{" "}
            <span className="text-primary font-semibold">{booking.service}</span> at{" "}
            <span className="font-semibold">{booking.salon}</span>
          </p>
          <p className="text-xs text-text-muted mt-1">{timeAgo}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="w-6 h-6 rounded-full hover:bg-surface flex items-center justify-center shrink-0 text-text-muted hover:text-foreground transition"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
