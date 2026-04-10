"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Star, Clock, Phone, Mail, Globe, Shield, Heart,
  Calendar, Share2, ChevronLeft, ChevronRight, MessageSquare,
  Scissors, Users, Award, CheckCircle2, ExternalLink, Map,
  AlertCircle, BellPlus,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import PortfolioGrid from "@/components/PortfolioGrid";
import VideoIntro from "@/components/VideoIntro";
import RatingBreakdown from "@/components/RatingBreakdown";
import WaitlistButton from "@/components/WaitlistButton";
import ShareButton from "@/components/ShareButton";

const salon = {
  name: "Glow Studio",
  type: "Hair Salon",
  setting: "Salon",
  location: "42 Shoreditch High St, London, E1 6JJ",
  city: "London",
  rating: 4.9,
  reviews: 234,
  phone: "020 1234 5678",
  email: "hello@glowstudio.co.uk",
  website: "www.glowstudio.co.uk",
  verified: true,
  established: "2019",
  teamSize: 6,
  instagram: "glowstudio_ldn",
  facebook: "glowstudiolondon",
  hasAvailability: true,
  cancellationPolicy: {
    freeCancel: 24,
    depositRequired: true,
    depositPercent: 20,
    noShowCharge: true,
  },
  about:
    "Award-winning hair salon specialising in colour, balayage, and styling. Our team of expert stylists are passionate about helping you look and feel your best. Whether you're after a fresh new cut, a bold colour change, or a special occasion style, we've got you covered.\n\nWe use only the finest products including Olaplex, Redken, and L'Oreal Professional to ensure your hair stays healthy and vibrant. Every appointment begins with a thorough consultation so we can understand exactly what you're looking for.",
  gallery: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop",
  ],
  hours: [
    { day: "Monday", time: "09:00 - 18:00", open: true },
    { day: "Tuesday", time: "09:00 - 18:00", open: true },
    { day: "Wednesday", time: "09:00 - 20:00", open: true },
    { day: "Thursday", time: "09:00 - 20:00", open: true },
    { day: "Friday", time: "09:00 - 18:00", open: true },
    { day: "Saturday", time: "09:00 - 17:00", open: true },
    { day: "Sunday", time: "Closed", open: false },
  ],
  treatments: [
    { name: "Women's Haircut & Blow Dry", duration: "60 mins", price: 45, category: "Hair" },
    { name: "Blow Dry & Style", duration: "45 mins", price: 30, category: "Hair" },
    { name: "Children's Haircut", duration: "30 mins", price: 18, category: "Hair" },
    { name: "Hair Colour (Full Head)", duration: "120 mins", price: 85, category: "Colour" },
    { name: "Balayage", duration: "150 mins", price: 120, category: "Colour" },
    { name: "Highlights (Full Head)", duration: "120 mins", price: 95, category: "Colour" },
    { name: "Highlights (Half Head)", duration: "90 mins", price: 70, category: "Colour" },
    { name: "Root Touch Up", duration: "60 mins", price: 55, category: "Colour" },
    { name: "Toner", duration: "30 mins", price: 25, category: "Colour" },
    { name: "Blow Dry & Style", duration: "45 mins", price: 30, category: "Hair" },
    { name: "Olaplex Treatment", duration: "30 mins", price: 35, category: "Treatment" },
    { name: "Keratin Treatment", duration: "120 mins", price: 150, category: "Treatment" },
  ],
  staffMembers: [
    {
      id: 1,
      name: "Sophie Taylor",
      role: "Senior Stylist",
      bio: "With 8 years of experience, Sophie specialises in balayage and creative colour. She's trained with some of London's top colourists.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
      specialties: ["Balayage", "Colour", "Highlights"],
      rating: 4.9,
    },
    {
      id: 2,
      name: "James Chen",
      role: "Creative Director",
      bio: "James founded Glow Studio in 2019. Known for his precision cuts and modern styling, he brings a decade of editorial experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      specialties: ["Precision Cuts", "Styling", "Editorial"],
      rating: 5.0,
    },
    {
      id: 3,
      name: "Amara Osei",
      role: "Colour Specialist",
      bio: "Amara is passionate about colour correction and transformations. She loves turning hair dreams into reality.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
      specialties: ["Colour Correction", "Highlights", "Toner"],
      rating: 4.8,
    },
    {
      id: 4,
      name: "Lily Nguyen",
      role: "Stylist",
      bio: "Lily joined Glow Studio after training at the London College of Fashion. She excels in blow dries and updos for special events.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      specialties: ["Blow Dry", "Updos", "Bridal"],
      rating: 4.7,
    },
    {
      id: 5,
      name: "Marcus Green",
      role: "Junior Stylist",
      bio: "Marcus is our newest team member, bringing fresh energy and a keen eye for trends. Great with textured and afro hair.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      specialties: ["Textured Hair", "Braids", "Natural Styling"],
      rating: 4.6,
    },
  ],
  reviewsList: [
    {
      name: "Emma W.",
      rating: 5,
      date: "2 days ago",
      text: "Absolutely love my balayage! The team here are so talented and friendly. Really took the time to understand what I wanted. Can't recommend enough.",
    },
    {
      name: "Sarah C.",
      rating: 5,
      date: "1 week ago",
      text: "Best haircut I've had in years. Really listened to what I wanted and nailed it. The salon is gorgeous too, very relaxing atmosphere.",
    },
    {
      name: "Jade T.",
      rating: 4,
      date: "2 weeks ago",
      text: "Great colour work on my highlights, they look so natural. The only reason for 4 stars is the wait was slightly longer than expected but the result was worth it.",
    },
    {
      name: "Amy R.",
      rating: 5,
      date: "3 weeks ago",
      text: "My go-to salon! Always leave feeling amazing. The Olaplex treatment saved my damaged hair after years of bleaching. The staff are lovely.",
    },
    {
      name: "Lucy M.",
      rating: 5,
      date: "1 month ago",
      text: "Had my bridal hair trial here and I'm so happy with the result. Can't wait for the big day! They were so patient with all my Pinterest photos.",
    },
    {
      name: "Kate P.",
      rating: 5,
      date: "1 month ago",
      text: "Took my daughter for her first proper haircut and they were brilliant with her. So gentle and patient. She loved it!",
    },
  ],
};

