"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Sparkles, Star, ArrowRight, Shield,
  Calendar, Clock, Heart, Users, Quote, Smartphone, Bell,
  TrendingUp, BarChart3, UserPlus, Eye, Zap, Lock,
  CheckCircle2, BadgeCheck, ChevronLeft, ChevronRight,
} from "lucide-react";
import {
  ScrollReveal,
  TextReveal,
  MagneticButton,
  TiltCard,
  AnimatedCounter,
  StaggerChildren,
  staggerItem,
  ParallaxSection,
} from "@/components/animations";
import { cloudinaryLoader } from "@/lib/cloudinary";
import useEmblaCarousel from "embla-carousel-react";

/* ─── Data ─── */
const featuredSalons = [
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, reviews: 234, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop", speciality: "Hair Colour Specialists", verified: true, availableToday: true },
  { name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, reviews: 189, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop", speciality: "Gel & Acrylic Nails", verified: true, availableToday: true },
  { name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, reviews: 312, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop", speciality: "Advanced Facials", verified: true, availableToday: false },
  { name: "Serenity Spa", location: "Bath, Somerset", rating: 4.8, reviews: 278, image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop", speciality: "Luxury Spa Treatments", verified: false, availableToday: true },
  { name: "Curl & Co", location: "Brixton, London", rating: 4.7, reviews: 198, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop", speciality: "Afro & Textured Hair", verified: true, availableToday: true },
  { name: "Blush Beauty Bar", location: "Deansgate, Manchester", rating: 4.8, reviews: 267, image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop", speciality: "Bridal & Event Makeup", verified: true, availableToday: false },
  { name: "Polish Perfect", location: "Didsbury, Manchester", rating: 4.9, reviews: 178, image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=400&fit=crop", speciality: "Nail Art & Extensions", verified: true, availableToday: true },
  { name: "The Grooming Room", location: "Soho, London", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop", speciality: "Premium Barbering", verified: false, availableToday: true },
];

const categories = [
  { name: "Hair", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop", count: 2450, href: "/directory?category=hair" },
  { name: "Nails", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop", count: 1830, href: "/directory?category=nails" },
  { name: "Makeup", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=300&fit=crop", count: 1240, href: "/directory?category=makeup" },
  { name: "Face", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop", count: 1560, href: "/directory?category=face" },
  { name: "Body", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop", count: 980, href: "/directory?category=body" },
  { name: "Hair Removal", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop", count: 1120, href: "/directory?category=hair-removal" },
];

const testimonials = [
  { name: "Sophie Williams", location: "London", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face", rating: 5, text: "Found my dream stylist through One Touch Beauty! The booking was seamless and my balayage turned out absolutely gorgeous.", service: "Hair Colour" },
  { name: "Hannah Peters", location: "Bristol", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face", rating: 5, text: "I used to spend ages searching Instagram for nail techs. Now I just open One Touch Beauty, filter by my area, and book in seconds.", service: "Gel Nails" },
  { name: "James Okafor", location: "Manchester", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face", rating: 5, text: "Best barbering experience I've had. The reviews helped me find a specialist in fades near me, effortless booking. 10/10.", service: "Barbering" },
  { name: "Amara Chen", location: "Edinburgh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face", rating: 5, text: "Had my bridal makeup trial through the app and it was perfect. The reviews helped me pick the right MUA.", service: "Bridal Makeup" },
];

const trendingTreatments = [
  { name: "Balayage", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=500&fit=crop", priceRange: "£85 – £150", bookings: 3420 },
  { name: "Gel Manicure", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=500&fit=crop", priceRange: "£25 – £45", bookings: 5120 },
  { name: "Hydrafacial", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=500&fit=crop", priceRange: "£60 – £120", bookings: 2890 },
  { name: "Hot Stone Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=500&fit=crop", priceRange: "£50 – £90", bookings: 1960 },
  { name: "Lash Extensions", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=500&fit=crop", priceRange: "£40 – £80", bookings: 4230 },
  { name: "Brazilian Blowout", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=500&fit=crop", priceRange: "£100 – £200", bookings: 1540 },
];

const trustBadges = [
  { icon: BadgeCheck, title: "ID Verified Pros", desc: "Every professional is identity-checked and vetted before joining" },
  { icon: Lock, title: "Secure Payments", desc: "Bank-level 256-bit encryption protects your payment details" },
  { icon: Shield, title: "Satisfaction Guaranteed", desc: "Not happy? We'll make it right or refund you" },
  { icon: Clock, title: "24/7 Support", desc: "Our dedicated team is available around the clock" },
];

const businessSteps = [
  { icon: UserPlus, title: "Create your profile", desc: "Sign up in minutes. Add your services, prices, photos, and opening hours." },
  { icon: Eye, title: "Get discovered", desc: "Appear in searches across your area. Smart matching connects you with the right clients." },
  { icon: Calendar, title: "Manage bookings", desc: "Accept bookings 24/7. No more missed calls or DM back-and-forth." },
  { icon: TrendingUp, title: "Grow your business", desc: "Track performance, collect reviews, and watch your client base grow." },
];

const cities = [
  "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle",
];

/* ─── Embla Carousel for Trending ─── */
function TrendingCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Autoplay
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5">
          {trendingTreatments.map((t, i) => (
            <motion.div
              key={t.name}
              className="flex-shrink-0 w-64 sm:w-72"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link
                href={`/directory?q=${t.name}`}
                className="rounded-2xl overflow-hidden glass-card-light block group"
              >
                <div className="h-72 relative overflow-hidden">
                  <Image
                    loader={cloudinaryLoader}
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-bold text-white text-lg mb-1">{t.name}</h3>
                    <p className="text-white/80 text-sm font-medium">{t.priceRange}</p>
                    <p className="text-white/50 text-xs mt-1">{t.bookings.toLocaleString()} bookings</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={scrollPrev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10"
      >
        <ChevronLeft size={18} className="text-gray-700" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all hover:scale-110 z-10"
      >
        <ChevronRight size={18} className="text-gray-700" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {trendingTreatments.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === selectedIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Video Hero ─── */
function VideoHero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={heroRef} className="relative h-[100svh] min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Video Background with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: heroY }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&h=1080&fit=crop"
          className="absolute inset-0 h-[120%] w-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3993033/3993033-uhd_2560_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/5 z-[2]" />

      {/* Content */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-8 border border-white/15"
          >
            <Sparkles size={14} className="text-primary" /> The UK&apos;s Premier Beauty Marketplace
          </motion.span>

          {/* Animated Heading */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <TextReveal
              text="Discover Your"
              tag="span"
              className="block"
              delay={0.6}
            />
            <motion.span
              className="gradient-text-animated block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              Perfect Look
            </motion.span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Book top-rated salons, stylists, and beauty professionals near you. Instant confirmation, real reviews, zero hassle.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.7, type: "spring", damping: 20 }}
            className="bg-white/95 dark:bg-surface-elevated/95 backdrop-blur-xl rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto border border-white/20"
          >
            <div className="flex items-center gap-2 flex-1 px-4">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full py-3 bg-transparent text-gray-800 dark:text-foreground placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 px-4 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-border">
              <MapPin size={18} className="text-gray-400 shrink-0" />
              <input
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City or postcode"
                className="w-full py-3 bg-transparent text-gray-800 dark:text-foreground placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <Link
              href={`/directory?q=${searchQuery}&location=${locationQuery}`}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Search size={16} /> Search
            </Link>
          </motion.div>
        </div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7 }}
          className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-16"
        >
          {[
            { label: "Beauty Pros", value: 5000, suffix: "+" },
            { label: "Happy Clients", value: 50000, suffix: "+" },
            { label: "Bookings Made", value: 200000, suffix: "+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-white tabular-nums">
                <AnimatedCounter to={stat.value} duration={2.5} suffix={stat.suffix} />
              </p>
              <p className="text-sm text-white/50 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </motion.div>
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
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  return (
    <div>
      {/* ═══ VIDEO HERO ═══ */}
      <VideoHero />

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TextReveal
              text="Browse by Category"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted text-lg">Find exactly the treatment you&apos;re after</p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={staggerItem}>
                <Link
                  href={cat.href}
                  className="group relative h-44 rounded-2xl overflow-hidden block"
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <Image
                      loader={cloudinaryLoader}
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 p-3">
                    <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                    <p className="text-xs text-white/70">{cat.count.toLocaleString()} pros</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ FEATURED SALONS ═══ */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <TextReveal
                text="Top-Rated Near You"
                tag="h2"
                className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2"
              />
              <ScrollReveal delay={0.1}>
                <p className="text-text-muted text-lg">Salons loved by thousands of happy clients</p>
              </ScrollReveal>
            </div>
            <ScrollReveal direction="right">
              <Link href="/directory" className="hidden sm:flex items-center gap-1 text-primary font-bold hover:underline text-sm">
                View all <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
            {featuredSalons.map((salon, i) => (
              <motion.div key={salon.name} variants={staggerItem}>
                <TiltCard className="glass-card-light rounded-2xl overflow-hidden group block relative">
                  <Link href={`/salon/${i + 1}`}>
                    <div className="h-52 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                      >
                        <Image
                          loader={cloudinaryLoader}
                          src={salon.image}
                          alt={salon.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {salon.verified && (
                        <span className="absolute top-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white bg-accent/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          <BadgeCheck size={12} /> Verified
                        </span>
                      )}
                      {salon.availableToday && (
                        <span className="absolute top-3 right-12 text-[11px] font-bold text-white bg-primary/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
                          Available today
                        </span>
                      )}

                      <motion.button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavourite(i); }}
                        whileTap={{ scale: 1.4 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/40 transition-all"
                      >
                        <Heart
                          size={14}
                          className={`transition-colors ${
                            favourites.has(i) ? "text-primary fill-primary" : "text-white"
                          }`}
                        />
                      </motion.button>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{salon.name}</h3>
                      <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                        <MapPin size={13} /> {salon.location}
                      </p>
                      <p className="text-xs text-primary font-semibold mt-2">{salon.speciality}</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span className="text-sm font-bold text-foreground">{salon.rating}</span>
                          <span className="text-xs text-text-muted">({salon.reviews})</span>
                        </div>
                        <motion.span
                          className="text-xs font-bold text-primary inline-flex items-center gap-1"
                          whileHover={{ x: 4 }}
                        >
                          Book now <ArrowRight size={12} />
                        </motion.span>
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            ))}
          </StaggerChildren>

          <ScrollReveal className="text-center mt-8 sm:hidden">
            <Link href="/directory" className="inline-flex items-center gap-1 text-primary font-bold text-sm">
              View all salons <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ TRENDING TREATMENTS (Embla Carousel) ═══ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TextReveal
              text="Trending Treatments"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted text-lg">The most booked treatments right now</p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <TrendingCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <TextReveal
              text="How It Works"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted text-lg">Three simple steps to your next appointment</p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-3 gap-10 max-w-3xl mx-auto" staggerDelay={0.15}>
            {[
              { icon: Search, title: "Search", desc: "Find salons and beauty pros near you by service, location, or name" },
              { icon: Calendar, title: "Book", desc: "Pick a date and time that suits you. Instant confirmation, no fuss" },
              { icon: Sparkles, title: "Enjoy", desc: "Turn up and enjoy your treatment. Leave a review to help others!" },
            ].map((step, i) => (
              <motion.div key={step.title} variants={staggerItem} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-18 h-18 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 relative"
                >
                  <step.icon size={30} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="font-bold text-foreground text-xl mb-2">{step.title}</h3>
                <p className="text-text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TextReveal
              text="Loved by Thousands"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted text-lg">Real reviews from real clients across the UK</p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={staggerItem}
              >
                <TiltCard className="glass-card-light rounded-2xl p-6 relative h-full" tiltAmount={5}>
                  <Quote size={32} className="text-primary/10 absolute top-4 right-4" />
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0 ring-2 ring-primary/20">
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
                      <p className="font-bold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= t.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                  <span className="text-xs font-bold text-primary">{t.service}</span>
                </TiltCard>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ TRUST & SAFETY ═══ */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TextReveal
              text="Trust & Safety"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted text-lg">Your safety and satisfaction are our top priority</p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
            {trustBadges.map((badge) => (
              <motion.div key={badge.title} variants={staggerItem} className="text-center glass-card-light rounded-2xl p-8">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5"
                >
                  <badge.icon size={28} className="text-primary" />
                </motion.div>
                <h3 className="font-bold text-foreground text-lg mb-2">{badge.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{badge.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ FOR BUSINESSES ═══ */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <ScrollReveal>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                <BarChart3 size={14} /> For beauty professionals
              </span>
            </ScrollReveal>
            <TextReveal
              text="Grow Your Beauty Business"
              tag="h2"
              className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.2}>
              <p className="text-text-muted max-w-xl mx-auto text-lg">
                Join thousands of salons, freelancers, and home-based beauty pros already using One Touch Beauty.
              </p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto" staggerDelay={0.12}>
            {businessSteps.map((step, i) => (
              <motion.div key={step.title} variants={staggerItem} className="text-center group">
                <motion.div
                  whileHover={{ scale: 1.1, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors relative"
                >
                  <step.icon size={28} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </span>
                </motion.div>
                <h3 className="font-bold text-foreground text-base mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </StaggerChildren>

          <ScrollReveal className="text-center mt-10" delay={0.3}>
            <MagneticButton className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:shadow-xl text-lg cursor-pointer">
              <Zap size={20} /> Get Started for Free
            </MagneticButton>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ CITIES ═══ */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <TextReveal
              text="Popular Cities"
              tag="h2"
              className="text-3xl font-extrabold text-foreground mb-3"
            />
            <ScrollReveal delay={0.1}>
              <p className="text-text-muted">Find beauty professionals in your area</p>
            </ScrollReveal>
          </div>

          <StaggerChildren className="flex flex-wrap justify-center gap-3" staggerDelay={0.04}>
            {cities.map((city) => (
              <motion.div key={city} variants={staggerItem}>
                <Link
                  href={`/directory?location=${city}`}
                  className="px-5 py-2.5 rounded-full bg-surface-elevated border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all inline-block"
                >
                  <motion.span whileHover={{ y: -2 }} className="inline-block">
                    {city}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ═══ BUSINESS CTA (Parallax) ═══ */}
      <ParallaxSection speed={0.2} className="relative py-24">
        <Image
          loader={cloudinaryLoader}
          src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&h=600&fit=crop"
          alt="Salon interior"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mb-5"
            >
              <Shield size={44} className="text-white/80 mx-auto" />
            </motion.div>
          </ScrollReveal>
          <TextReveal
            text="Are You a Beauty Professional?"
            tag="h2"
            className="text-3xl sm:text-5xl font-extrabold text-white mb-5"
          />
          <ScrollReveal delay={0.2}>
            <p className="text-white/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
              Join thousands of beauty pros on One Touch Beauty. Get discovered by new clients, manage your bookings, and grow your business — all for free.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-50 hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 text-lg cursor-pointer">
                <Users size={20} /> List Your Business
              </MagneticButton>
              <Link
                href="/pricing"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition inline-flex items-center justify-center gap-2 text-lg"
              >
                View Pricing
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      {/* ═══ APP DOWNLOAD ═══ */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="glass-card-light rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                >
                  <Bell size={14} /> Coming soon
                </motion.span>
                <TextReveal
                  text="Beauty Booking, Right in Your Pocket"
                  tag="h2"
                  className="text-3xl sm:text-4xl font-extrabold text-foreground mb-5"
                />
                <ScrollReveal delay={0.2}>
                  <p className="text-text-muted mb-8 max-w-md text-lg leading-relaxed">
                    The One Touch Beauty app is launching soon. Get instant notifications, manage your bookings on the go, and discover beauty pros near you.
                  </p>
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition"
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                      <div className="text-left">
                        <p className="text-[10px] leading-none opacity-70">Download on the</p>
                        <p className="text-sm font-bold leading-tight">App Store</p>
                      </div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition"
                    >
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1.004 1.004 0 010 1.724l-2.302 1.33-2.535-2.535 2.535-2.849zM5.864 2.658L16.801 8.99l-2.302 2.302-8.635-8.635z"/></svg>
                      <div className="text-left">
                        <p className="text-[10px] leading-none opacity-70">Get it on</p>
                        <p className="text-sm font-bold leading-tight">Google Play</p>
                      </div>
                    </motion.button>
                  </div>
                </ScrollReveal>
                <p className="text-xs text-text-muted mt-5">🔔 Join 2,000+ people on the waitlist</p>
              </div>

              {/* Phone mockup with float animation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex-shrink-0 relative"
              >
                <div className="w-64 h-[480px] rounded-[3rem] bg-gray-900 p-2 shadow-2xl relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-gray-900 rounded-b-2xl z-20" />
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative bg-white">
                    <Image
                      loader={cloudinaryLoader}
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=600&fit=crop"
                      alt="App preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 mb-2">
                        <p className="text-gray-900 font-bold text-xs">Book your next appointment</p>
                        <p className="text-gray-500 text-[10px]">Browse 5,000+ beauty pros</p>
                      </div>
                      <div className="bg-primary/90 backdrop-blur-sm rounded-xl p-3 text-center">
                        <p className="text-white font-bold text-xs">One Touch Beauty</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
