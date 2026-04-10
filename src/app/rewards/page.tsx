"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Gift, Star, Crown, Award, Gem, Shield, Users, ArrowRight,
  Check, Copy, Sparkles, TrendingUp, Zap, Heart, Share2,
  CreditCard, Clock,
} from "lucide-react";
import LoyaltyCard from "@/components/LoyaltyCard";
import ShareButton from "@/components/ShareButton";

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

// Loyalty cards per business
const loyaltyCards = [
  {
    id: 1,
    businessName: "Glow Studio",
    businessImage: "💇‍♀️",
    stampsEarned: 7,
    stampsTotal: 10,
    reward: "Free Blow Dry",
    lastVisit: "22 Mar 2026",
    pointsEarned: 1650,
  },
  {
    id: 2,
    businessName: "Nail Artistry",
    businessImage: "💅",
    stampsEarned: 3,
    stampsTotal: 8,
    reward: "Free Gel Manicure",
    lastVisit: "15 Mar 2026",
    pointsEarned: 520,
  },
  {
    id: 3,
    businessName: "Pure Skin Clinic",
    businessImage: "✨",
    stampsEarned: 1,
    stampsTotal: 6,
    reward: "Free Mini Facial",
    lastVisit: "8 Mar 2026",
    pointsEarned: 280,
  },
];

// Available rewards
const availableRewards = [
  { id: 1, name: "Free Blow Dry", pointsCost: 300, image: "💇‍♀️", category: "Hair" },
  { id: 2, name: "£10 Off Any Treatment", pointsCost: 500, image: "🎫", category: "Discount" },
  { id: 3, name: "Free Olaplex Treatment", pointsCost: 800, image: "✨", category: "Treatment" },
  { id: 4, name: "Free Gel Manicure", pointsCost: 600, image: "💅", category: "Nails" },
  { id: 5, name: "Free Full Colour", pointsCost: 2000, image: "🎨", category: "Colour" },
  { id: 6, name: "VIP Pamper Package", pointsCost: 3500, image: "👑", category: "Premium" },
];

const rewardHistory = [
  { date: "22 Mar", desc: "Balayage at Glow Studio", points: 1200, type: "earned" as const },
  { date: "15 Mar", desc: "Referral bonus — Emma joined", points: 500, type: "earned" as const },
  { date: "8 Mar", desc: "Redeemed: Free blow dry", points: -300, type: "redeemed" as const },
  { date: "1 Mar", desc: "Haircut at Luxe Hair", points: 450, type: "earned" as const },
  { date: "20 Feb", desc: "Gel Manicure at The Nail Room", points: 280, type: "earned" as const },
  { date: "14 Feb", desc: "Birthday bonus 🎂", points: 50, type: "earned" as const },
  { date: "10 Feb", desc: "Referral bonus — Lisa joined", points: 500, type: "earned" as const },
  { date: "2 Feb", desc: "Redeemed: £10 Off Treatment", points: -500, type: "redeemed" as const },
];

export default function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
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

  const visibleHistory = showAllHistory ? rewardHistory : rewardHistory.slice(0, 5);

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
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hey {user.name}! 👋</h1>
            <p className="text-white/70 text-sm">You&apos;re doing brilliantly. Keep earning to unlock more perks.</p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <p className="text-3xl font-bold">{user.points.toLocaleString()}</p>
                <p className="text-xs text-white/60">Current points</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{user.lifetimePoints.toLocaleString()}</p>
                <p className="text-xs text-white/60">Lifetime earned</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{user.referrals}</p>
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
                <div className="flex justify-between text-[10px] text-white/50 mt-1">
                  <span>{currentTier.points.toLocaleString()} pts</span>
                  <span>{nextTier.points.toLocaleString()} pts</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loyalty Cards per Business */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <CreditCard size={20} className="text-primary" /> Your Loyalty Cards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loyaltyCards.map((card) => (
              <LoyaltyCard
                key={card.id}
                businessName={card.businessName}
                businessImage={card.businessImage}
                stampsEarned={card.stampsEarned}
                stampsTotal={card.stampsTotal}
                reward={card.reward}
                lastVisit={card.lastVisit}
                pointsEarned={card.pointsEarned}
              />
            ))}
          </div>
        </section>

        {/* Available Rewards to Redeem */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Gift size={20} className="text-primary" /> Available Rewards
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRewards.map((reward) => {
              const canRedeem = user.points >= reward.pointsCost;
              return (
                <div
                  key={reward.id}
                  className={`bg-surface-elevated border rounded-2xl p-5 transition-all ${
                    canRedeem
                      ? "border-primary/30 hover:border-primary hover:shadow-md cursor-pointer"
                      : "border-border opacity-70"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{reward.image}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                      {reward.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{reward.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-primary">{reward.pointsCost.toLocaleString()} pts</span>
                    {canRedeem ? (
                      <button className="text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary-dark transition">
                        Redeem
                      </button>
                    ) : (
                      <span className="text-[10px] text-text-muted">
                        Need {(reward.pointsCost - user.points).toLocaleString()} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

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
                <ShareButton
                  title="Join One Touch Beauty!"
                  text={`Use my referral code ${referralCode} to get £10 off your first booking on One Touch Beauty!`}
                />
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

        {/* Points Transaction History Timeline */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
            <Clock size={20} className="text-primary" /> Points History
          </h2>
          <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-border" />

              {visibleHistory.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 relative hover:bg-surface/50 transition">
                  {/* Timeline dot */}
                  <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 z-10 ring-4 ring-background ${
                    item.type === "earned" ? "bg-accent" : "bg-primary"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{item.desc}</p>
                      <span className={`text-sm font-bold ${
                        item.type === "earned" ? "text-accent" : "text-primary"
                      }`}>
                        {item.points > 0 ? "+" : ""}{item.points}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {rewardHistory.length > 5 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="w-full py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition border-t border-border"
              >
                {showAllHistory ? "Show less" : `Show all ${rewardHistory.length} transactions`}
              </button>
            )}
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
