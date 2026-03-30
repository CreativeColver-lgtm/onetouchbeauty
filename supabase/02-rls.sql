-- =============================================================================
-- QUERY 2: Row Level Security Policies
-- =============================================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active businesses" ON businesses FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage their business" ON businesses FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create business" ON businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Business owners can manage services" ON services FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own bookings" ON bookings FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Business owners can view their bookings" ON bookings FOR SELECT
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
CREATE POLICY "Authenticated users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = client_id);

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = client_id);
CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE USING (auth.uid() = client_id);
CREATE POLICY "Business owners can reply to reviews" ON reviews FOR UPDATE
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Business Photos
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view photos" ON business_photos FOR SELECT USING (true);
CREATE POLICY "Business owners can manage photos" ON business_photos FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Favourites
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own favourites" ON favourites FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Users can manage own favourites" ON favourites FOR ALL USING (auth.uid() = client_id);

-- Availability
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view availability" ON availability FOR SELECT USING (true);
CREATE POLICY "Business owners can manage availability" ON availability FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));

-- Blocked Dates
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view blocked dates" ON blocked_dates FOR SELECT USING (true);
CREATE POLICY "Business owners can manage blocked dates" ON blocked_dates FOR ALL
  USING (business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()));
