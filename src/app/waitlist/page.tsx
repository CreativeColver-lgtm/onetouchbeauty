"use client";
import { useState } from "react";
import {
  Clock, Bell, X, Check, Plus, Search, MapPin,
  Calendar, User, Scissors, AlertCircle, ChevronDown,
} from "lucide-react";

interface WaitlistEntryLocal {
  id: string;
  salonName: string;
  salonLocation: string;
  serviceName: string;
  staffName: string | null;
  preferredDate: string | null;
  preferredTimeStart: string | null;
  preferredTimeEnd: string | null;
  position: number;
  status: "waiting" | "notified" | "booked" | "expired";
  createdAt: string;
  notifiedAt: string | null;
}

const mockEntries: WaitlistEntryLocal[] = [
  {
    id: "1", salonName: "Glow Studio", salonLocation: "Shoreditch, London",
    serviceName: "Balayage", staffName: "Sophie Laurent",
    preferredDate: "2026-04-05", preferredTimeStart: "10:00", preferredTimeEnd: "14:00",
    position: 3, status: "waiting", createdAt: "2026-03-28T14:30:00Z", notifiedAt: null,
  },
  {
    id: "2", salonName: "The Hair Lab", salonLocation: "Hackney, London",
    serviceName: "Keratin Treatment", staffName: null,
    preferredDate: null, preferredTimeStart: null, preferredTimeEnd: null,
    position: 1, status: "notified", createdAt: "2026-03-20T09:00:00Z", notifiedAt: "2026-03-29T16:00:00Z",
  },
  {
    id: "3", salonName: "Luxe Curls", salonLocation: "Islington, London",
    serviceName: "Natural Hair Consultation", staffName: "Aisha Williams",
    preferredDate: "2026-04-10", preferredTimeStart: "09:00", preferredTimeEnd: "12:00",
    position: 7, status: "waiting", createdAt: "2026-03-25T11:00:00Z", notifiedAt: null,
  },
];

const MOCK_SALONS = [
  { id: "s1", name: "Glow Studio", location: "Shoreditch" },
  { id: "s2", name: "The Hair Lab", location: "Hackney" },
  { id: "s3", name: "Luxe Curls", location: "Islington" },
  { id: "s4", name: "Silk & Scissors", location: "Camden" },
];

const MOCK_SERVICES = [
  "Haircut & Blow Dry", "Balayage", "Hair Colour", "Olaplex Treatment",
  "Blow Dry & Style", "Bridal Hair", "Extensions", "Keratin Treatment",
  "Natural Hair Consultation",
];

const MOCK_STAFF = [
  { id: "st1", name: "Sophie Laurent" },
  { id: "st2", name: "James Chen" },
  { id: "st3", name: "Mia Thompson" },
  { id: "st4", name: "Aisha Williams" },
];

