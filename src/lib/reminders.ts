// =============================================================================
// Reminders — Email & SMS reminder utilities
// =============================================================================

import type { Booking } from '@/types/database'

type BookingReminder = Record<string, any>

interface ReminderBooking extends Booking {
  businesses?: { name: string; phone: string | null; address: string | null }
  services?: { name: string; duration_minutes: number }
  profiles?: { full_name: string | null; email: string; phone: string | null }
}

// ---------------------------------------------------------------------------
// Email Reminders (Resend)
// ---------------------------------------------------------------------------
export async function sendEmailReminder(booking: ReminderBooking): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[reminders] RESEND_API_KEY not configured — skipping email reminder')
    return false
  }

  const clientEmail = booking.profiles?.email
  if (!clientEmail) {
    console.warn(`[reminders] No email for booking ${booking.id}`)
    return false
  }

  const salonName = booking.businesses?.name ?? 'your salon'
  const serviceName = booking.services?.name ?? 'your appointment'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'One Touch Beauty <reminders@onetouchbeauty.co.uk>',
        to: [clientEmail],
        subject: `Reminder: ${serviceName} at ${salonName} — ${booking.date} at ${booking.start_time}`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333;">Appointment Reminder 💇‍♀️</h2>
            <p>Hi${booking.profiles?.full_name ? ` ${booking.profiles.full_name}` : ''},</p>
            <p>Just a friendly reminder about your upcoming appointment:</p>
            <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${booking.date}</p>
              <p style="margin: 4px 0;"><strong>Time:</strong> ${booking.start_time}</p>
              <p style="margin: 4px 0;"><strong>Location:</strong> ${salonName}</p>
              ${booking.businesses?.address ? `<p style="margin: 4px 0;"><strong>Address:</strong> ${booking.businesses.address}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 14px;">Need to make changes? Please contact the salon directly.</p>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">— One Touch Beauty</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[reminders] Email send failed: ${err}`)
      return false
    }

    return true
  } catch (err) {
    console.error('[reminders] Email send error:', err)
    return false
  }
}

// ---------------------------------------------------------------------------
// SMS Reminders (Twilio)
// ---------------------------------------------------------------------------
export async function sendSmsReminder(booking: ReminderBooking): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.warn('[reminders] Twilio not configured — skipping SMS reminder')
    return false
  }

  const clientPhone = booking.profiles?.phone
  if (!clientPhone) {
    console.warn(`[reminders] No phone for booking ${booking.id}`)
    return false
  }

  const salonName = booking.businesses?.name ?? 'your salon'
  const serviceName = booking.services?.name ?? 'your appointment'
  const message = `Reminder: ${serviceName} at ${salonName} on ${booking.date} at ${booking.start_time}. See you soon! — One Touch Beauty`

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: clientPhone,
        From: fromNumber,
        Body: message,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`[reminders] SMS send failed: ${err}`)
      return false
    }

    return true
  } catch (err) {
    console.error('[reminders] SMS send error:', err)
    return false
  }
}

// ---------------------------------------------------------------------------
// Schedule & Cancel Reminders (DB operations)
// ---------------------------------------------------------------------------
export function buildReminders(booking: Booking): Omit<BookingReminder, 'id' | 'sent_at' | 'created_at'>[] {
  const reminders: Omit<BookingReminder, 'id' | 'sent_at' | 'created_at'>[] = []
  const bookingDateTime = new Date(`${booking.date}T${booking.start_time}`)

  // 24-hour reminder
  const twentyFourBefore = new Date(bookingDateTime.getTime() - 24 * 60 * 60 * 1000)
  if (twentyFourBefore > new Date()) {
    if (booking.notification_preferences?.email) {
      reminders.push({
        booking_id: booking.id,
        type: '24h',
        channel: 'email',
        status: 'pending',
        scheduled_for: twentyFourBefore.toISOString(),
      })
    }
    if (booking.notification_preferences?.sms) {
      reminders.push({
        booking_id: booking.id,
        type: '24h',
        channel: 'sms',
        status: 'pending',
        scheduled_for: twentyFourBefore.toISOString(),
      })
    }
  }

  // 1-hour reminder
  const oneHourBefore = new Date(bookingDateTime.getTime() - 60 * 60 * 1000)
  if (oneHourBefore > new Date()) {
    if (booking.notification_preferences?.email) {
      reminders.push({
        booking_id: booking.id,
        type: '1h',
        channel: 'email',
        status: 'pending',
        scheduled_for: oneHourBefore.toISOString(),
      })
    }
    if (booking.notification_preferences?.sms) {
      reminders.push({
        booking_id: booking.id,
        type: '1h',
        channel: 'sms',
        status: 'pending',
        scheduled_for: oneHourBefore.toISOString(),
      })
    }
  }

  return reminders
}
