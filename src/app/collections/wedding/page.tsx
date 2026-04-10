"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star, MapPin, Clock, Heart, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const treatments = [
  { name: "Bridal Hair & Styling", description: "Timeless updos, flowing curls, or sleek styles — perfected in your trial and recreated on the day", price: "from £150", duration: "2 hrs", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=600&fit=crop" },
  { name: "Bridal Makeup", description: "Long-lasting, photo-ready makeup that looks stunning from ceremony to last dance", price: "from £120", duration: "90 mins", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=600&fit=crop" },
  { name: "Pre-Wedding Facial Course", description: "A series of facials designed to give you radiant, camera-ready skin by the big day", price: "from £250", duration: "3 sessions", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=600&fit=crop" },
  { name: "Bridesmaid Package", description: "Hair and makeup for your bridal party — group bookings with dedicated stylists", price: "from £85 pp", duration: "60 mins", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=600&fit=crop" },
  { name: "Gel Bridal Manicure", description: "Chip-free, elegant nails that last through the honeymoon", price: "from £35", duration: "45 mins", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=600&fit=crop" },
  { name: "Pre-Wedding Lash Extensions", description: "Natural-looking volume so you can skip the falsies on your big day", price: "from £65", duration: "90 mins", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500&h=600&fit=crop" },
];

const featuredSalons = [
  { name: "Blush Beauty Bar", location: "Deansgate, Manchester", rating: 4.8, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop", speciality: "Bridal makeup experts" },
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop", speciality: "Bridal hair styling" },
  { name: "Face Forward", location: "Bold Street, Liverpool", rating: 4.8, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop", speciality: "Pre-wedding skin prep" },
];

const timeline = [
  { months: "6 months before", tasks: ["Book your bridal hair & makeup artist", "Start a facial course for glowing skin"] },
  { months: "3 months before", tasks: ["Hair colour appointment (balayage, highlights)", "Lash extension trial"] },
  { months: "1 month before", tasks: ["Bridal hair & makeup trial", "Book bridesmaid packages"] },
  { months: "1 week before", tasks: ["Final facial", "Gel manicure & pedicure", "Lash fill appointment"] },
];

export default function WeddingPage() {
  const scrollRef = useScrollReveal();

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=800&fit=crop"
          alt="Wedding beauty"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 lg:p-20 z-10">
          <Link href="/collections" className="inline-flex items-center gap-1 text-white/70 text-sm hover:text-white transition mb-6">
            <ArrowLeft size={16} /> All Collections
          </Link>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-400/20 text-rose-200 text-sm font-bold w-fit mb-4 backdrop-blur-sm border border-rose-400/20">
            <Heart size={14} /> Bridal Edit
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Wedding Season<br />
            <span className="text-rose-300">Packages</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl leading-relaxed">
            Everything you need to look and feel your absolute best on the most important day of your life. Curated by our editors.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center reveal">
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed max-w-2xl mx-auto italic">
            &ldquo;Your wedding day is one of the most photographed days of your life. Start planning your beauty routine early, and you&apos;ll walk down the aisle with total confidence.&rdquo;
          </p>
          <p className="mt-4 text-sm text-primary font-bold">— One Touch Beauty Editors</p>
        </div>
      </section>

      {/* Wedding Beauty Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-3xl font-bold text-foreground mb-10 text-center reveal">Your Bridal Beauty Timeline</h2>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-px" />

          <div className="space-y-10">
            {timeline.map((step, i) => (
              <div key={step.months} className={`reveal stagger-${i + 1} relative flex flex-col sm:flex-row gap-4 sm:gap-8 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                {/* Dot */}
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 mt-1.5 ring-4 ring-background z-10" />

                <div className={`flex-1 pl-10 sm:pl-0 ${i % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"}`}>
                  <span className="text-sm font-bold text-primary">{step.months}</span>
                  <ul className={`mt-2 space-y-1 ${i % 2 === 0 ? "sm:ml-auto" : ""}`}>
                    {step.tasks.map((task) => (
                      <li key={task} className="text-sm text-text-muted">{task}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-3xl font-bold text-foreground mb-10 reveal">Bridal Treatments</h2>
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
            <h2 className="text-3xl font-bold text-foreground mb-3">Featured Bridal Salons</h2>
            <p className="text-text-muted text-lg">Top-rated salons with dedicated bridal services</p>
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
          <Heart size={32} className="text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-foreground mb-3">Your dream wedding look starts here</h2>
          <p className="text-text-muted mb-8 text-lg">Browse bridal-ready salons and book your trial today</p>
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
