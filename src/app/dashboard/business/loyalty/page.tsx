"use client";
import { useState } from "react";
import {
  Gift, Plus, X, Search, Award, Shield, Crown, Gem,
  Sparkles, TrendingUp, Settings, Users, Star, Edit2,
  ToggleLeft, ToggleRight, Save,
} from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import type { LoyaltyTier } from "@/types/database";

interface ProgramConfig {
  name: string;
  pointsPerPound: number;
  pointsPerVisit: number;
  welcomeBonus: number;
  isActive: boolean;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountPercentage: number | null;
  freeServiceName: string | null;
  isActive: boolean;
}

interface TierThreshold {
  tier: LoyaltyTier;
  minPoints: number;
  label: string;
  color: string;
  icon: typeof Award;
}

interface LoyaltyMember {
  id: string;
  name: string;
  email: string;
  points: number;
  lifetimePoints: number;
  tier: LoyaltyTier;
  visits: number;
  joinedAt: string;
}

const TIER_ICONS: Record<LoyaltyTier, typeof Award> = {
  bronze: Award, silver: Shield, gold: Crown, platinum: Gem,
};

const mockMembers: LoyaltyMember[] = [
  { id: "1", name: "Emma Wilson", email: "emma@example.com", points: 2450, lifetimePoints: 5800, tier: "gold", visits: 24, joinedAt: "2024-08-15" },
  { id: "2", name: "Jade Thompson", email: "jade.t@example.com", points: 8200, lifetimePoints: 12500, tier: "platinum", visits: 38, joinedAt: "2024-03-10" },
  { id: "3", name: "Sarah Chen", email: "sarah.c@example.com", points: 890, lifetimePoints: 1600, tier: "bronze", visits: 12, joinedAt: "2025-01-20" },
  { id: "4", name: "Amy Roberts", email: "amy.r@example.com", points: 1200, lifetimePoints: 2100, tier: "silver", visits: 8, joinedAt: "2025-06-01" },
  { id: "5", name: "Lisa Patel", email: "lisa.p@example.com", points: 3400, lifetimePoints: 6200, tier: "gold", visits: 18, joinedAt: "2024-11-05" },
];

const mockRewards: Reward[] = [
  { id: "1", name: "10% Off Next Visit", description: "Save 10% on any service", pointsRequired: 500, discountPercentage: 10, freeServiceName: null, isActive: true },
  { id: "2", name: "Free Blow Dry", description: "Complimentary blow dry & style", pointsRequired: 1000, discountPercentage: null, freeServiceName: "Blow Dry & Style", isActive: true },
  { id: "3", name: "25% Off Colour", description: "25% off any colour service", pointsRequired: 2000, discountPercentage: 25, freeServiceName: null, isActive: true },
  { id: "4", name: "Free Olaplex Treatment", description: "Complimentary Olaplex treatment", pointsRequired: 3000, discountPercentage: null, freeServiceName: "Olaplex Treatment", isActive: false },
];

