"use client";
import { Crown, Shield, Award, Gem, TrendingUp } from "lucide-react";
import type { LoyaltyTier } from "@/types/database";

interface LoyaltyCardProps {
  points?: number;
  lifetimePoints?: number;
  tier?: LoyaltyTier;
  businessName?: string;
  businessImage?: string;
  stampsEarned?: number;
  stampsTotal?: number;
  reward?: string;
  lastVisit?: string;
  pointsEarned?: number;
  nextTierName?: string;
  pointsToNextTier?: number;
  compact?: boolean;
}

const tierConfig: Record<LoyaltyTier, {
  label: string;
  gradient: string;
  icon: typeof Crown;
}> = {
  bronze: { label: "Bronze", gradient: "from-amber-600 to-amber-700", icon: Award },
  silver: { label: "Silver", gradient: "from-gray-400 to-gray-500", icon: Shield },
  gold: { label: "Gold", gradient: "from-yellow-500 to-amber-500", icon: Crown },
  platinum: { label: "Platinum", gradient: "from-violet-500 to-purple-600", icon: Gem },
};

export default function LoyaltyCard({
  points = 0,
  lifetimePoints = 0,
  tier = "bronze",
  businessName,
  nextTierName,
  pointsToNextTier,
  compact = false,
}: LoyaltyCardProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  const progressPct = pointsToNextTier && pointsToNextTier > 0
    ? Math.min(100, ((lifetimePoints) / (lifetimePoints + pointsToNextTier)) * 100)
    : 100;

  if (compact) {
    return (
      <div className={`rounded-xl p-4 bg-gradient-to-br ${config.gradient} text-white`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon size={16} />
            <span className="text-xs font-semibold text-white/80">{config.label}</span>
          </div>
          {businessName && <span className="text-xs text-white/60">{businessName}</span>}
        </div>
        <p className="text-2xl font-extrabold">{points.toLocaleString()}</p>
        <p className="text-xs text-white/60">points available</p>
        {pointsToNextTier && nextTierName && (
          <div className="mt-2">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-[10px] text-white/60 mt-1">{pointsToNextTier} pts to {nextTierName}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl p-6 bg-gradient-to-br ${config.gradient} text-white overflow-hidden`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon size={20} />
            <span className="text-sm font-semibold text-white/80">{config.label} Member</span>
          </div>
          {businessName && (
            <span className="text-xs text-white/60">{businessName}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-3xl font-extrabold">{points.toLocaleString()}</p>
            <p className="text-xs text-white/60">Available points</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold">{lifetimePoints.toLocaleString()}</p>
            <p className="text-xs text-white/60">Lifetime earned</p>
          </div>
        </div>

        {pointsToNextTier && nextTierName && (
          <div>
            <div className="flex justify-between text-xs text-white/70 mb-1.5">
              <span>{config.label}</span>
              <span className="flex items-center gap-1">
                <TrendingUp size={11} />
                {pointsToNextTier.toLocaleString()} pts to {nextTierName}
              </span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
