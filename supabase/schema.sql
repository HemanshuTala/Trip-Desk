-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
  created_by UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email)
);

-- Create indexes for better query performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_trip_id ON leads(trip_id);
CREATE INDEX idx_leads_owner_id ON leads(owner_id);
CREATE INDEX idx_call_logs_lead_id ON call_logs(lead_id);
CREATE INDEX idx_trips_status ON trips(status);

-- Create GIN trigram indexes for sub-millisecond wildcard text searches
CREATE INDEX idx_leads_name_trgm ON leads USING gin (name gin_trgm_ops);
CREATE INDEX idx_leads_email_trgm ON leads USING gin (email gin_trgm_ops);
CREATE INDEX idx_leads_phone_trgm ON leads USING gin (phone gin_trgm_ops);

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

CREATE POLICY "Admins can view all trips"
  ON trips FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins and agents can insert trips"
  ON trips FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'agent')
    )
  );

CREATE POLICY "Admins and agents can update trips"
  ON trips FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin', 'agent')
    )
  );

CREATE POLICY "Only admins can delete trips"
  ON trips FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for leads (admin full access, owner can see own leads)
CREATE POLICY "Allow select leads based on role"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'agent'
      )
      AND (owner_id = auth.uid() OR owner_id IS NULL)
    )
  );

CREATE POLICY "Anyone can insert leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update leads based on role"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'agent'
      )
      AND (owner_id = auth.uid() OR owner_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'agent'
      )
      AND (owner_id = auth.uid() OR owner_id IS NULL)
    )
  );

CREATE POLICY "Only admins can delete leads"
  ON leads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for call_logs (admin full access)
CREATE POLICY "Allow select call_logs based on lead access"
  ON call_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = call_logs.lead_id
        AND (leads.owner_id = auth.uid() OR leads.owner_id IS NULL)
    )
  );

CREATE POLICY "Allow insert call_logs based on lead access"
  ON call_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
    OR
    (
      EXISTS (
        SELECT 1 FROM leads
        WHERE leads.id = call_logs.lead_id
          AND (leads.owner_id = auth.uid() OR leads.owner_id IS NULL)
      )
      AND (created_by = auth.uid())
    )
  );

CREATE POLICY "Only admins can update or delete call_logs"
  ON call_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for user_profiles
CREATE POLICY "Allow authenticated users to view all profiles"
  ON user_profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow users to manage own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = id);

-- Trigger to automatically create a user profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_count INTEGER;
  user_role TEXT;
BEGIN
  -- Check how many profiles currently exist
  SELECT COUNT(*) INTO profile_count FROM public.user_profiles;
  
  -- If this is the first user, make them admin, otherwise agent
  IF profile_count = 0 THEN
    user_role := 'admin';
  ELSE
    user_role := 'agent';
  END IF;

  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    user_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = COALESCE(public.user_profiles.role, EXCLUDED.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RPC function to calculate lead counts by status using DB-side grouping
CREATE OR REPLACE FUNCTION get_lead_stats()
RETURNS TABLE (status TEXT, count BIGINT) AS $$
  SELECT status, count(*)
  FROM public.leads
  GROUP BY status;
$$ LANGUAGE sql SECURITY DEFINER;


