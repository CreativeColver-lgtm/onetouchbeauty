"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Calendar, Clock, Users, Star, Bell, Settings,
  Plus, X, ChevronLeft, ChevronRight, Coffee, Palmtree, Check,
  BarChart3, Eye, Edit3, Save, Trash2, Building2, MapPin, Phone, Mail,
  PoundSterling, ExternalLink, Shield, Globe, Award, Scissors,
} from "lucide-react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const initialBookings = [
  { id: 1, client: "Emma Wilson", service: "Balayage", time: "09:00", duration: 150, date: "Today", status: "confirmed" },
  { id: 2, client: "Sarah Chen", service: "Haircut & Blow Dry", time: "12:00", duration: 60, date: "Today", status: "confirmed" },
  { id: 3, client: "Jade Thompson", service: "Hair Colour", time: "14:30", duration: 120, date: "Today", status: "pending" },
  { id: 4, client: "Amy Roberts", service: "Blow Dry", time: "09:30", duration: 45, date: "Tomorrow", status: "confirmed" },
  { id: 5, client: "Lisa Patel", service: "Bridal Trial", time: "11:00", duration: 90, date: "Tomorrow", status: "confirmed" },
];

const stats = [
  { label: "Bookings This Week", value: "23", change: "+12%", icon: Calendar },
  { label: "Total Clients", value: "156", change: "+8%", icon: Users },
  { label: "Average Rating", value: "4.9", change: "+0.1", icon: Star },
  { label: "Profile Views", value: "1.2k", change: "+24%", icon: Eye },
];

const initialNotifications = [
  { id: 1, text: "New booking from Emma Wilson", time: "2 mins ago", read: false },
  { id: 2, text: "Review from Sarah Chen: 5 stars", time: "1 hour ago", read: false },
  { id: 3, text: "Reminder: Jade Thompson at 2:30 PM", time: "3 hours ago", read: true },
];

interface Treatment {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
}

interface OpeningHour {
  day: string;
  open: boolean;
  start: string;
  end: string;
}

type Tab = "overview" | "details" | "treatments" | "hours" | "calendar" | "bookings" | "breaks" | "notifications" | "preview";

