"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search, MapPin, Star, ArrowRight, Shield,
  Calendar, Heart,
  TrendingUp, BarChart3, UserPlus, Eye, Zap, Lock,
  BadgeCheck, ChevronLeft, ChevronRight, Clock,
} from "lucide-react";
import {
  ScrollReveal,
  TextReveal,
  MagneticButton,
  AnimatedCounter,
  StaggerChildren,
  staggerItem,
} from "@/components/animations";
import { cloudinaryLoader } from "@/lib/cloudinary";
import useEmblaCarousel from "embla-carousel-react";

/* ─── Curated Pexels imagery ─── */
const img = {
  heroVideo: "https://videos.pexels.com/video-files/8830118/8830118-hd_1920_1080_25fps.mp4",
  heroPoster: "https://images.pexels.com/photos/5340982/pexels-photo-5340982.jpeg?auto=compress&cs=tinysrgb&w=1920",
  hair1: "https://images.pexels.com/photos/5340982/pexels-photo-5340982.jpeg?auto=compress&cs=tinysrgb&w=800",
  hair2: "https://images.pexels.com/photos/2820607/pexels-photo-2820607.jpeg?auto=compress&cs=tinysrgb&w=800",
  hair3: "https://images.pexels.com/photos/16442705/pexels-photo-16442705.jpeg?auto=compress&cs=tinysrgb&w=800",
  nails1: "https://images.pexels.com/photos/3997388/pexels-photo-3997388.jpeg?auto=compress&cs=tinysrgb&w=800",
  nails2: "https://images.pexels.com/photos/34871553/pexels-photo-34871553.jpeg?auto=compress&cs=tinysrgb&w=800",
  facial1: "https://images.pexels.com/photos/9774655/pexels-photo-9774655.jpeg?auto=compress&cs=tinysrgb&w=800",
  facial2: "https://images.pexels.com/photos/8131571/pexels-photo-8131571.jpeg?auto=compress&cs=tinysrgb&w=800",
  makeup1: "https://images.pexels.com/photos/5119214/pexels-photo-5119214.jpeg?auto=compress&cs=tinysrgb&w=800",
  makeup2: "https://images.pexels.com/photos/6833817/pexels-photo-6833817.jpeg?auto=compress&cs=tinysrgb&w=800",
  spa1: "https://images.pexels.com/photos/3764568/pexels-photo-3764568.jpeg?auto=compress&cs=tinysrgb&w=800",
  spa2: "https://images.pexels.com/photos/6628645/pexels-photo-6628645.jpeg?auto=compress&cs=tinysrgb&w=800",
  barber1: "https://images.pexels.com/photos/9992818/pexels-photo-9992818.jpeg?auto=compress&cs=tinysrgb&w=800",
  barber2: "https://images.pexels.com/photos/3998415/pexels-photo-3998415.jpeg?auto=compress&cs=tinysrgb&w=800",
  lashes: "https://images.pexels.com/photos/7755650/pexels-photo-7755650.jpeg?auto=compress&cs=tinysrgb&w=800",
  salon1: "https://images.pexels.com/photos/7195799/pexels-photo-7195799.jpeg?auto=compress&cs=tinysrgb&w=1200",
  salon2: "https://images.pexels.com/photos/7195811/pexels-photo-7195811.jpeg?auto=compress&cs=tinysrgb&w=800",
};

const avatars = {
  a1: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
  a2: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
  a3: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
};

/* ─── Data ─── */
const categories = [
  { name: "Hair", image: img.hair1, href: "/directory?category=hair" },
  { name: "Nails", image: img.nails1, href: "/directory?category=nails" },
  { name: "Facials", image: img.facial1, href: "/directory?category=face" },
  { name: "Makeup", image: img.makeup1, href: "/directory?category=makeup" },
  { name: "Spa & Body", image: img.spa1, href: "/directory?category=body" },
  { name: "Barbering", image: img.barber1, href: "/directory?category=barbering" },
];

const featuredSalons = [
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, image: img.salon2 },
  { name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, image: img.nails2 },
  { name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, image: img.facial2 },
  { name: "Serenity Spa", location: "Bath, Somerset", rating: 4.8, image: img.spa2 },
  { name: "Curl & Co", location: "Brixton, London", rating: 4.7, image: img.hair2 },
  { name: "Blush Beauty Bar", location: "Deansgate, Manchester", rating: 4.8, image: img.makeup2 },
  { name: "The Grooming Room", location: "Soho, London", rating: 4.6, image: img.barber2 },
  { name: "Lash Luxe", location: "Didsbury, Manchester", rating: 4.9, image: img.lashes },
];

