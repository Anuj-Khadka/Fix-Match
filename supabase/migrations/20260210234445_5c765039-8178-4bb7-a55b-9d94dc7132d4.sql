
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Service categories
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT
);
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.service_categories FOR SELECT USING (true);

-- Seed categories
INSERT INTO public.service_categories (name, slug, description, icon) VALUES
  ('Plumbing', 'plumbing', 'Pipe repairs, leaks, drain cleaning, water heater service', 'droplets'),
  ('Electrical', 'electrical', 'Wiring, outlets, panel upgrades, lighting installation', 'zap'),
  ('HVAC', 'hvac', 'Heating, cooling, ventilation repair and installation', 'wind'),
  ('Locksmith', 'locksmith', 'Lock changes, lockouts, key duplication, security upgrades', 'key'),
  ('Cleaning', 'cleaning', 'Deep cleaning, move-in/out cleaning, regular maintenance', 'sparkles'),
  ('Pest Control', 'pest-control', 'Insect removal, rodent control, prevention treatments', 'bug'),
  ('Appliance Repair', 'appliance-repair', 'Refrigerator, washer, dryer, dishwasher repair', 'refrigerator'),
  ('Painting', 'painting', 'Interior and exterior painting, touch-ups, wallpaper', 'paintbrush'),
  ('Carpentry', 'carpentry', 'Custom woodwork, furniture repair, deck building', 'hammer'),
  ('General Repair', 'general-repair', 'Handyman services, general fixes, mounting, assembly', 'wrench'),
  ('Landscaping', 'landscaping', 'Lawn care, tree trimming, garden design, irrigation', 'trees'),
  ('Security', 'security', 'Alarm systems, camera installation, access control', 'shield-check');

-- Providers
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_address TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  hourly_rate_min NUMERIC(10,2),
  hourly_rate_max NUMERIC(10,2),
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers are public" ON public.providers FOR SELECT USING (true);
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Provider services junction
CREATE TABLE public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
  UNIQUE(provider_id, category_id)
);
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Provider services are public" ON public.provider_services FOR SELECT USING (true);

-- Urgency enum
CREATE TYPE public.urgency_level AS ENUM ('now', 'today', 'flexible');
CREATE TYPE public.request_status AS ENUM ('submitted', 'matched', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Service requests
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.service_categories(id),
  description TEXT,
  urgency public.urgency_level NOT NULL DEFAULT 'today',
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_address TEXT,
  status public.request_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Helper function to get profile id
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1;
$$;

CREATE POLICY "Users can view own requests" ON public.service_requests FOR SELECT TO authenticated USING (user_id = public.get_my_profile_id());
CREATE POLICY "Users can create own requests" ON public.service_requests FOR INSERT TO authenticated WITH CHECK (user_id = public.get_my_profile_id());
CREATE POLICY "Users can update own requests" ON public.service_requests FOR UPDATE TO authenticated USING (user_id = public.get_my_profile_id());
CREATE POLICY "Users can delete own requests" ON public.service_requests FOR DELETE TO authenticated USING (user_id = public.get_my_profile_id());
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id),
  status public.booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT TO authenticated
  USING (request_id IN (SELECT id FROM public.service_requests WHERE user_id = public.get_my_profile_id()));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (request_id IN (SELECT id FROM public.service_requests WHERE user_id = public.get_my_profile_id()));
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some providers
INSERT INTO public.providers (name, bio, location_lat, location_lng, location_address, rating, review_count, is_verified, hourly_rate_min, hourly_rate_max, years_experience) VALUES
  ('Mike''s Plumbing', 'Licensed master plumber with 15+ years experience.', 40.7128, -74.0060, 'New York, NY', 4.9, 127, true, 75, 150, 15),
  ('SparkTech Electric', 'Full-service electrical contracting. Residential & commercial.', 40.7580, -73.9855, 'Midtown, NY', 4.8, 89, true, 80, 160, 12),
  ('CoolAir HVAC', 'Heating and cooling experts. 24/7 emergency service.', 40.7282, -73.7949, 'Queens, NY', 4.7, 64, true, 90, 180, 10),
  ('QuickLock Services', 'Fast, reliable locksmith. Licensed and insured.', 40.6892, -74.0445, 'Brooklyn, NY', 4.6, 45, true, 60, 120, 8),
  ('CleanStar Pro', 'Professional cleaning services for homes and offices.', 40.7484, -73.9967, 'Chelsea, NY', 4.8, 156, true, 40, 80, 7),
  ('BugAway Pest Control', 'Eco-friendly pest control solutions.', 40.7614, -73.9776, 'Upper East Side, NY', 4.5, 38, true, 70, 140, 9),
  ('FixIt Appliance', 'All major appliance brands repaired same day.', 40.7831, -73.9712, 'Upper West Side, NY', 4.7, 72, true, 65, 130, 11),
  ('ColorPro Painting', 'Interior and exterior painting specialists.', 40.6782, -73.9442, 'Park Slope, NY', 4.9, 93, true, 50, 100, 14);

-- Link providers to categories
DO $$
DECLARE
  plumbing_id UUID;
  electrical_id UUID;
  hvac_id UUID;
  locksmith_id UUID;
  cleaning_id UUID;
  pest_id UUID;
  appliance_id UUID;
  painting_id UUID;
BEGIN
  SELECT id INTO plumbing_id FROM public.service_categories WHERE slug = 'plumbing';
  SELECT id INTO electrical_id FROM public.service_categories WHERE slug = 'electrical';
  SELECT id INTO hvac_id FROM public.service_categories WHERE slug = 'hvac';
  SELECT id INTO locksmith_id FROM public.service_categories WHERE slug = 'locksmith';
  SELECT id INTO cleaning_id FROM public.service_categories WHERE slug = 'cleaning';
  SELECT id INTO pest_id FROM public.service_categories WHERE slug = 'pest-control';
  SELECT id INTO appliance_id FROM public.service_categories WHERE slug = 'appliance-repair';
  SELECT id INTO painting_id FROM public.service_categories WHERE slug = 'painting';

  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, plumbing_id FROM public.providers p WHERE p.name = 'Mike''s Plumbing';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, electrical_id FROM public.providers p WHERE p.name = 'SparkTech Electric';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, hvac_id FROM public.providers p WHERE p.name = 'CoolAir HVAC';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, locksmith_id FROM public.providers p WHERE p.name = 'QuickLock Services';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, cleaning_id FROM public.providers p WHERE p.name = 'CleanStar Pro';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, pest_id FROM public.providers p WHERE p.name = 'BugAway Pest Control';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, appliance_id FROM public.providers p WHERE p.name = 'FixIt Appliance';
  INSERT INTO public.provider_services (provider_id, category_id)
  SELECT p.id, painting_id FROM public.providers p WHERE p.name = 'ColorPro Painting';
END $$;
