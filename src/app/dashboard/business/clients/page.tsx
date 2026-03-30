"use client";
import { useState } from "react";
import {
  Search, Download, ChevronDown, ChevronUp, Plus, Star,
  Calendar, PoundSterling, User, Tag, MessageSquare, ClipboardList,
  Award, Shield, Crown, Gem, Filter,
} from "lucide-react";
import type { LoyaltyTier } from "@/types/database";

interface ClientBooking {
  id: string;
  date: string;
  service: string;
  staff: string;
  total: number;
  status: string;
}

interface ConsultationResponse {
  formName: string;
  date: string;
  summary: string;
}

interface ClientRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpendPence: number;
  lastVisit: string | null;
  tier: LoyaltyTier;
  tags: string[];
  notes: string[];
  preferences: string;
  bookings: ClientBooking[];
  consultations: ConsultationResponse[];
}

const TIER_CONFIG: Record<LoyaltyTier, { label: string; icon: typeof Award; color: string; bg: string }> = {
  bronze: { label: "Bronze", icon: Award, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
  silver: { label: "Silver", icon: Shield, color: "text-gray-500", bg: "bg-gray-100 dark:bg-gray-800/30" },
  gold: { label: "Gold", icon: Crown, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/20" },
  platinum: { label: "Platinum", icon: Gem, color: "text-violet-600", bg: "bg-violet-100 dark:bg-violet-900/20" },
};

const mockClients: ClientRow[] = [
  {
    id: "1", name: "Emma Wilson", email: "emma@example.com", phone: "07700 200001",
    totalBookings: 24, totalSpendPence: 286000, lastVisit: "2026-03-28",
    tier: "gold", tags: ["VIP", "Colour Lover"], notes: ["Prefers Sophie for colour", "Allergic to PPD dye"],
    preferences: "Morning appointments, window seat preferred",
    bookings: [
      { id: "b1", date: "2026-03-28", service: "Balayage", staff: "Sophie Laurent", total: 12000, status: "completed" },
      { id: "b2", date: "2026-03-14", service: "Haircut & Blow Dry", staff: "Sophie Laurent", total: 4500, status: "completed" },
      { id: "b3", date: "2026-02-28", service: "Olaplex Treatment", staff: "James Chen", total: 3500, status: "completed" },
    ],
    consultations: [{ formName: "Colour Consultation", date: "2026-03-28", summary: "No allergies, natural brunette, wants warm tones" }],
  },
  {
    id: "2", name: "Sarah Chen", email: "sarah.c@example.com", phone: "07700 200002",
    totalBookings: 12, totalSpendPence: 98000, lastVisit: "2026-03-25",
    tier: "silver", tags: ["Regular"], notes: ["Brings her own shampoo"],
    preferences: "Afternoon slots, quiet area",
    bookings: [
      { id: "b4", date: "2026-03-25", service: "Haircut & Blow Dry", staff: "James Chen", total: 4500, status: "completed" },
      { id: "b5", date: "2026-03-01", service: "Blow Dry & Style", staff: "Mia Thompson", total: 3000, status: "completed" },
    ],
    consultations: [],
  },
  {
    id: "3", name: "Jade Thompson", email: "jade.t@example.com", phone: "07700 200003",
    totalBookings: 38, totalSpendPence: 542000, lastVisit: "2026-03-29",
    tier: "platinum", tags: ["VIP", "Bridal", "Referrer"], notes: ["Referred 5 new clients", "Loyalty member since 2024"],
    preferences: "Saturday mornings, cappuccino on arrival",
    bookings: [
      { id: "b6", date: "2026-03-29", service: "Bridal Trial", staff: "Mia Thompson", total: 7500, status: "confirmed" },
      { id: "b7", date: "2026-03-15", service: "Extensions", staff: "Mia Thompson", total: 15000, status: "completed" },
    ],
    consultations: [{ formName: "Bridal Consultation", date: "2026-03-29", summary: "Wedding Aug 2026, wants classic updo, hair trial booked" }],
  },
  {
    id: "4", name: "Amy Roberts", email: "amy.r@example.com", phone: "07700 200004",
    totalBookings: 3, totalSpendPence: 21000, lastVisit: "2026-02-10",
    tier: "bronze", tags: ["New"], notes: [],
    preferences: "No preference",
    bookings: [
      { id: "b8", date: "2026-02-10", service: "Haircut & Blow Dry", staff: "James Chen", total: 4500, status: "completed" },
    ],
    consultations: [],
  },
];

export default function ClientsPage() {
  const [clients] = useState<ClientRow[]>(mockClients);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [clientNotes, setClientNotes] = useState<Record<string, string[]>>(
    Object.fromEntries(mockClients.map((c) => [c.id, [...c.notes]]))
  );
  const [tierFilter, setTierFilter] = useState<LoyaltyTier | "">("");

  const filtered = clients.filter((c) => {
    if (tierFilter && c.tier !== tierFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const addNote = (clientId: string) => {
    if (!newNote.trim()) return;
    setClientNotes((prev) => ({
      ...prev,
      [clientId]: [...(prev[clientId] || []), newNote.trim()],
    }));
    setNewNote("");
  };

  const exportClients = () => {
    const csv = [
      "Name,Email,Phone,Total Bookings,Total Spend (£),Last Visit,Tier,Tags",
      ...clients.map((c) =>
        `"${c.name}","${c.email}","${c.phone}",${c.totalBookings},${(c.totalSpendPence / 100).toFixed(2)},${c.lastVisit || "N/A"},${c.tier},"${c.tags.join(", ")}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clients-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Client CRM</h1>
          <p className="text-text-muted text-sm">{clients.length} clients · £{(clients.reduce((s, c) => s + c.totalSpendPence, 0) / 100).toLocaleString()} lifetime revenue</p>
        </div>
        <button
          onClick={exportClients}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface border border-border text-foreground font-semibold rounded-xl hover:border-primary/30 transition"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1 px-3 py-2.5 bg-surface border border-border rounded-xl">
          <Search size={16} className="text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or tag..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value as LoyaltyTier | "")}
          className="px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
        >
          <option value="">All Tiers</option>
          <option value="bronze">Bronze</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="platinum">Platinum</option>
        </select>
      </div>

      {/* Client Table */}
      <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-text-muted p-3">Client</th>
                <th className="text-right text-xs font-semibold text-text-muted p-3 hidden sm:table-cell">Bookings</th>
                <th className="text-right text-xs font-semibold text-text-muted p-3 hidden md:table-cell">Total Spend</th>
                <th className="text-left text-xs font-semibold text-text-muted p-3 hidden lg:table-cell">Last Visit</th>
                <th className="text-left text-xs font-semibold text-text-muted p-3 hidden md:table-cell">Tier</th>
                <th className="text-left text-xs font-semibold text-text-muted p-3 hidden lg:table-cell">Tags</th>
                <th className="text-center text-xs font-semibold text-text-muted p-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const tierCfg = TIER_CONFIG[c.tier];
                const TierIcon = tierCfg.icon;
                const isExpanded = expandedId === c.id;

                return (
                  <>
                    <tr
                      key={c.id}
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                      className="border-b border-border last:border-0 hover:bg-surface/50 transition cursor-pointer"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {c.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{c.name}</p>
                            <p className="text-xs text-text-muted">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right hidden sm:table-cell">
                        <span className="text-sm font-semibold text-foreground">{c.totalBookings}</span>
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">
                        <span className="text-sm font-semibold text-foreground">£{(c.totalSpendPence / 100).toLocaleString()}</span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs text-text-muted">
                          {c.lastVisit ? new Date(c.lastVisit).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${tierCfg.bg} ${tierCfg.color}`}>
                          <TierIcon size={11} /> {tierCfg.label}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {c.tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {isExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                      </td>
                    </tr>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <tr key={`${c.id}-detail`}>
                        <td colSpan={7} className="p-0">
                          <div className="bg-surface/50 border-b border-border p-5">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Booking history */}
                              <div>
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                                  <Calendar size={14} /> Booking History
                                </h4>
                                <div className="space-y-2">
                                  {c.bookings.map((b) => (
                                    <div key={b.id} className="flex items-center justify-between p-2 bg-surface-elevated rounded-lg">
                                      <div>
                                        <p className="text-xs font-semibold text-foreground">{b.service}</p>
                                        <p className="text-[10px] text-text-muted">{b.date} · {b.staff}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs font-bold text-foreground">£{(b.total / 100).toFixed(2)}</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                          b.status === "completed" ? "bg-accent/10 text-accent" : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
                                        }`}>{b.status}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              <div>
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                                  <MessageSquare size={14} /> Notes
                                </h4>
                                <div className="space-y-1.5 mb-3">
                                  {(clientNotes[c.id] || []).map((n, i) => (
                                    <p key={i} className="text-xs text-text-muted p-2 bg-surface-elevated rounded-lg">• {n}</p>
                                  ))}
                                  {(clientNotes[c.id] || []).length === 0 && (
                                    <p className="text-xs text-text-muted italic">No notes yet</p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <input
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addNote(c.id)}
                                    placeholder="Add a note..."
                                    className="flex-1 px-2.5 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary"
                                  />
                                  <button
                                    onClick={() => addNote(c.id)}
                                    className="px-2.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition"
                                  >
                                    <Plus size={12} />
                                  </button>
                                </div>

                                {/* Preferences */}
                                {c.preferences && (
                                  <div className="mt-3">
                                    <h5 className="text-xs font-semibold text-text-muted mb-1">Preferences</h5>
                                    <p className="text-xs text-foreground p-2 bg-surface-elevated rounded-lg">{c.preferences}</p>
                                  </div>
                                )}
                              </div>

                              {/* Consultation responses */}
                              <div>
                                <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                                  <ClipboardList size={14} /> Consultation Forms
                                </h4>
                                {c.consultations.length > 0 ? (
                                  <div className="space-y-2">
                                    {c.consultations.map((cr, i) => (
                                      <div key={i} className="p-2 bg-surface-elevated rounded-lg">
                                        <p className="text-xs font-semibold text-foreground">{cr.formName}</p>
                                        <p className="text-[10px] text-text-muted mb-1">{cr.date}</p>
                                        <p className="text-xs text-text-muted">{cr.summary}</p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs text-text-muted italic">No consultation responses</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            <User size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No clients found</p>
            <p className="text-sm">Clients will appear here once they book</p>
          </div>
        )}
      </div>
    </div>
  );
}
