"use client";
import { useState } from "react";
import {
  Plus, X, Send, Clock, Eye, Users, BarChart3,
  Mail, MessageSquare, Calendar, ChevronRight, Sparkles,
  Target, Tag, Crown, Filter,
} from "lucide-react";
import CampaignBuilder from "@/components/CampaignBuilder";
import type { CampaignStatus, LoyaltyTier } from "@/types/database";

interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms";
  subject: string;
  body: string;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  recipients: number;
  opened: number;
  clicked: number;
  audience: {
    lastVisitDays: number | null;
    serviceCategory: string | null;
    tier: LoyaltyTier | null;
    tags: string[];
  };
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: "text-text-muted", bg: "bg-surface" },
  scheduled: { label: "Scheduled", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  sending: { label: "Sending", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
  sent: { label: "Sent", color: "text-accent", bg: "bg-accent/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
};

const mockCampaigns: Campaign[] = [
  {
    id: "1", name: "Spring Colour Sale", type: "email",
    subject: "🌸 20% off all colour services this spring!",
    body: "Hi {{first_name}},\n\nSpring is here and we're celebrating with 20% off all colour services at {{business_name}}!\n\nBook before April 15th to claim your discount.",
    status: "sent", scheduledAt: null, sentAt: "2026-03-15T10:00:00Z",
    recipients: 312, opened: 186, clicked: 64,
    audience: { lastVisitDays: 90, serviceCategory: "Colour", tier: null, tags: [] },
  },
  {
    id: "2", name: "VIP Loyalty Reward", type: "email",
    subject: "Exclusive offer for our Gold & Platinum members ✨",
    body: "Hi {{first_name}},\n\nAs one of our most valued clients, we'd like to offer you a complimentary Olaplex treatment with your next booking.\n\nUse code VIP2026 when booking.",
    status: "scheduled", scheduledAt: "2026-04-01T09:00:00Z", sentAt: null,
    recipients: 45, opened: 0, clicked: 0,
    audience: { lastVisitDays: null, serviceCategory: null, tier: "gold", tags: ["VIP"] },
  },
  {
    id: "3", name: "Win Back Campaign", type: "email",
    subject: "We miss you! Come back for 15% off",
    body: "Hi {{first_name}},\n\nWe haven't seen you in a while and we'd love to welcome you back to {{business_name}}.\n\nEnjoy 15% off your next visit — we can't wait to see you again!",
    status: "draft", scheduledAt: null, sentAt: null,
    recipients: 0, opened: 0, clicked: 0,
    audience: { lastVisitDays: 60, serviceCategory: null, tier: null, tags: [] },
  },
  {
    id: "4", name: "Mother's Day Special", type: "sms",
    subject: "",
    body: "Treat mum to a pamper day at Glow Studio! Mother's Day packages from £75. Book now: onetouchbeauty.co.uk/booking",
    status: "sent", scheduledAt: null, sentAt: "2026-03-20T08:00:00Z",
    recipients: 428, opened: 0, clicked: 38,
    audience: { lastVisitDays: null, serviceCategory: null, tier: null, tags: [] },
  },
];

const SERVICE_CATEGORIES = ["Cuts", "Colour", "Styling", "Treatments", "Bridal", "Extensions"];

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [showBuilder, setShowBuilder] = useState(false);
  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "">("");

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "email" as "email" | "sms",
    scheduledAt: "",
    audience: { lastVisitDays: null as number | null, serviceCategory: null as string | null, tier: null as LoyaltyTier | null, tags: [] as string[] },
  });

  const filtered = statusFilter
    ? campaigns.filter((c) => c.status === statusFilter)
    : campaigns;

  const handleSaveCampaign = ({ subject, content }: { subject: string; content: string }) => {
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name || subject.slice(0, 40),
      type: newCampaign.type,
      subject,
      body: content,
      status: newCampaign.scheduledAt ? "scheduled" : "draft",
      scheduledAt: newCampaign.scheduledAt || null,
      sentAt: null,
      recipients: 0,
      opened: 0,
      clicked: 0,
      audience: newCampaign.audience,
    };
    setCampaigns((prev) => [campaign, ...prev]);
    setShowBuilder(false);
    setNewCampaign({ name: "", type: "email", scheduledAt: "", audience: { lastVisitDays: null, serviceCategory: null, tier: null, tags: [] } });
  };

  const statusCounts = {
    all: campaigns.length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    scheduled: campaigns.filter((c) => c.status === "scheduled").length,
    sent: campaigns.filter((c) => c.status === "sent").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
          <p className="text-text-muted text-sm">Create and manage email & SMS marketing campaigns</p>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
        >
          <Plus size={16} /> New Campaign
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Campaigns", value: campaigns.length, icon: Sparkles, color: "text-primary" },
          { label: "Total Recipients", value: campaigns.reduce((s, c) => s + c.recipients, 0).toLocaleString(), icon: Users, color: "text-secondary" },
          { label: "Avg Open Rate", value: `${campaigns.filter((c) => c.recipients > 0).length > 0 ? Math.round(campaigns.filter((c) => c.recipients > 0).reduce((s, c) => s + (c.opened / c.recipients) * 100, 0) / campaigns.filter((c) => c.recipients > 0).length) : 0}%`, icon: Eye, color: "text-accent" },
          { label: "Total Clicks", value: campaigns.reduce((s, c) => s + c.clicked, 0), icon: Target, color: "text-amber-500" },
        ].map((card) => (
          <div key={card.label} className="bg-surface-elevated border border-border rounded-2xl p-5">
            <card.icon size={18} className={`${card.color} mb-2`} />
            <p className="text-2xl font-extrabold text-foreground">{card.value}</p>
            <p className="text-xs text-text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: "", label: `All (${statusCounts.all})` },
          { key: "draft", label: `Drafts (${statusCounts.draft})` },
          { key: "scheduled", label: `Scheduled (${statusCounts.scheduled})` },
          { key: "sent", label: `Sent (${statusCounts.sent})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as CampaignStatus | "")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              statusFilter === tab.key ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign list */}
      <div className="space-y-3">
        {filtered.map((c) => {
          const cfg = STATUS_CONFIG[c.status];
          return (
            <div
              key={c.id}
              onClick={() => setViewingCampaign(c)}
              className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    c.type === "email" ? "bg-primary/10" : "bg-accent/10"
                  }`}>
                    {c.type === "email" ? <Mail size={18} className="text-primary" /> : <MessageSquare size={18} className="text-accent" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{c.name}</h3>
                    {c.subject && <p className="text-xs text-text-muted truncate max-w-md">{c.subject}</p>}
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {c.scheduledAt && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(c.scheduledAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {c.status === "sent" && (
                  <div className="flex items-center gap-4 text-center">
                    <div>
                      <p className="text-sm font-bold text-foreground">{c.recipients}</p>
                      <p className="text-[10px] text-text-muted">Sent</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{c.recipients > 0 ? Math.round((c.opened / c.recipients) * 100) : 0}%</p>
                      <p className="text-[10px] text-text-muted">Opened</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{c.recipients > 0 ? Math.round((c.clicked / c.recipients) * 100) : 0}%</p>
                      <p className="text-[10px] text-text-muted">Clicked</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <Mail size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No campaigns found</p>
          <p className="text-sm">Create your first campaign to start marketing</p>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {viewingCampaign && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingCampaign(null)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl mb-8">
            <button
              onClick={() => setViewingCampaign(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-1">{viewingCampaign.name}</h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[viewingCampaign.status].bg} ${STATUS_CONFIG[viewingCampaign.status].color}`}>
              {STATUS_CONFIG[viewingCampaign.status].label}
            </span>

            {viewingCampaign.subject && (
              <div className="mt-4">
                <label className="text-xs font-semibold text-text-muted">Subject</label>
                <p className="text-sm text-foreground mt-0.5">{viewingCampaign.subject}</p>
              </div>
            )}

            <div className="mt-3">
              <label className="text-xs font-semibold text-text-muted">Content</label>
              <div className="mt-1 p-3 bg-surface rounded-xl text-sm text-text-muted whitespace-pre-wrap max-h-48 overflow-y-auto">
                {viewingCampaign.body}
              </div>
            </div>

            {/* Audience */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-text-muted mb-2 block">Target Audience</label>
              <div className="flex flex-wrap gap-2">
                {viewingCampaign.audience.lastVisitDays && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-surface border border-border text-text-muted">
                    Last visit within {viewingCampaign.audience.lastVisitDays} days
                  </span>
                )}
                {viewingCampaign.audience.serviceCategory && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-surface border border-border text-text-muted">
                    Category: {viewingCampaign.audience.serviceCategory}
                  </span>
                )}
                {viewingCampaign.audience.tier && (
                  <span className="text-xs px-2 py-1 rounded-lg bg-surface border border-border text-text-muted">
                    Tier: {viewingCampaign.audience.tier}
                  </span>
                )}
                {viewingCampaign.audience.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg bg-surface border border-border text-text-muted">
                    Tag: {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            {viewingCampaign.status === "sent" && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-surface rounded-xl">
                  <p className="text-lg font-bold text-foreground">{viewingCampaign.recipients}</p>
                  <p className="text-xs text-text-muted">Recipients</p>
                </div>
                <div className="text-center p-3 bg-surface rounded-xl">
                  <p className="text-lg font-bold text-foreground">{viewingCampaign.opened}</p>
                  <p className="text-xs text-text-muted">Opened</p>
                </div>
                <div className="text-center p-3 bg-surface rounded-xl">
                  <p className="text-lg font-bold text-foreground">{viewingCampaign.clicked}</p>
                  <p className="text-xs text-text-muted">Clicked</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Campaign Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBuilder(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl mb-8">
            <button
              onClick={() => setShowBuilder(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-5">New Campaign</h2>

            <div className="space-y-4 mb-6">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Campaign Name</label>
                  <input
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="e.g. Spring Promo"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Type</label>
                  <div className="flex gap-2">
                    {(["email", "sms"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setNewCampaign({ ...newCampaign, type: t })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold capitalize transition ${
                          newCampaign.type === t ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
                        }`}
                      >
                        {t === "email" ? <Mail size={12} className="inline mr-1" /> : <MessageSquare size={12} className="inline mr-1" />}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Audience Builder */}
              <div className="p-4 bg-surface rounded-xl border border-border">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                  <Target size={14} /> Target Audience
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Last visit within</label>
                    <select
                      value={newCampaign.audience.lastVisitDays || ""}
                      onChange={(e) => setNewCampaign({ ...newCampaign, audience: { ...newCampaign.audience, lastVisitDays: e.target.value ? parseInt(e.target.value) : null } })}
                      className="w-full px-2 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Any time</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Service category</label>
                    <select
                      value={newCampaign.audience.serviceCategory || ""}
                      onChange={(e) => setNewCampaign({ ...newCampaign, audience: { ...newCampaign.audience, serviceCategory: e.target.value || null } })}
                      className="w-full px-2 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Any category</option>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Loyalty tier</label>
                    <select
                      value={newCampaign.audience.tier || ""}
                      onChange={(e) => setNewCampaign({ ...newCampaign, audience: { ...newCampaign.audience, tier: (e.target.value as LoyaltyTier) || null } })}
                      className="w-full px-2 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    >
                      <option value="">Any tier</option>
                      <option value="bronze">Bronze+</option>
                      <option value="silver">Silver+</option>
                      <option value="gold">Gold+</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-text-muted mb-1 block">Schedule</label>
                    <input
                      type="datetime-local"
                      value={newCampaign.scheduledAt}
                      onChange={(e) => setNewCampaign({ ...newCampaign, scheduledAt: e.target.value })}
                      className="w-full px-2 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Campaign content builder */}
            <CampaignBuilder
              onSave={handleSaveCampaign}
              businessName="Glow Studio"
            />
          </div>
        </div>
      )}
    </div>
  );
}
