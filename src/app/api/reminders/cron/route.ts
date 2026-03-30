// =============================================================================
// GET /api/reminders/cron — Vercel cron job to send due reminders
// =============================================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmailReminder, sendSmsReminder } from '@/lib/reminders'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const now = new Date()

    // Find reminders that are due (scheduled_for <= now and still pending)
    const { data: dueReminders, error } = await supabase
      .from('booking_reminders')
      .select(`
        *,
        bookings:booking_id(
          *,
          businesses:business_id(name, phone, address),
          services:service_id(name, duration_minutes),
          profiles:client_id(full_name, email, phone)
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString())
      .limit(50) // Process in batches

    if (error) {
      console.error('[reminders/cron] Query error:', error)
      return NextResponse.json({ error: 'Failed to query reminders' }, { status: 500 })
    }

    if (!dueReminders?.length) {
      return NextResponse.json({ sent: 0, message: 'No reminders due' })
    }

    let sentCount = 0
    let failedCount = 0

    for (const reminder of dueReminders) {
      const booking = reminder.bookings
      if (!booking) {
        // Booking was deleted — mark reminder as failed
        await supabase
          .from('booking_reminders')
          .update({ status: 'failed' })
          .eq('id', reminder.id)
        failedCount++
        continue
      }

      // Skip if booking is cancelled or completed
      if (['cancelled', 'completed', 'no_show'].includes(booking.status)) {
        await supabase
          .from('booking_reminders')
          .update({ status: 'failed' })
          .eq('id', reminder.id)
        continue
      }

      let success = false

      if (reminder.channel === 'email') {
        success = await sendEmailReminder(booking)
      } else if (reminder.channel === 'sms') {
        success = await sendSmsReminder(booking)
      }

      // Update reminder status
      await supabase
        .from('booking_reminders')
        .update({
          status: success ? 'sent' : 'failed',
          sent_at: success ? new Date().toISOString() : null,
        })
        .eq('id', reminder.id)

      if (success) sentCount++
      else failedCount++
    }

    return NextResponse.json({
      sent: sentCount,
      failed: failedCount,
      total: dueReminders.length,
      timestamp: now.toISOString(),
    })
  } catch (err) {
    console.error('[reminders/cron] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
