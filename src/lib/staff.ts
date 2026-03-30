// =============================================================================
// Staff — Availability, scheduling, and assignment
// =============================================================================

import { createClient } from './supabase'
import type { StaffMember, StaffSchedule } from '@/types/database'

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// ---------------------------------------------------------------------------
// Get available staff for a service at a given date/time
// ---------------------------------------------------------------------------
export async function getAvailableStaff(
  businessId: string,
  serviceId: string,
  date: string,
  time?: string
): Promise<StaffMember[]> {
  const supabase = createClient()

  // Get all active staff for this business who offer this service
  const { data: allStaff } = await supabase
    .from('staff_members')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .contains('service_ids', [serviceId])

  if (!allStaff?.length) return []

  const dayOfWeek = DAYS[new Date(date).getDay()]

  // Filter by schedule availability
  const available = (allStaff as StaffMember[]).filter((staff) => {
    const daySchedule = staff.schedule?.[dayOfWeek]
    if (!daySchedule?.available) return false

    // If a specific time is requested, check it falls within their schedule
    if (time && daySchedule.start && daySchedule.end) {
      return time >= daySchedule.start && time < daySchedule.end
    }

    return true
  })

  // If time specified, also check for booking conflicts
  if (time) {
    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('staff_id, start_time, end_time')
      .eq('business_id', businessId)
      .eq('date', date)
      .in('status', ['pending', 'confirmed'])

    const busyStaffIds = new Set(
      (existingBookings ?? [])
        .filter((b: { start_time: string; end_time: string }) => {
          // Check if the requested time overlaps with existing bookings
          return time >= b.start_time && time < b.end_time
        })
        .map((b: { staff_id: string }) => b.staff_id)
    )

    return available.filter((s) => !busyStaffIds.has(s.id))
  }

  return available
}

// ---------------------------------------------------------------------------
// Get a staff member's schedule
// ---------------------------------------------------------------------------
export async function getStaffSchedule(staffId: string): Promise<StaffSchedule | null> {
  const supabase = createClient()

  const { data } = await supabase
    .from('staff_members')
    .select('schedule')
    .eq('id', staffId)
    .single()

  return data?.schedule as StaffSchedule | null
}

// ---------------------------------------------------------------------------
// Check staff availability for a specific time range
// ---------------------------------------------------------------------------
export async function checkStaffAvailability(
  staffId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  const supabase = createClient()

  // Get staff schedule
  const { data: staff } = await supabase
    .from('staff_members')
    .select('schedule')
    .eq('id', staffId)
    .single()

  if (!staff) return false

  const schedule = staff.schedule as StaffSchedule
  const dayOfWeek = DAYS[new Date(date).getDay()]
  const daySchedule = schedule?.[dayOfWeek]

  if (!daySchedule?.available) return false
  if (startTime < daySchedule.start || endTime > daySchedule.end) return false

  // Check for conflicts
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .eq('staff_id', staffId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed'])
    .lt('start_time', endTime)
    .gt('end_time', startTime)

  return !conflicts?.length
}

// ---------------------------------------------------------------------------
// Get all staff for a business
// ---------------------------------------------------------------------------
export async function getBusinessStaff(businessId: string): Promise<StaffMember[]> {
  const supabase = createClient()

  const { data } = await supabase
    .from('staff_members')
    .select('*')
    .eq('business_id', businessId)
    .order('full_name', { ascending: true })

  return (data ?? []) as StaffMember[]
}
