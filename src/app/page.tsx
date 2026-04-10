"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Search, MapPin, Sparkles, Star, ArrowRight, Shield,
  Calendar, Heart, Users, Bell,
  TrendingUp, BarChart3, UserPlus, Eye, Zap, Lock,
  BadgeCheck, ChevronLeft, ChevronRight, Clock, Play,
} from "lucide-react";
import {
  ScrollReveal,
  TextReveal,
  MagneticButton,
  TiltCard,
  AnimatedCounter,
  StaggerChildren,
  staggerItem,
} from "@/components/animations";
import { cloudinaryLoader } from "@/lib/cloudinary";
import useEmblaCarousel from "embla-carousel-react";

/* ─── Premium Pexels imagery (high-res, curated) ─── */
const images = {
  hero: "https://images.pexels.com/photos/3993290/pexels-photo-3993290.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  heroVideo: "https://videos.pexels.com/video-files/8225738/8225738-hd_1920_1080_25fps.mp4",
  hair1: "https://images.pexels.com/photos/3993451/pexels-photo-3993451.jpeg?auto=compress&cs=tinysrgb&w=800",
  hair2: "https://images.pexels.com/photos/7440126/pexels-photo-7440126.jpeg?auto=compress&cs=tinysrgb&w=800",
  nails1: "https://images.pexels.com/photos/34971940/pexels-photo-34971940.jpeg?auto=compress&cs=tinysrgb&w=800",
  nails2: "https://images.pexels.com/photos/34871553/pexels-photo-34871553.jpeg?auto=compress&cs=tinysrgb&w=800",
  facial1: "https://images.pexels.com/photos/3985325/pexels-photo-3985325.jpeg?auto=compress&cs=tinysrgb&w=800",
  facial2: "https://images.pexels.com/photos/6724433/pexels-photo-6724433.jpeg?auto=compress&cs=tinysrgb&w=800",
  makeup1: "https://images.pexels.com/photos/7514849/pexels-photo-7514849.jpeg?auto=compress&cs=tinysrgb&w=800",
  body1: "https://images.pexels.com/photos/6629602/pexels-photo-6629602.jpeg?auto=compress&cs=tinysrgb&w=800",
  body2: "https://images.pexels.com/photos/6187305/pexels-photo-6187305.jpeg?auto=compress&cs=tinysrgb&w=800",
  barber1: "https://images.pexels.com/photos/12464841/pexels-photo-12464841.jpeg?auto=compress&cs=tinysrgb&w=800",
  salon1: "https://images.pexels.com/photos/7195799/pexels-photo-7195799.jpeg?auto=compress&cs=tinysrgb&w=1920",
  salon2: "https://images.pexels.com/photos/7195811/pexels-photo-7195811.jpeg?auto=compress&cs=tinysrgb&w=800",
  salon3: "https://images.pexels.com/photos/7750120/pexels-photo-7750120.jpeg?auto=compress&cs=tinysrgb&w=800",
  ctaBg: "https://images.pexels.com/photos/7195812/pexels-photo-7195812.jpeg?auto=compress&cs=tinysrgb&w=1920",
  appPreview: "https://images.pexels.com/photos/5368632/pexels-photo-5368632.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop",
};

