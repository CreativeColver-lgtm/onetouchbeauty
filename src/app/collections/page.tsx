"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const collections = [
  {
    slug: "summer-glow",
    title: "Summer Glow Treatments",
    description: "Sun-kissed hair, bronzed skin, and holiday-ready nails — our curated edit for the warmer months",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=500&fit=crop",
    tag: "Seasonal",
  },
  {
    slug: "wedding",
    title: "Wedding Season Packages",
    description: "From bridal glam to bridesmaid prep — everything you need to look flawless on the big day",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=500&fit=crop",
    tag: "Bridal",
  },
];

export default function CollectionsPage() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
            <Sparkles size={14} /> Curated Collections
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Beauty Collections
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto leading-relaxed">
            Hand-picked treatments and featured salons for every occasion. Our editors curate the best beauty experiences across the UK.
          </p>
        </div>
      </section>

      {/* Collections grid */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {collections.map((col, i) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className={`reveal stagger-${i + 1} group relative rounded-2xl overflow-hidden block aspect-[4/3]`}
            >
              <Image
                src={col.image}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm w-fit mb-3">
                  {col.tag}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                  {col.title}
                </h2>
                <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-md">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-1 text-white font-bold text-sm group-hover:gap-2 transition-all">
                  Explore collection <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
