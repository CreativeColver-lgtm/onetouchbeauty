"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar, Clock, Star, MapPin, Heart, User, ArrowRight,
  MessageSquare, Search, Gift, Crown, Zap, ChevronRight,
  RotateCcw, Bell, Settings, Shield, TrendingUp,
} from "lucide-react";

/* ── mock data ── */
const upcomingBookings = [
  { id: 1, salon: "Glow Studio", service: "Balayage", date: "28 Mar 2026", time: "09:00", daysUntil: 3, price: "£120", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&h=100&fit=crop" },
  { id: 2, salon: "Nail Artistry", service: "Gel Manicure", date: "2 Apr 2026", time: "14:00", daysUntil: 8, price: "£35", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=100&h=100&fit=crop" },
  { id: 3, salon: "Pure Skin Clinic", service: "HydraFacial", date: "10 Apr 2026", time: "11:00", daysUntil: 16, price: "£90", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=100&h=100&fit=crop" },
];

const pastBookings = [
  { id: 4, salon: "Glow Studio", service: "Haircut & Blow Dry", date: "15 Mar 2026", time: "10:00", price: "£45", reviewed: true },
  { id: 5, salon: "Lash & Brow Bar", service: "Lash Lift", date: "8 Mar 2026", time: "10:30", price: "£55", reviewed: false },
  { id: 6, salon: "Zen Body Spa", service: "Swedish Massage", date: "1 Mar 2026", time: "14:00", price: "£65", reviewed: true },
  { id: 7, salon: "Nail Artistry", service: "Pedicure", date: "22 Feb 2026", time: "12:00", price: "£40", reviewed: false },
];

const favouriteSalons = [
  { id: 1, name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, reviews: 234, image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop" },
  { id: 2, name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, reviews: 189, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop" },
  { id: 3, name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, reviews: 312, image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop" },
  { id: 4, name: "Lash & Brow Bar", location: "Kensington, London", rating: 4.7, reviews: 156, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&h=200&fit=crop" },
];

const recommendedSalons = [
  { id: 5, name: "The Blow Dry Bar", location: "Chelsea, London", rating: 4.8, type: "Hair Salon", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=300&h=200&fit=crop" },
  { id: 6, name: "Skin Deep Clinic", location: "Notting Hill, London", rating: 4.9, type: "Skin Clinic", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&h=200&fit=crop" },
  { id: 7, name: "Zen Nails", location: "Angel, London", rating: 4.7, type: "Nail Salon", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&h=200&fit=crop" },
];

const activityFeed = [
  { text: "You booked Balayage at Glow Studio", time: "2 hours ago", icon: Calendar },
  { text: "Nail Artistry sent you a 15% off promo", time: "Yesterday", icon: Gift },
  { text: "Your review for Glow Studio was published", time: "3 days ago", icon: Star },
  { text: "Pure Skin Clinic confirmed your booking", time: "5 days ago", icon: Bell },
  { text: "You earned 50 loyalty points", time: "1 week ago", icon: Crown },
];

export default function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-lg">
              EW
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hello, Emma!</h1>
              <p className="text-text-muted">Your beauty hub — bookings, favourites & more</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-3 py-1.5 rounded-full">
              <Shield size={12} /> Verified
            </span>
            <Link href="/dashboard/client" className="p-2 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 transition">
              <Settings size={18} className="text-text-muted" />
            </Link>
          </div>
        </div>

        {/* Quick Search */}
        <div className="mb-8">
          <div className="flex items-center gap-3 px-5 py-4 bg-surface-elevated border border-border rounded-2xl focus-within:border-primary transition-colors">
            <Search size={20} className="text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Quick book — search salons, services, or locations..."
              className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
            />
            <Link href="/directory" className="px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition whitespace-nowrap">
              Search
            </Link>
          </div>
        </div>

        {/* Loyalty + Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white col-span-2">
            <div className="flex items-center justify-between mb-3">
              <Crown size={24} />
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">GOLD TIER</span>
            </div>
            <p className="text-3xl font-extrabold">1,240</p>
            <p className="text-sm opacity-80">Loyalty Points</p>
            <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: "62%" }} />
            </div>
            <p className="text-xs mt-1.5 opacity-70">760 points to Platinum</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-2xl p-5">
            <Calendar size={18} className="text-primary mb-2" />
            <p className="text-2xl font-extrabold text-foreground">3</p>
            <p className="text-sm text-text-muted">Upcoming</p>
          </div>
          <div className="bg-surface-elevated border border-border rounded-2xl p-5">
            <Heart size={18} className="text-primary mb-2" />
            <p className="text-2xl font-extrabold text-foreground">4</p>
            <p className="text-sm text-text-muted">Favourites</p>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Upcoming Bookings</h2>
            <Link href="/directory" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              Book new <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingBookings.map((b) => (
              <div key={b.id} className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                    <Image src={b.image} alt={b.salon} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground truncate">{b.salon}</p>
                    <p className="text-sm text-text-muted">{b.service}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="flex items-center gap-1 text-text-muted"><Calendar size={13} /> {b.date}</span>
                  <span className="flex items-center gap-1 text-text-muted"><Clock size={13} /> {b.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                    <Zap size={11} /> In {b.daysUntil} day{b.daysUntil !== 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-foreground">{b.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Bookings */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Past Bookings</h2>
          <div className="bg-surface-elevated border border-border rounded-2xl divide-y divide-border">
            {pastBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-sm font-bold text-primary">
                  {b.salon.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{b.salon}</p>
                  <p className="text-xs text-text-muted">{b.service} · {b.date}</p>
                </div>
                <span className="text-sm font-semibold text-foreground hidden sm:block">{b.price}</span>
                <div className="flex items-center gap-2">
                  {!b.reviewed && (
                    <button className="text-xs px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 font-medium hover:bg-amber-200 transition dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                      <Star size={11} /> Review
                    </button>
                  )}
                  <button className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition flex items-center gap-1">
                    <RotateCcw size={11} /> Rebook
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favourites + Activity */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Favourite Salons */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Favourite Salons</h2>
              <Link href="/directory" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                Discover more <ChevronRight size={13} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {favouriteSalons.map((s) => (
                <Link key={s.id} href="/booking"
                  className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                  <div className="h-32 relative">
                    <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    <div className="absolute top-2 right-2">
                      <Heart size={18} className="text-primary fill-primary drop-shadow-sm" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground">{s.name}</h3>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-1"><MapPin size={11} /> {s.location}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-bold text-foreground">{s.rating}</span>
                      <span className="text-xs text-text-muted">({s.reviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="bg-surface-elevated border border-border rounded-2xl p-5">
              <div className="space-y-4">
                {activityFeed.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <a.icon size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{a.text}</p>
                      <p className="text-xs text-text-muted">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Recommended for You</h2>
              <p className="text-xs text-text-muted">Based on your booking history</p>
            </div>
            <Link href="/directory" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
              See all <ChevronRight size={13} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedSalons.map((s) => (
              <Link key={s.id} href="/booking"
                className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="h-36 relative">
                  <Image src={s.image} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                  <span className="absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-foreground backdrop-blur-sm">
                    {s.type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground">{s.name}</h3>
                  <p className="text-xs text-text-muted flex items-center gap-1 mt-1"><MapPin size={11} /> {s.location}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={13} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-bold text-foreground">{s.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
