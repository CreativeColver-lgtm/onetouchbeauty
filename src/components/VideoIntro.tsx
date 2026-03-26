"use client";
import { useState } from "react";
import Image from "next/image";
import { Play, X, Video } from "lucide-react";

export default function VideoIntro({
  thumbnail = "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=450&fit=crop",
  title = "Meet Your Stylist",
  subtitle = "Watch a quick introduction from our team",
}: {
  thumbnail?: string;
  title?: string;
  subtitle?: string;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div>
        <h2 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
          <Video size={20} className="text-primary" />
          {title}
        </h2>
        <p className="text-sm text-text-muted mb-4">{subtitle}</p>

        <button
          onClick={() => setShowModal(true)}
          className="relative w-full aspect-video rounded-2xl overflow-hidden group cursor-pointer block"
        >
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
              <Play size={28} className="text-primary ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Duration badge */}
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold backdrop-blur-sm">
            2:30
          </span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-surface-elevated rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Video size={28} className="text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Video Introductions</h3>
            <p className="text-text-muted mb-6 leading-relaxed">
              Video introductions are coming soon! Soon you&apos;ll be able to meet your stylist before you book, so you know exactly who you&apos;re visiting.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
