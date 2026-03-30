// =============================================================================
// One Touch Beauty — Database Types
// =============================================================================

export type UserRole = 'client' | 'business'
export type BusinessSetting = 'Home' | 'Salon' | 'Mobile'
export type SubscriptionTier = 'free_trial' | 'business' | 'business_pro'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

// New enum types from 002_platform_upgrade
export type StaffRole = 'owner' | 'manager' | 'staff'
export type PreferredContactMethod = 'email' | 'sms' | 'whatsapp'
export type WaitlistStatus = 'waiting' | 'notified' | 'booked' | 'expired'
export type DepositStatus = 'pending' | 'paid' | 'refunded' | 'forfeited'
export type ReminderType = 'email' | 'sms'
export type ReminderTriggerType = '24h_before' | '1h_before' | 'custom'
export type ReminderStatus = 'pending' | 'sent' | 'failed'
export type NotificationType = 'reminder' | 'confirmation' | 'marketing' | 'review_request'
export type NotificationChannel = 'email' | 'sms' | 'push'
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'delivered'
export type LoyaltyProgramType = 'points' | 'visits' | 'spend'
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum'
export type LoyaltyTransactionType = 'earn' | 'redeem' | 'bonus' | 'expire' | 'adjust'
export type InventoryTransactionType = 'purchase' | 'sale' | 'adjustment' | 'return'
export type CampaignType = 'email' | 'sms'
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled'
export type BookingSource = 'app' | 'web' | 'google' | 'instagram' | 'facebook' | 'direct'

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
  // New fields from 002
  instagram_url: string | null
  facebook_url: string | null
  google_place_id: string | null
  accepts_walkins: boolean
  avg_rating: number
  total_reviews: number
  cancellation_policy_id: string | null
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
  // New fields from 002
  instagram_url?: string | null
  facebook_url?: string | null
  google_place_id?: string | null
  accepts_walkins?: boolean
  avg_rating?: number
  total_reviews?: number
  cancellation_policy_id?: string | null
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
  // New fields from 002
  instagram_url?: string | null
  facebook_url?: string | null
  google_place_id?: string | null
  accepts_walkins?: boolean
  avg_rating?: number
  total_reviews?: number
  cancellation_policy_id?: string | null
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
  // New fields from 002
  staff_id: string | null
  deposit_amount_pence: number
  cancellation_reason: string | null
  cancelled_at: string | null
  rescheduled_from_id: string | null
  source: BookingSource
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
  // New fields from 002
  staff_id?: string | null
  deposit_amount_pence?: number
  cancellation_reason?: string | null
  cancelled_at?: string | null
  rescheduled_from_id?: string | null
  source?: BookingSource
}