function getDaysInMonth(year: number, month: number) {
  const days: { date: number; isCurrentMonth: boolean }[] = [];
  const firstDay = new Date(year, month, 1).getDay();
  const adjusted = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < adjusted; i++) days.push({ date: 0, isCurrentMonth: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ date: i, isCurrentMonth: true });
  return days;
}

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Business Details
  const [editingDetails, setEditingDetails] = useState(false);
  const [details, setDetails] = useState({
    name: "Glow Studio",
    type: "Hair Salon",
    email: "hello@glowstudio.co.uk",
    phone: "020 1234 5678",
    address: "42 Shoreditch High St",
    city: "London",
    postcode: "E1 6JJ",
    about: "Award-winning hair salon specialising in colour, balayage, and styling. Our team of expert stylists are passionate about helping you look and feel your best.",
  });
  const [editDetails, setEditDetails] = useState({ ...details });

  // Treatments
  const [treatments, setTreatments] = useState<Treatment[]>([
    { id: 1, name: "Women's Haircut & Blow Dry", duration: 60, price: 45, category: "Hair" },
    { id: 2, name: "Men's Haircut", duration: 30, price: 25, category: "Hair" },
    { id: 3, name: "Hair Colour (Full Head)", duration: 120, price: 85, category: "Colour" },
    { id: 4, name: "Balayage", duration: 150, price: 120, category: "Colour" },
    { id: 5, name: "Blow Dry & Style", duration: 45, price: 30, category: "Hair" },
    { id: 6, name: "Olaplex Treatment", duration: 30, price: 35, category: "Treatment" },
    { id: 7, name: "Bridal Hair Trial", duration: 90, price: 75, category: "Bridal" },
  ]);
  const [showAddTreatment, setShowAddTreatment] = useState(false);
  const [newTreatment, setNewTreatment] = useState({ name: "", duration: 30, price: 0, category: "Hair" });
  const [editingTreatmentId, setEditingTreatmentId] = useState<number | null>(null);

  // Opening Hours
  const [hours, setHours] = useState<OpeningHour[]>([
    { day: "Monday", open: true, start: "09:00", end: "18:00" },
    { day: "Tuesday", open: true, start: "09:00", end: "18:00" },
    { day: "Wednesday", open: true, start: "09:00", end: "20:00" },
    { day: "Thursday", open: true, start: "09:00", end: "20:00" },
    { day: "Friday", open: true, start: "09:00", end: "18:00" },
    { day: "Saturday", open: true, start: "09:00", end: "17:00" },
    { day: "Sunday", open: false, start: "10:00", end: "16:00" },
  ]);

  // Breaks
  const [breaks, setBreaks] = useState([
    { id: 1, type: "break", name: "Lunch Break", day: "Every Day", time: "13:00 - 14:00" },
    { id: 2, type: "holiday", name: "Easter Holiday", day: "18 Apr - 21 Apr", time: "All Day" },
  ]);
  const [showAddBreak, setShowAddBreak] = useState(false);

  const days = getDaysInMonth(currentYear, currentMonth);

  const tabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "details", label: "My Details", icon: Building2 },
    { key: "treatments", label: "Treatments", icon: PoundSterling },
    { key: "hours", label: "Opening Hours", icon: Clock },
    { key: "calendar", label: "Calendar", icon: Calendar },
    { key: "bookings", label: "Bookings", icon: Users },
    { key: "breaks", label: "Breaks", icon: Coffee },
    { key: "notifications", label: "Alerts", icon: Bell },
    { key: "preview", label: "Preview Profile", icon: Eye },
  ];

  const addTreatment = () => {
    if (!newTreatment.name || !newTreatment.price) return;
    setTreatments((prev) => [...prev, { ...newTreatment, id: Date.now() }]);
    setNewTreatment({ name: "", duration: 30, price: 0, category: "Hair" });
    setShowAddTreatment(false);
  };

  const deleteTreatment = (id: number) => {
    setTreatments((prev) => prev.filter((t) => t.id !== id));
  };

  const updateHour = (index: number, field: keyof OpeningHour, value: string | boolean) => {
    setHours((prev) => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
            <p className="text-text-muted">Welcome back, {details.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">{details.type}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.key ? "bg-primary text-white" : "bg-surface-elevated text-text-muted hover:text-foreground"
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-surface-elevated border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={20} className="text-primary" />
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{stat.change}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Today&apos;s Appointments</h3>
                <div className="space-y-3">
                  {initialBookings.filter((b) => b.date === "Today").map((b) => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{b.client}</p>
                        <p className="text-xs text-text-muted">{b.service} &bull; {b.duration} mins</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">{b.time}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === "confirmed" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                        }`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Recent Notifications</h3>
                <div className="space-y-3">
                  {initialNotifications.map((n) => (
                    <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.read ? "bg-surface" : "bg-primary/5 border border-primary/10"}`}>
                      <Bell size={16} className={`mt-0.5 ${n.read ? "text-text-muted" : "text-primary"}`} />
                      <div className="flex-1">
                        <p className={`text-sm ${n.read ? "text-text-muted" : "text-foreground font-medium"}`}>{n.text}</p>
                        <p className="text-xs text-text-muted mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Details */}
        {activeTab === "details" && (
          <div className="animate-fade-in max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Business Details</h2>
              {editingDetails ? (
                <button onClick={() => { setDetails({ ...editDetails }); setEditingDetails(false); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition">
                  <Save size={14} /> Save Changes
                </button>
              ) : (
                <button onClick={() => { setEditDetails({ ...details }); setEditingDetails(true); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                  <Edit3 size={14} /> Edit Details
                </button>
              )}
            </div>

            <div className="bg-surface-elevated border border-border rounded-2xl p-6 space-y-4">
              {editingDetails ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Business Name</label>
                    <input value={editDetails.name} onChange={(e) => setEditDetails({ ...editDetails, name: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Salon Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {["Hair Salon", "Nail Salon", "Beauty Salon", "Barbershop", "Spa & Wellness", "Makeup Studio",
                        "Lash & Brow Bar", "Skin Clinic", "Mobile Beautician", "Home-Based Salon", "Tanning Salon", "Massage Therapist",
                      ].map((type) => (
                        <button key={type} type="button" onClick={() => setEditDetails({ ...editDetails, type })}
                          className={`px-3 py-2 rounded-xl text-xs font-medium transition border ${
                            editDetails.type === type ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-foreground hover:border-primary/50"
                          }`}>{type}</button>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                      <input value={editDetails.email} onChange={(e) => setEditDetails({ ...editDetails, email: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                      <input value={editDetails.phone} onChange={(e) => setEditDetails({ ...editDetails, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                    <input value={editDetails.address} onChange={(e) => setEditDetails({ ...editDetails, address: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
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
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">About</label>
                    <textarea value={editDetails.about} onChange={(e) => setEditDetails({ ...editDetails, about: e.target.value })}
                      rows={4} className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary resize-none" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Building2 size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{details.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{details.type}</span>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-text-muted" />
                      <span className="text-sm text-foreground">{details.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-text-muted" />
                      <span className="text-sm text-foreground">{details.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <MapPin size={16} className="text-text-muted" />
                      <span className="text-sm text-foreground">{details.address}, {details.city}, {details.postcode}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-1">About</p>
                    <p className="text-sm text-text-muted">{details.about}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Treatments & Pricing */}
        {activeTab === "treatments" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Treatments & Pricing</h2>
                <p className="text-sm text-text-muted">{treatments.length} treatments listed</p>
              </div>
              <button onClick={() => setShowAddTreatment(!showAddTreatment)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                <Plus size={16} /> Add Treatment
              </button>
            </div>

            {/* Add Treatment Form */}
            {showAddTreatment && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">New Treatment</h3>
                  <button onClick={() => setShowAddTreatment(false)}><X size={18} className="text-text-muted" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Treatment Name</label>
                    <input value={newTreatment.name} onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
                      placeholder="e.g. Gel Manicure" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Price (£)</label>
                    <input type="number" value={newTreatment.price || ""} onChange={(e) => setNewTreatment({ ...newTreatment, price: Number(e.target.value) })}
                      placeholder="0.00" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Duration (mins)</label>
                    <select value={newTreatment.duration} onChange={(e) => setNewTreatment({ ...newTreatment, duration: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary">
                      {[15, 30, 45, 60, 75, 90, 120, 150, 180].map((d) => (
                        <option key={d} value={d}>{d} mins</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                    <select value={newTreatment.category} onChange={(e) => setNewTreatment({ ...newTreatment, category: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:border-primary">
                      {["Hair", "Colour", "Nails", "Face", "Body", "Lashes", "Brows", "Makeup", "Bridal", "Treatment", "Other"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button onClick={addTreatment}
                  className="mt-4 px-5 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition flex items-center gap-1.5">
                  <Check size={14} /> Add Treatment
                </button>
              </div>
            )}

            {/* Treatments List */}
            <div className="space-y-3">
              {treatments.map((t) => (
                <div key={t.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <PoundSterling size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.name}</p>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                      <span className="flex items-center gap-1"><Clock size={11} /> {t.duration} mins</span>
                      <span className="px-2 py-0.5 rounded-full bg-surface border border-border">{t.category}</span>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">£{t.price}</p>
                  <button onClick={() => deleteTreatment(t.id)}
                    className="p-2 text-text-muted hover:text-red-400 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {activeTab === "hours" && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-lg font-bold text-foreground mb-6">Opening Hours</h2>
            <div className="bg-surface-elevated border border-border rounded-2xl p-5">
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div key={h.day} className={`flex items-center gap-4 p-3 rounded-xl transition ${h.open ? "bg-surface" : "bg-surface opacity-50"}`}>
                    <label className="flex items-center gap-3 w-32 shrink-0 cursor-pointer">
                      <input type="checkbox" checked={h.open} onChange={(e) => updateHour(i, "open", e.target.checked)}
                        className="w-4 h-4 accent-primary rounded" />
                      <span className={`text-sm font-semibold ${h.open ? "text-foreground" : "text-text-muted"}`}>{h.day}</span>
                    </label>
                    {h.open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="time" value={h.start} onChange={(e) => updateHour(i, "start", e.target.value)}
                          className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
                        <span className="text-text-muted text-sm">to</span>
                        <input type="time" value={h.end} onChange={(e) => updateHour(i, "end", e.target.value)}
                          className="px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" />
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted italic">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        {activeTab === "calendar" && (
          <div className="animate-fade-in">
            <div className="bg-surface-elevated border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); }}
                  className="p-2 hover:bg-surface rounded-lg transition"><ChevronLeft size={18} /></button>
                <h3 className="font-bold text-foreground text-lg">{months[currentMonth]} {currentYear}</h3>
                <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); }}
                  className="p-2 hover:bg-surface rounded-lg transition"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {days.map((d, i) => (
                  <div key={i} className={`min-h-[80px] p-2 rounded-lg border text-sm ${
                    d.isCurrentMonth ? "border-border bg-surface-elevated" : "invisible"
                  }`}>
                    {d.isCurrentMonth && (
                      <>
                        <span className="font-medium text-foreground">{d.date}</span>
                        {d.date === new Date().getDate() && currentMonth === new Date().getMonth() && (
                          <div className="mt-1 space-y-0.5">
                            <div className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary truncate">9:00 Balayage</div>
                            <div className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary truncate">12:00 Haircut</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === "bookings" && (
          <div className="animate-fade-in space-y-3">
            <h2 className="text-lg font-bold text-foreground mb-4">All Upcoming Bookings</h2>
            {initialBookings.map((b) => (
              <div key={b.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{b.client}</p>
                  <p className="text-sm text-text-muted">{b.service} &bull; {b.duration} mins</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted">{b.date}</p>
                  <p className="font-semibold text-foreground">{b.time}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  b.status === "confirmed" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30"
                }`}>{b.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Breaks & Holidays */}
        {activeTab === "breaks" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Breaks & Holidays</h2>
              <button onClick={() => setShowAddBreak(!showAddBreak)}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                <Plus size={16} /> Add Break / Holiday
              </button>
            </div>
            {showAddBreak && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Add new</h3>
                  <button onClick={() => setShowAddBreak(false)}><X size={18} className="text-text-muted" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                    <select className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary">
                      <option>Break</option><option>Holiday</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                    <input placeholder="e.g. Lunch break" className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Date / Recurrence</label>
                    <input placeholder="e.g. Every Day, 18 Apr - 21 Apr" className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Time</label>
                    <input placeholder="e.g. 13:00 - 14:00 or All Day" className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <button onClick={() => { setShowAddBreak(false); setBreaks((prev) => [...prev, { id: Date.now(), type: "break", name: "New Break", day: "Custom", time: "TBD" }]); }}
                  className="mt-4 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">Save</button>
              </div>
            )}
            <div className="space-y-3">
              {breaks.map((b) => (
                <div key={b.id} className="bg-surface-elevated border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    b.type === "break" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-accent/10"
                  }`}>
                    {b.type === "break" ? <Coffee size={18} className="text-amber-600" /> : <Palmtree size={18} className="text-accent" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{b.name}</p>
                    <p className="text-sm text-text-muted">{b.day} &bull; {b.time}</p>
                  </div>
                  <button onClick={() => setBreaks((prev) => prev.filter((x) => x.id !== b.id))}
                    className="text-text-muted hover:text-red-400 transition"><X size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="animate-fade-in space-y-3">
            <h2 className="text-lg font-bold text-foreground mb-4">Notifications</h2>
            {initialNotifications.map((n) => (
              <div key={n.id} className={`flex items-start gap-3 p-4 rounded-xl border transition ${
                n.read ? "bg-surface-elevated border-border" : "bg-primary/5 border-primary/10"
              }`}>
                <Bell size={18} className={`mt-0.5 ${n.read ? "text-text-muted" : "text-primary"}`} />
                <div className="flex-1">
                  <p className={`${n.read ? "text-text-muted" : "text-foreground font-medium"}`}>{n.text}</p>
                  <p className="text-xs text-text-muted mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Profile */}
        {activeTab === "preview" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Profile Preview</h2>
                <p className="text-sm text-text-muted">This is how clients see your business page</p>
              </div>
              <Link href="/salon/1" target="_blank"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                <ExternalLink size={14} /> Open Full Page
              </Link>
            </div>

            {/* Preview Card */}
            <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
              {/* Mini Banner */}
              <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center">
                <span className="text-4xl">💇‍♀️</span>
              </div>

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">{details.name}</h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                    <Shield size={10} /> Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-primary font-medium">{details.type}</span>
                </div>
                <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                  <MapPin size={13} /> {details.address}, {details.city}, {details.postcode}
                </p>

                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star size={15} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-foreground">4.9</span>
                    <span className="text-sm text-text-muted">(234 reviews)</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
                    <Award size={11} /> Est. 2019
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted flex items-center gap-1">
                    <Scissors size={11} /> {treatments.length} treatments
                  </span>
                </div>

                {/* About */}
                <div className="mt-5 pt-5 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-2">About</h4>
                  <p className="text-sm text-text-muted leading-relaxed">{details.about}</p>
                </div>

                {/* Treatments Preview */}
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">Treatments & Prices</h4>
                    <span className="text-xs text-text-muted">{treatments.length} listed</span>
                  </div>
                  <div className="divide-y divide-border">
                    {treatments.slice(0, 5).map((t) => (
                      <div key={t.id} className="flex items-center justify-between py-2.5">
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <span className="text-xs text-text-muted">{t.duration} mins &bull; {t.category}</span>
                        </div>
                        <span className="font-bold text-foreground">£{t.price}</span>
                      </div>
                    ))}
                    {treatments.length > 5 && (
                      <p className="text-xs text-primary font-medium pt-2">+ {treatments.length - 5} more treatments</p>
                    )}
                  </div>
                </div>

                {/* Opening Hours Preview */}
                <div className="mt-5 pt-5 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Opening Hours</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {hours.map((h) => (
                      <div key={h.day} className="flex items-center justify-between text-sm text-text-muted">
                        <span>{h.day.substring(0, 3)}</span>
                        <span className={!h.open ? "text-red-400" : ""}>{h.open ? `${h.start} - ${h.end}` : "Closed"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Preview */}
                <div className="mt-5 pt-5 border-t border-border">
                  <h4 className="font-semibold text-foreground mb-3">Contact</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-text-muted flex items-center gap-2"><Phone size={14} className="text-primary" /> {details.phone}</p>
                    <p className="text-sm text-text-muted flex items-center gap-2"><Mail size={14} className="text-primary" /> {details.email}</p>
                    <p className="text-sm text-text-muted flex items-center gap-2"><MapPin size={14} className="text-primary" /> {details.address}, {details.city}, {details.postcode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
