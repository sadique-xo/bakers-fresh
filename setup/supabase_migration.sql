-- ============================================================================
-- Baker's Fresh — Supabase Schema (V1)
-- ============================================================================
-- HOW TO USE:
-- 1. Create new Supabase project at https://supabase.com (region: ap-south-1 / Mumbai)
-- 2. Go to SQL Editor
-- 3. Paste this entire file
-- 4. Click "Run"
-- 5. Verify tables exist in Table Editor
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE order_status AS ENUM (
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
  'rejected'
);

CREATE TYPE delivery_method AS ENUM ('pickup', 'delivery');

-- ============================================================================
-- HELPER: updated_at trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============================================================================
-- CATEGORIES
-- ============================================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- CAKES
-- ============================================================================

CREATE TABLE cakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  gallery_urls TEXT[],
  base_price_inr INT NOT NULL,
  flavors TEXT[],
  sizes_available TEXT[],
  is_eggless BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX cakes_category_idx ON cakes(category_id);
CREATE INDEX cakes_featured_idx ON cakes(is_featured) WHERE is_featured = true;
CREATE INDEX cakes_active_idx ON cakes(is_active) WHERE is_active = true;

CREATE TRIGGER cakes_updated_at BEFORE UPDATE ON cakes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ORDERS
-- ============================================================================

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT '',
  status order_status DEFAULT 'pending',

  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,

  cake_id UUID REFERENCES cakes(id) ON DELETE SET NULL,
  cake_type TEXT,
  cake_size TEXT,
  cake_flavor TEXT,
  is_eggless BOOLEAN DEFAULT false,
  message_on_cake TEXT,
  reference_image_urls TEXT[],
  special_instructions TEXT,

  delivery_method delivery_method NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time_slot TEXT,
  delivery_address TEXT,

  estimated_price_inr INT,
  final_price_inr INT,

  admin_notes TEXT,
  outlet TEXT,
  confirmed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_phone_idx ON orders(customer_phone);
CREATE INDEX orders_delivery_date_idx ON orders(delivery_date);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- Auto-generate order number BF-2026-0001 format
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := 'BF-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                        LPAD(nextval('order_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- LOCATIONS
-- ============================================================================

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  google_maps_url TEXT,
  google_maps_embed TEXT,
  hours JSONB,
  latitude NUMERIC,
  longitude NUMERIC,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  source TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read for catalog data
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active cakes" ON cakes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active locations" ON locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view testimonials" ON testimonials
  FOR SELECT USING (true);

-- Public can insert orders (the order form)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can manage orders
CREATE POLICY "Authenticated users can read orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete orders" ON orders
  FOR DELETE USING (auth.role() = 'authenticated');

-- Authenticated users can manage all catalog data
CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage cakes" ON cakes
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage locations" ON locations
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================================
-- SEED DATA — Categories, Locations, Demo Cakes, Testimonials
-- ============================================================================

-- Categories
INSERT INTO categories (slug, name, description, display_order) VALUES
  ('birthday', 'Birthday Cakes', 'Make every birthday memorable', 1),
  ('anniversary', 'Anniversary Cakes', 'Celebrate love with sweet moments', 2),
  ('wedding', 'Wedding Cakes', 'Premium tiered cakes for your big day', 3),
  ('photo-cake', 'Photo Cakes', 'Edible photos printed on cream', 4),
  ('designer', 'Designer & Custom', 'Bring your wildest cake ideas to life', 5),
  ('kids', 'Kids Cakes', 'Cartoon characters and fun themes', 6),
  ('eggless', 'Eggless Cakes', 'Pure vegetarian, equally delicious', 7),
  ('pastries', 'Pastries', 'Single-serve treats, freshly made daily', 8);