const trendingTreatments = [
  { name: "Balayage", image: img.hair1, price: "£85 – £150", bookings: 3420 },
  { name: "Gel Manicure", image: img.nails1, price: "£25 – £45", bookings: 5120 },
  { name: "Hydrafacial", image: img.facial1, price: "£60 – £120", bookings: 2890 },
  { name: "Hot Stone Massage", image: img.spa2, price: "£50 – £90", bookings: 1960 },
  { name: "Lash Extensions", image: img.lashes, price: "£40 – £80", bookings: 4230 },
  { name: "Skin Fade", image: img.barber2, price: "£20 – £35", bookings: 2740 },
];

const testimonials = [
  { name: "Sophie Williams", location: "London", avatar: avatars.a1, rating: 5, text: "Found my dream stylist through One Touch Beauty. The booking was seamless and my balayage turned out absolutely gorgeous. I\u2019ve told all my friends." },
  { name: "Hannah Peters", location: "Bristol", avatar: avatars.a2, rating: 5, text: "I used to spend ages on Instagram searching for nail techs. Now I filter by area and book in seconds. Total game changer for my monthly pamper." },
  { name: "James Okafor", location: "Manchester", avatar: avatars.a3, rating: 5, text: "Best barbering experience I\u2019ve had. Found a specialist in fades near me through the reviews. The whole process was effortless. 10/10." },
];

const cities = [
  "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle",
];

/* ═══════════════════════════════════════════════════════════
   1. HERO — Full viewport video, massive typography
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={heroRef} className="relative h-[100svh] min-h-[700px] overflow-hidden bg-black">
      <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
        <video
          autoPlay muted loop playsInline
          poster={img.heroPoster}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={img.heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80 z-[1]" />

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        {/* Massive brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-white font-extrabold uppercase leading-[0.85] tracking-[0.15em]"
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2.5rem, 10vw, 10rem)" }}
        >
          One Touch<br />Beauty
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-white/50 text-sm tracking-[0.3em] uppercase mt-6"
        >
          The UK&apos;s beauty marketplace
        </motion.p>

        {/* Search bar — glass morphism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-16 w-full max-w-xl"
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-xl px-5 py-3.5 border border-white/10">
              <Search size={16} className="text-white/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Treatment or salon"
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-xl px-5 py-3.5 border border-white/10">
              <MapPin size={16} className="text-white/40" />
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City or postcode"
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
              />
            </div>
            <Link
              href={`/directory?q=${searchQuery}&location=${locationQuery}`}
              className="px-8 py-3.5 bg-secondary text-white font-semibold hover:bg-foreground transition-all flex items-center justify-center text-sm tracking-wide"
            >
              Search
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ height: ["12px", "28px", "12px"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px bg-white/30"
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. MARQUEE — Horizontal scrolling text
   ═══════════════════════════════════════════════════════════ */
