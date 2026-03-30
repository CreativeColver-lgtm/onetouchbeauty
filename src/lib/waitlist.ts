// =============================================================================
// Waitlist — Join, check position, notify, and process expired entries
// =============================================================================

import { createClient } from './supabase'
import type { WaitlistEntry, WaitlistEntryInsert } from '@/types/database'

// ---------------------------------------------------------------------------
// Join waitlist
// ---------------------------------------------------------------------------
export async function joinWaitlist(
  entry: WaitlistEntryInsert
): Promise<{ success: boolean; waitlistId?: string; position?: number; error?: string }> {
  const supabase = createClient()

  // Get current max position for this business
  const { data: existing } = await supabase
    .from('waitlist')
    .select('position')
    .eq('business_id', entry.business_id)
    .eq('status', 'waiting')
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = (existing?.[0]?.position ?? 0) + 1

  const { data, error } = await supabase
    .from('waitlist')
    .insert({
      ...entry,
      status: 'waiting',
      position: nextPosition,
      // Expire after 7 days by default
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[waitlist] Join error:', error)
    return { success: false, error: error.message }
  }

  return { success: true, waitlistId: data.id, position: nextPosition }
}

// ---------------------------------------------------------------------------
// Check position
// ---------------------------------------------------------------------------
export async function checkPosition(
  waitlistId: string
): Promise<{ position: number; status: string } | null> {
  const supabase = createClient()

  const { data } = await supabase
    .from('waitlist')
    .select('position, status')
    .eq('id', waitlistId)
    .single()

  if (!data) return null
  return { position: data.position, status: data.status }
}

// ---------------------------------------------------------------------------
// Notify availability — marks entries as notified
// ---------------------------------------------------------------------------
export async function notifyAvailability(
  businessId: string,
  date?: string
): Promise<WaitlistEntry[]> {
  const supabase = createClient()

  let query = supabase
    .from('waitlist')
    .select('*, businesses(name)')
    .eq('business_id', businessId)
    .eq('status', 'waiting')
    .order('position', { ascending: true })
    .limit(5) // Notify top 5 in queue

  if (date) {
    query = query.or(`preferred_date.eq.${date},preferred_date.is.null`)
  }

  const { data: entries } = await query

  if (!entries?.length) return []

  // Mark as notified
  const ids = entries.map((e: WaitlistEntry) => e.id)
  await supabase
    .from('waitlist')
    .update({ status: 'notified', notified_at: new Date().toISOString() })
    .in('id', ids)

  return entries as WaitlistEntry[]
}

// ---------------------------------------------------------------------------
// Process expired entries — clean up old waitlist entries
// ---------------------------------------------------------------------------
export async function processExpiredEntries(): Promise<number> {
  const supabase = createClient()

  const { data } = await supabase
    .from('waitlist')
    .update({ status: 'expired' })
    .eq('status', 'waiting')
    .lt('expires_at', new Date().toISOString())
    .select('id')

  return data?.length ?? 0
}

// ---------------------------------------------------------------------------
// Get waitlist for a business
// ---------------------------------------------------------------------------
export async function getBusinessWaitlist(businessId: string): Promise<WaitlistEntry[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from('waitlist')
    .select('*')
    .eq('business_id', businessId)
    .in('status', ['waiting', 'notified'])
    .order('position', { ascending: true })

  return (data ?? []) as WaitlistEntry[]
}

// ---------------------------------------------------------------------------
// Leave waitlist
// ---------------------------------------------------------------------------
export async function leaveWaitlist(waitlistId: string, clientId?: string): Promise<boolean> {
  const supabase = createClient()

  let query = supabase
    .from('waitlist')
    .update({ status: 'cancelled' })
    .eq('id', waitlistId)

  if (clientId) {
    query = query.eq('client_id', clientId)
  }

  const { error } = await query
  return !error
}