const today = new Date().toLocaleDateString("en-GB", { weekday: "long" });
const treatmentCategories = [...new Set(salon.treatments.map((t) => t.category))];

export default function SalonPage() {
  const [activeGallery, setActiveGallery] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const scrollRef = useScrollReveal();

  const filteredTreatments =
    activeCategory === "All"
      ? salon.treatments
      : salon.treatments.filter((t) => t.category === activeCategory);

  const visibleReviews = showAllReviews
    ? salon.reviewsList
    : salon.reviewsList.slice(0, 3);

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Gallery */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-black overflow-hidden">
        <Image
          src={salon.gallery[activeGallery]}
          alt={`${salon.name} gallery`}
          fill
          className="object-cover opacity-90 card-img-zoom"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Gallery Navigation */}
        <button
          onClick={() =>
            setActiveGallery(
              (prev) => (prev - 1 + salon.gallery.length) % salon.gallery.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() =>
            setActiveGallery((prev) => (prev + 1) % salon.gallery.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition"
        >
          <ChevronRight size={20} />
        </button>

        {/* Gallery Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {salon.gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveGallery(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                i === activeGallery
                  ? "border-white"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={salon.gallery[i]}
                alt=""
                width={48}
                height={48}
                className="object-cover w-full h-full"
                unoptimized
              />
            </button>
          ))}
        </div>

        {/* Photo Count */}
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
          {activeGallery + 1} / {salon.gallery.length}
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-12 relative z-10">
        {/* Profile Header */}
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-lg mb-6 reveal card-glow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{salon.name}</h1>
                {salon.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                    <Shield size={12} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-primary font-medium">{salon.type}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  {salon.setting}
                </span>
              </div>
              <p className="text-sm text-text-muted flex items-center gap-1 mt-2">
                <MapPin size={14} /> {salon.location}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-amber-400 fill-amber-400"
                  />
                  <span className="font-bold text-foreground">{salon.rating}</span>
                  <span className="text-sm text-text-muted">
                    ({salon.reviews} reviews)
                  </span>
                </div>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    salon.hours.find((h) => h.day === today)?.open
                      ? "text-accent"
                      : "text-red-400"
                  }`}
                >
                  <Clock size={14} />
                  {salon.hours.find((h) => h.day === today)?.open
                    ? `Open today ${
                        salon.hours.find((h) => h.day === today)?.time
                      }`
                    : "Closed today"}
                </span>
              </div>

              {/* Quick Info Pills */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
                  <Award size={11} /> Est. {salon.established}
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
                  <Users size={11} /> {salon.teamSize} stylists
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
                  <Scissors size={11} /> {salon.treatments.length} treatments
                </span>
              </div>

              {/* Social Links */}
              {(salon.instagram || salon.facebook) && (
                <div className="flex items-center gap-2 mt-3">
                  {salon.instagram && (
                    <a
                      href={`https://instagram.com/${salon.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:text-primary-dark transition"
                    >
                      <ExternalLink size={12} /> @{salon.instagram}
                    </a>
                  )}
                  {salon.facebook && (
                    <a
                      href={`https://facebook.com/${salon.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:text-blue-300 transition"
                    >
                      <ExternalLink size={12} /> Facebook
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:items-end">
              {salon.hasAvailability ? (
                <Link
                  href="/booking"
                  className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Calendar size={16} /> Book Appointment
                </Link>
              ) : (
                <WaitlistButton salonId="1" salonName={salon.name} />
              )}
              <div className="flex gap-2">
                <a
                  href={`tel:${salon.phone}`}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-border text-foreground font-medium rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Phone size={14} /> Call
                </a>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`px-4 py-2.5 border rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium ${
                    liked
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground hover:border-primary hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Heart
                    size={14}
                    className={liked ? "fill-primary" : ""}
                  />
                  {liked ? "Saved" : "Save"}
                </button>
                <ShareButton
                  title={salon.name}
                  text={`Check out ${salon.name} — ${salon.type} in ${salon.city}`}
                  url={typeof window !== "undefined" ? window.location.href : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h2 className="font-bold text-foreground text-lg mb-3">
                About {salon.name}
              </h2>
              {salon.about.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className="text-text-muted text-sm leading-relaxed mb-3 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Meet the Team */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                  <Users size={18} className="text-primary" /> Meet the Team
                </h2>
                <span className="text-xs text-text-muted">{salon.staffMembers.length} stylists</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {salon.staffMembers.map((member) => (
                  <div
                    key={member.id}
                    className="group p-4 rounded-xl border border-border bg-surface hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-full overflow-hidden relative ring-2 ring-primary/10 shrink-0">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition">
                          {member.name}
                        </h3>
                        <p className="text-xs text-primary font-medium">{member.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-foreground">{member.rating}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-3 leading-relaxed line-clamp-2">
                      {member.bio}
                    </p>
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {member.specialties.map((sp) => (
                        <span
                          key={sp}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/booking?staff=${member.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Book with {member.name.split(" ")[0]} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatments & Prices */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground text-lg">
                  Treatments & Prices
                </h2>
                <span className="text-xs text-text-muted">
                  {salon.treatments.length} treatments
                </span>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === "All"
                      ? "bg-primary text-white shadow-md"
                      : "bg-surface border border-border text-text-muted hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  All
                </button>
                {treatmentCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface border border-border text-text-muted hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Treatment List */}
              <div className="divide-y divide-border">
                {filteredTreatments.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between py-3.5 group hover:bg-surface/50 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition">
                        {t.name}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock size={11} /> {t.duration}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                          {t.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground text-lg">
                        £{t.price}
                      </span>
                      <Link
                        href="/booking"
                        className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-all opacity-0 group-hover:opacity-100"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews with Rating Breakdown */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-lg">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star
                    size={16}
                    className="text-amber-400 fill-amber-400"
                  />
                  <span className="font-bold text-foreground">
                    {salon.rating}
                  </span>
                  <span className="text-sm text-text-muted">
                    ({salon.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Rating Breakdown Component */}
              <RatingBreakdown
                rating={salon.rating}
                totalReviews={salon.reviews}
                breakdown={[
                  { stars: 5, count: salon.reviewsList.filter(r => r.rating === 5).length },
                  { stars: 4, count: salon.reviewsList.filter(r => r.rating === 4).length },
                  { stars: 3, count: salon.reviewsList.filter(r => r.rating === 3).length },
                  { stars: 2, count: salon.reviewsList.filter(r => r.rating === 2).length },
                  { stars: 1, count: salon.reviewsList.filter(r => r.rating === 1).length },
                ]}
              />

              {/* Individual Reviews */}
              <div className="space-y-5 mt-6">
                {visibleReviews.map((r, i) => (
                  <div
                    key={i}
                    className="pb-5 border-b border-border last:border-0 last:pb-0 reveal"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground text-sm">
                            {r.name}
                          </span>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={11}
                                className={
                                  s <= r.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-border"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{r.date}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed ml-13">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>

              {salon.reviewsList.length > 3 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 w-full py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition"
                >
                  {showAllReviews
                    ? "Show less"
                    : `Show all ${salon.reviewsList.length} reviews`}
                </button>
              )}
            </div>

            {/* Before & After */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h2 className="font-bold text-foreground text-lg mb-4">Before & After</h2>
              <BeforeAfterGallery
                transformations={[
                  {
                    before: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
                    after: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
                    title: "Balayage Transformation",
                    description: "From flat colour to sun-kissed dimension",
                  },
                ]}
                compact
              />
              <Link
                href="/gallery"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                View full gallery →
              </Link>
            </div>

            {/* Meet Your Stylist */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <VideoIntro />
            </div>

            {/* Portfolio */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h2 className="font-bold text-foreground text-lg mb-4">Our Work</h2>
              <PortfolioGrid />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h3 className="font-bold text-foreground mb-4">Opening Hours</h3>
              <div className="space-y-2.5">
                {salon.hours.map((h) => (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between text-sm ${
                      h.day === today
                        ? "font-semibold text-foreground"
                        : "text-text-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {h.day === today && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                      <span>{h.day}</span>
                    </div>
                    <span className={!h.open ? "text-red-400" : ""}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h3 className="font-bold text-foreground mb-4">Contact</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${salon.phone}`}
                  className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone size={14} className="text-primary" />
                  </div>
                  {salon.phone}
                </a>
                <a
                  href={`mailto:${salon.email}`}
                  className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail size={14} className="text-primary" />
                  </div>
                  {salon.email}
                </a>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe size={14} className="text-primary" />
                  </div>
                  {salon.website}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  {salon.location}
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 reveal card-glow">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Shield size={16} className="text-primary" /> Cancellation Policy
              </h3>
              <ul className="text-xs text-text-muted space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                  Free cancellation up to {salon.cancellationPolicy.freeCancel} hours before
                </li>
                {salon.cancellationPolicy.depositRequired && (
                  <li className="flex items-start gap-2">
                    <AlertCircle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                    {salon.cancellationPolicy.depositPercent}% deposit required at booking
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <AlertCircle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                  Late cancellations: deposit is non-refundable
                </li>
                {salon.cancellationPolicy.noShowCharge && (
                  <li className="flex items-start gap-2">
                    <AlertCircle size={12} className="text-red-400 shrink-0 mt-0.5" />
                    No-shows: full amount may be charged
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={12} className="text-accent shrink-0 mt-0.5" />
                  Free rescheduling with {salon.cancellationPolicy.freeCancel}+ hours notice
                </li>
              </ul>
            </div>

            {/* Map Placeholder */}
            <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden reveal card-glow">
              <div className="h-48 map-placeholder bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 flex items-center justify-center flex-col gap-3">
                <Map size={32} className="text-primary/30" />
                <div className="text-center px-4">
                  <p className="text-sm font-medium text-foreground">
                    {salon.city}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {salon.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Book CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-center reveal card-glow">
              <Calendar size={28} className="text-white/80 mx-auto mb-2" />
              <h3 className="font-bold text-white text-lg mb-1">
                Ready to book?
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Choose a time that works for you
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition-all hover:shadow-lg w-full justify-center"
              >
                <Calendar size={16} /> Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
