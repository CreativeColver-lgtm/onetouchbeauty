// =============================================================================
// Notifications — Email notifications for bookings, reviews, waitlist
// =============================================================================

import type { Booking, WaitlistEntry } from '@/types/database'

interface BookingWithRelations extends Booking {
  businesses?: { name: string; address: string | null; phone: string | null }
  services?: { name: string; duration_minutes: number; price_pence: number }
  profiles?: { full_name: string | null; email: string }
}

// ---------------------------------------------------------------------------
// Helper: send email via Resend
// ---------------------------------------------------------------------------
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[notifications] RESEND_API_KEY not configured')
    return false
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'One Touch Beauty <noreply@onetouchbeauty.co.uk>',
        to: [to],
        subject,
        html,
      }),
    })

    if (!res.ok) {
      console.error('[notifications] Send failed:', await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[notifications] Send error:', err)
    return false
  }
}

// ---------------------------------------------------------------------------
// Booking Confirmation
// ---------------------------------------------------------------------------
export async function sendBookingConfirmation(booking: BookingWithRelations): Promise<boolean> {
  const email = booking.profiles?.email
  if (!email) return false

  const name = booking.profiles?.full_name ?? 'there'
  const salonName = booking.businesses?.name ?? 'the salon'
  const serviceName = booking.services?.name ?? 'your service'
  const price = booking.total_pence ? `£${(booking.total_pence / 100).toFixed(2)}` : ''

  return sendEmail(
    email,
    `Booking Confirmed — ${serviceName} at ${salonName}`,
    `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Confirmed ✅</h2>
      <p>Hi ${name},</p>
      <p>Your booking has been confirmed!</p>
      <div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 16px 0;">
        ${(booking as any).reference ? `<p style="margin: 4px 0;"><strong>Reference:</strong> ${(booking as any).reference}</p>` : ''}
        <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
        <p style="margin: 4px 0;"><strong>Date:</strong> ${booking.date}</p>
        <p style="margin: 4px 0;"><strong>Time:</strong> ${booking.start_time} — ${booking.end_time}</p>
        <p style="margin: 4px 0;"><strong>Location:</strong> ${salonName}</p>
        ${price ? `<p style="margin: 4px 0;"><strong>Total:</strong> ${price}</p>` : ''}
      </div>
      <p style="color: #666; font-size: 14px;">We look forward to seeing you!</p>
      <p style="color: #999; font-size: 12px;">— One Touch Beauty</p>
    </div>
    `
  )
}

// ---------------------------------------------------------------------------
// Cancellation Notification
// ---------------------------------------------------------------------------
export async function sendCancellationNotification(booking: BookingWithRelations): Promise<boolean> {
  const email = booking.profiles?.email
  if (!email) return false

  const name = booking.profiles?.full_name ?? 'there'
  const salonName = booking.businesses?.name ?? 'the salon'
  const serviceName = booking.services?.name ?? 'your service'

  return sendEmail(
    email,
    `Booking Cancelled — ${serviceName} at ${salonName}`,
    `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #333;">Booking Cancelled</h2>
      <p>Hi ${name},</p>
      <p>Your booking for <strong>${serviceName}</strong> at <strong>${salonName}</strong> on ${booking.date} at ${booking.start_time} has been cancelled.</p>
      <p style="color: #666; font-size: 14px;">If this was a mistake, please rebook at your convenience.</p>
      <p style="color: #999; font-size: 12px;">— One Touch Beauty</p>
    </div>
    `
  )
}

// ---------------------------------------------------------------------------
// Review Request (sent after completed booking)
// ---------------------------------------------------------------------------
export async function requestReview(booking: BookingWithRelations): Promise<boolean> {
  const email = booking.profiles?.email
  if (!email) return false

  const name = booking.profiles?.full_name ?? 'there'
  const salonName = booking.businesses?.name ?? 'the salon'

  return sendEmail(
    email,
    `How was your visit to ${salonName}? ⭐`,
    `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #333;">How was your experience? ⭐</h2>
      <p>Hi ${name},</p>
      <p>We hope you enjoyed your recent visit to <strong>${salonName}</strong>!</p>
      <p>Your feedback helps other clients find great beauty services. Would you take a moment to leave a review?</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/salon/${booking.business_id}#reviews" 
           style="display: inline-block; background: #6366f1; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">
          Leave a Review
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">— One Touch Beauty</p>
    </div>
    `
  )
}

// ---------------------------------------------------------------------------
// Waitlist Notification
// ---------------------------------------------------------------------------
export async function sendWaitlistNotification(entry: WaitlistEntry & { businesses?: { name: string } }): Promise<boolean> {
  const salonName = entry.businesses?.name ?? 'the salon'

  return sendEmail(
    (entry as any).client_email,
    `A slot has opened up at ${salonName}! 🎉`,
    `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #333;">Good news! A slot is available 🎉</h2>
      <p>Hi ${(entry as any).client_name},</p>
      <p>Great news — a slot has opened up at <strong>${salonName}</strong>${entry.preferred_date ? ` around your preferred date (${entry.preferred_date})` : ''}!</p>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/booking?business=${entry.business_id}" 
           style="display: inline-block; background: #6366f1; color: white; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-weight: bold;">
          Book Now
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">This slot won't last long — book now to secure your spot!</p>
      <p style="color: #999; font-size: 12px;">— One Touch Beauty</p>
    </div>
    `
  )
}
