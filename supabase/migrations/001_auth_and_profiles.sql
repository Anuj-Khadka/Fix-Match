-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE kyc_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');
CREATE TYPE provider_status AS ENUM ('offline', 'online', 'busy');

-- Core profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE,
  avatar_url TEXT,
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customer profiles
CREATE TABLE customer_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  saved_addresses JSONB DEFAULT '[]',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Provider profiles
CREATE TABLE provider_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  business_name TEXT,
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  kyc_status kyc_status DEFAULT 'pending',
  kyc_document_url TEXT,
  kyc_reviewed_at TIMESTAMPTZ,
  kyc_rejection_reason TEXT,
  status provider_status DEFAULT 'offline',
  last_lat DOUBLE PRECISION,
  last_lng DOUBLE PRECISION,
  last_seen_at TIMESTAMPTZ,
  rating_avg NUMERIC(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  acceptance_rate NUMERIC(5,2) DEFAULT 100,
  completion_rate NUMERIC(5,2) DEFAULT 100,
  stripe_account_id TEXT,
  hourly_rate NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin profiles
CREATE TABLE admin_profiles (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Customers can manage their own profile"
  ON customer_profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Providers can manage their own profile"
  ON provider_profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins can view all provider profiles"
  ON provider_profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update provider profiles"
  ON provider_profiles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER provider_profiles_updated_at
  BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile row when a new Supabase auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data->>'role')::user_role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
