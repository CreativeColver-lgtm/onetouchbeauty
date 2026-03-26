// =============================================================================
// One Touch Beauty — Database Types
// =============================================================================

export type UserRole = 'client' | 'business'
export type BusinessSetting = 'Home' | 'Salon' | 'Mobile'
export type SubscriptionTier = 'free_trial' | 'business' | 'business_pro'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------
export interface Profile {
  id: string
  full_name: string | null
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  id_verified: boolean
  created_at: string
  updated_at: string
}

export interface ProfileInsert {
  id: string
  full_name?: string | null
  email: string
  phone?: string | null
  avatar_url?: string | null
  role?: UserRole
  id_verified?: boolean
}

export interface ProfileUpdate {
  full_name?: string | null
  email?: string
  phone?: string | null
  avatar_url?: string | null
  role?: UserRole
  id_verified?: boolean
}

// ---------------------------------------------------------------------------
// Businesses
// ---------------------------------------------------------------------------
export interface OpeningHours {
  [day: string]: {
    open: string
    close: string
    closed?: boolean
  }
}

export interface Business {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string | null
  type: string
  setting: BusinessSetting
  address: string | null
  city: string | null
  postcode: string | null
  lat: number | null
  lng: number | null
  phone: string | null
  email: string | null
  website: string | null
  opening_hours: OpeningHours
  logo_url: string | null
  cover_image_url: string | null
  is_verified: boolean
  is_featured: boolean
  is_active: boolean
  subscription_tier: SubscriptionTier
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface BusinessInsert {
  owner_id: string
  name: string
  slug: string
  description?: string | null
  type: string
  setting?: BusinessSetting
  address?: string | null
  city?: string | null
  postcode?: string | null
  lat?: number | null
  lng?: number | null
  phone?: string | null
  email?: string | null
  website?: string | null
  opening_hours?: OpeningHours
  logo_url?: string | null
  cover_image_url?: string | null
  is_verified?: boolean
  is_featured?: boolean
  is_active?: boolean
  subscription_tier?: SubscriptionTier
  subscription_expires_at?: string | null
}

export interface BusinessUpdate {
  name?: string
  slug?: string
  description?: string | null
  type?: string
  setting?: BusinessSetting
  address?: string | null
  city?: string | null
  postcode?: string | null
  lat?: number | null
  lng?: number | null
  phone?: string | null
  email?: string | null
  website?: string | null
  opening_hours?: OpeningHours
  logo_url?: string | null
  cover_image_url?: string | null
  is_verified?: boolean
  is_featured?: boolean
  is_active?: boolean
  subscription_tier?: SubscriptionTier
  subscription_expires_at?: string | null
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export interface Service {
  id: string
  business_id: string
  name: string
  description: string | null
  category: string | null
  duration_minutes: number
  price_pence: number
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface ServiceInsert {
  business_id: string
  name: string
  description?: string | null
  category?: string | null
  duration_minutes: number
  price_pence: number
  is_active?: boolean
  sort_order?: number
}

export interface ServiceUpdate {
  name?: string
  description?: string | null
  category?: string | null
  duration_minutes?: number
  price_pence?: number
  is_active?: boolean
  sort_order?: number
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------
export interface NotificationPreferences {
  email: boolean
  sms: boolean
}

export interface Booking {
  id: string
  business_id: string
  client_id: string
  service_id: string
  date: string
  start_time: string
  end_time: string
  status: BookingStatus
  total_pence: number
  notes: string | null
  notification_preferences: NotificationPreferences
  created_at: string
  updated_at: string
}

export interface BookingInsert {
  business_id: string
  client_id: string
  service_id: string
  date: string
  start_time: string
  end_time: string
  status?: BookingStatus
  total_pence: number
  notes?: string | null
  notification_preferences?: NotificationPreferences
}

export interface BookingUpdate {
  date?: string
  start_time?: string
  end_time?: string
  status?: BookingStatus
  total_pence?: number
  notes?: string | null
  notification_preferences?: NotificationPreferences
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export interface Review {
  id: string
  business_id: string
  client_id: string
  booking_id: string | null
  rating: number
  comment: string | null
  reply: string | null
  created_at: string
}

export interface ReviewInsert {
  business_id: string
  client_id: string
  booking_id?: string | null
  rating: number
  comment?: string | null
}

export interface ReviewUpdate {
  rating?: number
  comment?: string | null
  reply?: string | null
}

// ---------------------------------------------------------------------------
// Business Photos
// ---------------------------------------------------------------------------
export interface BusinessPhoto {
  id: string
  business_id: string
  url: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface BusinessPhotoInsert {
  business_id: string
  url: string
  caption?: string | null
  sort_order?: number
}

export interface BusinessPhotoUpdate {
  url?: string
  caption?: string | null
  sort_order?: number
}

// ---------------------------------------------------------------------------
// Favourites
// ---------------------------------------------------------------------------
export interface Favourite {
  id: string
  client_id: string
  business_id: string
  created_at: string
}

export interface FavouriteInsert {
  client_id: string
  business_id: string
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------
export interface Availability {
  id: string
  business_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface AvailabilityInsert {
  business_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available?: boolean
}

export interface AvailabilityUpdate {
  day_of_week?: number
  start_time?: string
  end_time?: string
  is_available?: boolean
}

// ---------------------------------------------------------------------------
// Blocked Dates
// ---------------------------------------------------------------------------
export interface BlockedDate {
  id: string
  business_id: string
  date: string
  reason: string | null
}

export interface BlockedDateInsert {
  business_id: string
  date: string
  reason?: string | null
}

export interface BlockedDateUpdate {
  date?: string
  reason?: string | null
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------
export interface BusinessFilters {
  search?: string
  category?: string
  city?: string
  setting?: BusinessSetting
  is_featured?: boolean
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}
