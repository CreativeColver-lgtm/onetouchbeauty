-- =============================================================================
-- QUERY 3: Seed Data (demo salons, services, reviews)
-- =============================================================================
-- Note: Since we can't create real auth.users from SQL, we create placeholder
-- UUIDs. For the demo, we'll temporarily disable RLS to insert seed data,
-- then re-enable it.
-- =============================================================================

-- Temporarily disable RLS for seeding
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;

-- ── Demo Users (profiles without auth.users — for display only) ──
-- We'll use fixed UUIDs so we can reference them
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud, instance_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'sarah@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('22222222-2222-2222-2222-222222222222', 'james@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('33333333-3333-3333-3333-333333333333', 'emma@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('44444444-4444-4444-4444-444444444444', 'oliver@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('55555555-5555-5555-5555-555555555555', 'chloe@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  -- Business owners
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'glow@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'beautyroom@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'radiance@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'purebliss@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'luxenails@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa6666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cuttingedge@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa7777-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'serenity@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa8888-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'crownglory@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaa9999-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'velvet@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000'),
  ('aaaabbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'diamond@demo.com', crypt('demo1234', gen_salt('bf')), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000');

-- Client profiles
INSERT INTO profiles (id, full_name, email, role, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Mitchell', 'sarah@demo.com', 'client', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),
  ('22222222-2222-2222-2222-222222222222', 'James Wilson', 'james@demo.com', 'client', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),
  ('33333333-3333-3333-3333-333333333333', 'Emma Thompson', 'emma@demo.com', 'client', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),
  ('44444444-4444-4444-4444-444444444444', 'Oliver Brown', 'oliver@demo.com', 'client', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
  ('55555555-5555-5555-5555-555555555555', 'Chloe Davies', 'chloe@demo.com', 'client', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face');

-- Business owner profiles
INSERT INTO profiles (id, full_name, email, role) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maria Santos', 'glow@demo.com', 'business'),
  ('aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sophie Clarke', 'beautyroom@demo.com', 'business'),
  ('aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Priya Patel', 'radiance@demo.com', 'business'),
  ('aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lauren Hughes', 'purebliss@demo.com', 'business'),
  ('aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Kim Nguyen', 'luxenails@demo.com', 'business'),
  ('aaaa6666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tom Bradley', 'cuttingedge@demo.com', 'business'),
  ('aaaa7777-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Aisha Khan', 'serenity@demo.com', 'business'),
  ('aaaa8888-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Rachel Green', 'crownglory@demo.com', 'business'),
  ('aaaa9999-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jade Taylor', 'velvet@demo.com', 'business'),
  ('aaaabbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nina Kowalski', 'diamond@demo.com', 'business');

-- ── Businesses ──
INSERT INTO businesses (id, owner_id, name, slug, description, type, setting, address, city, postcode, lat, lng, phone, email, cover_image_url, is_verified, is_featured, is_active, subscription_tier, opening_hours) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Glow Studio', 'glow-studio', 'Award-winning hair and beauty salon in the heart of Shoreditch. Specialising in colour, balayage, and luxury treatments.', 'Hair Salon', 'Salon', '42 Rivington Street', 'London', 'EC2A 3LX', 51.5256, -0.0798, '020 7123 4567', 'hello@glowstudio.co.uk', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop', true, true, true, 'business_pro', '{"mon":"09:00-19:00","tue":"09:00-19:00","wed":"09:00-20:00","thu":"09:00-20:00","fri":"09:00-19:00","sat":"09:00-18:00","sun":"10:00-16:00"}'),

  ('b0000002-0000-0000-0000-000000000002', 'aaaa2222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The Beauty Room', 'the-beauty-room', 'Luxury beauty treatments in elegant Kensington surroundings. From facials to full makeovers, we do it all.', 'Beauty Salon', 'Salon', '15 Kensington Church Street', 'London', 'W8 7LX', 51.5035, -0.1925, '020 7234 5678', 'info@thebeautyroom.co.uk', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=500&fit=crop', true, true, true, 'business', '{"mon":"10:00-18:00","tue":"10:00-18:00","wed":"10:00-20:00","thu":"10:00-20:00","fri":"10:00-18:00","sat":"09:00-17:00","sun":"closed"}'),

  ('b0000003-0000-0000-0000-000000000003', 'aaaa3333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Radiance Hair & Beauty', 'radiance-hair-beauty', 'Manchester''s premier hair and beauty destination. Expert stylists, stunning results, every time.', 'Hair Salon', 'Salon', '88 Deansgate', 'Manchester', 'M3 2ER', 53.4794, -2.2451, '0161 234 5678', 'book@radiancebeauty.co.uk', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=500&fit=crop', true, false, true, 'business', '{"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-19:00","thu":"09:00-19:00","fri":"09:00-18:00","sat":"09:00-17:00","sun":"closed"}'),

  ('b0000004-0000-0000-0000-000000000004', 'aaaa4444-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pure Bliss Salon', 'pure-bliss-salon', 'Your sanctuary in Birmingham. Relax, rejuvenate, and leave feeling your absolute best.', 'Spa', 'Salon', '23 Colmore Row', 'Birmingham', 'B3 2BH', 52.4814, -1.9029, '0121 345 6789', 'hello@purebliss.co.uk', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=500&fit=crop', true, false, true, 'business', '{"mon":"10:00-18:00","tue":"10:00-18:00","wed":"10:00-19:00","thu":"10:00-19:00","fri":"10:00-18:00","sat":"09:00-17:00","sun":"11:00-16:00"}'),

  ('b0000005-0000-0000-0000-000000000005', 'aaaa5555-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Luxe Nails & Spa', 'luxe-nails-spa', 'Nail art, gel extensions, and luxurious spa treatments. The best nails in Leeds, hands down.', 'Nail Salon', 'Salon', '5 The Headrow', 'Leeds', 'LS1 6PU', 53.7996, -1.5484, '0113 456 7890', 'nails@luxespa.co.uk', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=500&fit=crop', true, true, true, 'business_pro', '{"mon":"09:30-18:00","tue":"09:30-18:00","wed":"09:30-19:00","thu":"09:30-19:00","fri":"09:30-18:00","sat":"09:00-17:00","sun":"closed"}'),

  ('b0000006-0000-0000-0000-000000000006', 'aaaa6666-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'The Cutting Edge', 'the-cutting-edge', 'Bristol''s sharpest barber and men''s grooming lounge. Classic cuts, modern style.', 'Barber', 'Salon', '71 Park Street', 'Bristol', 'BS1 5PB', 51.4536, -2.6007, '0117 567 8901', 'book@cuttingedge.co.uk', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=500&fit=crop', false, false, true, 'free_trial', '{"mon":"08:00-18:00","tue":"08:00-18:00","wed":"08:00-19:00","thu":"08:00-19:00","fri":"08:00-18:00","sat":"08:00-17:00","sun":"closed"}'),

  ('b0000007-0000-0000-0000-000000000007', 'aaaa7777-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Serenity Beauty Bar', 'serenity-beauty-bar', 'Edinburgh''s hidden gem. Brows, lashes, facials, and the most relaxing experience in the city.', 'Beauty Salon', 'Salon', '18 George Street', 'Edinburgh', 'EH2 2PF', 55.9533, -3.2080, '0131 678 9012', 'hello@serenitybar.co.uk', 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&h=500&fit=crop', true, false, true, 'business', '{"mon":"10:00-18:00","tue":"10:00-18:00","wed":"10:00-19:00","thu":"10:00-19:00","fri":"10:00-18:00","sat":"09:00-17:00","sun":"closed"}'),

  ('b0000008-0000-0000-0000-000000000008', 'aaaa8888-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Crown & Glory', 'crown-and-glory', 'Afro hair specialists and braiding experts. Celebrating natural beauty in Brighton since 2019.', 'Hair Salon', 'Salon', '33 North Laine', 'Brighton', 'BN1 1GN', 50.8252, -0.1377, '01273 789 012', 'info@crownandglory.co.uk', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&h=500&fit=crop', true, false, true, 'business', '{"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-19:00","thu":"09:00-19:00","fri":"09:00-18:00","sat":"09:00-17:00","sun":"closed"}'),

  ('b0000009-0000-0000-0000-000000000009', 'aaaa9999-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Velvet Touch Salon', 'velvet-touch-salon', 'Full-service beauty salon in Liverpool. From hair to nails to lashes — we''ve got you covered.', 'Beauty Salon', 'Salon', '12 Bold Street', 'Liverpool', 'L1 4DS', 53.4045, -2.9780, '0151 890 1234', 'book@velvettouch.co.uk', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&h=500&fit=crop', false, false, true, 'free_trial', '{"mon":"09:00-17:30","tue":"09:00-17:30","wed":"09:00-18:30","thu":"09:00-18:30","fri":"09:00-17:30","sat":"09:00-16:00","sun":"closed"}'),

  ('b0000010-0000-0000-0000-000000000010', 'aaaabbbb-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Diamond Beauty', 'diamond-beauty', 'Nottingham''s luxury beauty destination. Makeup artistry, skincare treatments, and bridal packages.', 'Beauty Salon', 'Salon', '7 Victoria Street', 'Nottingham', 'NG1 2EX', 52.9548, -1.1581, '0115 901 2345', 'hello@diamondbeauty.co.uk', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=500&fit=crop', true, true, true, 'business_pro', '{"mon":"09:00-18:00","tue":"09:00-18:00","wed":"09:00-19:00","thu":"09:00-19:00","fri":"09:00-18:00","sat":"09:00-17:00","sun":"11:00-15:00"}');

-- ── Services ──
-- Glow Studio
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Women''s Cut & Blow Dry', 'Expert cut and professional blow dry', 'Hair', 60, 5500, 1),
  ('b0000001-0000-0000-0000-000000000001', 'Balayage', 'Hand-painted highlights for a natural sun-kissed look', 'Hair', 150, 15000, 2),
  ('b0000001-0000-0000-0000-000000000001', 'Full Head Colour', 'Complete colour transformation', 'Hair', 120, 9500, 3),
  ('b0000001-0000-0000-0000-000000000001', 'Blow Dry & Style', 'Wash, blow dry, and style', 'Hair', 45, 3500, 4),
  ('b0000001-0000-0000-0000-000000000001', 'Olaplex Treatment', 'Bond repair treatment for damaged hair', 'Treatment', 30, 4000, 5);

-- The Beauty Room
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000002-0000-0000-0000-000000000002', 'Luxury Facial', 'Deep cleansing facial with premium products', 'Face', 75, 8500, 1),
  ('b0000002-0000-0000-0000-000000000002', 'Bridal Makeup', 'Full bridal makeup with trial included', 'Makeup', 120, 20000, 2),
  ('b0000002-0000-0000-0000-000000000002', 'Lash Extensions (Full Set)', 'Classic or volume lash extensions', 'Lashes', 90, 6500, 3),
  ('b0000002-0000-0000-0000-000000000002', 'Brow Lamination', 'Sculpted, fluffy brows that last 6 weeks', 'Brows', 45, 4000, 4);

-- Radiance Hair & Beauty
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000003-0000-0000-0000-000000000003', 'Women''s Haircut', 'Precision cut tailored to your style', 'Hair', 45, 4000, 1),
  ('b0000003-0000-0000-0000-000000000003', 'Highlights (Half Head)', 'Beautiful highlights framing the face', 'Hair', 90, 7500, 2),
  ('b0000003-0000-0000-0000-000000000003', 'Keratin Smoothing', 'Frizz-free, glossy hair for up to 3 months', 'Treatment', 120, 12000, 3),
  ('b0000003-0000-0000-0000-000000000003', 'Gel Nails', 'Long-lasting gel manicure', 'Nails', 45, 3500, 4),
  ('b0000003-0000-0000-0000-000000000003', 'Updo / Evening Style', 'Elegant updo for special occasions', 'Hair', 60, 5000, 5);

-- Pure Bliss Salon
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000004-0000-0000-0000-000000000004', 'Full Body Massage', '60-minute relaxation massage', 'Body', 60, 6000, 1),
  ('b0000004-0000-0000-0000-000000000004', 'Hot Stone Therapy', 'Deep relaxation with heated stones', 'Body', 75, 7500, 2),
  ('b0000004-0000-0000-0000-000000000004', 'Aromatherapy Facial', 'Customised facial with essential oils', 'Face', 60, 5500, 3),
  ('b0000004-0000-0000-0000-000000000004', 'Body Wrap', 'Detoxifying or hydrating body wrap', 'Body', 90, 8000, 4);

-- Luxe Nails & Spa
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000005-0000-0000-0000-000000000005', 'Gel Manicure', 'Classic gel manicure with colour', 'Nails', 45, 3000, 1),
  ('b0000005-0000-0000-0000-000000000005', 'Gel Pedicure', 'Luxury gel pedicure with foot massage', 'Nails', 60, 3500, 2),
  ('b0000005-0000-0000-0000-000000000005', 'Acrylic Extensions', 'Full set of acrylic nail extensions', 'Nails', 75, 4500, 3),
  ('b0000005-0000-0000-0000-000000000005', 'Nail Art (per nail)', 'Custom nail art designs', 'Nails', 15, 500, 4),
  ('b0000005-0000-0000-0000-000000000005', 'BIAB Nails', 'Builder in a bottle for natural nail strength', 'Nails', 60, 4000, 5),
  ('b0000005-0000-0000-0000-000000000005', 'Express Manicure', 'Quick shape, file, and polish', 'Nails', 20, 1500, 6);

-- The Cutting Edge
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000006-0000-0000-0000-000000000006', 'Men''s Haircut', 'Classic or modern cut, your choice', 'Hair', 30, 2500, 1),
  ('b0000006-0000-0000-0000-000000000006', 'Beard Trim & Shape', 'Expert beard grooming', 'Hair', 20, 1500, 2),
  ('b0000006-0000-0000-0000-000000000006', 'Hot Towel Shave', 'Traditional straight razor shave', 'Hair', 30, 2000, 3),
  ('b0000006-0000-0000-0000-000000000006', 'Cut & Beard Combo', 'Haircut plus beard trim', 'Hair', 45, 3500, 4);

-- Serenity Beauty Bar
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000007-0000-0000-0000-000000000007', 'Brow Wax & Tint', 'Shape and tint for defined brows', 'Brows', 30, 2500, 1),
  ('b0000007-0000-0000-0000-000000000007', 'Classic Lash Extensions', 'Natural-look individual lash extensions', 'Lashes', 90, 5500, 2),
  ('b0000007-0000-0000-0000-000000000007', 'Volume Lashes', 'Dramatic volume with fan technique', 'Lashes', 120, 7000, 3),
  ('b0000007-0000-0000-0000-000000000007', 'Dermaplaning Facial', 'Exfoliation and peach fuzz removal', 'Face', 60, 6000, 4),
  ('b0000007-0000-0000-0000-000000000007', 'LED Light Therapy', 'Skin rejuvenation with LED technology', 'Face', 30, 3500, 5);

-- Crown & Glory
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000008-0000-0000-0000-000000000008', 'Box Braids', 'Classic box braids, any length', 'Hair', 240, 12000, 1),
  ('b0000008-0000-0000-0000-000000000008', 'Cornrows', 'Straight back or designed cornrows', 'Hair', 120, 6000, 2),
  ('b0000008-0000-0000-0000-000000000008', 'Twist Out', 'Defined twist out on natural hair', 'Hair', 90, 5000, 3),
  ('b0000008-0000-0000-0000-000000000008', 'Silk Press', 'Straightening treatment for natural hair', 'Hair', 90, 6500, 4),
  ('b0000008-0000-0000-0000-000000000008', 'Loc Maintenance', 'Retwist and style maintenance', 'Hair', 60, 4500, 5);

-- Velvet Touch Salon
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000009-0000-0000-0000-000000000009', 'Cut & Colour', 'Haircut with full colour service', 'Hair', 120, 8500, 1),
  ('b0000009-0000-0000-0000-000000000009', 'Gel Nails', 'Beautiful gel nails with choice of colour', 'Nails', 45, 2800, 2),
  ('b0000009-0000-0000-0000-000000000009', 'Lash Lift & Tint', 'Natural lash lift with tint', 'Lashes', 45, 3500, 3),
  ('b0000009-0000-0000-0000-000000000009', 'Waxing (Full Leg)', 'Smooth results that last', 'Hair Removal', 45, 2500, 4);

-- Diamond Beauty
INSERT INTO services (business_id, name, description, category, duration_minutes, price_pence, sort_order) VALUES
  ('b0000010-0000-0000-0000-000000000010', 'Bridal Package', 'Trial + wedding day makeup + touch-up kit', 'Makeup', 180, 35000, 1),
  ('b0000010-0000-0000-0000-000000000010', 'Special Occasion Makeup', 'Glamorous makeup for any event', 'Makeup', 60, 6500, 2),
  ('b0000010-0000-0000-0000-000000000010', 'Hydra Facial', 'Advanced hydrating facial treatment', 'Face', 60, 8000, 3),
  ('b0000010-0000-0000-0000-000000000010', 'Chemical Peel', 'Professional grade skin resurfacing', 'Face', 45, 7000, 4),
  ('b0000010-0000-0000-0000-000000000010', 'Microneedling', 'Collagen-boosting microneedling session', 'Face', 60, 12000, 5);

-- ── Reviews ──
INSERT INTO reviews (business_id, client_id, rating, comment) VALUES
  -- Glow Studio reviews
  ('b0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 5, 'Absolutely love this place! Maria did an incredible balayage — best I''ve ever had. The salon is gorgeous and everyone is so welcoming.'),
  ('b0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 5, 'Been coming here for 2 years and wouldn''t go anywhere else. Consistently amazing cuts and colour.'),
  ('b0000001-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 4, 'Great salon, lovely atmosphere. Slight wait on arrival but the result was worth it. Will definitely be back!'),

  -- The Beauty Room reviews
  ('b0000002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 5, 'Had my bridal makeup done here and it was perfection. Sophie really listened to what I wanted. Tears-proof and lasted all night!'),
  ('b0000002-0000-0000-0000-000000000002', '55555555-5555-5555-5555-555555555555', 4, 'Lovely facial, very relaxing. Products used were top quality. Skin looked amazing for days after.'),

  -- Radiance reviews
  ('b0000003-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 5, 'Priya is a miracle worker with highlights. My hair looks incredible and so natural. Best salon in Manchester!'),
  ('b0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 4, 'Really pleased with my keratin treatment. Hair is so smooth and manageable now. A bit pricey but worth every penny.'),

  -- Pure Bliss reviews
  ('b0000004-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 5, 'The hot stone massage was heavenly. I walked in stressed and walked out floating. Already booked my next one!'),
  ('b0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 5, 'Treated myself to the body wrap and facial combo. Pure bliss is right — the name says it all. Incredible experience.'),
  ('b0000004-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 4, 'Lovely spa, very clean and peaceful. The aromatherapy facial was so relaxing I nearly fell asleep!'),

  -- Luxe Nails reviews
  ('b0000005-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555', 5, 'Best nails in Leeds, no question. Kim is an artist! My gel set lasted a full 3 weeks with zero chips.'),
  ('b0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 5, 'The BIAB treatment has completely transformed my natural nails. They''re so strong now. Can''t recommend enough!'),
  ('b0000005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 4, 'Lovely nail art, really creative designs. Salon is a bit small but the quality more than makes up for it.'),

  -- The Cutting Edge reviews
  ('b0000006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 5, 'Best barber I''ve found in Bristol. Tom knows exactly what he''s doing. The hot towel shave is an experience!'),
  ('b0000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 4, 'Really good haircut, nice relaxed vibe. Would recommend the cut and beard combo — great value.'),

  -- Serenity reviews
  ('b0000007-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 5, 'The volume lashes are stunning! Aisha takes such care and they look completely natural. Edinburgh''s best kept secret.'),
  ('b0000007-0000-0000-0000-000000000007', '55555555-5555-5555-5555-555555555555', 5, 'Had the dermaplaning facial and my skin has never looked better. Aisha really knows her stuff. Booking the LED therapy next!'),

  -- Crown & Glory reviews
  ('b0000008-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333333', 5, 'Finally found someone who really understands afro hair. Rachel did gorgeous box braids — neat, not too tight, and lasted beautifully.'),
  ('b0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 5, 'Love this salon! The silk press was flawless and my hair felt healthy after. So important to find people who care about your hair health.'),

  -- Velvet Touch reviews
  ('b0000009-0000-0000-0000-000000000009', '55555555-5555-5555-5555-555555555555', 4, 'Good all-round salon. Had a cut and colour that turned out really well. Friendly team and reasonable prices for Liverpool.'),
  ('b0000009-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222', 3, 'Nails were nice but the appointment ran 20 minutes late. Results were good though and staff were apologetic.'),

  -- Diamond Beauty reviews
  ('b0000010-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 5, 'Had the Hydra Facial before my wedding and my skin was GLOWING. Nina is incredibly skilled. Worth every penny for the bridal package.'),
  ('b0000010-0000-0000-0000-000000000010', '33333333-3333-3333-3333-333333333333', 5, 'The microneedling has made such a difference to my acne scars. After 3 sessions I can really see the improvement. Nina explains everything clearly.'),
  ('b0000010-0000-0000-0000-000000000010', '55555555-5555-5555-5555-555555555555', 4, 'Special occasion makeup was beautiful. Nina matched my skin tone perfectly and it lasted all evening. Will book again!');

-- ── Business Photos ──
INSERT INTO business_photos (business_id, url, caption, sort_order) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop', 'Our salon', 1),
  ('b0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop', 'Styling area', 2),
  ('b0000002-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop', 'Facial treatment room', 1),
  ('b0000002-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop', 'Makeup station', 2),
  ('b0000003-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop', 'Hair styling', 1),
  ('b0000004-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop', 'Spa room', 1),
  ('b0000004-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop', 'Treatment area', 2),
  ('b0000005-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop', 'Nail art station', 1),
  ('b0000005-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=400&fit=crop', 'Nail designs', 2),
  ('b0000006-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop', 'Barber chair', 1),
  ('b0000007-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop', 'Beauty bar', 1),
  ('b0000008-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&h=400&fit=crop', 'Braiding station', 1),
  ('b0000009-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop', 'Salon interior', 1),
  ('b0000010-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop', 'Treatment room', 1);

-- ── Availability (Mon-Sat for all) ──
INSERT INTO availability (business_id, day_of_week, start_time, end_time, is_available)
SELECT b.id, d.dow, '09:00'::TIME, '18:00'::TIME, true
FROM businesses b
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(dow);

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
