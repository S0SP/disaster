-- 1. Create role type safely
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('NGO', 'DONOR', 'VOTER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  ngo_name TEXT,
  ngo_address TEXT NOT NULL,
  target_amount DECIMAL NOT NULL,
  raised_amount DECIMAL DEFAULT 0,
  tx_hash TEXT,
  milestones JSONB,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Donations Table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id TEXT NOT NULL, -- Can be UUID or contract address
  donor_address TEXT,
  amount DECIMAL NOT NULL,
  tx_hash TEXT UNIQUE NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "NGO can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert donations" ON public.donations FOR INSERT WITH CHECK (true);

-- IMPORTANT: If you get "Could not find table public.profiles", 
-- make sure you run this script in the SQL Editor and then 
-- go to Settings -> Database -> "Reload PostgREST Cache" 
-- (or just wait a minute).

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (true); -- We'll refine this later for production

-- 3. Allow anonymous insertions for new profiles 
-- (Necessary because we are syncing Thirdweb auth to Supabase via client)
CREATE POLICY "Allow profile creation" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- 4. Allow public read access
CREATE POLICY "Public read access"
ON public.profiles FOR SELECT
USING (true);

-- IMPORTANT: After running this, if you still get RLS errors:
-- 1. Ensure "Enable Row Level Security" is ON for the profiles table.
-- 2. Check that you don't have conflicting policies.

-- Note: Since we are using Thirdweb (In-App Wallet), 
-- we will use service-role/anon keys from the frontend 
-- for the initial sync, but RLS should be tight.
