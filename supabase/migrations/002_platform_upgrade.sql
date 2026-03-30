-- =============================================================================
-- 002_platform_upgrade.sql
-- One Touch Beauty — Platform Upgrade Migration
-- Staff management, client profiles, loyalty, inventory, marketing, and more
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Custom ENUM types
-- ---------------------------------------------------------------------------
CREATE TYPE staff_role AS ENUM ('owner', 'manager', 'staff');
CREATE TYPE preferred_contact_method AS ENUM ('email', 'sms', 'whatsapp');
CREATE TYPE waitlist_status AS ENUM ('waiting', 'notified', 'booked', 'expired');
CREATE TYPE deposit_status AS ENUM ('pending', 'paid', 'refunded', 'forfeited');
CREATE TYPE reminder_type AS ENUM ('email', 'sms');
CREATE TYPE reminder_trigger_type AS ENUM ('24h_before', '1h_before', 'custom');
CREATE TYPE reminder_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE notification_type AS ENUM ('reminder', 'confirmation', 'marketing', 'review_request');
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed', 'delivered');
CREATE TYPE loyalty_program_type AS ENUM ('points', 'visits', 'spend');
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE loyalty_transaction_type AS ENUM ('earn', 'redeem', 'bonus', 'expire', 'adjust');
CREATE TYPE inventory_transaction_type AS ENUM ('purchase', 'sale', 'adjustment', 'return');
CREATE TYPE campaign_type AS ENUM ('email', 'sms');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'cancelled');
CREATE TYPE booking_source AS ENUM ('app', 'web', 'google', 'instagram', 'facebook', 'direct');

-- ---------------------------------------------------------------------------
-- 1. staff_members
-- ---------------------------------------------------------------------------
CREATE TABLE staff_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  profile_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name          text NOT NULL,
  email         text,
  phone         text,
  role          staff_role NOT NULL DEFAULT 'staff',
  avatar_url    text,
  bio           text,
  specialties   text[] DEFAULT '{}',
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. staff_services (junction)
-- ---------------------------------------------------------------------------
CREATE TABLE staff_services (
  staff_id   uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (staff_id, service_id)
);

-- ---------------------------------------------------------------------------
-- 3. staff_schedules
-- ---------------------------------------------------------------------------
CREATE TABLE staff_schedules (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id     uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  day_of_week  smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   time NOT NULL,
  end_time     time NOT NULL,
  is_available boolean NOT NULL DEFAULT true
);

-- ---------------------------------------------------------------------------
-- 4. staff_breaks
-- ---------------------------------------------------------------------------
CREATE TABLE staff_breaks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id    uuid NOT NULL REFERENCES staff_members(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time  time NOT NULL,
  end_time    time NOT NULL
);