const STATUS_CONFIG = {
  waiting: { label: "Waiting", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", icon: Clock },
  notified: { label: "Notified", color: "text-accent", bg: "bg-accent/10", icon: Bell },
  booked: { label: "Booked", color: "text-primary", bg: "bg-primary/10", icon: Check },
  expired: { label: "Expired", color: "text-text-muted", bg: "bg-surface", icon: AlertCircle },
};

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntryLocal[]>(mockEntries);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({
    salonId: "",
    service: "",
    preferredDate: "",
    preferredTimeStart: "",
    preferredTimeEnd: "",
    staffId: "",
  });
  const [joinSuccess, setJoinSuccess] = useState(false);

  const activeEntries = entries.filter((e) => e.status === "waiting" || e.status === "notified");
  const pastEntries = entries.filter((e) => e.status === "booked" || e.status === "expired");

  const cancelEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const salon = MOCK_SALONS.find((s) => s.id === joinForm.salonId);
    if (!salon || !joinForm.service) return;

    const staff = MOCK_STAFF.find((s) => s.id === joinForm.staffId);
    const newEntry: WaitlistEntryLocal = {
      id: Date.now().toString(),
      salonName: salon.name,
      salonLocation: salon.location,
      serviceName: joinForm.service,
      staffName: staff?.name || null,
      preferredDate: joinForm.preferredDate || null,
      preferredTimeStart: joinForm.preferredTimeStart || null,
      preferredTimeEnd: joinForm.preferredTimeEnd || null,
      position: Math.floor(Math.random() * 10) + 1,
      status: "waiting",
      createdAt: new Date().toISOString(),
      notifiedAt: null,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setJoinSuccess(true);
  };

  const resetJoinModal = () => {
    setShowJoinModal(false);
    setJoinSuccess(false);
    setJoinForm({ salonId: "", service: "", preferredDate: "", preferredTimeStart: "", preferredTimeEnd: "", staffId: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Waitlist</h1>
            <p className="text-text-muted text-sm">{activeEntries.length} active waitlist entr{activeEntries.length === 1 ? "y" : "ies"}</p>
          </div>
          <button
            onClick={() => setShowJoinModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
          >
            <Plus size={16} /> Join Waitlist
          </button>
        </div>

        {/* Active Entries */}
        {activeEntries.length > 0 ? (
          <div className="space-y-3 mb-8">
            {activeEntries.map((entry) => {
              const statusCfg = STATUS_CONFIG[entry.status];
              const StatusIcon = statusCfg.icon;

              return (
                <div key={entry.id} className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{entry.salonName}</h3>
                      <p className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={11} /> {entry.salonLocation}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                      <StatusIcon size={12} /> {statusCfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wide">Service</p>
                      <p className="text-sm font-semibold text-foreground">{entry.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted uppercase tracking-wide">Position</p>
                      <p className="text-sm font-semibold text-foreground">#{entry.position} in queue</p>
                    </div>
                    {entry.staffName && (
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide">Staff</p>
                        <p className="text-sm font-semibold text-foreground">{entry.staffName}</p>
                      </div>
                    )}
                    {entry.preferredDate && (
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide">Preferred</p>
                        <p className="text-sm font-semibold text-foreground">
                          {new Date(entry.preferredDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          {entry.preferredTimeStart && ` ${entry.preferredTimeStart}`}
                          {entry.preferredTimeEnd && `–${entry.preferredTimeEnd}`}
                        </p>
                      </div>
                    )}
                  </div>

                  {entry.status === "notified" && (
                    <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl mb-3">
                      <p className="text-xs text-accent font-semibold flex items-center gap-1.5">
                        <Bell size={13} />
                        A slot is available! Book now before it&apos;s taken.
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Notified {entry.notifiedAt ? new Date(entry.notifiedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "just now"}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-text-muted">
                      Joined {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div className="flex items-center gap-2">
                      {entry.status === "notified" && (
                        <a
                          href="/waitlist"
                          className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition"
                        >
                          Book Now
                        </a>
                      )}
                      <button
                        onClick={() => cancelEntry(entry.id)}
                        className="px-3 py-1.5 bg-surface border border-border text-text-muted text-xs font-medium rounded-lg hover:text-red-500 hover:border-red-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 mb-8 bg-surface-elevated border border-border rounded-2xl">
            <Clock size={48} className="mx-auto mb-3 text-text-muted opacity-30" />
            <p className="font-semibold text-foreground">No active waitlist entries</p>
            <p className="text-sm text-text-muted mb-4">Join a waitlist to get notified when a slot opens up</p>
            <button
              onClick={() => setShowJoinModal(true)}
              className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
            >
              Join Waitlist
            </button>
          </div>
        )}

        {/* Past Entries */}
        {pastEntries.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-text-muted mb-3">Past Entries</h2>
            <div className="space-y-2">
              {pastEntries.map((entry) => {
                const statusCfg = STATUS_CONFIG[entry.status];
                return (
                  <div key={entry.id} className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl opacity-60">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{entry.salonName}</p>
                      <p className="text-xs text-text-muted">{entry.serviceName}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCfg.bg} ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Join Waitlist Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetJoinModal} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={resetJoinModal}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            {joinSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">You&apos;re on the waitlist!</h3>
                <p className="text-sm text-text-muted mb-4">
                  We&apos;ll notify you as soon as a slot opens up.
                </p>
                <button
                  onClick={resetJoinModal}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Join a Waitlist</h3>
                    <p className="text-xs text-text-muted">Get notified when a slot opens up</p>
                  </div>
                </div>

                <form onSubmit={handleJoin} className="space-y-3">
                  {/* Salon */}
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Salon *</label>
                    <select
                      required
                      value={joinForm.salonId}
                      onChange={(e) => setJoinForm({ ...joinForm, salonId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a salon...</option>
                      {MOCK_SALONS.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.location}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Service *</label>
                    <select
                      required
                      value={joinForm.service}
                      onChange={(e) => setJoinForm({ ...joinForm, service: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Select a service...</option>
                      {MOCK_SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Preferred Date</label>
                    <input
                      type="date"
                      value={joinForm.preferredDate}
                      onChange={(e) => setJoinForm({ ...joinForm, preferredDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Preferred Time Range */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-text-muted mb-1 block">From</label>
                      <input
                        type="time"
                        value={joinForm.preferredTimeStart}
                        onChange={(e) => setJoinForm({ ...joinForm, preferredTimeStart: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text-muted mb-1 block">To</label>
                      <input
                        type="time"
                        value={joinForm.preferredTimeEnd}
                        onChange={(e) => setJoinForm({ ...joinForm, preferredTimeEnd: e.target.value })}
                        className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Preferred Staff */}
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1 block">Preferred Staff (optional)</label>
                    <select
                      value={joinForm.staffId}
                      onChange={(e) => setJoinForm({ ...joinForm, staffId: e.target.value })}
                      className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">No preference</option>
                      {MOCK_STAFF.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={!joinForm.salonId || !joinForm.service}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Join Waitlist
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
