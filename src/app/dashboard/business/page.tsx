"use client";
import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, PoundSterling, Calendar, Users, Star,
  Eye, BarChart3, Clock, Edit3, MessageSquare, Scissors, ArrowUpRight,
  ChevronRight, MapPin, Zap, QrCode, CalendarDays, Mail,
} from "lucide-react";

/* ── mock data ── */
const revenueCards = [
  { label: "This Month", value: "£2,340", change: "+18%", up: true },
  { label: "Last Month", value: "£1,980", change: "+7%", up: true },
  { label: "Bookings", value: "48", change: "+12%", up: true },
  { label: "Profile Views", value: "1,247", change: "-3%", up: false },
];

const weeklyBookings = [
  { day: "Mon", count: 6 },
  { day: "Tue", count: 9 },
  { day: "Wed", count: 12 },
  { day: "Thu", count: 8 },
  { day: "Fri", count: 14 },
  { day: "Sat", count: 18 },
  { day: "Sun", count: 3 },
];

const profileViews = [320, 280, 350, 310, 390, 420, 400, 370, 450, 480, 430, 460, 500, 470];

const popularServices = [
  { name: "Balayage", bookings: 38, pct: 92 },
  { name: "Haircut & Blow Dry", bookings: 32, pct: 78 },
  { name: "Hair Colour", bookings: 24, pct: 58 },
  { name: "Olaplex Treatment", bookings: 18, pct: 44 },
  { name: "Blow Dry & Style", bookings: 14, pct: 34 },
];

const peakHoursData = [
  //  9, 10, 11, 12, 13, 14, 15, 16, 17
  [2, 3, 4, 2, 1, 3, 4, 3, 2], // Mon
  [3, 4, 5, 3, 1, 4, 5, 4, 3], // Tue
  [4, 5, 5, 4, 2, 5, 5, 4, 3], // Wed
  [3, 4, 4, 3, 1, 3, 4, 3, 2], // Thu
  [5, 5, 5, 4, 2, 5, 5, 5, 4], // Fri
  [5, 5, 5, 5, 3, 5, 5, 4, 0], // Sat
  [1, 2, 2, 1, 0, 0, 0, 0, 0], // Sun
];
const peakDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const peakHours = ["9am", "10", "11", "12", "1pm", "2", "3", "4", "5"];

const recentBookings = [
  { id: 1, client: "Emma Wilson", service: "Balayage", time: "09:00", date: "Today", price: "£120", status: "confirmed" },
  { id: 2, client: "Sarah Chen", service: "Haircut & Blow Dry", time: "11:30", date: "Today", price: "£45", status: "confirmed" },
  { id: 3, client: "Jade Thompson", service: "Hair Colour", time: "14:00", date: "Today", price: "£85", status: "pending" },
  { id: 4, client: "Amy Roberts", service: "Blow Dry", time: "09:30", date: "Tomorrow", price: "£30", status: "confirmed" },
  { id: 5, client: "Lisa Patel", service: "Bridal Trial", time: "11:00", date: "Tomorrow", price: "£75", status: "confirmed" },
  { id: 6, client: "Rachel Green", service: "Olaplex", time: "15:00", date: "Tomorrow", price: "£35", status: "pending" },
];

const acquisitionSources = [
  { source: "Direct Search", pct: 42, color: "bg-primary" },
  { source: "Google / SEO", pct: 28, color: "bg-secondary" },
  { source: "Referral", pct: 18, color: "bg-accent" },
  { source: "Social Media", pct: 12, color: "bg-amber-400" },
];

const ratingBreakdown = [
  { stars: 5, count: 156, pct: 67 },
  { stars: 4, count: 52, pct: 22 },
  { stars: 3, count: 18, pct: 8 },
  { stars: 2, count: 5, pct: 2 },
  { stars: 1, count: 3, pct: 1 },
];

