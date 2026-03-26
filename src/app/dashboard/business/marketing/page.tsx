"use client";
import { useState } from "react";
import {
  Mail, Gift, Megaphone, BarChart3, Send, Clock, Eye,
  ToggleLeft, ToggleRight, Sparkles, TrendingUp, Users,
  Calendar, ChevronRight, ArrowRight, Heart, Zap,
} from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  type: string;
  icon: typeof Mail;
  subject: string;
  preview: string;
  enabled: boolean;
  openRate: number;
  clickRate: number;
  bookings: number;
  sent: number;
  color: string;
}

const initialCampaigns: Campaign[] = [
  {
    id: 1, name: "Win Back", type: "Automated", icon: Heart,
    subject: "Haven't seen you in a while — 10% off!",
    preview: "Hi {name}, we miss you at Glow Studio! It's been a while since your last visit. Come back and enjoy 10% off your next appointment. Book now and treat yourself — you deserve it! 💖",
    enabled: true, openRate: 42, clickRate: 18, bookings: 12, sent: 234,
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 2, name: "Birthday", type: "Automated", icon: Gift,
    subject: "Happy birthday! Here's a treat 🎂",
    preview: "Happy Birthday, {name}! 🎉 To celebrate your special day, we'd love to offer you a complimentary mini treatment with your next booking. Valid for 30 days. Have a wonderful birthday!",
    enabled: true, openRate: 68, clickRate: 35, bookings: 28, sent: 156,
    color: "from-purple-500 to-violet-500",
  },
  {
    id: 3, name: "New Service", type: "One-off", icon: Sparkles,
    subject: "✨ Introducing our new Olaplex Treatment",
    preview: "Exciting news, {name}! We've just added Olaplex Bond Repair Treatment to our menu. It's the ultimate repair for damaged, coloured or heat-styled hair. Introductory price: just £30 (usually £45). Limited slots available — book yours today!",
    enabled: false, openRate: 38, clickRate: 22, bookings: 8, sent: 312,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 4, name: "Monthly Newsletter", type: "Scheduled", icon: Mail,
    subject: "March at Glow Studio — What's New",
    preview: "Hi {name}, here's what's happening at Glow Studio this month: new spring colours, extended Saturday hours, and a special Mother's Day package. Plus, read our top hair care tips for the season change.",
    enabled: true, openRate: 31, clickRate: 12, bookings: 6, sent: 450,
    color: "from-sky-500 to-blue-500",
  },
];

export default function MarketingPage() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [scheduleMode, setScheduleMode] = useState<"now" | "later">("now");

  const toggleCampaign = (id: number) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalBookings = campaigns.reduce((s, c) => s + c.bookings, 0);
  const avgOpenRate = Math.round(campaigns.reduce((s, c) => s + c.openRate, 0) / campaigns.length);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Automated Marketing</h1>
            <p className="text-text-muted">Email campaigns that bring clients back automatically</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
            <Megaphone size={16} /> Create Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Emails Sent", value: totalSent.toLocaleString(), icon: Send, color: "text-primary" },
            { label: "Avg Open Rate", value: `${avgOpenRate}%`, icon: Eye, color: "text-secondary" },
            { label: "Bookings Generated", value: totalBookings.toString(), icon: Calendar, color: "text-accent" },
            { label: "Active Campaigns", value: campaigns.filter((c) => c.enabled).length.toString(), icon: Zap, color: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-surface-elevated border border-border rounded-2xl p-5">
              <s.icon size={18} className={`${s.color} mb-2`} />
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm text-text-muted">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Campaign List */}
          <div className="lg:col-span-2 space-y-4">
            {campaigns.map((c) => (
              <div key={c.id}
                className={`bg-surface-elevated border rounded-2xl p-5 transition-all cursor-pointer ${
                  selectedCampaign?.id === c.id ? "border-primary shadow-lg" : "border-border hover:border-primary/30"
                }`}
                onClick={() => setSelectedCampaign(c)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shrink-0`}>
                      <c.icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{c.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">{c.type}</span>
                      </div>
                      <p className="text-sm text-text-muted truncate">{c.subject}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1"><Eye size={11} /> {c.openRate}% open</span>
                        <span className="flex items-center gap-1"><TrendingUp size={11} /> {c.clickRate}% clicks</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {c.bookings} bookings</span>
                        <span className="flex items-center gap-1"><Users size={11} /> {c.sent} sent</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCampaign(c.id); }}
                    className="shrink-0"
                    aria-label={`Toggle ${c.name} campaign`}>
                    {c.enabled ? (
                      <ToggleRight size={32} className="text-accent" />
                    ) : (
                      <ToggleLeft size={32} className="text-text-muted" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            {selectedCampaign ? (
              <>
                {/* Email Preview */}
                <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
                  <div className="p-4 bg-surface border-b border-border">
                    <p className="text-xs text-text-muted mb-1">Preview</p>
                    <p className="font-semibold text-foreground text-sm">{selectedCampaign.subject}</p>
                  </div>
                  {/* Styled email mock */}
                  <div className="p-5 bg-white dark:bg-[#1a1a2e]">
                    <div className="text-center mb-5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark mx-auto flex items-center justify-center text-white font-bold text-lg mb-2">
                        G
                      </div>
                      <p className="text-xs text-text-muted">Glow Studio</p>
                    </div>
                    <div className={`h-1.5 rounded-full bg-gradient-to-r ${selectedCampaign.color} mb-5`} />
                    <p className="text-sm text-foreground leading-relaxed mb-4">
                      {selectedCampaign.preview.replace("{name}", "Emma")}
                    </p>
                    <button className="w-full py-3 bg-primary text-white font-bold rounded-xl text-sm">
                      Book Now
                    </button>
                    <p className="text-[10px] text-text-muted text-center mt-4">
                      Glow Studio · 42 Shoreditch High St · London E1 6JJ
                    </p>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                  <h4 className="font-bold text-foreground mb-4">Performance</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Open Rate", value: selectedCampaign.openRate, max: 100 },
                      { label: "Click Rate", value: selectedCampaign.clickRate, max: 50 },
                      { label: "Booking Rate", value: Math.round((selectedCampaign.bookings / selectedCampaign.sent) * 100), max: 20 },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-foreground">{m.label}</span>
                          <span className="text-sm font-bold text-foreground">{m.value}%</span>
                        </div>
                        <div className="h-2 bg-surface rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark" style={{ width: `${(m.value / m.max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                  <h4 className="font-bold text-foreground mb-3">Schedule</h4>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setScheduleMode("now")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                        scheduleMode === "now" ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
                      }`}>
                      Send Now
                    </button>
                    <button
                      onClick={() => setScheduleMode("later")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                        scheduleMode === "later" ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
                      }`}>
                      Schedule
                    </button>
                  </div>
                  {scheduleMode === "later" && (
                    <div className="space-y-3 mb-4">
                      <input type="date" className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary" />
                      <input type="time" className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary" />
                    </div>
                  )}
                  <button className="w-full py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition flex items-center justify-center gap-2">
                    <Send size={14} /> {scheduleMode === "now" ? "Send Campaign" : "Schedule Campaign"}
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center">
                <Mail size={36} className="text-text-muted mx-auto mb-3" />
                <p className="font-semibold text-foreground">Select a campaign</p>
                <p className="text-sm text-text-muted">Click a campaign to preview and manage</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
