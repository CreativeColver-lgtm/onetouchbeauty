-- =============================================================================
-- One Touch Beauty — Database Schema
-- =============================================================================
-- Run this against your Supabase project SQL editor.
-- All monetary values stored in pence (GBP) to avoid floating-point issues.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Custom ENUM types
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('client', 'business');
CREATE TYPE business_setting AS ENUM ('Home', 'Salon', 'Mobile');
CREATE TYPE subscription_tier AS ENUM ('free_trial', 'business', 'business_pro');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- ---------------------------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- ---------------------------------------------------------------------------
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  role        user_role NOT NULL DEFAULT 'client',
  id_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- RLS policies (enable RLS first, then add policies)
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
-- CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);

-- ---------------------------------------------------------------------------
-- Businesses
-- ---------------------------------------------------------------------------
CREATE TABLE businesses (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id                UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  slug                    TEXT UNIQUE NOT NULL,
  description             TEXT,
  type                    TEXT NOT NULL,  -- e.g. 'Hair Salon', 'Nail Salon', 'Barber', 'Spa'
  setting                 business_setting NOT NULL DEFAULT 'Salon',
  address                 TEXT,
  city                    TEXT,
  postcode                TEXT,
  lat                     DOUBLE PRECISION,
  lng                     DOUBLE PRECISION,
  phone                   TEXT,
  email                   TEXT,
  website                 TEXT,
  opening_hours           JSONB DEFAULT '{}',
  logo_url                TEXT,
  cover_image_url         TEXT,
  is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured             BOOLEAN NOT NULL DEFAULT FALSE,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  subscription_tier       subscription_tier NOT NULL DEFAULT 'free_trial',
  subscription_expires_at TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_type ON businesses(type);
CREATE INDEX idx_businesses_active ON businesses(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_businesses_featured ON businesses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_businesses_location ON businesses(lat, lng);

-- RLS policies
-- ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Active businesses are viewable" ON businesses FOR SELECT USING (is_active = true);
-- CREATE POLICY "Owners can manage their businesses" ON businesses FOR ALL USING (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------
CREATE TABLE services (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id      UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  description      TEXT,
  category         TEXT,
  duration_minutes INTEGER NOT NULL,
  price_pence      INTEGER NOT NULL,  -- stored in pence (GBP)
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_services_business ON services(business_id);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(business_id, is_active) WHERE is_active = TRUE;

-- RLS policies
-- ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Active services are viewable" ON services FOR SELECT USING (is_active = true);
-- CREATE POLICY "Business owners can manage services" ON services FOR ALL
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
CREATE TABLE bookings (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id              UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  client_id                UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id               UUID NOT NULL REFERENCES services(id) ON DELETE SET NULL,
  date                     DATE NOT NULL,
  start_time               TIME NOT NULL,
  end_time                 TIME NOT NULL,
  status                   booking_status NOT NULL DEFAULT 'pending',
  total_pence              INTEGER NOT NULL,
  notes                    TEXT,
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false}',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_business ON bookings(business_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_date ON bookings(business_id, date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- RLS policies
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Clients can view own bookings" ON bookings FOR SELECT USING (auth.uid() = client_id);
-- CREATE POLICY "Business owners can view their bookings" ON bookings FOR SELECT
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
-- CREATE POLICY "Clients can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  rating      SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  reply       TEXT,  -- business owner reply
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_client ON reviews(client_id);
CREATE INDEX idx_reviews_rating ON reviews(business_id, rating);

-- RLS policies
-- ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Reviews are publicly viewable" ON reviews FOR SELECT USING (true);
-- CREATE POLICY "Clients can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = client_id);
-- CREATE POLICY "Business owners can reply" ON reviews FOR UPDATE
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Business Photos
-- ---------------------------------------------------------------------------
CREATE TABLE business_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  caption     TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_photos_business ON business_photos(business_id);

-- RLS policies
-- ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Photos are publicly viewable" ON business_photos FOR SELECT USING (true);
-- CREATE POLICY "Business owners can manage photos" ON business_photos FOR ALL
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Favourites
-- ---------------------------------------------------------------------------
CREATE TABLE favourites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_id, business_id)
);

CREATE INDEX idx_favourites_client ON favourites(client_id);
CREATE INDEX idx_favourites_business ON favourites(business_id);

-- RLS policies
-- ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own favourites" ON favourites FOR SELECT USING (auth.uid() = client_id);
-- CREATE POLICY "Users can manage own favourites" ON favourites FOR ALL USING (auth.uid() = client_id);

-- ---------------------------------------------------------------------------
-- Availability
-- ---------------------------------------------------------------------------
CREATE TABLE availability (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id  UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_availability_business ON availability(business_id);

-- RLS policies
-- ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Availability is publicly viewable" ON availability FOR SELECT USING (true);
-- CREATE POLICY "Business owners can manage availability" ON availability FOR ALL
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Blocked Dates
-- ---------------------------------------------------------------------------
CREATE TABLE blocked_dates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  reason      TEXT,
  UNIQUE(business_id, date)
);

CREATE INDEX idx_blocked_dates_business ON blocked_dates(business_id);
CREATE INDEX idx_blocked_dates_date ON blocked_dates(business_id, date);

-- RLS policies
-- ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Blocked dates are publicly viewable" ON blocked_dates FOR SELECT USING (true);
-- CREATE POLICY "Business owners can manage blocked dates" ON blocked_dates FOR ALL
--   USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Helper function: auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
