"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Clock, Star, MapPin, Bell, Heart,
  User, ArrowRight, MessageSquare, Mail, Phone, Edit3, Save,
  Shield,
} from "lucide-react";

const bookings = [
  { id: 1, salon: "Glow Studio", service: "Balayage", date: "28 Mar 2026", time: "09:00", status: "upcoming", image: "💇‍♀️" },
  { id: 2, salon: "Nail Artistry", service: "Gel Manicure", date: "2 Apr 2026", time: "14:00", status: "upcoming", image: "💅" },
  { id: 3, salon: "Pure Skin Clinic", service: "Facial", date: "15 Mar 2026", time: "11:00", status: "completed", image: "✨" },
  { id: 4, salon: "Lash & Brow Bar", service: "Lash Lift", date: "8 Mar 2026", time: "10:30", status: "completed", image: "👁️" },
];

const favourites = [
  { id: 1, name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, image: "💇‍♀️" },
  { id: 2, name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, image: "✨" },
  { id: 3, name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, image: "💅" },
];

type Tab = "bookings" | "favourites" | "details" | "notifications";

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState({
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "07712 345 678",
    address: "24 Oak Lane",
    city: "London",
    postcode: "SW1A 1AA",
  });
  const [editDetails, setEditDetails] = useState({ ...details });

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Hello, {details.name.split(" ")[0]}!</h1>
              <p className="text-sm text-text-muted">Manage your bookings, favourites, and details</p>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
            <Shield size={12} /> Verified
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {[
            { key: "bookings" as Tab, label: "My Bookings", icon: Calendar },
            { key: "favourites" as Tab, label: "Favourites", icon: Heart },
            { key: "details" as Tab, label: "My Details", icon: User },
            { key: "notifications" as Tab, label: "Notifications", icon: Bell },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.key ? "bg-primary text-white" : "bg-surface-elevated text-text-muted hover:text-foreground"
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in space-y-6">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Upcoming</h2>
              {upcoming.length === 0 ? (
                <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center">
                  <Calendar size={32} className="text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">No upcoming bookings</p>
                  <Link href="/directory" className="inline-flex items-center gap-1 mt-3 text-primary font-semibold text-sm hover:underline">
                    Browse salons <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((b) => (
                    <div key={b.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-2xl">
                        {b.image}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{b.salon}</p>
                        <p className="text-sm text-text-muted">{b.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{b.date}</p>
                        <p className="text-xs text-text-muted flex items-center gap-1 justify-end"><Clock size={11} /> {b.time}</p>
                      </div>
                      <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">Upcoming</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Past Bookings</h2>
              <div className="space-y-3">
                {past.map((b) => (
                  <div key={b.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4 opacity-75">
                    <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-2xl">
                      {b.image}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{b.salon}</p>
                      <p className="text-sm text-text-muted">{b.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-text-muted">{b.date}</p>
                    </div>
                    <button className="text-xs px-3 py-1 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition">
                      Rebook
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Favourites */}
        {activeTab === "favourites" && (
          <div className="animate-fade-in grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favourites.map((f) => (
              <Link key={f.id} href="/booking"
                className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                  {f.image}
                </div>
                <h3 className="font-bold text-foreground">{f.name}</h3>
                <p className="text-sm text-text-muted flex items-center gap-1 mt-1"><MapPin size={13} /> {f.location}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-semibold text-foreground">{f.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* My Details */}
        {activeTab === "details" && (
          <div className="animate-fade-in max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">My Details</h2>
              {editing ? (
                <button onClick={() => { setDetails({ ...editDetails }); setEditing(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition">
                  <Save size={14} /> Save Changes
                </button>
              ) : (
                <button onClick={() => { setEditDetails({ ...details }); setEditing(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                  <Edit3 size={14} /> Edit Details
                </button>
              )}
            </div>

            <div className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-4">
              {editing ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <User size={16} className="text-text-muted" />
                      <input value={editDetails.name} onChange={(e) => setEditDetails({ ...editDetails, name: e.target.value })}
                        className="w-full bg-transparent text-foreground focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <Mail size={16} className="text-text-muted" />
                      <input value={editDetails.email} onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value })}
                        className="w-full bg-transparent text-foreground focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <Phone size={16} className="text-text-muted" />
                      <input value={editDetails.phone} onChange={(e) => setEditDetails({ ...editDetails, phone: e.target.value })}
                        className="w-full bg-transparent text-foreground focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <MapPin size={16} className="text-text-muted" />
                      <input value={editDetails.address} onChange={(e) => setEditDetails({ ...editDetails, address: e.target.value })}
                        className="w-full bg-transparent text-foreground focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
                      <input value={editDetails.city} onChange={(e) => setEditDetails({ ...editDetails, city: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Postcode</label>
                      <input value={editDetails.postcode} onChange={(e) => setEditDetails({ ...editDetails, postcode: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 pb-4 border-b border-border">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={28} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{details.name}</h3>
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent">
                        <Shield size={12} /> ID Verified
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-text-muted shrink-0" />
                      <span className="text-sm text-foreground">{details.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-text-muted shrink-0" />
                      <span className="text-sm text-foreground">{details.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-text-muted shrink-0" />
                      <span className="text-sm text-foreground">{details.address}, {details.city}, {details.postcode}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mt-4">
              <h3 className="font-semibold text-foreground mb-3">Change Password</h3>
              <div className="space-y-3">
                <input type="password" placeholder="Current password"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary text-sm" />
                <input type="password" placeholder="New password"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary text-sm" />
                <input type="password" placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary text-sm" />
                <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="animate-fade-in space-y-3">
            {[
              { text: "Your appointment at Glow Studio is tomorrow at 9:00 AM", time: "Just now", icon: Calendar },
              { text: "Nail Artistry has a new offer: 20% off gel nails!", time: "2 hours ago", icon: Star },
              { text: "Don't forget to leave a review for Pure Skin Clinic", time: "Yesterday", icon: MessageSquare },
            ].map((n, i) => (
              <div key={i} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-start gap-3">
                <n.icon size={18} className="text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-foreground text-sm">{n.text}</p>
                  <p className="text-xs text-text-muted mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