/* ─── Data ─── */
const featuredSalons = [
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, reviews: 234, image: images.salon2, speciality: "Hair Colour Specialists", verified: true, availableToday: true },
  { name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, reviews: 189, image: images.nails1, speciality: "Gel & Acrylic Nails", verified: true, availableToday: true },
  { name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, reviews: 312, image: images.facial1, speciality: "Advanced Facials", verified: true, availableToday: false },
  { name: "Serenity Spa", location: "Bath, Somerset", rating: 4.8, reviews: 278, image: images.body1, speciality: "Luxury Spa Treatments", verified: false, availableToday: true },
  { name: "Curl & Co", location: "Brixton, London", rating: 4.7, reviews: 198, image: images.hair2, speciality: "Afro & Textured Hair", verified: true, availableToday: true },
  { name: "Blush Beauty Bar", location: "Deansgate, Manchester", rating: 4.8, reviews: 267, image: images.makeup1, speciality: "Bridal & Event Makeup", verified: true, availableToday: false },
  { name: "Polish Perfect", location: "Didsbury, Manchester", rating: 4.9, reviews: 178, image: images.nails2, speciality: "Nail Art & Extensions", verified: true, availableToday: true },
  { name: "The Grooming Room", location: "Soho, London", rating: 4.6, reviews: 156, image: images.barber1, speciality: "Premium Barbering", verified: false, availableToday: true },
];

const categories = [
  { name: "Hair", image: images.hair1, count: 2450, href: "/directory?category=hair" },
  { name: "Nails", image: images.nails1, count: 1830, href: "/directory?category=nails" },
  { name: "Makeup", image: images.makeup1, count: 1240, href: "/directory?category=makeup" },
  { name: "Facials", image: images.facial2, count: 1560, href: "/directory?category=face" },
  { name: "Body & Spa", image: images.body2, count: 980, href: "/directory?category=body" },
  { name: "Barbering", image: images.barber1, count: 1120, href: "/directory?category=barbering" },
];

