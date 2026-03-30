// =============================================================================
// POST /api/reminders/send — Send booking reminders via email & SMS
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmailReminder, sendSmsReminder } from '@/lib/reminders'

export async function POST(request: NextRequest) {
  try {
    const { bookingId, channel } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch booking with related data
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        businesses:business_id(name, phone, address),
        services:service_id(name, duration_minutes),
        profiles:client_id(full_name, email, phone)
      `)
      .eq('id', bookingId)
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const results: { email?: boolean; sms?: boolean } = {}

    // Send email reminder
    if (!channel || channel === 'email') {
      results.email = await sendEmailReminder(booking)
    }

    // Send SMS reminder
    if (!channel || channel === 'sms') {
      results.sms = await sendSmsReminder(booking)
    }

    // Update reminder status in DB
    if (results.email || results.sms) {
      await supabase
        .from('booking_reminders')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('booking_id', bookingId)
        .eq('status', 'pending')
    }

    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('[reminders/send] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