function Marquee() {
  const items = "HAIR · NAILS · FACIALS · MAKEUP · SPA · BARBERING · ";
  return (
    <div className="bg-surface-blush border-y border-border py-6 overflow-hidden">
      <div className="marquee-track">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="text-primary/20 font-extrabold uppercase tracking-[0.2em] whitespace-nowrap px-4"
            style={{ fontFamily: "var(--font-body)", fontSize: "clamp(2rem, 5vw, 5rem)" }}
          >
            {items}{items}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. FEATURED — Horizontal scroll carousel (RCA artist style)
   ═══════════════════════════════════════════════════════════ */
function FeaturedCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false, align: "start", slidesToScroll: 1, containScroll: "trimSnaps",
    dragFree: true,
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-1">
          {featuredSalons.map((salon, i) => (
            <div key={salon.name} className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[360px]">
              <Link href={`/salon/${i + 1}`} className="block group">
                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    loader={cloudinaryLoader}
                    src={salon.image}
                    alt={salon.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="360px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star size={12} className="text-primary fill-primary" />
                      <span className="text-white text-sm font-semibold">{salon.rating}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg tracking-tight">{salon.name}</h3>
                    <p className="text-white/50 text-xs mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {salon.location}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* Arrow buttons */}
      <div className="flex gap-2 mt-6">
        <button onClick={scrollPrev} className="w-12 h-12 border border-border flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-foreground">
          <ChevronLeft size={18} />
        </button>
        <button onClick={scrollNext} className="w-12 h-12 border border-border flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition-all text-foreground">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. TESTIMONIALS — Single-quote slider
   ═══════════════════════════════════════════════════════════ */
function TestimonialSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center gap-1 mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={16} className={s <= t.rating ? "text-primary fill-primary" : "text-white/20"} />
          ))}
        </div>
        <p
          className="text-white text-2xl sm:text-4xl lg:text-5xl leading-snug italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden relative">
            <Image loader={cloudinaryLoader} src={t.avatar} alt={t.name} fill className="object-cover" unoptimized />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{t.name}</p>
            <p className="text-white/40 text-xs">{t.location}</p>
          </div>
        </div>
      </motion.div>
      {/* Dots */}
      <div className="flex justify-center gap-3 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-primary" : "w-3 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div>
      {/* 1. HERO */}
      <Hero />

      {/* 2. MARQUEE */}
      <Marquee />

      {/* 3. CATEGORIES — Full-bleed image grid, sharp edges */}
      <section className="bg-background">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-[2px]">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="category-grid-item group block aspect-[4/5] relative">
              <Image
                loader={cloudinaryLoader}
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10">
                <h3
                  className="text-white font-bold text-xl sm:text-3xl lg:text-4xl uppercase tracking-tight"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FEATURED — Horizontal scroll (RCA artist carousel) */}
      <section className="py-32 sm:py-40 bg-surface-blush">
        <div className="px-6 lg:px-12">
          <ScrollReveal>
            <h2
              className="text-massive text-foreground mb-16"
              style={{ fontFamily: "var(--font-body)" }}
            >
              TOP RATED
            </h2>
          </ScrollReveal>
          <FeaturedCarousel />
        </div>
      </section>

      {/* 5. TRENDING — Alternating large layout */}
      <section className="py-32 sm:py-40 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <h2
              className="text-massive text-foreground mb-20"
              style={{ fontFamily: "var(--font-body)" }}
            >
              TRENDING
            </h2>
          </ScrollReveal>

          <div className="space-y-0">
            {trendingTreatments.slice(0, 4).map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 0.1}>
                <Link href={`/directory?q=${t.name}`} className="group block">
                  <div className={`grid lg:grid-cols-2 gap-0 items-stretch ${i % 2 === 1 ? "direction-rtl" : ""}`}>
                    {/* Image */}
                    <div className={`aspect-[4/3] relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                      <Image
                        loader={cloudinaryLoader}
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="50vw"
                        unoptimized
                      />
                    </div>
                    {/* Text */}
                    <div className={`flex flex-col justify-center p-8 sm:p-12 lg:p-16 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                      <h3
                        className="text-editorial text-foreground group-hover:text-primary transition-colors duration-300"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {t.name}
                      </h3>
                      <div className="flex items-center gap-6 mt-4 text-text-muted text-sm">
                        <span>{t.price}</span>
                        <span>{t.bookings.toLocaleString()} bookings</span>
                      </div>
                      <div className="mt-6 flex items-center gap-2 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View salons <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
                {i < 3 && <div className="border-b border-border" />}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. APP DOWNLOAD */}
      <section className="py-32 sm:py-40 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollReveal>
                <span className="inline-block px-4 py-1.5 border border-border text-[10px] tracking-[0.3em] uppercase text-text-muted mb-8">
                  Coming Soon
                </span>
              </ScrollReveal>
              <TextReveal
                text="Beauty booking, right in your pocket"
                tag="h2"
                className="text-editorial text-foreground"
              />
              <ScrollReveal delay={0.2}>
                <p className="text-text-muted mt-6 max-w-md leading-relaxed">
                  Book appointments, discover new salons, manage your schedule — all from the One Touch Beauty app.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <div className="flex gap-4 mt-10">
                  {/* App Store button */}
                  <div className="px-6 py-3 border border-border flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    <div>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">Download on the</p>
                      <p className="text-sm font-semibold -mt-0.5">App Store</p>
                    </div>
                  </div>
                  {/* Google Play button */}
                  <div className="px-6 py-3 border border-border flex items-center gap-3 hover:bg-surface transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.24-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m.91-.91L19.59 12l-1.87-2.21-2.27 2.27 2.27 2.15M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z"/></svg>
                    <div>
                      <p className="text-[9px] text-text-muted uppercase tracking-wider">Get it on</p>
                      <p className="text-sm font-semibold -mt-0.5">Google Play</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
            {/* Phone mockup */}
            <ScrollReveal direction="right">
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-[260px] h-[520px] bg-foreground rounded-[36px] border-4 border-border overflow-hidden shadow-2xl shadow-black/50">
                  <Image
                    loader={cloudinaryLoader}
                    src={img.hair3}
                    alt="App preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-bold text-sm">One Touch Beauty</p>
                    <p className="text-white/50 text-xs mt-1">Your next appointment awaits</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS — Large single-quote slider */}
      <section className="py-32 sm:py-40 bg-surface-blush">
        <div className="px-6 lg:px-8">
          <TestimonialSlider />
        </div>
      </section>

      {/* 8. BUSINESS CTA — Split screen */}
      <section className="bg-background">
        <div className="grid lg:grid-cols-2 min-h-[80vh]">
          {/* Left — dark text */}
          <div className="flex flex-col justify-center p-10 sm:p-16 lg:p-24 bg-surface-blush text-foreground">
            <ScrollReveal>
              <span className="text-primary text-xs font-semibold tracking-[0.2em] uppercase flex items-center gap-2 mb-6">
                <BarChart3 size={14} /> For Professionals
              </span>
            </ScrollReveal>
            <TextReveal
              text="Grow your business"
              tag="h2"
              className="text-editorial text-foreground"
            />
            <StaggerChildren className="mt-12 space-y-8" staggerDelay={0.1}>
              {[
                { icon: UserPlus, title: "Create your profile", desc: "Sign up in minutes. Add services, prices, and photos." },
                { icon: Eye, title: "Get discovered", desc: "Appear in searches across your area automatically." },
                { icon: Calendar, title: "Manage bookings", desc: "Accept bookings 24/7. No missed calls." },
                { icon: TrendingUp, title: "Grow", desc: "Track performance and watch your client base build." },
              ].map((step) => (
                <motion.div key={step.title} variants={staggerItem} className="flex gap-4">
                  <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                    <step.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm tracking-tight">{step.title}</h3>
                    <p className="text-text-muted text-sm mt-1 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerChildren>
            <ScrollReveal delay={0.4}>
              <Link
                href="/register/business"
                className="inline-flex items-center gap-2 mt-12 px-8 py-4 bg-secondary text-white font-semibold hover:bg-foreground transition-all text-sm tracking-wide"
              >
                <Zap size={16} /> Get started free
              </Link>
            </ScrollReveal>
          </div>
          {/* Right — full-bleed image */}
          <div className="relative min-h-[400px] lg:min-h-0">
            <Image
              loader={cloudinaryLoader}
              src={img.salon1}
              alt="Modern salon interior"
              fill
              className="object-cover"
              sizes="50vw"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* 9. TRUST BAR */}
      <section className="py-12 border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BadgeCheck, title: "ID Verified", desc: "Every professional vetted" },
              { icon: Lock, title: "Secure Payments", desc: "256-bit encryption" },
              { icon: Shield, title: "Guaranteed", desc: "Satisfaction or refund" },
              { icon: Clock, title: "24/7 Support", desc: "Always here to help" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-4">
                <div className="w-10 h-10 border border-border flex items-center justify-center shrink-0">
                  <b.icon size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{b.title}</p>
                  <p className="text-xs text-text-muted">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CITIES — Pills on dark background */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-white/30 text-xs font-semibold tracking-[0.2em] uppercase mb-8">Popular Cities</p>
          </ScrollReveal>
          <StaggerChildren className="flex flex-wrap gap-3" staggerDelay={0.03}>
            {cities.map((city) => (
              <motion.div key={city} variants={staggerItem}>
                <Link
                  href={`/directory?location=${city}`}
                  className="px-5 py-2.5 border border-white/15 text-sm text-white/50 hover:border-white hover:text-white transition-all duration-300"
                >
                  {city}
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* 11. FINAL CTA — Full-bleed image, large text overlay */}
      <section className="relative py-40 sm:py-52 overflow-hidden">
        <Image
          loader={cloudinaryLoader}
          src={img.makeup2}
          alt="Beauty"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <h2
              className="text-massive text-white uppercase"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Book Now
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-text-muted mt-6 max-w-md mx-auto leading-relaxed text-lg">
              Your next appointment is one tap away.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                href="/directory"
                className="px-10 py-4 bg-secondary text-white font-semibold hover:bg-foreground transition-all text-sm tracking-wide inline-flex items-center justify-center gap-2"
              >
                Find a salon
              </Link>
              <Link
                href="/register/business"
                className="px-10 py-4 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all text-sm tracking-wide inline-flex items-center justify-center gap-2"
              >
                List your business
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