export default function LoyaltyPage() {
  const [config, setConfig] = useState<ProgramConfig>({
    name: "Glow Rewards", pointsPerPound: 10, pointsPerVisit: 50, welcomeBonus: 100, isActive: true,
  });

  const [tiers, setTiers] = useState<TierThreshold[]>([
    { tier: "bronze", minPoints: 0, label: "Bronze", color: "text-amber-600", icon: Award },
    { tier: "silver", minPoints: 2000, label: "Silver", color: "text-gray-500", icon: Shield },
    { tier: "gold", minPoints: 5000, label: "Gold", color: "text-yellow-600", icon: Crown },
    { tier: "platinum", minPoints: 10000, label: "Platinum", color: "text-violet-600", icon: Gem },
  ]);

  const [rewards, setRewards] = useState<Reward[]>(mockRewards);
  const [members] = useState<LoyaltyMember[]>(mockMembers);
  const [memberSearch, setMemberSearch] = useState("");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [activeTab, setActiveTab] = useState<"config" | "rewards" | "members" | "tiers">("config");
  const [saved, setSaved] = useState(false);

  const [rewardForm, setRewardForm] = useState({
    name: "", description: "", pointsRequired: 500,
    discountPercentage: null as number | null,
    freeServiceName: null as string | null,
    rewardType: "discount" as "discount" | "free_service",
  });

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const openAddReward = () => {
    setEditingReward(null);
    setRewardForm({ name: "", description: "", pointsRequired: 500, discountPercentage: 10, freeServiceName: null, rewardType: "discount" });
    setShowRewardModal(true);
  };

  const openEditReward = (r: Reward) => {
    setEditingReward(r);
    setRewardForm({
      name: r.name, description: r.description, pointsRequired: r.pointsRequired,
      discountPercentage: r.discountPercentage,
      freeServiceName: r.freeServiceName,
      rewardType: r.freeServiceName ? "free_service" : "discount",
    });
    setShowRewardModal(true);
  };

  const saveReward = () => {
    if (!rewardForm.name.trim()) return;
    const reward: Reward = {
      id: editingReward?.id || Date.now().toString(),
      name: rewardForm.name,
      description: rewardForm.description,
      pointsRequired: rewardForm.pointsRequired,
      discountPercentage: rewardForm.rewardType === "discount" ? rewardForm.discountPercentage : null,
      freeServiceName: rewardForm.rewardType === "free_service" ? rewardForm.freeServiceName : null,
      isActive: editingReward?.isActive ?? true,
    };
    if (editingReward) {
      setRewards((prev) => prev.map((r) => r.id === editingReward.id ? reward : r));
    } else {
      setRewards((prev) => [...prev, reward]);
    }
    setShowRewardModal(false);
  };

  const handleSaveConfig = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loyalty Program</h1>
          <p className="text-text-muted text-sm">{members.length} members · {rewards.filter((r) => r.isActive).length} active rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            config.isActive ? "bg-accent/10 text-accent" : "bg-red-50 text-red-500 dark:bg-red-900/20"
          }`}>
            {config.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Preview Card */}
      <div className="mb-8 max-w-md">
        <LoyaltyCard
          points={2450}
          lifetimePoints={5800}
          tier="gold"
          businessName="Glow Studio"
          nextTierName="Platinum"
          pointsToNextTier={4200}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: "config", label: "Program Setup", icon: Settings },
          { key: "rewards", label: "Rewards", icon: Gift },
          { key: "tiers", label: "Tier Thresholds", icon: Crown },
          { key: "members", label: "Members", icon: Users },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeTab === tab.key ? "bg-primary text-white" : "bg-surface border border-border text-text-muted hover:border-primary/30"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Config Tab */}
      {activeTab === "config" && (
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 max-w-xl">
          <h3 className="font-bold text-foreground mb-4">Program Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 block">Program Name</label>
              <input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Points per £</label>
                <input
                  type="number"
                  min="1"
                  value={config.pointsPerPound}
                  onChange={(e) => setConfig({ ...config, pointsPerPound: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Points per visit</label>
                <input
                  type="number"
                  min="0"
                  value={config.pointsPerVisit}
                  onChange={(e) => setConfig({ ...config, pointsPerVisit: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Welcome bonus</label>
                <input
                  type="number"
                  min="0"
                  value={config.welcomeBonus}
                  onChange={(e) => setConfig({ ...config, welcomeBonus: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl">
              <p className="text-xs text-text-muted">
                Example: A client spending <strong className="text-foreground">£120</strong> on a balayage earns{" "}
                <strong className="text-primary">{120 * config.pointsPerPound + config.pointsPerVisit} points</strong>{" "}
                ({120 * config.pointsPerPound} from spend + {config.pointsPerVisit} visit bonus)
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-surface rounded-xl">
              <span className="text-sm font-semibold text-foreground">Program Active</span>
              <button onClick={() => setConfig({ ...config, isActive: !config.isActive })}>
                {config.isActive ? <ToggleRight size={24} className="text-accent" /> : <ToggleLeft size={24} className="text-text-muted" />}
              </button>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2"
            >
              <Save size={16} /> {saved ? "Saved ✓" : "Save Configuration"}
            </button>
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === "rewards" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openAddReward}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition text-sm"
            >
              <Plus size={14} /> Add Reward
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((r) => (
              <div key={r.id} className={`bg-surface-elevated border border-border rounded-2xl p-5 transition ${!r.isActive ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Gift size={18} className="text-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEditReward(r)} className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition">
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setRewards((prev) => prev.map((rw) => rw.id === r.id ? { ...rw, isActive: !rw.isActive } : rw))}
                    >
                      {r.isActive ? <ToggleRight size={20} className="text-accent" /> : <ToggleLeft size={20} className="text-text-muted" />}
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{r.name}</h3>
                <p className="text-xs text-text-muted mb-3">{r.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">{r.pointsRequired.toLocaleString()} pts</span>
                  {r.discountPercentage && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">{r.discountPercentage}% off</span>
                  )}
                  {r.freeServiceName && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Free service</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === "tiers" && (
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 max-w-xl">
          <h3 className="font-bold text-foreground mb-4">Tier Thresholds</h3>
          <p className="text-xs text-text-muted mb-4">Set the lifetime points required for each tier level</p>
          <div className="space-y-3">
            {tiers.map((t, i) => {
              const TierIcon = t.icon;
              return (
                <div key={t.tier} className="flex items-center gap-3 p-3 bg-surface rounded-xl">
                  <TierIcon size={18} className={t.color} />
                  <span className={`text-sm font-semibold ${t.color} w-20`}>{t.label}</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={t.minPoints}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setTiers((prev) => prev.map((tier, idx) => idx === i ? { ...tier, minPoints: val } : tier));
                      }}
                      disabled={i === 0}
                      className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary disabled:opacity-50"
                    />
                  </div>
                  <span className="text-xs text-text-muted">pts</span>
                </div>
              );
            })}
          </div>
          <button
            onClick={handleSaveConfig}
            className="w-full py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition mt-4 flex items-center justify-center gap-2"
          >
            <Save size={16} /> {saved ? "Saved ✓" : "Save Thresholds"}
          </button>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === "members" && (
        <div>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl mb-4 max-w-md">
            <Search size={16} className="text-text-muted" />
            <input
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
            />
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-text-muted p-3">Member</th>
                  <th className="text-right text-xs font-semibold text-text-muted p-3 hidden sm:table-cell">Points</th>
                  <th className="text-right text-xs font-semibold text-text-muted p-3 hidden md:table-cell">Lifetime</th>
                  <th className="text-left text-xs font-semibold text-text-muted p-3">Tier</th>
                  <th className="text-right text-xs font-semibold text-text-muted p-3 hidden lg:table-cell">Visits</th>
                  <th className="text-left text-xs font-semibold text-text-muted p-3 hidden lg:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m) => {
                  const TierIcon = TIER_ICONS[m.tier];
                  return (
                    <tr key={m.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {m.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{m.name}</p>
                            <p className="text-xs text-text-muted">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right hidden sm:table-cell">
                        <span className="text-sm font-bold text-primary">{m.points.toLocaleString()}</span>
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">
                        <span className="text-sm text-foreground">{m.lifetimePoints.toLocaleString()}</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-xs font-medium">
                          <TierIcon size={12} />
                          {m.tier.charAt(0).toUpperCase() + m.tier.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-right hidden lg:table-cell">
                        <span className="text-sm text-foreground">{m.visits}</span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="text-xs text-text-muted">
                          {new Date(m.joinedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRewardModal(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button onClick={() => setShowRewardModal(false)} className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition">
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-5">
              {editingReward ? "Edit Reward" : "Add Reward"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Reward Name *</label>
                <input
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. 20% Off Next Visit"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Description</label>
                <input
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="Short description..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Points Required</label>
                <input
                  type="number"
                  min="1"
                  value={rewardForm.pointsRequired}
                  onChange={(e) => setRewardForm({ ...rewardForm, pointsRequired: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">Reward Type</label>
                <div className="flex gap-2">
                  {(["discount", "free_service"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setRewardForm({ ...rewardForm, rewardType: t })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                        rewardForm.rewardType === t ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
                      }`}
                    >
                      {t === "discount" ? "Discount %" : "Free Service"}
                    </button>
                  ))}
                </div>
              </div>

              {rewardForm.rewardType === "discount" && (
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Discount %</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={rewardForm.discountPercentage || ""}
                    onChange={(e) => setRewardForm({ ...rewardForm, discountPercentage: parseInt(e.target.value) || null })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {rewardForm.rewardType === "free_service" && (
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Service Name</label>
                  <input
                    value={rewardForm.freeServiceName || ""}
                    onChange={(e) => setRewardForm({ ...rewardForm, freeServiceName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="e.g. Blow Dry & Style"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-border">
              <button onClick={() => setShowRewardModal(false)} className="flex-1 py-2.5 bg-surface border border-border text-foreground font-semibold rounded-xl hover:bg-surface/80 transition">
                Cancel
              </button>
              <button onClick={saveReward} disabled={!rewardForm.name.trim()} className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition disabled:opacity-40">
                {editingReward ? "Save Changes" : "Add Reward"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