-- ---------------------------------------------------------------------------
-- 8. cancellation_policies (created before client_profiles & bookings ALTER
--    because businesses.cancellation_policy_id references it)
-- ---------------------------------------------------------------------------
CREATE TABLE cancellation_policies (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  notice_hours          integer NOT NULL DEFAULT 24,
  fee_percentage        integer NOT NULL DEFAULT 0,
  deposit_percentage    integer NOT NULL DEFAULT 0,
  deposit_amount_pence  integer,
  require_card_on_file  boolean NOT NULL DEFAULT false,
  free_cancellation_hours integer NOT NULL DEFAULT 24,
  policy_text           text,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 5. client_profiles
-- ---------------------------------------------------------------------------
CREATE TABLE client_profiles (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id          uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_name      text,
  date_of_birth       date,
  gender              text,
  address             text,
  notes               text,
  allergies           text,
  medical_notes       text,
  preferred_staff_id  uuid REFERENCES staff_members(id) ON DELETE SET NULL,
  preferred_contact   preferred_contact_method DEFAULT 'email',
  lifetime_spend_pence integer NOT NULL DEFAULT 0,
  total_bookings      integer NOT NULL DEFAULT 0,
  total_no_shows      integer NOT NULL DEFAULT 0,
  last_visit_at       timestamptz,
  tags                text[] DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 6. client_notes
-- ---------------------------------------------------------------------------
CREATE TABLE client_notes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_profile_id uuid NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  business_id       uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  staff_id          uuid REFERENCES staff_members(id) ON DELETE SET NULL,
  note              text NOT NULL,
  is_private        boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 7. waitlist
-- ---------------------------------------------------------------------------
CREATE TABLE waitlist (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  client_id           uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id          uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  preferred_staff_id  uuid REFERENCES staff_members(id) ON DELETE SET NULL,
  preferred_date      date,
  preferred_time_start time,
  preferred_time_end   time,
  status              waitlist_status NOT NULL DEFAULT 'waiting',
  created_at          timestamptz NOT NULL DEFAULT now(),
  notified_at         timestamptz,
  expires_at          timestamptz
);

-- ---------------------------------------------------------------------------
-- 9. booking_deposits
-- ---------------------------------------------------------------------------
CREATE TABLE booking_deposits (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id               uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount_pence             integer NOT NULL,
  stripe_payment_intent_id text,
  status                   deposit_status NOT NULL DEFAULT 'pending',
  paid_at                  timestamptz,
  refunded_at              timestamptz,
  created_at               timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 10. reminders
-- ---------------------------------------------------------------------------
CREATE TABLE reminders (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id             uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  type                   reminder_type NOT NULL,
  trigger_type           reminder_trigger_type NOT NULL DEFAULT '24h_before',
  trigger_minutes_before integer NOT NULL DEFAULT 1440,
  status                 reminder_status NOT NULL DEFAULT 'pending',
  sent_at                timestamptz,
  error_message          text,
  created_at             timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 11. notification_log
-- ---------------------------------------------------------------------------
CREATE TABLE notification_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type          notification_type NOT NULL,
  channel       notification_channel NOT NULL,
  subject       text,
  body          text,
  status        notification_status NOT NULL DEFAULT 'pending',
  external_id   text,
  sent_at       timestamptz,
  delivered_at  timestamptz,
  error_message text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 12. loyalty_programs
-- ---------------------------------------------------------------------------
CREATE TABLE loyalty_programs (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name                text NOT NULL,
  type                loyalty_program_type NOT NULL DEFAULT 'points',
  points_per_pound    integer NOT NULL DEFAULT 1,
  points_per_visit    integer NOT NULL DEFAULT 0,
  welcome_bonus_points integer NOT NULL DEFAULT 0,
  is_active           boolean NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 13. loyalty_rewards
-- ---------------------------------------------------------------------------
CREATE TABLE loyalty_rewards (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_program_id   uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  name                 text NOT NULL,
  description          text,
  points_required      integer NOT NULL,
  discount_percentage  integer,
  discount_amount_pence integer,
  free_service_id      uuid REFERENCES services(id) ON DELETE SET NULL,
  is_active            boolean NOT NULL DEFAULT true,
  sort_order           integer NOT NULL DEFAULT 0,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 14. loyalty_balances
-- ---------------------------------------------------------------------------
CREATE TABLE loyalty_balances (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id           uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  loyalty_program_id    uuid NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  points_balance        integer NOT NULL DEFAULT 0,
  total_points_earned   integer NOT NULL DEFAULT 0,
  total_points_redeemed integer NOT NULL DEFAULT 0,
  total_visits          integer NOT NULL DEFAULT 0,
  tier                  loyalty_tier NOT NULL DEFAULT 'bronze',
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  UNIQUE (client_id, business_id)
);

-- ---------------------------------------------------------------------------
-- 15. loyalty_transactions
-- ---------------------------------------------------------------------------
CREATE TABLE loyalty_transactions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_balance_id uuid NOT NULL REFERENCES loyalty_balances(id) ON DELETE CASCADE,
  type              loyalty_transaction_type NOT NULL,
  points            integer NOT NULL,
  description       text,
  booking_id        uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 16. consultation_forms
-- ---------------------------------------------------------------------------
CREATE TABLE consultation_forms (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id               uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name                      text NOT NULL,
  description               text,
  fields                    jsonb NOT NULL DEFAULT '[]',
  is_required_before_booking boolean NOT NULL DEFAULT false,
  service_ids               uuid[] DEFAULT '{}',
  is_active                 boolean NOT NULL DEFAULT true,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 17. consultation_responses
-- ---------------------------------------------------------------------------
CREATE TABLE consultation_responses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id       uuid NOT NULL REFERENCES consultation_forms(id) ON DELETE CASCADE,
  client_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id    uuid REFERENCES bookings(id) ON DELETE SET NULL,
  responses     jsonb NOT NULL DEFAULT '{}',
  signed_at     timestamptz,
  signature_url text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 18. inventory_products
-- ---------------------------------------------------------------------------
CREATE TABLE inventory_products (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name                text NOT NULL,
  brand               text,
  sku                 text,
  description         text,
  category            text,
  cost_pence          integer NOT NULL DEFAULT 0,
  price_pence         integer NOT NULL DEFAULT 0,
  stock_quantity      integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  is_retail           boolean NOT NULL DEFAULT false,
  is_active           boolean NOT NULL DEFAULT true,
  image_url           text,
  barcode             text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 19. inventory_transactions
-- ---------------------------------------------------------------------------
CREATE TABLE inventory_transactions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES inventory_products(id) ON DELETE CASCADE,
  type            inventory_transaction_type NOT NULL,
  quantity         integer NOT NULL,
  unit_price_pence integer,
  booking_id      uuid REFERENCES bookings(id) ON DELETE SET NULL,
  notes           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 20. marketing_campaigns
-- ---------------------------------------------------------------------------
CREATE TABLE marketing_campaigns (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name             text NOT NULL,
  type             campaign_type NOT NULL DEFAULT 'email',
  subject          text,
  body             text,
  target_audience  jsonb DEFAULT '{}',
  status           campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at     timestamptz,
  sent_at          timestamptz,
  total_recipients integer NOT NULL DEFAULT 0,
  total_opened     integer NOT NULL DEFAULT 0,
  total_clicked    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 21. referral_codes
-- ---------------------------------------------------------------------------
CREATE TABLE referral_codes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id         uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id         uuid REFERENCES businesses(id) ON DELETE CASCADE,
  code                text NOT NULL UNIQUE,
  discount_percentage integer NOT NULL DEFAULT 0,
  reward_points       integer NOT NULL DEFAULT 0,
  max_uses            integer,
  times_used          integer NOT NULL DEFAULT 0,
  is_active           boolean NOT NULL DEFAULT true,
  expires_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 22. referral_uses
-- ---------------------------------------------------------------------------
CREATE TABLE referral_uses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id uuid NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  referred_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id       uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- ALTER existing tables: bookings
-- ---------------------------------------------------------------------------
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS staff_id              uuid REFERENCES staff_members(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deposit_amount_pence   integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancellation_reason    text,
  ADD COLUMN IF NOT EXISTS cancelled_at           timestamptz,
  ADD COLUMN IF NOT EXISTS rescheduled_from_id    uuid REFERENCES bookings(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS source                 booking_source NOT NULL DEFAULT 'app';

-- ---------------------------------------------------------------------------
-- ALTER existing tables: businesses
-- ---------------------------------------------------------------------------
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS instagram_url          text,
  ADD COLUMN IF NOT EXISTS facebook_url           text,
  ADD COLUMN IF NOT EXISTS google_place_id        text,
  ADD COLUMN IF NOT EXISTS accepts_walkins        boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS avg_rating             numeric(3,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews          integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cancellation_policy_id uuid REFERENCES cancellation_policies(id) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

-- staff_members
CREATE INDEX idx_staff_members_business_id ON staff_members(business_id);
CREATE INDEX idx_staff_members_profile_id  ON staff_members(profile_id) WHERE profile_id IS NOT NULL;
CREATE INDEX idx_staff_members_active      ON staff_members(business_id, is_active);

-- staff_services
CREATE INDEX idx_staff_services_service_id ON staff_services(service_id);

-- staff_schedules
CREATE INDEX idx_staff_schedules_staff_id  ON staff_schedules(staff_id);
CREATE INDEX idx_staff_schedules_day       ON staff_schedules(staff_id, day_of_week);

-- staff_breaks
CREATE INDEX idx_staff_breaks_staff_id     ON staff_breaks(staff_id);

-- client_profiles
CREATE INDEX idx_client_profiles_profile_id ON client_profiles(profile_id);
CREATE INDEX idx_client_profiles_staff      ON client_profiles(preferred_staff_id) WHERE preferred_staff_id IS NOT NULL;

-- client_notes
CREATE INDEX idx_client_notes_client_profile ON client_notes(client_profile_id);
CREATE INDEX idx_client_notes_business       ON client_notes(business_id);

-- waitlist
CREATE INDEX idx_waitlist_business_id   ON waitlist(business_id);
CREATE INDEX idx_waitlist_client_id     ON waitlist(client_id);
CREATE INDEX idx_waitlist_status        ON waitlist(business_id, status);
CREATE INDEX idx_waitlist_date          ON waitlist(preferred_date);

-- cancellation_policies
CREATE INDEX idx_cancellation_policies_business ON cancellation_policies(business_id);

-- booking_deposits
CREATE INDEX idx_booking_deposits_booking ON booking_deposits(booking_id);
CREATE INDEX idx_booking_deposits_status  ON booking_deposits(status);

-- reminders
CREATE INDEX idx_reminders_booking ON reminders(booking_id);
CREATE INDEX idx_reminders_status  ON reminders(status);

-- notification_log
CREATE INDEX idx_notification_log_profile ON notification_log(profile_id);
CREATE INDEX idx_notification_log_status  ON notification_log(status);
CREATE INDEX idx_notification_log_created ON notification_log(created_at);

-- loyalty_programs
CREATE INDEX idx_loyalty_programs_business ON loyalty_programs(business_id);

-- loyalty_rewards
CREATE INDEX idx_loyalty_rewards_program ON loyalty_rewards(loyalty_program_id);

-- loyalty_balances
CREATE INDEX idx_loyalty_balances_client   ON loyalty_balances(client_id);
CREATE INDEX idx_loyalty_balances_business ON loyalty_balances(business_id);
CREATE INDEX idx_loyalty_balances_program  ON loyalty_balances(loyalty_program_id);

-- loyalty_transactions
CREATE INDEX idx_loyalty_transactions_balance ON loyalty_transactions(loyalty_balance_id);
CREATE INDEX idx_loyalty_transactions_booking ON loyalty_transactions(booking_id) WHERE booking_id IS NOT NULL;

-- consultation_forms
CREATE INDEX idx_consultation_forms_business ON consultation_forms(business_id);

-- consultation_responses
CREATE INDEX idx_consultation_responses_form    ON consultation_responses(form_id);
CREATE INDEX idx_consultation_responses_client  ON consultation_responses(client_id);
CREATE INDEX idx_consultation_responses_booking ON consultation_responses(booking_id) WHERE booking_id IS NOT NULL;

-- inventory_products
CREATE INDEX idx_inventory_products_business  ON inventory_products(business_id);
CREATE INDEX idx_inventory_products_sku       ON inventory_products(sku) WHERE sku IS NOT NULL;
CREATE INDEX idx_inventory_products_category  ON inventory_products(business_id, category);
CREATE INDEX idx_inventory_products_low_stock ON inventory_products(business_id) WHERE stock_quantity <= low_stock_threshold AND is_active = true;

-- inventory_transactions
CREATE INDEX idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX idx_inventory_transactions_booking ON inventory_transactions(booking_id) WHERE booking_id IS NOT NULL;

-- marketing_campaigns
CREATE INDEX idx_marketing_campaigns_business ON marketing_campaigns(business_id);
CREATE INDEX idx_marketing_campaigns_status   ON marketing_campaigns(status);
CREATE INDEX idx_marketing_campaigns_scheduled ON marketing_campaigns(scheduled_at) WHERE status = 'scheduled';

-- referral_codes
CREATE INDEX idx_referral_codes_referrer  ON referral_codes(referrer_id);
CREATE INDEX idx_referral_codes_business  ON referral_codes(business_id) WHERE business_id IS NOT NULL;
CREATE INDEX idx_referral_codes_code      ON referral_codes(code);

-- referral_uses
CREATE INDEX idx_referral_uses_code     ON referral_uses(referral_code_id);
CREATE INDEX idx_referral_uses_referred ON referral_uses(referred_id);

-- bookings new columns
CREATE INDEX idx_bookings_staff_id ON bookings(staff_id) WHERE staff_id IS NOT NULL;
CREATE INDEX idx_bookings_source   ON bookings(source);

-- businesses new columns
CREATE INDEX idx_businesses_google_place ON businesses(google_place_id) WHERE google_place_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Updated_at triggers (reuse or create the trigger function)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'staff_members', 'client_profiles', 'cancellation_policies',
    'loyalty_programs', 'loyalty_balances', 'consultation_forms',
    'inventory_products', 'marketing_campaigns'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();',
      tbl
    );
  END LOOP;
END;
$$;

COMMIT;