const testimonials = [
  { name: "Sophie Williams", location: "London", avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face", rating: 5, text: "Found my dream stylist through One Touch Beauty. The booking was seamless and my balayage turned out absolutely gorgeous. I've told all my friends.", service: "Hair Colour" },
  { name: "Hannah Peters", location: "Bristol", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face", rating: 5, text: "I used to spend ages on Instagram searching for nail techs. Now I filter by area and book in seconds. Total game changer for my monthly pamper.", service: "Gel Nails" },
  { name: "James Okafor", location: "Manchester", avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face", rating: 5, text: "Best barbering experience I've had. Found a specialist in fades near me through the reviews. The whole process was effortless. 10/10.", service: "Barbering" },
];

const trendingTreatments = [
  { name: "Balayage", image: images.hair1, priceRange: "£85 – £150", bookings: 3420 },
  { name: "Gel Manicure", image: images.nails1, priceRange: "£25 – £45", bookings: 5120 },
  { name: "Hydrafacial", image: images.facial1, priceRange: "£60 – £120", bookings: 2890 },
  { name: "Hot Stone Massage", image: images.body1, priceRange: "£50 – £90", bookings: 1960 },
  { name: "Lash Extensions", image: images.facial2, priceRange: "£40 – £80", bookings: 4230 },
  { name: "Brazilian Blowout", image: images.hair2, priceRange: "£100 – £200", bookings: 1540 },
];

const cities = [
  "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle",
];

/* ─── Trending Carousel ─── */
function TrendingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true, align: "start", slidesToScroll: 1, containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const interval = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { clearInterval(interval); emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {trendingTreatments.map((t) => (
            <motion.div
              key={t.name}
              className="flex-shrink-0 w-[280px] sm:w-[320px]"
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <Link href={`/directory?q=${t.name}`} className="block group">
                <div className="aspect-[3/4] relative rounded-2xl overflow-hidden mb-4">
                  <Image
                    loader={cloudinaryLoader}
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover img-zoom"
                    sizes="320px"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-medium text-white/70 tracking-wide uppercase">
                      {t.bookings.toLocaleString()} bookings
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-lg tracking-tight">{t.name}</h3>
                <p className="text-text-muted text-sm mt-0.5">{t.priceRange}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-8">
        <div className="flex gap-2">
          {trendingTreatments.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === selectedIndex ? "w-8 bg-primary" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={scrollNext} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={heroRef} className="relative h-[100svh] min-h-[700px] overflow-hidden bg-secondary">
      {/* Video bg */}
      <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
        <video
          autoPlay muted loop playsInline
          poster={images.hero}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={images.heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      {/* Sophisticated overlay — not just black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80 z-[1]" />

      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-28 px-6"
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-6"
          >
            <span className="section-line inline-block mb-6" />
            <p className="text-white/60 text-sm font-medium tracking-[0.2em] uppercase">
              The UK&apos;s beauty marketplace
            </p>
          </motion.div>

          {/* Main heading — editorial style */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-8 max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Find your <br />
            <span className="italic font-normal text-primary-light">perfect</span> look
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/60 text-lg sm:text-xl max-w-lg mb-10 leading-relaxed"
          >
            Book top-rated salons and beauty professionals near you. Real reviews, instant confirmation.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
          >
            <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-4 border border-white/10">
              <Search size={18} className="text-white/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Treatment or salon name"
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-3 flex-1 bg-white/10 backdrop-blur-xl rounded-xl px-5 py-4 border border-white/10">
              <MapPin size={18} className="text-white/40" />
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City or postcode"
                className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm"
              />
            </div>
            <Link
              href={`/directory?q=${searchQuery}&location=${locationQuery}`}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
            >
              Search
            </Link>
          </motion.div>

          {/* Stats — minimal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex gap-12 mt-14 text-white/40"
          >
            {[
              { value: 5000, label: "Professionals", suffix: "+" },
              { value: 50000, label: "Happy clients", suffix: "+" },
              { value: 200000, label: "Bookings made", suffix: "+" },
            ].map((s) => (
              <div key={s.label} className="hidden sm:block">
                <p className="text-2xl font-semibold text-white/80 tabular-nums tracking-tight">
                  <AnimatedCounter to={s.value} duration={3} suffix={s.suffix} />
                </p>
                <p className="text-xs tracking-wide uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-6 right-8 z-10 flex items-center gap-3"
      >
        <span className="text-white/30 text-xs tracking-[0.15em] uppercase">Scroll</span>
        <motion.div
          animate={{ height: ["16px", "32px", "16px"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px bg-white/30"
        />
      </motion.div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [favourites, setFavourites] = useState<Set<number>>(new Set());
  const toggleFavourite = useCallback((index: number) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }, []);

  return (
    <div>
      <Hero />

      {/* ═══ CATEGORIES — Editorial grid ═══ */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16">
            <div>
              <ScrollReveal>
                <span className="section-line mb-4" />
              </ScrollReveal>
              <TextReveal
                text="Browse by category"
                tag="h2"
                className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mt-4"
              />
            </div>
            <ScrollReveal delay={0.2} direction="right">
              <Link href="/directory" className="text-primary text-sm font-semibold tracking-wide flex items-center gap-2 mt-4 sm:mt-0 hover:gap-3 transition-all">
                View all services <ArrowRight size={14} />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={0.08}>
            {categories.map((cat, i) => (
              <motion.div key={cat.name} variants={staggerItem}>
                <Link href={cat.href} className={`group relative block overflow-hidden rounded-2xl ${i === 0 ? "row-span-2 aspect-[3/4] lg:aspect-auto lg:h-full" : "aspect-[4/3]"}`}>
                  <div className="absolute inset-0">
                    <Image
                      loader={cloudinaryLoader}
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="text-white font-semibold text-lg sm:text-xl tracking-tight">{cat.name}</h3>
                    <p className="text-white/50 text-xs mt-1 tracking-wide">{cat.count.toLocaleString()} professionals</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ FEATURED — Clean card layout ═══ */}
      <section className="py-24 sm:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-16">
            <div>
              <ScrollReveal>
                <span className="section-line mb-4" />
              </ScrollReveal>
              <TextReveal
                text="Top rated near you"
                tag="h2"
                className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mt-4"
              />
              <ScrollReveal delay={0.15}>
                <p className="text-text-muted mt-3 max-w-md">Trusted by thousands of clients across the UK</p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.2} direction="right">
              <Link href="/directory" className="text-primary text-sm font-semibold tracking-wide flex items-center gap-2 mt-4 sm:mt-0 hover:gap-3 transition-all">
                View all <ArrowRight size={14} />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.06}>
            {featuredSalons.map((salon, i) => (
              <motion.div key={salon.name} variants={staggerItem}>
                <Link href={`/salon/${i + 1}`} className="group block">
                  <div className="aspect-[4/5] relative rounded-2xl overflow-hidden mb-4">
                    <Image
                      loader={cloudinaryLoader}
                      src={salon.image}
                      alt={salon.name}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {salon.verified && (
                      <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        <BadgeCheck size={11} /> Verified
                      </span>
                    )}

                    <motion.button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavourite(i); }}
                      whileTap={{ scale: 1.3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 10 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center hover:bg-black/40 transition-all"
                    >
                      <Heart size={13} className={favourites.has(i) ? "text-primary fill-primary" : "text-white"} />
                    </motion.button>

                    {salon.availableToday && (
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] font-semibold text-white bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                          Available today
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-primary fill-primary" />
                        <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
                      </div>
                      <span className="text-xs text-text-muted">({salon.reviews} reviews)</span>
                    </div>
                    <h3 className="font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">{salon.name}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-0.5">
                      <MapPin size={12} /> {salon.location}
                    </p>
                    <p className="text-xs text-primary font-medium mt-2">{salon.speciality}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ TRENDING TREATMENTS ═══ */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <ScrollReveal>
              <span className="section-line mb-4" />
            </ScrollReveal>
            <TextReveal
              text="Trending right now"
              tag="h2"
              className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mt-4"
            />
            <ScrollReveal delay={0.15}>
              <p className="text-text-muted mt-3 max-w-md">The most popular treatments booked this month</p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <TrendingCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — Horizontal layout ═══ */}
      <section className="py-24 sm:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <ScrollReveal>
              <span className="section-line-center mb-4" />
            </ScrollReveal>
            <TextReveal
              text="How it works"
              tag="h2"
              className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mt-4"
            />
          </div>

          <StaggerChildren className="grid sm:grid-cols-3 gap-16 max-w-4xl mx-auto" staggerDelay={0.15}>
            {[
              { num: "01", title: "Search", desc: "Find salons and beauty professionals near you by treatment, location, or name.", icon: Search },
              { num: "02", title: "Book", desc: "Choose a date and time that works for you. Instant confirmation, no waiting.", icon: Calendar },
              { num: "03", title: "Enjoy", desc: "Turn up, relax, and enjoy your treatment. Share your experience with a review.", icon: Sparkles },
            ].map((step) => (
              <motion.div key={step.num} variants={staggerItem} className="text-center">
                <span className="text-5xl font-bold text-border tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
                  {step.num}
                </span>
                <h3 className="text-xl font-semibold text-foreground mt-4 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — Large quote style ═══ */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-16">
            <ScrollReveal>
              <span className="section-line mb-4" />
            </ScrollReveal>
            <TextReveal
              text="What clients say"
              tag="h2"
              className="text-3xl sm:text-5xl font-bold text-foreground tracking-tight mt-4"
            />
          </div>

          <StaggerChildren className="grid lg:grid-cols-3 gap-8" staggerDelay={0.1}>
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={staggerItem}>
                <div className="border border-border rounded-2xl p-8 sm:p-10 h-full flex flex-col justify-between hover:border-primary/30 transition-colors duration-500">
                  <div>
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className={s <= t.rating ? "text-primary fill-primary" : "text-border"} />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed text-lg" style={{ fontFamily: "var(--font-display)" }}>
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                    <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0">
                      <Image
                        loader={cloudinaryLoader}
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.location} · {t.service}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ TRUST — Minimal row ═══ */}
      <section className="py-16 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.08}>
            {[
              { icon: BadgeCheck, title: "ID Verified", desc: "Every professional vetted" },
              { icon: Lock, title: "Secure Payments", desc: "256-bit encryption" },
              { icon: Shield, title: "Guaranteed", desc: "Satisfaction or refund" },
              { icon: Clock, title: "24/7 Support", desc: "Always here to help" },
            ].map((b) => (
              <motion.div key={b.title} variants={staggerItem} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <b.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{b.title}</p>
                  <p className="text-xs text-text-muted">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ FOR BUSINESS — Split layout ═══ */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Image */}
            <ScrollReveal direction="left">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden">
                <Image
                  loader={cloudinaryLoader}
                  src={images.salon1}
                  alt="Salon interior"
                  fill
                  className="object-cover"
                  sizes="50vw"
                  unoptimized
                />
              </div>
            </ScrollReveal>

            {/* Right — Content */}
            <div>
              <ScrollReveal>
                <span className="text-primary text-sm font-semibold tracking-[0.15em] uppercase flex items-center gap-2">
                  <BarChart3 size={14} /> For professionals
                </span>
              </ScrollReveal>
              <TextReveal
                text="Grow your beauty business"
                tag="h2"
                className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mt-4 mb-8"
              />

              <StaggerChildren className="space-y-8" staggerDelay={0.1}>
                {[
                  { icon: UserPlus, title: "Create your profile", desc: "Sign up in minutes. Add services, prices, photos, and opening hours." },
                  { icon: Eye, title: "Get discovered", desc: "Appear in searches across your area. Smart matching finds you the right clients." },
                  { icon: Calendar, title: "Manage bookings", desc: "Accept bookings 24/7. No missed calls or DM back-and-forth." },
                  { icon: TrendingUp, title: "Grow", desc: "Track performance, collect reviews, and watch your client base build." },
                ].map((step) => (
                  <motion.div key={step.title} variants={staggerItem} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <step.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground tracking-tight">{step.title}</h3>
                      <p className="text-sm text-text-muted mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </StaggerChildren>

              <ScrollReveal delay={0.4}>
                <div className="mt-10">
                  <MagneticButton className="px-8 py-4 bg-secondary text-white font-semibold rounded-xl hover:bg-foreground transition-all text-sm tracking-wide cursor-pointer inline-flex items-center gap-2">
                    <Zap size={16} /> Get started for free
                  </MagneticButton>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CITIES ═══ */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <p className="text-text-muted text-sm font-medium tracking-wide mb-6">Popular cities</p>
          </ScrollReveal>
          <StaggerChildren className="flex flex-wrap gap-2" staggerDelay={0.03}>
            {cities.map((city) => (
              <motion.div key={city} variants={staggerItem}>
                <Link
                  href={`/directory?location=${city}`}
                  className="px-4 py-2 rounded-full border border-border text-sm text-text-muted hover:border-primary hover:text-primary transition-colors"
                >
                  {city}
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-32 overflow-hidden">
        <Image
          loader={cloudinaryLoader}
          src={images.ctaBg}
          alt="Luxury salon"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="section-line-center mb-6" style={{ background: "rgba(255,255,255,0.3)" }} />
          </ScrollReveal>
          <TextReveal
            text="Your next appointment is one tap away"
            tag="h2"
            className="text-3xl sm:text-5xl font-bold text-white tracking-tight mt-4 mb-6"
          />
          <ScrollReveal delay={0.3}>
            <p className="text-white/50 mb-10 max-w-md mx-auto leading-relaxed">
              Join thousands of clients who&apos;ve found their go-to beauty professionals on One Touch Beauty.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/directory"
                className="px-8 py-4 bg-white text-secondary font-semibold rounded-xl hover:bg-white/90 transition-all text-sm tracking-wide inline-flex items-center justify-center gap-2"
              >
                Find a salon
              </Link>
              <Link
                href="/register/business"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all text-sm tracking-wide inline-flex items-center justify-center gap-2"
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
