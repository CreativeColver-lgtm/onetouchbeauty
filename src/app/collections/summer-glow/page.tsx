"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, MapPin, Clock, Sun, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const treatments = [
  { name: "Sun-Kissed Balayage", description: "Golden, hand-painted highlights that mimic natural sunlight", price: "from £95", duration: "2.5 hrs", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=600&fit=crop" },
  { name: "Vitamin C Facial", description: "Brightening facial that gives you that just-back-from-holiday glow", price: "from £65", duration: "60 mins", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=600&fit=crop" },
  { name: "Gel Pedicure", description: "Holiday-ready toes with long-lasting, chip-free colour", price: "from £30", duration: "45 mins", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=600&fit=crop" },
  { name: "Body Bronzing", description: "Natural-looking spray tan for a streak-free summer glow", price: "from £25", duration: "30 mins", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=600&fit=crop" },
  { name: "Lash Lift & Tint", description: "Wake up with perfect lashes — no mascara needed on holiday", price: "from £40", duration: "45 mins", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=600&fit=crop" },
  { name: "Brazilian Wax", description: "Smooth and holiday-ready with minimal discomfort", price: "from £30", duration: "30 mins", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&h=600&fit=crop" },
];

const featuredSalons = [
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop", speciality: "Balayage experts" },
  { name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop", speciality: "Advanced facials" },
  { name: "Serenity Spa", location: "Bath, Somerset", rating: 4.8, image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop", speciality: "Luxury body treatments" },
];

export default function SummerGlowPage() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1920&h=800&fit=crop"
          alt="Summer glow"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/5" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-20 z-10">
          <Link href="/collections" className="inline-flex items-center gap-1 text-white/70 text-sm hover:text-white transition mb-6">
            <ArrowLeft size={16} /> All Collections
          </Link>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-200 text-sm font-bold w-fit mb-4 backdrop-blur-sm border border-amber-400/20">
            <Sun size={14} /> Seasonal Edit
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Summer Glow<br />
            <span className="text-amber-300">Treatments</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            Our editors&apos; hand-picked selection of the best treatments to get you glowing this summer. From sun-kissed hair to bronzed skin.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center reveal">
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto italic">
            &ldquo;Summer is all about effortless beauty — that golden, just-got-back-from-the-beach glow. These are the treatments that will get you there.&rdquo;
          </p>
          <p className="mt-4 text-sm text-primary font-bold">— One Touch Beauty Editors</p>
        </div>
      </section>

      {/* Treatments */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-3xl font-bold text-foreground mb-10 reveal">The Edit</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((t, i) => (
            <Link
              key={t.name}
              href={`/directory?q=${encodeURIComponent(t.name)}`}
              className={`reveal stagger-${i + 1} group rounded-2xl overflow-hidden bg-surface-elevated border border-border card-hover block`}
            >
              <div className="relative h-64 overflow-hidden">
                <Image src={t.image} alt={t.name} fill className="object-cover card-img-zoom" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-sm">
                  {t.price}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors mb-1">{t.name}</h3>
                <p className="text-sm text-text-muted leading-relaxed mb-3">{t.description}</p>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Clock size={12} /> {t.duration}</span>
                  <span className="text-primary font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Find salons <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Salons */}
      <section className="bg-surface py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 reveal">
            <h2 className="text-3xl font-bold text-foreground mb-3">Featured Salons</h2>
            <p className="text-text-muted text-lg">Top-rated salons perfect for your summer glow</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {featuredSalons.map((s, i) => (
              <Link
                key={s.name}
                href={`/salon/${i + 1}`}
                className={`reveal stagger-${i + 1} group rounded-2xl overflow-hidden bg-surface-elevated border border-border card-hover block`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={s.image} alt={s.name} fill className="object-cover card-img-zoom" unoptimized />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                  <p className="text-sm text-text-muted flex items-center gap-1 mt-1"><MapPin size={13} /> {s.location}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="font-bold text-foreground text-sm">{s.rating}</span>
                    </div>
                    <span className="text-xs text-primary font-semibold">{s.speciality}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center reveal">
          <Sparkles size={32} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-3">Ready for your summer glow?</h2>
          <p className="text-text-muted mb-8 text-lg">Browse all summer-ready treatments and book with confidence</p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:shadow-xl text-lg"
          >
            Browse all salons <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