const quickActions = [
  { label: "Edit Profile", icon: Edit3, href: "/dashboard/business", color: "bg-primary/10 text-primary" },
  { label: "Calendar", icon: CalendarDays, href: "/dashboard/business/calendar", color: "bg-secondary/10 text-secondary" },
  { label: "Reviews", icon: MessageSquare, href: "/dashboard/business", color: "bg-accent/10 text-accent" },
  { label: "Services", icon: Scissors, href: "/dashboard/business", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30" },
  { label: "Marketing", icon: Mail, href: "/dashboard/business/marketing", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30" },
  { label: "QR Check-In", icon: QrCode, href: "/dashboard/business/qr", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30" },
];

/* ── helpers ── */
function heatColor(v: number) {
  if (v === 0) return "bg-surface";
  if (v <= 1) return "bg-primary/10";
  if (v <= 2) return "bg-primary/20";
  if (v <= 3) return "bg-primary/40";
  if (v <= 4) return "bg-primary/60";
  return "bg-primary/90";
}

export default function BusinessDashboard() {
  const maxBooking = Math.max(...weeklyBookings.map((b) => b.count));
  const svgW = 600;
  const svgH = 120;
  const step = svgW / (profileViews.length - 1);
  const maxView = Math.max(...profileViews);
  const points = profileViews.map((v, i) => `${i * step},${svgH - (v / maxView) * (svgH - 10)}`).join(" ");
  const areaPath = `M0,${svgH} ${profileViews.map((v, i) => `L${i * step},${svgH - (v / maxView) * (svgH - 10)}`).join(" ")} L${(profileViews.length - 1) * step},${svgH} Z`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
            <p className="text-text-muted">Welcome back, Glow Studio — here&apos;s your overview</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">Hair Salon</span>
            <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1"><MapPin size={11} /> Shoreditch</span>
          </div>
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {revenueCards.map((c) => (
            <div key={c.label} className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <PoundSterling size={18} className="text-primary" />
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                  c.up ? "bg-accent/10 text-accent" : "bg-red-100 text-red-500 dark:bg-red-900/30"
                }`}>
                  {c.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {c.change}
                </span>
              </div>
              <p className="text-2xl font-extrabold text-foreground">{c.value}</p>
              <p className="text-sm text-text-muted">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href}
              className="flex flex-col items-center gap-2 p-4 bg-surface-elevated border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.color}`}>
                <a.icon size={18} />
              </div>
              <span className="text-xs font-semibold text-foreground text-center">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Bookings */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Weekly Bookings</h3>
                <p className="text-xs text-text-muted">This week vs last week</p>
              </div>
              <BarChart3 size={18} className="text-text-muted" />
            </div>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyBookings.map((b) => (
                <div key={b.day} className="flex flex-col items-center gap-1 flex-1">
                  <span className="text-xs font-bold text-foreground">{b.count}</span>
                  <div className="w-full rounded-t-lg bg-primary/20 relative overflow-hidden" style={{ height: `${(b.count / maxBooking) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg" />
                  </div>
                  <span className="text-xs text-text-muted font-medium">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Views */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-foreground">Profile Views</h3>
                <p className="text-xs text-text-muted">Last 14 days</p>
              </div>
              <div className="flex items-center gap-1 text-accent text-xs font-semibold">
                <TrendingUp size={13} /> +24%
              </div>
            </div>
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-32" preserveAspectRatio="none">
              <defs>
                <linearGradient id="viewGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#viewGrad)" />
              <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Middle Row: Services + Peak Hours */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Services */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground">Popular Services</h3>
              <Scissors size={18} className="text-text-muted" />
            </div>
            <div className="space-y-4">
              {popularServices.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-text-muted">{s.bookings} bookings</span>
                  </div>
                  <div className="h-2.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Hours Heatmap */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground">Peak Hours</h3>
              <Clock size={18} className="text-text-muted" />
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[320px]">
                {/* Header */}
                <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `48px repeat(${peakHours.length}, 1fr)` }}>
                  <div />
                  {peakHours.map((h) => (
                    <div key={h} className="text-center text-[10px] text-text-muted font-medium">{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {peakDays.map((day, di) => (
                  <div key={day} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `48px repeat(${peakHours.length}, 1fr)` }}>
                    <div className="text-xs text-text-muted font-medium flex items-center">{day}</div>
                    {peakHoursData[di].map((v, hi) => (
                      <div key={hi} className={`h-7 rounded-md ${heatColor(v)} transition-colors`} title={`${day} ${peakHours[hi]}: ${v}/5`} />
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 justify-end">
                  <span className="text-[10px] text-text-muted">Quiet</span>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <div key={v} className={`w-4 h-4 rounded ${heatColor(v)}`} />
                  ))}
                  <span className="text-[10px] text-text-muted">Busy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Bookings + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-surface-elevated border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-foreground">Recent Bookings</h3>
              <Link href="/dashboard/business/calendar" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                View all <ChevronRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl hover:bg-surface/80 transition">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {b.client.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{b.client}</p>
                    <p className="text-xs text-text-muted">{b.service}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-text-muted">{b.date}</p>
                    <p className="text-sm font-semibold text-foreground">{b.time}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">{b.price}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    b.status === "confirmed" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                  }`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Acquisition + Ratings */}
          <div className="space-y-6">
            {/* Client Acquisition */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Client Sources</h3>
              <div className="space-y-3">
                {acquisitionSources.map((s) => (
                  <div key={s.source}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{s.source}</span>
                      <span className="text-sm font-bold text-foreground">{s.pct}%</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Summary */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Rating Summary</h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-extrabold text-foreground">4.8</span>
                <div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className={s <= 4 ? "text-amber-400 fill-amber-400" : "text-amber-400 fill-amber-400/40"} />
                    ))}
                  </div>
                  <p className="text-xs text-text-muted">234 reviews</p>
                </div>
              </div>
              <div className="space-y-2">
                {ratingBreakdown.map((r) => (
                  <div key={r.stars} className="flex items-center gap-2">
                    <span className="text-xs text-text-muted w-3">{r.stars}</span>
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${r.pct}%` }} />
                    </div>
                    <span className="text-xs text-text-muted w-8 text-right">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
