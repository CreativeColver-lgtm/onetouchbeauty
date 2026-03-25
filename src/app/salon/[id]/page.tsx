"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin, Star, Clock, Phone, Mail, Globe, Shield, Heart,
  Calendar, Share2, ChevronLeft, ChevronRight, MessageSquare,
  Scissors, Users, Award, CheckCircle2, ExternalLink,
} from "lucide-react";

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
  about: "Award-winning hair salon specialising in colour, balayage, and styling. Our team of expert stylists are passionate about helping you look and feel your best. Whether you're after a fresh new cut, a bold colour change, or a special occasion style, we've got you covered.\n\nWe use only the finest products including Olaplex, Redken, and L'Oreal Professional to ensure your hair stays healthy and vibrant. Every appointment begins with a thorough consultation so we can understand exactly what you're looking for.",
  gallery: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400&h=400&fit=crop",
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
    { name: "Men's Haircut", duration: "30 mins", price: 25, category: "Hair" },
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
    { name: "Scalp Treatment", duration: "45 mins", price: 40, category: "Treatment" },
    { name: "Hair Extensions (Full Head)", duration: "180 mins", price: 250, category: "Extensions" },
    { name: "Bridal Hair Trial", duration: "90 mins", price: 75, category: "Bridal" },
    { name: "Wedding Day Hair", duration: "90 mins", price: 95, category: "Bridal" },
    { name: "Updo / Evening Style", duration: "60 mins", price: 55, category: "Hair" },
  ],
  reviewsList: [
    { name: "Emma W.", rating: 5, date: "2 days ago", text: "Absolutely love my balayage! The team here are so talented and friendly. Really took the time to understand what I wanted. Can't recommend enough." },
    { name: "Sarah C.", rating: 5, date: "1 week ago", text: "Best haircut I've had in years. Really listened to what I wanted and nailed it. The salon is gorgeous too, very relaxing atmosphere." },
    { name: "Jade T.", rating: 4, date: "2 weeks ago", text: "Great colour work on my highlights, they look so natural. The only reason for 4 stars is the wait was slightly longer than expected but the result was worth it." },
    { name: "Amy R.", rating: 5, date: "3 weeks ago", text: "My go-to salon! Always leave feeling amazing. The Olaplex treatment saved my damaged hair after years of bleaching. The staff are lovely." },
    { name: "Lucy M.", rating: 5, date: "1 month ago", text: "Had my bridal hair trial here and I'm so happy with the result. Can't wait for the big day! They were so patient with all my Pinterest photos." },
    { name: "Kate P.", rating: 5, date: "1 month ago", text: "Took my daughter for her first proper haircut and they were brilliant with her. So gentle and patient. She loved it!" },
  ],
};

const today = new Date().toLocaleDateString("en-GB", { weekday: "long" });
const treatmentCategories = [...new Set(salon.treatments.map((t) => t.category))];

