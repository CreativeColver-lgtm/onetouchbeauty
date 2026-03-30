// =============================================================================
// Campaigns — Email/SMS marketing campaigns
// =============================================================================

import { createClient } from './supabase'
import type { Campaign, CampaignInsert, CampaignStats, CampaignAudienceFilters } from '@/types/database'

// ---------------------------------------------------------------------------
// Create campaign
// ---------------------------------------------------------------------------
export async function createCampaign(campaign: CampaignInsert): Promise<Campaign | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      ...campaign,
      stats: { total_sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0 } as CampaignStats,
    })
    .select()
    .single()

  if (error) {
    console.error('[campaigns] Create error:', error)
    return null
  }

  return data as Campaign
}

// ---------------------------------------------------------------------------
// Send campaign
// ---------------------------------------------------------------------------
export async function sendCampaign(campaignId: string): Promise<{ sent: number; errors: number }> {
  const supabase = createClient()

  // Get campaign
  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (!campaign) return { sent: 0, errors: 0 }

  // Build audience
  const audience = await buildAudience(campaign.business_id, campaign.audience_filters as CampaignAudienceFilters)

  // Update status to sending
  await supabase
    .from('campaigns')
    .update({ status: 'sending' })
    .eq('id', campaignId)

  let sent = 0
  let errors = 0

  // Send to each recipient
  for (const recipient of audience) {
    try {
      if (campaign.type === 'email') {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) {
          console.warn('[campaigns] RESEND_API_KEY not configured')
          break
        }

        // Replace merge tags
        let content = campaign.content as string
        content = content.replace(/\{\{first_name\}\}/g, recipient.full_name?.split(' ')[0] ?? 'there')
        content = content.replace(/\{\{full_name\}\}/g, recipient.full_name ?? '')
        content = content.replace(/\{\{email\}\}/g, recipient.email ?? '')

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'One Touch Beauty <campaigns@onetouchbeauty.co.uk>',
            to: [recipient.email],
            subject: campaign.subject,
            html: content,
          }),
        })

        if (res.ok) sent++
        else errors++
      }
      // SMS sending would go here with Twilio
    } catch {
      errors++
    }
  }

  // Update campaign stats and status
  await supabase
    .from('campaigns')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      stats: {
        total_sent: sent + errors,
        delivered: sent,
        opened: 0,
        clicked: 0,
        bounced: errors,
      },
    })
    .eq('id', campaignId)

  return { sent, errors }
}

// ---------------------------------------------------------------------------
// Get campaign stats
// ---------------------------------------------------------------------------
export async function getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
  const supabase = createClient()

  const { data } = await supabase
    .from('campaigns')
    .select('stats')
    .eq('id', campaignId)
    .single()

  return data?.stats as CampaignStats | null
}

// ---------------------------------------------------------------------------
// Build audience based on filters
// ---------------------------------------------------------------------------
export async function buildAudience(
  businessId: string,
  filters: CampaignAudienceFilters = {}
): Promise<{ id: string; full_name: string | null; email: string; phone: string | null }[]> {
  const supabase = createClient()

  // Get unique clients who have booked with this business
  const { data: bookings } = await supabase
    .from('bookings')
    .select('client_id, profiles:client_id(id, full_name, email, phone), services(category), created_at, total_pence')
    .eq('business_id', businessId)
    .in('status', ['confirmed', 'completed'])

  if (!bookings?.length) return []

  // Group by client
  const clientMap = new Map<string, {
    id: string
    full_name: string | null
    email: string
    phone: string | null
    bookingCount: number
    totalSpent: number
    lastVisit: string
    categories: Set<string>
  }>()

  for (const b of bookings) {
    const profile = b.profiles as unknown as { id: string; full_name: string | null; email: string; phone: string | null }
    if (!profile?.email) continue

    const existing = clientMap.get(profile.id)
    if (existing) {
      existing.bookingCount++
      existing.totalSpent += b.total_pence ?? 0
      if (b.created_at > existing.lastVisit) existing.lastVisit = b.created_at
      if ((b.services as unknown as { category: string })?.category) {
        existing.categories.add((b.services as unknown as { category: string }).category)
      }
    } else {
      clientMap.set(profile.id, {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        bookingCount: 1,
        totalSpent: b.total_pence ?? 0,
        lastVisit: b.created_at,
        categories: new Set((b.services as unknown as { category: string })?.category ? [(b.services as unknown as { category: string }).category] : []),
      })
    }
  }

  // Apply filters
  let clients = Array.from(clientMap.values())

  if (filters.last_visit_days) {
    const cutoff = new Date(Date.now() - filters.last_visit_days * 24 * 60 * 60 * 1000).toISOString()
    clients = clients.filter((c) => c.lastVisit >= cutoff)
  }

  if (filters.service_categories?.length) {
    clients = clients.filter((c) =>
      filters.service_categories!.some((cat) => c.categories.has(cat))
    )
  }

  if (filters.min_bookings) {
    clients = clients.filter((c) => c.bookingCount >= filters.min_bookings!)
  }

  if (filters.min_spent_pence) {
    clients = clients.filter((c) => c.totalSpent >= filters.min_spent_pence!)
  }

  return clients.map((c) => ({
    id: c.id,
    full_name: c.full_name,
    email: c.email,
    phone: c.phone,
  }))
}