export interface BookingUpdate {
  date?: string
  start_time?: string
  end_time?: string
  status?: BookingStatus
  total_pence?: number
  notes?: string | null
  notification_preferences?: NotificationPreferences
  // New fields from 002
  staff_id?: string | null
  deposit_amount_pence?: number
  cancellation_reason?: string | null
  cancelled_at?: string | null
  rescheduled_from_id?: string | null
  source?: BookingSource
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

// =============================================================================
// NEW TABLES — 002_platform_upgrade
// =============================================================================

// ---------------------------------------------------------------------------
// 1. Staff Members
// ---------------------------------------------------------------------------
export interface StaffMember {
  id: string
  business_id: string
  profile_id: string | null
  name: string
  email: string | null
  phone: string | null
  role: StaffRole
  avatar_url: string | null
  bio: string | null
  specialties: string[]
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface StaffMemberInsert {
  business_id: string
  profile_id?: string | null
  name: string
  email?: string | null
  phone?: string | null
  role?: StaffRole
  avatar_url?: string | null
  bio?: string | null
  specialties?: string[]
  is_active?: boolean
  sort_order?: number
}

export interface StaffMemberUpdate {
  profile_id?: string | null
  name?: string
  email?: string | null
  phone?: string | null
  role?: StaffRole
  avatar_url?: string | null
  bio?: string | null
  specialties?: string[]
  is_active?: boolean
  sort_order?: number
}

// ---------------------------------------------------------------------------
// 2. Staff Services (junction)
// ---------------------------------------------------------------------------
export interface StaffService {
  staff_id: string
  service_id: string
}

export interface StaffServiceInsert {
  staff_id: string
  service_id: string
}

// ---------------------------------------------------------------------------
// 3. Staff Schedules
// ---------------------------------------------------------------------------
export interface StaffSchedule {
  id: string
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
}

export interface StaffScheduleInsert {
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available?: boolean
}

export interface StaffScheduleUpdate {
  day_of_week?: number
  start_time?: string
  end_time?: string
  is_available?: boolean
}

// ---------------------------------------------------------------------------
// 4. Staff Breaks
// ---------------------------------------------------------------------------
export interface StaffBreak {
  id: string
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface StaffBreakInsert {
  staff_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface StaffBreakUpdate {
  day_of_week?: number
  start_time?: string
  end_time?: string
}

// ---------------------------------------------------------------------------
// 5. Client Profiles
// ---------------------------------------------------------------------------
export interface ClientProfile {
  id: string
  profile_id: string
  preferred_name: string | null
  date_of_birth: string | null
  gender: string | null
  address: string | null
  notes: string | null
  allergies: string | null
  medical_notes: string | null
  preferred_staff_id: string | null
  preferred_contact: PreferredContactMethod
  lifetime_spend_pence: number
  total_bookings: number
  total_no_shows: number
  last_visit_at: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ClientProfileInsert {
  profile_id: string
  preferred_name?: string | null
  date_of_birth?: string | null
  gender?: string | null
  address?: string | null
  notes?: string | null
  allergies?: string | null
  medical_notes?: string | null
  preferred_staff_id?: string | null
  preferred_contact?: PreferredContactMethod
  lifetime_spend_pence?: number
  total_bookings?: number
  total_no_shows?: number
  last_visit_at?: string | null
  tags?: string[]
}

export interface ClientProfileUpdate {
  preferred_name?: string | null
  date_of_birth?: string | null
  gender?: string | null
  address?: string | null
  notes?: string | null
  allergies?: string | null
  medical_notes?: string | null
  preferred_staff_id?: string | null
  preferred_contact?: PreferredContactMethod
  lifetime_spend_pence?: number
  total_bookings?: number
  total_no_shows?: number
  last_visit_at?: string | null
  tags?: string[]
}

// ---------------------------------------------------------------------------
// 6. Client Notes
// ---------------------------------------------------------------------------
export interface ClientNote {
  id: string
  client_profile_id: string
  business_id: string
  staff_id: string | null
  note: string
  is_private: boolean
  created_at: string
}

export interface ClientNoteInsert {
  client_profile_id: string
  business_id: string
  staff_id?: string | null
  note: string
  is_private?: boolean
}

export interface ClientNoteUpdate {
  note?: string
  is_private?: boolean
}

// ---------------------------------------------------------------------------
// 7. Waitlist
// ---------------------------------------------------------------------------
export interface WaitlistEntry {
  id: string
  business_id: string
  client_id: string
  service_id: string
  preferred_staff_id: string | null
  preferred_date: string | null
  preferred_time_start: string | null
  preferred_time_end: string | null
  status: WaitlistStatus
  created_at: string
  notified_at: string | null
  expires_at: string | null
}

export interface WaitlistEntryInsert {
  business_id: string
  client_id: string
  service_id: string
  preferred_staff_id?: string | null
  preferred_date?: string | null
  preferred_time_start?: string | null
  preferred_time_end?: string | null
  status?: WaitlistStatus
  notified_at?: string | null
  expires_at?: string | null
}

export interface WaitlistEntryUpdate {
  preferred_staff_id?: string | null
  preferred_date?: string | null
  preferred_time_start?: string | null
  preferred_time_end?: string | null
  status?: WaitlistStatus
  notified_at?: string | null
  expires_at?: string | null
}

// ---------------------------------------------------------------------------
// 8. Cancellation Policies
// ---------------------------------------------------------------------------
export interface CancellationPolicy {
  id: string
  business_id: string
  notice_hours: number
  fee_percentage: number
  deposit_percentage: number
  deposit_amount_pence: number | null
  require_card_on_file: boolean
  free_cancellation_hours: number
  policy_text: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CancellationPolicyInsert {
  business_id: string
  notice_hours?: number
  fee_percentage?: number
  deposit_percentage?: number
  deposit_amount_pence?: number | null
  require_card_on_file?: boolean
  free_cancellation_hours?: number
  policy_text?: string | null
  is_active?: boolean
}

export interface CancellationPolicyUpdate {
  notice_hours?: number
  fee_percentage?: number
  deposit_percentage?: number
  deposit_amount_pence?: number | null
  require_card_on_file?: boolean
  free_cancellation_hours?: number
  policy_text?: string | null
  is_active?: boolean
}

// ---------------------------------------------------------------------------
// 9. Booking Deposits
// ---------------------------------------------------------------------------
export interface BookingDeposit {
  id: string
  booking_id: string
  amount_pence: number
  stripe_payment_intent_id: string | null
  status: DepositStatus
  paid_at: string | null
  refunded_at: string | null
  created_at: string
}

export interface BookingDepositInsert {
  booking_id: string
  amount_pence: number
  stripe_payment_intent_id?: string | null
  status?: DepositStatus
  paid_at?: string | null
  refunded_at?: string | null
}

export interface BookingDepositUpdate {
  amount_pence?: number
  stripe_payment_intent_id?: string | null
  status?: DepositStatus
  paid_at?: string | null
  refunded_at?: string | null
}

// ---------------------------------------------------------------------------
// 10. Reminders
// ---------------------------------------------------------------------------
export interface Reminder {
  id: string
  booking_id: string
  type: ReminderType
  trigger_type: ReminderTriggerType
  trigger_minutes_before: number
  status: ReminderStatus
  sent_at: string | null
  error_message: string | null
  created_at: string
}

export interface ReminderInsert {
  booking_id: string
  type: ReminderType
  trigger_type?: ReminderTriggerType
  trigger_minutes_before?: number
  status?: ReminderStatus
  sent_at?: string | null
  error_message?: string | null
}

export interface ReminderUpdate {
  type?: ReminderType
  trigger_type?: ReminderTriggerType
  trigger_minutes_before?: number
  status?: ReminderStatus
  sent_at?: string | null
  error_message?: string | null
}

// ---------------------------------------------------------------------------
// 11. Notification Log
// ---------------------------------------------------------------------------
export interface NotificationLogEntry {
  id: string
  profile_id: string
  type: NotificationType
  channel: NotificationChannel
  subject: string | null
  body: string | null
  status: NotificationStatus
  external_id: string | null
  sent_at: string | null
  delivered_at: string | null
  error_message: string | null
  created_at: string
}

export interface NotificationLogInsert {
  profile_id: string
  type: NotificationType
  channel: NotificationChannel
  subject?: string | null
  body?: string | null
  status?: NotificationStatus
  external_id?: string | null
  sent_at?: string | null
  delivered_at?: string | null
  error_message?: string | null
}

export interface NotificationLogUpdate {
  status?: NotificationStatus
  external_id?: string | null
  sent_at?: string | null
  delivered_at?: string | null
  error_message?: string | null
}

// ---------------------------------------------------------------------------
// 12. Loyalty Programs
// ---------------------------------------------------------------------------
export interface LoyaltyProgram {
  id: string
  business_id: string
  name: string
  type: LoyaltyProgramType
  points_per_pound: number
  points_per_visit: number
  welcome_bonus_points: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoyaltyProgramInsert {
  business_id: string
  name: string
  type?: LoyaltyProgramType
  points_per_pound?: number
  points_per_visit?: number
  welcome_bonus_points?: number
  is_active?: boolean
}

export interface LoyaltyProgramUpdate {
  name?: string
  type?: LoyaltyProgramType
  points_per_pound?: number
  points_per_visit?: number
  welcome_bonus_points?: number
  is_active?: boolean
}

// ---------------------------------------------------------------------------
// 13. Loyalty Rewards
// ---------------------------------------------------------------------------
export interface LoyaltyReward {
  id: string
  loyalty_program_id: string
  name: string
  description: string | null
  points_required: number
  discount_percentage: number | null
  discount_amount_pence: number | null
  free_service_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface LoyaltyRewardInsert {
  loyalty_program_id: string
  name: string
  description?: string | null
  points_required: number
  discount_percentage?: number | null
  discount_amount_pence?: number | null
  free_service_id?: string | null
  is_active?: boolean
  sort_order?: number
}

export interface LoyaltyRewardUpdate {
  name?: string
  description?: string | null
  points_required?: number
  discount_percentage?: number | null
  discount_amount_pence?: number | null
  free_service_id?: string | null
  is_active?: boolean
  sort_order?: number
}

// ---------------------------------------------------------------------------
// 14. Loyalty Balances
// ---------------------------------------------------------------------------
export interface LoyaltyBalance {
  id: string
  client_id: string
  business_id: string
  loyalty_program_id: string
  points_balance: number
  total_points_earned: number
  total_points_redeemed: number
  total_visits: number
  tier: LoyaltyTier
  created_at: string
  updated_at: string
}

export interface LoyaltyBalanceInsert {
  client_id: string
  business_id: string
  loyalty_program_id: string
  points_balance?: number
  total_points_earned?: number
  total_points_redeemed?: number
  total_visits?: number
  tier?: LoyaltyTier
}

export interface LoyaltyBalanceUpdate {
  loyalty_program_id?: string
  points_balance?: number
  total_points_earned?: number
  total_points_redeemed?: number
  total_visits?: number
  tier?: LoyaltyTier
}

// ---------------------------------------------------------------------------
// 15. Loyalty Transactions
// ---------------------------------------------------------------------------
export interface LoyaltyTransaction {
  id: string
  loyalty_balance_id: string
  type: LoyaltyTransactionType
  points: number
  description: string | null
  booking_id: string | null
  created_at: string
}

export interface LoyaltyTransactionInsert {
  loyalty_balance_id: string
  type: LoyaltyTransactionType
  points: number
  description?: string | null
  booking_id?: string | null
}

// ---------------------------------------------------------------------------
// 16. Consultation Forms
// ---------------------------------------------------------------------------
export interface ConsultationFormField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'signature'
  required: boolean
  options?: string[]
  placeholder?: string
}

export interface ConsultationForm {
  id: string
  business_id: string
  name: string
  description: string | null
  fields: ConsultationFormField[]
  is_required_before_booking: boolean
  service_ids: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ConsultationFormInsert {
  business_id: string
  name: string
  description?: string | null
  fields?: ConsultationFormField[]
  is_required_before_booking?: boolean
  service_ids?: string[]
  is_active?: boolean
}

export interface ConsultationFormUpdate {
  name?: string
  description?: string | null
  fields?: ConsultationFormField[]
  is_required_before_booking?: boolean
  service_ids?: string[]
  is_active?: boolean
}

// ---------------------------------------------------------------------------
// 17. Consultation Responses
// ---------------------------------------------------------------------------
export interface ConsultationResponse {
  id: string
  form_id: string
  client_id: string
  booking_id: string | null
  responses: Record<string, unknown>
  signed_at: string | null
  signature_url: string | null
  created_at: string
}

export interface ConsultationResponseInsert {
  form_id: string
  client_id: string
  booking_id?: string | null
  responses: Record<string, unknown>
  signed_at?: string | null
  signature_url?: string | null
}

// ---------------------------------------------------------------------------
// 18. Inventory Products
// ---------------------------------------------------------------------------
export interface InventoryProduct {
  id: string
  business_id: string
  name: string
  brand: string | null
  sku: string | null
  description: string | null
  category: string | null
  cost_pence: number
  price_pence: number
  stock_quantity: number
  low_stock_threshold: number
  is_retail: boolean
  is_active: boolean
  image_url: string | null
  barcode: string | null
  created_at: string
  updated_at: string
}

export interface InventoryProductInsert {
  business_id: string
  name: string
  brand?: string | null
  sku?: string | null
  description?: string | null
  category?: string | null
  cost_pence?: number
  price_pence?: number
  stock_quantity?: number
  low_stock_threshold?: number
  is_retail?: boolean
  is_active?: boolean
  image_url?: string | null
  barcode?: string | null
}

export interface InventoryProductUpdate {
  name?: string
  brand?: string | null
  sku?: string | null
  description?: string | null
  category?: string | null
  cost_pence?: number
  price_pence?: number
  stock_quantity?: number
  low_stock_threshold?: number
  is_retail?: boolean
  is_active?: boolean
  image_url?: string | null
  barcode?: string | null
}

// ---------------------------------------------------------------------------
// 19. Inventory Transactions
// ---------------------------------------------------------------------------
export interface InventoryTransaction {
  id: string
  product_id: string
  type: InventoryTransactionType
  quantity: number
  unit_price_pence: number | null
  booking_id: string | null
  notes: string | null
  created_at: string
}

export interface InventoryTransactionInsert {
  product_id: string
  type: InventoryTransactionType
  quantity: number
  unit_price_pence?: number | null
  booking_id?: string | null
  notes?: string | null
}

// ---------------------------------------------------------------------------
// 20. Marketing Campaigns
// ---------------------------------------------------------------------------
export interface MarketingCampaignTargetAudience {
  last_visit_days?: number
  tags?: string[]
  min_spend_pence?: number
  tier?: LoyaltyTier
  [key: string]: unknown
}

export interface MarketingCampaign {
  id: string
  business_id: string
  name: string
  type: CampaignType
  subject: string | null
  body: string | null
  target_audience: MarketingCampaignTargetAudience
  status: CampaignStatus
  scheduled_at: string | null
  sent_at: string | null
  total_recipients: number
  total_opened: number
  total_clicked: number
  created_at: string
  updated_at: string
}

export interface MarketingCampaignInsert {
  business_id: string
  name: string
  type?: CampaignType
  subject?: string | null
  body?: string | null
  target_audience?: MarketingCampaignTargetAudience
  status?: CampaignStatus
  scheduled_at?: string | null
}

export interface MarketingCampaignUpdate {
  name?: string
  type?: CampaignType
  subject?: string | null
  body?: string | null
  target_audience?: MarketingCampaignTargetAudience
  status?: CampaignStatus
  scheduled_at?: string | null
  sent_at?: string | null
  total_recipients?: number
  total_opened?: number
  total_clicked?: number
}

// ---------------------------------------------------------------------------
// 21. Referral Codes
// ---------------------------------------------------------------------------
export interface ReferralCode {
  id: string
  referrer_id: string
  business_id: string | null
  code: string
  discount_percentage: number
  reward_points: number
  max_uses: number | null
  times_used: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface ReferralCodeInsert {
  referrer_id: string
  business_id?: string | null
  code: string
  discount_percentage?: number
  reward_points?: number
  max_uses?: number | null
  is_active?: boolean
  expires_at?: string | null
}

export interface ReferralCodeUpdate {
  discount_percentage?: number
  reward_points?: number
  max_uses?: number | null
  times_used?: number
  is_active?: boolean
  expires_at?: string | null
}

// ---------------------------------------------------------------------------
// 22. Referral Uses
// ---------------------------------------------------------------------------
export interface ReferralUse {
  id: string
  referral_code_id: string
  referred_id: string
  booking_id: string | null
  created_at: string
}

export interface ReferralUseInsert {
  referral_code_id: string
  referred_id: string
  booking_id?: string | null
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
