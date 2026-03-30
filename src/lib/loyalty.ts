// =============================================================================
// Loyalty — Points, tiers, and rewards
// =============================================================================

import { createClient } from './supabase'
import type { LoyaltyTier, LoyaltyBalance, LoyaltyTransaction } from '@/types/database'

// ---------------------------------------------------------------------------
// Tier thresholds
// ---------------------------------------------------------------------------
const TIER_THRESHOLDS: { tier: LoyaltyTier; min: number }[] = [
  { tier: 'platinum', min: 10000 },
  { tier: 'gold', min: 5000 },
  { tier: 'silver', min: 2000 },
  { tier: 'bronze', min: 0 },
]

export function checkTier(lifetimePoints: number): LoyaltyTier {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (lifetimePoints >= min) return tier
  }
  return 'bronze'
}

export function getNextTier(currentTier: LoyaltyTier): { tier: LoyaltyTier; pointsNeeded: number } | null {
  const idx = TIER_THRESHOLDS.findIndex((t) => t.tier === currentTier)
  if (idx <= 0) return null // Already platinum or not found
  const next = TIER_THRESHOLDS[idx - 1]
  return { tier: next.tier, pointsNeeded: next.min }
}

export function getTierInfo(tier: LoyaltyTier) {
  const info: Record<LoyaltyTier, { label: string; color: string; bgColor: string; borderColor: string }> = {
    bronze: { label: 'Bronze', color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20', borderColor: 'border-amber-200 dark:border-amber-800' },
    silver: { label: 'Silver', color: 'text-gray-500', bgColor: 'bg-gray-50 dark:bg-gray-800/30', borderColor: 'border-gray-300 dark:border-gray-600' },
    gold: { label: 'Gold', color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', borderColor: 'border-yellow-300 dark:border-yellow-700' },
    platinum: { label: 'Platinum', color: 'text-violet-600', bgColor: 'bg-violet-50 dark:bg-violet-900/20', borderColor: 'border-violet-300 dark:border-violet-700' },
  }
  return info[tier]
}

// ---------------------------------------------------------------------------
// Earn points
// ---------------------------------------------------------------------------
export async function earnPoints(
  clientId: string,
  businessId: string,
  amountPence: number,
  bookingId?: string,
  description?: string
): Promise<{ points: number; newBalance: number; tier: LoyaltyTier }> {
  const supabase = createClient()

  // Get the loyalty program config for this business
  const { data: program } = await supabase
    .from('loyalty_programs')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .single()

  if (!program) {
    return { points: 0, newBalance: 0, tier: 'bronze' }
  }

  // Calculate points: points per pound spent + per visit bonus
  const poundsSpent = Math.floor(amountPence / 100)
  const points = (poundsSpent * program.points_per_pound) + program.points_per_visit

  // Get or create balance
  const { data: balance } = await supabase
    .from('loyalty_balances')
    .select('*')
    .eq('client_id', clientId)
    .eq('business_id', businessId)
    .single()

  const newPoints = (balance?.points ?? 0) + points
  const newLifetime = (balance?.lifetime_points ?? 0) + points
  const newTier = checkTier(newLifetime)

  if (balance) {
    await supabase
      .from('loyalty_balances')
      .update({ points: newPoints, lifetime_points: newLifetime, tier: newTier })
      .eq('id', balance.id)
  } else {
    await supabase.from('loyalty_balances').insert({
      client_id: clientId,
      business_id: businessId,
      points: newPoints,
      lifetime_points: newLifetime,
      tier: newTier,
    })
  }

  // Record transaction
  await supabase.from('loyalty_transactions').insert({
    client_id: clientId,
    business_id: businessId,
    points,
    type: 'earned',
    description: description ?? `Earned from booking — £${(amountPence / 100).toFixed(2)} spent`,
    booking_id: bookingId ?? null,
  })

  return { points, newBalance: newPoints, tier: newTier }
}

// ---------------------------------------------------------------------------
// Redeem points
// ---------------------------------------------------------------------------
export async function redeemPoints(
  clientId: string,
  businessId: string,
  rewardId: string
): Promise<{ success: boolean; error?: string; remainingPoints?: number }> {
  const supabase = createClient()

  // Get reward
  const { data: reward, error: rewardErr } = await supabase
    .from('loyalty_rewards')
    .select('*')
    .eq('id', rewardId)
    .eq('is_active', true)
    .single()

  if (rewardErr || !reward) {
    return { success: false, error: 'Reward not found or inactive' }
  }

  // Get balance
  const { data: balance } = await supabase
    .from('loyalty_balances')
    .select('*')
    .eq('client_id', clientId)
    .eq('business_id', businessId)
    .single()

  if (!balance || balance.points < reward.points_cost) {
    return { success: false, error: 'Not enough points' }
  }

  const newPoints = balance.points - reward.points_cost

  await supabase
    .from('loyalty_balances')
    .update({ points: newPoints })
    .eq('id', balance.id)

  await supabase.from('loyalty_transactions').insert({
    client_id: clientId,
    business_id: businessId,
    points: -reward.points_cost,
    type: 'redeemed',
    description: `Redeemed: ${reward.name}`,
    reward_id: rewardId,
  })

  return { success: true, remainingPoints: newPoints }
}

// ---------------------------------------------------------------------------
// Get balance
// ---------------------------------------------------------------------------
export async function getBalance(
  clientId: string,
  businessId: string
): Promise<LoyaltyBalance | null> {
  const supabase = createClient()

  const { data } = await supabase
    .from('loyalty_balances')
    .select('*')
    .eq('client_id', clientId)
    .eq('business_id', businessId)
    .single()

  return data as LoyaltyBalance | null
}

// ---------------------------------------------------------------------------
// Get transaction history
// ---------------------------------------------------------------------------
export async function getTransactions(
  clientId: string,
  businessId?: string,
  limit = 20
): Promise<LoyaltyTransaction[]> {
  const supabase = createClient()

  let query = supabase
    .from('loyalty_transactions')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (businessId) {
    query = query.eq('business_id', businessId)
  }

  const { data } = await query
  return (data ?? []) as LoyaltyTransaction[]
}
