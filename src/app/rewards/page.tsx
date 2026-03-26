"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Gift, Star, Crown, Award, Gem, Shield, Users, ArrowRight,
  Check, Copy, Sparkles, TrendingUp, Zap, Heart,
} from "lucide-react";

const tiers = [
  {
    name: "Bronze",
    icon: Award,
    points: 0,
    color: "from-amber-600 to-amber-700",
    textColor: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
    perks: ["Earn 10 points per £1 spent", "Birthday bonus (50 points)", "Exclusive member offers"],
  },
  {
    name: "Silver",
    icon: Shield,
    points: 2000,
    color: "from-gray-400 to-gray-500",
    textColor: "text-gray-500",
    bgColor: "bg-gray-50 dark:bg-gray-800/30",
    borderColor: "border-gray-300 dark:border-gray-600",
    perks: ["Everything in Bronze", "Priority booking", "10% off first visit each month", "Free treatment upgrade quarterly"],
  },
  {
    name: "Gold",
    icon: Crown,
    points: 5000,
    color: "from-yellow-500 to-amber-500",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-300 dark:border-yellow-700",
    perks: ["Everything in Silver", "15% off all services", "Complimentary blow dry monthly", "VIP event invitations", "Free cancellation"],
  },
  {
    name: "Platinum",
    icon: Gem,
    points: 10000,
    color: "from-violet-500 to-purple-600",
    textColor: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    borderColor: "border-violet-300 dark:border-violet-700",
    perks: ["Everything in Gold", "20% off all services", "Personal beauty concierge", "Complimentary treatment monthly", "Early access to new salons", "Exclusive product samples"],
  },
];

// Mock user data
const user = {
  name: "Sarah",
  tier: "Silver",
  points: 2450,
  nextTier: "Gold",
  pointsToNext: 5000 - 2450,
  lifetimePoints: 3200,
  referrals: 3,
};

const rewardHistory = [
  { date: "22 Mar", desc: "Balayage at Glow Studio", points: 1200, type: "earned" as const },
  { date: "15 Mar", desc: "Referral bonus — Emma joined", points: 500, type: "earned" as const },
  { date: "8 Mar", desc: "Redeemed: Free blow dry", points: -300, type: "redeemed" as const },
  { date: "1 Mar", desc: "Haircut at Luxe Hair", points: 450, type: "earned" as const },
  { date: "20 Feb", desc: "Gel Manicure at The Nail Room", points: 280, type: "earned" as const },
];

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "SARAH-OTB-10";

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTierIdx = tiers.findIndex((t) => t.name === user.tier);
  const currentTier = tiers[currentTierIdx];
  const nextTier = tiers[currentTierIdx + 1];
  const progressPct = nextTier
    ? ((user.points - currentTier.points) / (nextTier.points - currentTier.points)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Hero Card */}
        <div className={`relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br ${currentTier.color} text-white overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-1">
              <currentTier.icon size={20} />
              <span className="text-sm font-semibold text-white/80">{user.tier} Member</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">Hey {user.name}! 👋</h1>
            <p className="text-white/70 text-sm">You&apos;re doing brilliantly. Keep earning to unlock more perks.</p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-extrabold">{user.points.toLocaleString()}</p>
                <p className="text-xs text-white/60">Current points</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">{user.lifetimePoints.toLocaleString()}</p>
                <p className="text-xs text-white/60">Lifetime earned</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold">{user.referrals}</p>
                <p className="text-xs text-white/60">Referrals</p>
              </div>
            </div>

            {/* Progress to Next Tier */}
            {nextTier && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-white/70 mb-2">
                  <span>{user.tier}</span>
                  <span>{user.pointsToNext.toLocaleString()} points to {nextTier.name}</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(progressPct, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-primary" /> How It Works
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Earn Points", desc: "Get 10 points for every £1 you spend on treatments", color: "text-primary" },
              { icon: TrendingUp, title: "Level Up", desc: "Unlock higher tiers with better perks as you earn more", color: "text-secondary" },
              { icon: Gift, title: "Redeem Rewards", desc: "Use points for free treatments, discounts, and exclusive offers", color: "text-accent" },
            ].map((item) => (
              <div key={item.title} className="bg-surface-elevated border border-border rounded-2xl p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={22} className={item.color} />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tier Levels */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Crown size={20} className="text-primary" /> Tier Levels
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {tiers.map((tier) => {
              const isCurrent = tier.name === user.tier;
              return (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-5 border ${
                    isCurrent
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : `${tier.borderColor} ${tier.bgColor}`
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <tier.icon size={18} className={isCurrent ? "text-primary" : tier.textColor} />
                      <h3 className="font-bold text-foreground">{tier.name}</h3>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        YOUR TIER
                      </span>
                    )}
                    {!isCurrent && (
                      <span className="text-xs text-text-muted">{tier.points.toLocaleString()}+ pts</span>
                    )}
                  </div>
                  <ul className="space-y-1.5">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-sm text-text-muted">
                        <Check size={14} className={`shrink-0 mt-0.5 ${isCurrent ? "text-primary" : tier.textColor}`} />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Referral Section */}
        <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Refer a Friend</h2>
              </div>
              <p className="text-sm text-text-muted mb-4">
                Give your friends <strong className="text-foreground">£10 off</strong> their first booking, and you&apos;ll get{" "}
                <strong className="text-foreground">£10 credit</strong> when they book. Everyone wins! 🎉
              </p>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-4 py-2.5 bg-surface-elevated border border-border rounded-xl font-mono text-sm text-foreground">
                  {referralCode}
                </div>
                <button
                  onClick={copyCode}
                  className="px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center gap-2"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                You&apos;ve referred {user.referrals} friends and earned £{user.referrals * 10} in rewards
              </p>
            </div>
            <div className="hidden sm:flex w-24 h-24 rounded-2xl bg-primary/10 items-center justify-center">
              <Heart size={40} className="text-primary" />
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" /> Recent Activity
          </h2>
          <div className="bg-surface-elevated border border-border rounded-2xl divide-y divide-border">
            {rewardHistory.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.type === "earned" ? "bg-accent/10" : "bg-primary/10"
                  }`}>
                    {item.type === "earned" ? (
                      <Star size={14} className="text-accent" />
                    ) : (
                      <Gift size={14} className="text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.desc}</p>
                    <p className="text-xs text-text-muted">{item.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  item.type === "earned" ? "text-accent" : "text-primary"
                }`}>
                  {item.points > 0 ? "+" : ""}{item.points}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pb-4">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition shadow-lg shadow-primary/20"
          >
            Start Earning Points <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
