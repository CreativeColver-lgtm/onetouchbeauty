import { createClient } from './supabase'
import type {
  Business,
  BusinessFilters,
  BusinessPhoto,
  Booking,
  BookingInsert,
  Favourite,
  PaginatedResult,
  Review,
  Service,
} from '@/types/database'

const supabase = createClient()

// ---------------------------------------------------------------------------
// Businesses
// ---------------------------------------------------------------------------

export async function getBusinesses(
  filters: BusinessFilters = {}
): Promise<PaginatedResult<Business>> {
  const {
    search,
    category,
    city,
    setting,
    is_featured,
    page = 1,
    limit = 12,
  } = filters

  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('businesses')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`)
  }
  if (category) {
    query = query.eq('type', category)
  }
  if (city) {
    query = query.ilike('city', `%${city}%`)
  }
  if (setting) {
    query = query.eq('setting', setting)
  }
  if (is_featured !== undefined) {
    query = query.eq('is_featured', is_featured)
  }

  const { data, error, count } = await query
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as Business[],
    count: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

export async function getBusinessById(id: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as Business
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data as Business
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function getServicesByBusiness(businessId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as Service[]
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function getReviewsByBusiness(businessId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles:client_id(full_name, avatar_url)')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Review[]
}

// ---------------------------------------------------------------------------
// Photos
// ---------------------------------------------------------------------------

export async function getPhotosByBusiness(businessId: string): Promise<BusinessPhoto[]> {
  const { data, error } = await supabase
    .from('business_photos')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as BusinessPhoto[]
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export async function createBooking(booking: BookingInsert): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data as Booking
}

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, businesses(name, slug, logo_url), services(name, duration_minutes, price_pence)')
    .eq('client_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []) as Booking[]
}

// ---------------------------------------------------------------------------
// Favourites
// ---------------------------------------------------------------------------

export async function toggleFavourite(
  clientId: string,
  businessId: string
): Promise<{ favourited: boolean }> {
  // Check if favourite exists
  const { data: existing } = await supabase
    .from('favourites')
    .select('id')
    .eq('client_id', clientId)
    .eq('business_id', businessId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('favourites')
      .delete()
      .eq('id', existing.id)

    if (error) throw error
    return { favourited: false }
  }

  const { error } = await supabase
    .from('favourites')
    .insert({ client_id: clientId, business_id: businessId } as Favourite)

  if (error) throw error
  return { favourited: true }
}