export default function SalonPage() {
  const [activeGallery, setActiveGallery] = useState(0);
  const [liked, setLiked] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const filteredTreatments = activeCategory === "All"
    ? salon.treatments
    : salon.treatments.filter((t) => t.category === activeCategory);

  const visibleReviews = showAllReviews ? salon.reviewsList : salon.reviewsList.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Gallery */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-black overflow-hidden">
        <Image
          src={salon.gallery[activeGallery]}
          alt={`${salon.name} gallery`}
          fill
          className="object-cover opacity-90"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Gallery Navigation */}
        <button onClick={() => setActiveGallery((prev) => (prev - 1 + salon.gallery.length) % salon.gallery.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setActiveGallery((prev) => (prev + 1) % salon.gallery.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 glass text-white flex items-center justify-center hover:bg-white/30 transition">
          <ChevronRight size={20} />
        </button>

        {/* Gallery Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {salon.gallery.map((_, i) => (
            <button key={i} onClick={() => setActiveGallery(i)}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                i === activeGallery ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
              }`}>
              <Image src={salon.gallery[i]} alt="" width={48} height={48} className="object-cover w-full h-full" unoptimized />
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
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-lg mb-6">
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
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">{salon.setting}</span>
              </div>
              <p className="text-sm text-text-muted flex items-center gap-1 mt-2">
                <MapPin size={14} /> {salon.location}
              </p>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-foreground">{salon.rating}</span>
                  <span className="text-sm text-text-muted">({salon.reviews} reviews)</span>
                </div>
                <span className={`text-sm font-medium flex items-center gap-1 ${
                  salon.hours.find((h) => h.day === today)?.open ? "text-accent" : "text-red-400"
                }`}>
                  <Clock size={14} />
                  {salon.hours.find((h) => h.day === today)?.open
                    ? `Open today ${salon.hours.find((h) => h.day === today)?.time}`
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href="/booking"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2 w-full sm:w-auto">
                <Calendar size={16} /> Book Appointment
              </Link>
              <div className="flex gap-2">
                <a href={`tel:${salon.phone}`} className="flex-1 sm:flex-none px-4 py-2.5 border border-border text-foreground font-medium rounded-xl hover:border-primary hover:text-primary transition flex items-center justify-center gap-2 text-sm">
                  <Phone size={14} /> Call
                </a>
                <button onClick={() => setLiked(!liked)}
                  className={`px-4 py-2.5 border rounded-xl transition flex items-center justify-center gap-2 text-sm font-medium ${
                    liked ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary hover:text-primary"
                  }`}>
                  <Heart size={14} className={liked ? "fill-primary" : ""} /> {liked ? "Saved" : "Save"}
                </button>
                <button className="px-4 py-2.5 border border-border text-foreground rounded-xl hover:border-primary hover:text-primary transition flex items-center justify-center">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h2 className="font-bold text-foreground text-lg mb-3">About {salon.name}</h2>
              {salon.about.split("\n\n").map((p, i) => (
                <p key={i} className="text-text-muted text-sm leading-relaxed mb-3 last:mb-0">{p}</p>
              ))}
            </div>

            {/* Treatments & Prices */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-foreground text-lg">Treatments & Prices</h2>
                <span className="text-xs text-text-muted">{salon.treatments.length} treatments</span>
              </div>

              {/* Category Tabs */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4">
                <button onClick={() => setActiveCategory("All")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                    activeCategory === "All" ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary"
                  }`}>All</button>
                {treatmentCategories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                      activeCategory === cat ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary"
                    }`}>{cat}</button>
                ))}
              </div>

              {/* Treatment List */}
              <div className="divide-y divide-border">
                {filteredTreatments.map((t) => (
                  <div key={t.name} className="flex items-center justify-between py-3.5 group">
                    <div>
                      <p className="font-medium text-foreground text-sm group-hover:text-primary transition">{t.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-text-muted flex items-center gap-1"><Clock size={11} /> {t.duration}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">{t.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-foreground text-lg">£{t.price}</span>
                      <Link href="/booking" className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-dark transition opacity-0 group-hover:opacity-100">
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-foreground text-lg">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-foreground">{salon.rating}</span>
                  <span className="text-sm text-text-muted">({salon.reviews} reviews)</span>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex items-center gap-6 mb-6 pb-5 border-b border-border">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-foreground">{salon.rating}</p>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={14} className={s <= Math.round(salon.rating) ? "text-amber-400 fill-amber-400" : "text-border"} />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted mt-1">{salon.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = salon.reviewsList.filter((r) => r.rating === stars).length;
                    const pct = salon.reviewsList.length > 0 ? (count / salon.reviewsList.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-xs text-text-muted w-3">{stars}</span>
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-text-muted w-6">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-5">
                {visibleReviews.map((r, i) => (
                  <div key={i} className="pb-5 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-foreground text-sm">{r.name}</span>
                          <div className="flex gap-0.5 mt-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={11} className={s <= r.rating ? "text-amber-400 fill-amber-400" : "text-border"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-text-muted">{r.date}</span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed ml-13">{r.text}</p>
                  </div>
                ))}
              </div>

              {salon.reviewsList.length > 3 && (
                <button onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 w-full py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition">
                  {showAllReviews ? "Show less" : `Show all ${salon.reviewsList.length} reviews`}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Opening Hours</h3>
              <div className="space-y-2.5">
                {salon.hours.map((h) => (
                  <div key={h.day} className={`flex items-center justify-between text-sm ${
                    h.day === today ? "font-semibold text-foreground" : "text-text-muted"
                  }`}>
                    <div className="flex items-center gap-2">
                      {h.day === today && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      <span>{h.day}</span>
                    </div>
                    <span className={!h.open ? "text-red-400" : ""}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Contact</h3>
              <div className="space-y-3">
                <a href={`tel:${salon.phone}`} className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Phone size={14} className="text-primary" /></div>
                  {salon.phone}
                </a>
                <a href={`mailto:${salon.email}`} className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Mail size={14} className="text-primary" /></div>
                  {salon.email}
                </a>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Globe size={14} className="text-primary" /></div>
                  {salon.website}
                </div>
                <div className="flex items-center gap-3 text-sm text-text-muted">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><MapPin size={14} className="text-primary" /></div>
                  {salon.location}
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{salon.city}</p>
                  <p className="text-xs text-text-muted">{salon.location}</p>
                </div>
              </div>
            </div>

            {/* Book CTA */}
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-center">
              <Calendar size={28} className="text-white/80 mx-auto mb-2" />
              <h3 className="font-bold text-white text-lg mb-1">Ready to book?</h3>
              <p className="text-white/70 text-sm mb-4">Choose a time that works for you</p>
              <Link href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-50 transition w-full justify-center">
                <Calendar size={16} /> Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
