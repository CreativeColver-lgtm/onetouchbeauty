// =============================================================================
// /api/waitlist — POST (join), GET (check position), DELETE (leave)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server'
import { joinWaitlist, checkPosition, leaveWaitlist } from '@/lib/waitlist'

// ---------------------------------------------------------------------------
// POST — Join waitlist
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessId, clientId, clientName, clientEmail, clientPhone, serviceId, preferredDate, preferredTime } = body

    if (!businessId || !clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'businessId, clientName, and clientEmail are required' },
        { status: 400 }
      )
    }

    const result = await joinWaitlist({
      business_id: businessId,
      client_id: clientId ?? null,
      client_name: clientName,
      client_email: clientEmail,
      client_phone: clientPhone ?? null,
      service_id: serviceId ?? null,
      preferred_date: preferredDate ?? null,
      preferred_time: preferredTime ?? null,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      waitlistId: result.waitlistId,
      position: result.position,
    })
  } catch (err) {
    console.error('[waitlist] POST error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// GET — Check position
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const waitlistId = searchParams.get('id')

    if (!waitlistId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const result = await checkPosition(waitlistId)

    if (!result) {
      return NextResponse.json({ error: 'Waitlist entry not found' }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[waitlist] GET error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE — Leave waitlist
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const waitlistId = searchParams.get('id')
    const clientId = searchParams.get('clientId')

    if (!waitlistId) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const success = await leaveWaitlist(waitlistId, clientId ?? undefined)

    if (!success) {
      return NextResponse.json({ error: 'Failed to leave waitlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[waitlist] DELETE error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
