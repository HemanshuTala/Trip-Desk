-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_including_gst DECIMAL(10, 2) NOT NULL,
  total_seats INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'closed')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  group_type TEXT NOT NULL CHECK (group_type IN ('solo', 'friends', 'couple', 'family')),
  preferred_month TEXT NOT NULL,
  vibe_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'QUALIFIED', 'VIBE_CHECK_SENT', 'CONFIRMED', 'NOT_A_FIT')),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create call_logs table
CREATE TABLE call_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  next_action TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_trip_id ON leads(trip_id);
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_call_logs_lead_id ON call_logs(lead_id);
CREATE INDEX idx_trips_status ON trips(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips (public read for open trips, admin write)
CREATE POLICY "Public can view open trips"
  ON trips FOR SELECT
  USING (status = 'open');

CREATE POLICY "Admins can insert trips"
  ON trips FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update trips"
  ON trips FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete trips"
  ON trips FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for leads (admin full access)
CREATE POLICY "Admins can view leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert leads"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update leads"
  ON leads FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for call_logs (admin full access)
CREATE POLICY "Admins can view call_logs"
  ON call_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert call_logs"
  ON call_logs FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update call_logs"
  ON call_logs FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete call_logs"
  ON call_logs FOR DELETE
  USING (auth.role() = 'authenticated');

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
