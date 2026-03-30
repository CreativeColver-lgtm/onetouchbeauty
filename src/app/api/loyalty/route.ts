// =============================================================================
// /api/loyalty — GET (check balance) and POST (earn/redeem points)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { earnPoints, redeemPoints, getBalance, getTransactions, checkTier, getNextTier } from '@/lib/loyalty'

// ---------------------------------------------------------------------------
// GET — Check loyalty balance
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const businessId = searchParams.get('businessId')

    if (!clientId) {
      return NextResponse.json({ error: 'clientId is required' }, { status: 400 })
    }

    // If businessId provided, get balance for specific business
    if (businessId) {
      const balance = await getBalance(clientId, businessId)
      const transactions = await getTransactions(clientId, businessId, 10)
      const nextTier = balance ? getNextTier(balance.tier) : null

      return NextResponse.json({
        balance: balance ?? { points: 0, lifetime_points: 0, tier: 'bronze' },
        nextTier,
        transactions,
      })
    }

    // Otherwise get all balances for this client
    const supabase = await createClient()
    const { data: balances } = await supabase
      .from('loyalty_balances')
      .select('*, businesses:business_id(name, logo_url)')
      .eq('client_id', clientId)

    const transactions = await getTransactions(clientId, undefined, 20)

    return NextResponse.json({
      balances: balances ?? [],
      transactions,
    })
  } catch (err) {
    console.error('[loyalty] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST — Earn or redeem points
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, clientId, businessId, amountPence, rewardId, bookingId, description } = body

    if (!action || !clientId || !businessId) {
      return NextResponse.json(
        { error: 'action, clientId, and businessId are required' },
        { status: 400 }
      )
    }

    if (action === 'earn') {
      if (!amountPence) {
        return NextResponse.json({ error: 'amountPence is required for earning' }, { status: 400 })
      }

      const result = await earnPoints(clientId, businessId, amountPence, bookingId, description)
      return NextResponse.json(result)
    }

    if (action === 'redeem') {
      if (!rewardId) {
        return NextResponse.json({ error: 'rewardId is required for redeeming' }, { status: 400 })
      }

      const result = await redeemPoints(clientId, businessId, rewardId)
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  } catch (err) {
    console.error('[loyalty] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