-- Locations (the 4 real Baker's Fresh outlets)
INSERT INTO locations (slug, name, is_main, address, phone, whatsapp, google_maps_url, hours, display_order) VALUES
  (
    'lalpur',
    'Lalpur',
    true,
    'Bimal Shopping Complex, Lalpur, near Central Bank, opposite Amravati Complex, Ranchi 834001',
    '+919934627281',
    '+917004502102',
    'https://maps.google.com/?q=Bakers+Fresh+Lalpur+Ranchi',
    '{"monday":"8:00 AM - 10:00 PM","tuesday":"8:00 AM - 10:00 PM","wednesday":"8:00 AM - 10:00 PM","thursday":"8:00 AM - 10:00 PM","friday":"8:00 AM - 10:00 PM","saturday":"8:00 AM - 10:00 PM","sunday":"8:00 AM - 10:00 PM"}'::jsonb,
    1
  ),
  (
    'bit-mesra',
    'BIT Mesra',
    false,
    'BIT Mesra Campus, Mesra, Ranchi 835215',
    '+917004502102',
    '+917004502102',
    'https://maps.google.com/?q=Bakers+Fresh+BIT+Mesra',
    '{"monday":"9:00 AM - 9:30 PM","tuesday":"9:00 AM - 9:30 PM","wednesday":"9:00 AM - 9:30 PM","thursday":"9:00 AM - 9:30 PM","friday":"9:00 AM - 9:30 PM","saturday":"9:00 AM - 9:30 PM","sunday":"9:00 AM - 9:30 PM"}'::jsonb,
    2
  ),
  (
    'neori',
    'Neori',
    false,
    'Vikas, Pahan Complex, Neori, Ranchi',
    '+917004502102',
    '+917004502102',
    'https://maps.google.com/?q=Bakers+Fresh+Neori+Ranchi',
    '{"monday":"9:00 AM - 9:30 PM","tuesday":"9:00 AM - 9:30 PM","wednesday":"9:00 AM - 9:30 PM","thursday":"9:00 AM - 9:30 PM","friday":"9:00 AM - 9:30 PM","saturday":"9:00 AM - 9:30 PM","sunday":"9:00 AM - 9:30 PM"}'::jsonb,
    3
  ),
  (
    'bariatu',
    'Bariatu Road',
    false,
    'Opposite Shree Kaushal Tower, Bariatu Road, Ranchi',
    '+917004502102',
    '+917004502102',
    'https://maps.google.com/?q=Bakers+Fresh+Bariatu+Ranchi',
    '{"monday":"9:00 AM - 10:30 PM","tuesday":"9:00 AM - 10:30 PM","wednesday":"9:00 AM - 10:30 PM","thursday":"9:00 AM - 10:30 PM","friday":"9:00 AM - 10:30 PM","saturday":"9:00 AM - 10:30 PM","sunday":"9:00 AM - 10:30 PM"}'::jsonb,
    4
  );

-- Demo cakes (replace with real cakes when client provides photos)
INSERT INTO cakes (slug, category_id, name, description, image_url, base_price_inr, flavors, sizes_available, is_eggless, is_featured, display_order) VALUES
  (
    'midnight-truffle',
    (SELECT id FROM categories WHERE slug = 'birthday'),
    'Midnight Truffle',
    'Rich, fudgy layers of Belgian chocolate with a silky ganache finish. Perfect for the ultimate chocolate lover.',
    'https://placehold.co/600x600/E91E63/FFF8F3/png?text=Midnight+Truffle',
    650,
    ARRAY['chocolate truffle', 'dark chocolate'],
    ARRAY['0.5kg', '1kg', '1.5kg', '2kg', '3kg'],
    false,
    true,
    1
  ),
  (
    'classic-truffle',
    (SELECT id FROM categories WHERE slug = 'birthday'),
    'Classic Truffle',
    'Dark, rich, and incredibly moist chocolate layers.',
    'https://placehold.co/600x600/2A1A2C/FFF8F3/png?text=Classic+Truffle',
    550,
    ARRAY['chocolate truffle'],
    ARRAY['0.5kg', '1kg', '1.5kg', '2kg'],
    false,
    true,
    2
  ),
  (
    'strawberry-cloud',
    (SELECT id FROM categories WHERE slug = 'birthday'),
    'Strawberry Cloud',
    'Light vanilla sponge layered with fresh strawberry compote and whipped chantilly.',
    'https://placehold.co/600x600/FCE4EC/2A1A2C/png?text=Strawberry+Cloud',
    580,
    ARRAY['strawberry', 'vanilla'],
    ARRAY['0.5kg', '1kg', '1.5kg'],
    false,
    true,
    3
  ),
  (
    'velvet-dream',
    (SELECT id FROM categories WHERE slug = 'eggless'),
    'Velvet Dream',
    'Our signature red velvet recipe with a subtle hint of cocoa, generously frosted with cream cheese.',
    'https://placehold.co/600x600/AD1457/FFF8F3/png?text=Velvet+Dream',
    620,
    ARRAY['red velvet'],
    ARRAY['0.5kg', '1kg', '1.5kg', '2kg'],
    true,
    true,
    4
  ),
  (
    'berry-delight',
    (SELECT id FROM categories WHERE slug = 'birthday'),
    'Berry Delight',
    'Light vanilla sponge with fresh seasonal berries.',
    'https://placehold.co/600x600/FFB088/2A1A2C/png?text=Berry+Delight',
    550,
    ARRAY['vanilla', 'mixed berry'],
    ARRAY['0.5kg', '1kg', '1.5kg'],
    false,
    true,
    5
  ),
  (
    'belgian-chocolate-anniversary',
    (SELECT id FROM categories WHERE slug = 'anniversary'),
    'Belgian Chocolate Heart',
    'Heart-shaped Belgian chocolate cake with rose petal accents. The romantic centerpiece.',
    'https://placehold.co/600x600/E91E63/FFF8F3/png?text=Belgian+Heart',
    1160,
    ARRAY['chocolate truffle', 'dark chocolate'],
    ARRAY['1kg', '1.5kg', '2kg'],
    false,
    false,
    6
  ),
  (
    'photo-print-classic',
    (SELECT id FROM categories WHERE slug = 'photo-cake'),
    'Custom Photo Cake',
    'Your favorite photo printed on edible cream. Choose chocolate or vanilla base.',
    'https://placehold.co/600x600/D4A574/2A1A2C/png?text=Photo+Cake',
    899,
    ARRAY['chocolate', 'vanilla', 'butterscotch'],
    ARRAY['1kg', '1.5kg', '2kg'],
    false,
    false,
    7
  ),
  (
    'kids-character-cake',
    (SELECT id FROM categories WHERE slug = 'kids'),
    'Cartoon Character Cake',
    'Chhota Bheem, Doraemon, Spider-Man — tell us who, we''ll bake it.',
    'https://placehold.co/600x600/A8D8C7/2A1A2C/png?text=Kids+Cake',
    1299,
    ARRAY['chocolate', 'vanilla', 'strawberry'],
    ARRAY['1kg', '1.5kg', '2kg'],
    false,
    false,
    8
  );

-- Testimonials (sourced from typical Ranchi bakery reviews — replace with real ones from Google/Justdial)
INSERT INTO testimonials (customer_name, rating, review, source, is_featured, display_order) VALUES
  ('Priya S.', 5, 'Ordered a custom photo cake for my daughter''s birthday. The team called within an hour, suggested options I hadn''t thought of, and delivered exactly on time. Cake was fresh, the photo print was perfect.', 'google', true, 1),
  ('Rohan K.', 5, 'Been buying from Baker''s Fresh Lalpur since 2019. Bread is consistently soft, cakes are fresh. The custom cake order through their website was so much easier than the usual phone back-and-forth.', 'google', true, 2),
  ('Anita M.', 5, 'Anniversary cake delivered on time, beautifully decorated. Eggless option was 100% pure veg as promised. My family loved it.', 'justdial', true, 3);

-- ============================================================================
-- DONE
-- ============================================================================
-- Next steps:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create bucket "order-references" — public: false, file size: 10 MB,
--    allowed MIME: image/jpeg, image/png, image/webp, image/heic
-- 3. Create bucket "cake-images" — public: true, file size: 5 MB,
--    allowed MIME: image/jpeg, image/png, image/webp
-- 4. Apply storage policies (see 03_TECH.md)
-- 5. Authentication > Users > Invite owner email (this is your admin login)
-- 6. Settings > API > copy URL, anon key, service_role key for .env.local
-- ============================================================================
