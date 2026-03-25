"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, MapPin, Scissors, Sparkles, Star, ArrowRight, Shield,
  Calendar, Clock, Heart, Users, ChevronLeft, ChevronRight,
  Hand, Paintbrush, Droplets, Flower2, Waves, SlidersHorizontal,
} from "lucide-react";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&h=600&fit=crop",
    title: "Beauty at your fingertips",
    subtitle: "Discover top-rated salons and beauty pros near you",
  },
  {
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&h=600&fit=crop",
    title: "Find your perfect stylist",
    subtitle: "Browse thousands of beauty professionals across the UK",
  },
  {
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1400&h=600&fit=crop",
    title: "Book in seconds",
    subtitle: "Choose a time that suits you and get instant confirmation",
  },
  {
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1400&h=600&fit=crop",
    title: "Nails, hair, makeup & more",
    subtitle: "Every beauty service you need, all in one place",
  },
];

const categories = [
  { name: "Hair", icon: Scissors, count: 2450, color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600", href: "/directory?category=hair" },
  { name: "Nails", icon: Hand, count: 1830, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600", href: "/directory?category=nails" },
  { name: "Makeup", icon: Paintbrush, count: 1240, color: "bg-red-100 dark:bg-red-900/30 text-red-600", href: "/directory?category=makeup" },
  { name: "Face", icon: Droplets, count: 1560, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", href: "/directory?category=face" },
  { name: "Body", icon: Flower2, count: 980, color: "bg-green-100 dark:bg-green-900/30 text-green-600", href: "/directory?category=body" },
  { name: "Hair Removal", icon: Waves, count: 1120, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600", href: "/directory?category=hair-removal" },
];

const cities = [
  "London", "Birmingham", "Manchester", "Leeds", "Liverpool",
  "Bristol", "Sheffield", "Edinburgh", "Glasgow", "Cardiff",
  "Nottingham", "Newcastle",
];

const featuredSalons = [
  { name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, reviews: 234, image: "💇‍♀️", speciality: "Hair Colour Specialists" },
  { name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, reviews: 189, image: "💅", speciality: "Gel & Acrylic Nails" },
  { name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, reviews: 312, image: "✨", speciality: "Advanced Facials" },
  { name: "Lash & Brow Bar", location: "Leith, Edinburgh", rating: 4.7, reviews: 156, image: "👁️", speciality: "Lash Extensions" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [businessType, setBusinessType] = useState<string[]>([]);
  const [distance, setDistance] = useState("");
  const [treatmentCat, setTreatmentCat] = useState("");

  const toggleBusinessType = (t: string) => {
    setBusinessType((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  return (
    <div>
      {/* Hero Banner Slideshow */}
      <section className="relative h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden">
        {/* Slides */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/15 glass text-white text-sm font-semibold mb-6">
              <Sparkles size={14} /> The UK&apos;s beauty marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              {heroSlides[currentSlide].title.includes("fingertips") ? (
                <>Beauty at your <span className="text-primary-light">fingertips</span></>
              ) : (
                heroSlides[currentSlide].title
              )}
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              {heroSlides[currentSlide].subtitle}
            </p>

            {/* Search Bar */}
            <div className="bg-white/95 glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl mx-auto">
              <div className="flex items-center gap-2 flex-1 px-4">
                <Search size={18} className="text-gray-400 shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full py-3 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 flex-1 px-4 border-t sm:border-t-0 sm:border-l border-gray-200">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <input
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City or postcode"
                  className="w-full py-3 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <Link
                href={`/directory?q=${searchQuery}&location=${locationQuery}&type=${businessType.join(",")}&distance=${distance}&cat=${treatmentCat}`}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2"
              >
                <Search size={16} /> Search
              </Link>
            </div>

            {/* Filter Toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="mt-5 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full bg-white/20 glass text-white text-sm font-semibold hover:bg-white/30 transition-all border border-white/20">
              <SlidersHorizontal size={15} /> {showFilters ? "Hide Filters" : "Filter Results"}
              {(businessType.length > 0 || distance || treatmentCat) && (
                <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center animate-pulse-glow">
                  {businessType.length + (distance ? 1 : 0) + (treatmentCat ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-2xl p-5 sm:p-6 max-w-2xl mx-auto animate-slide-up shadow-2xl text-left">
                {/* Business Type - prominent cards */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">I&apos;m looking for</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "Home", emoji: "🏠", desc: "Home-based" },
                      { value: "Salon", emoji: "💈", desc: "Salon premises" },
                      { value: "Mobile", emoji: "🚗", desc: "Comes to you" },
                    ].map((t) => (
                      <button key={t.value} onClick={() => toggleBusinessType(t.value)}
                        className={`flex flex-col items-center gap-1 p-4 rounded-2xl text-center transition-all ${
                          businessType.includes(t.value)
                            ? "bg-primary text-white shadow-md scale-[1.02]"
                            : "bg-gray-50 text-gray-600 hover:bg-primary/5 hover:scale-[1.02]"
                        }`}>
                        <span className="text-2xl">{t.emoji}</span>
                        <span className="text-sm font-bold">{t.value}</span>
                        <span className={`text-[10px] ${businessType.includes(t.value) ? "text-white/70" : "text-gray-400"}`}>{t.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-gray-100 mb-5" />

                {/* Distance */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Distance</p>
                  <div className="flex flex-wrap gap-2">
                    {["3 miles", "5 miles", "10 miles", "25 miles", "National"].map((d) => (
                      <button key={d} onClick={() => setDistance(distance === d ? "" : d)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          distance === d
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-primary/5"
                        }`}>{d}</button>
                    ))}
                  </div>
                </div>

                {/* Treatment Category */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Treatment</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Hair", emoji: "✂️" },
                      { label: "Nails", emoji: "💅" },
                      { label: "Makeup", emoji: "💄" },
                      { label: "Face", emoji: "✨" },
                      { label: "Body", emoji: "🧖‍♀️" },
                      { label: "Hair Removal", emoji: "🌟" },
                    ].map((c) => (
                      <button key={c.label} onClick={() => setTreatmentCat(treatmentCat === c.label ? "" : c.label)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                          treatmentCat === c.label
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-primary/5"
                        }`}>
                        <span>{c.emoji}</span> {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(businessType.length > 0 || distance || treatmentCat) && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">{businessType.length + (distance ? 1 : 0) + (treatmentCat ? 1 : 0)} filter(s) active</span>
                    <button onClick={() => { setBusinessType([]); setDistance(""); setTreatmentCat(""); }}
                      className="text-sm text-primary font-semibold hover:underline">
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Quick stats */}
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {[
                { label: "Beauty Pros", value: "5,000+" },
                { label: "Happy Clients", value: "50,000+" },
                { label: "Bookings Made", value: "200,000+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Navigation Arrows */}
        <button onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition">
          <ChevronLeft size={20} />
        </button>
        <button onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition">
          <ChevronRight size={20} />
        </button>

        {/* Slide Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Browse by category</h2>
            <p className="text-text-muted">Find exactly the treatment you&apos;re after</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href}
                className="group bg-surface-elevated border border-border rounded-2xl p-6 text-center hover:border-primary/30 hover:shadow-lg transition-all">
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                <p className="text-xs text-text-muted mt-1">{cat.count.toLocaleString()} pros</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Salons */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top-rated near you</h2>
              <p className="text-text-muted">Salons loved by thousands of happy clients</p>
            </div>
            <Link href="/directory"
              className="hidden sm:flex items-center gap-1 text-primary font-semibold hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredSalons.map((salon) => (
              <div key={salon.name}
                className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {salon.image}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-foreground">{salon.name}</h3>
                  <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                    <MapPin size={13} /> {salon.location}
                  </p>
                  <p className="text-xs text-primary font-medium mt-2">{salon.speciality}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
                      <span className="text-xs text-text-muted">({salon.reviews})</span>
                    </div>
                    <Link href="/booking" className="text-xs font-semibold text-primary hover:underline">
                      Book now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">How it works</h2>
            <p className="text-text-muted">Three simple steps to your next appointment</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: Search, title: "Search", desc: "Find salons and beauty pros near you by service, location, or name" },
              { icon: Calendar, title: "Book", desc: "Pick a date and time that suits you. Instant confirmation, no fuss" },
              { icon: Sparkles, title: "Enjoy", desc: "Turn up and enjoy your treatment. Leave a review to help others!" },
            ].map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon size={28} className="text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-surface relative overflow-hidden">
        {/* City skyline silhouette */}
        <div className="absolute bottom-0 left-0 right-0 opacity-[0.05] dark:opacity-[0.07] pointer-events-none">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none" fill="currentColor" className="w-full h-[140px] text-foreground">
            <path d="M0,180 L0,145 C10,145 10,130 20,130 L28,130 L28,110 L32,108 L36,110 L36,130 L52,130 L52,95 L56,95 L56,80 L60,78 L64,80 L64,95 L68,95 L68,130 L90,130 C95,130 95,140 105,140 L120,140 L120,105 L126,105 L126,75 L130,72 L134,72 L138,75 L138,105 L144,105 L144,140 L170,140 L170,120 L180,120 L180,85 L184,82 L188,85 L188,65 L192,62 L196,65 L196,85 L200,82 L204,85 L204,120 L214,120 L214,140 L240,140 L240,130 L250,130 L250,55 L254,52 L258,52 L262,55 L262,90 L266,90 L266,55 L270,52 L274,55 L274,130 L284,130 L284,140 L310,140 L310,110 L320,110 L320,70 L326,68 L330,70 L330,45 L334,42 L338,45 L338,70 L342,68 L348,70 L348,110 L358,110 L358,140 L390,140 C395,140 395,135 400,135 L410,135 L410,100 L416,100 L416,60 L420,58 L424,60 L424,100 L430,100 L430,135 L450,135 L450,125 L460,125 L460,80 L466,78 L470,80 L470,50 L474,48 L478,48 L482,50 L482,80 L486,78 L492,80 L492,125 L502,125 L502,140 L530,140 L530,115 L540,115 L540,90 L544,88 L548,90 L548,65 L552,62 L556,65 L556,90 L560,88 L564,90 L564,115 L574,115 L574,140 L600,140 L600,130 L612,130 L612,95 L616,92 L620,95 L620,50 L624,47 L628,47 L632,50 L632,95 L636,92 L640,95 L640,130 L652,130 L652,140 L680,140 L680,120 L692,120 L692,75 L696,72 L700,75 L700,55 L704,52 L708,55 L708,75 L712,72 L716,75 L716,120 L728,120 L728,140 L760,140 L760,110 L770,110 L770,85 L774,82 L778,85 L778,40 L782,37 L786,37 L790,40 L790,85 L794,82 L798,85 L798,110 L808,110 L808,140 L840,140 C845,140 845,132 855,132 L865,132 L865,100 L870,100 L870,68 L874,65 L878,68 L878,100 L883,100 L883,132 L900,132 L900,120 L910,120 L910,55 L914,52 L918,52 L922,55 L922,78 L926,78 L926,55 L930,52 L934,55 L934,120 L944,120 L944,140 L975,140 L975,125 L985,125 L985,90 L989,87 L993,90 L993,60 L997,57 L1001,60 L1001,90 L1005,87 L1009,90 L1009,125 L1019,125 L1019,140 L1050,140 L1050,115 L1060,115 L1060,70 L1064,67 L1068,70 L1068,42 L1072,39 L1076,39 L1080,42 L1080,70 L1084,67 L1088,70 L1088,115 L1098,115 L1098,140 L1130,140 L1130,130 L1142,130 L1142,88 L1146,85 L1150,88 L1150,62 L1154,59 L1158,62 L1158,88 L1162,85 L1166,88 L1166,130 L1178,130 L1178,140 L1210,140 L1210,118 L1220,118 L1220,80 L1224,77 L1228,80 L1228,50 L1232,47 L1236,50 L1236,80 L1240,77 L1244,80 L1244,118 L1254,118 L1254,140 L1290,140 L1290,128 L1300,128 L1300,95 L1304,92 L1308,95 L1308,72 L1312,69 L1316,72 L1316,95 L1320,92 L1324,95 L1324,128 L1334,128 L1334,140 L1370,140 L1370,120 L1380,120 L1380,100 L1386,97 L1390,100 L1390,120 L1400,120 L1400,140 L1440,140 L1440,180 Z"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">Popular cities</h2>
            <p className="text-text-muted">Find beauty professionals in your area</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city) => (
              <Link key={city} href={`/directory?location=${city}`}
                className="px-5 py-2.5 rounded-full bg-surface-elevated border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition">
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={40} className="text-white/80 mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Are you a beauty professional?</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of beauty pros on One Touch Beauty. Get discovered by new clients, manage your bookings, and grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register/business"
              className="px-8 py-3.5 bg-white text-primary font-bold rounded-full hover:bg-gray-50 transition inline-flex items-center justify-center gap-2">
              <Users size={18} /> List Your Business
            </Link>
            <Link href="/pricing"
              className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition inline-flex items-center justify-center gap-2">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
