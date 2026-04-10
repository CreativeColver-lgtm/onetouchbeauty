"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Sparkles } from "lucide-react";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const transformations = [
  {
    before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    title: "Balayage Transformation",
    description: "From flat colour to sun-kissed dimension",
  },
  {
    before: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
    title: "Glow-Up Facial",
    description: "Visible radiance after a single professional treatment",
  },
  {
    before: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    title: "Nail Art Redesign",
    description: "Classic nails transformed into statement art",
  },
  {
    before: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
    title: "Complete Hair Makeover",
    description: "Bold new look with precision cut and colour",
  },
  {
    before: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    title: "Bridal Prep",
    description: "From everyday to wedding-ready perfection",
  },
  {
    before: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&h=400&fit=crop",
    title: "Colour Correction",
    description: "Restoring damaged hair to salon-perfect condition",
  },
];

export default function GalleryPage() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-64 sm:h-80 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=600&fit=crop"
          alt="Gallery hero"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold mb-4 backdrop-blur-sm border border-white/10">
            <Sparkles size={14} className="text-primary" /> Before & After
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            Transformation Gallery
          </h1>
          <p className="text-white/70 text-lg max-w-xl">
            See the magic happen — real results from top-rated beauty professionals across the UK
          </p>
        </div>
      </section>

      {/* Gallery content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition mb-8">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="reveal">
          <BeforeAfterGallery transformations={transformations} />
        </div>

        {/* CTA */}
        <div className="mt-16 text-center reveal">
          <h2 className="text-2xl font-bold text-foreground mb-3">Love what you see?</h2>
          <p className="text-text-muted mb-6">Find your perfect professional and book your transformation today</p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:shadow-xl"
          >
            Find a salon near you
          </Link>
        </div>
      </section>
    </div>
  );
}
