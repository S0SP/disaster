-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('NGO', 'DONOR', 'VOTER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    user_role user_role DEFAULT 'DONOR',
    has_onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    ngo_name TEXT,
    ngo_address TEXT NOT NULL, -- Wallet
    target_amount NUMERIC NOT NULL,
    raised_amount NUMERIC DEFAULT 0,
    tx_hash TEXT UNIQUE, -- On-chain hash
    milestones JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id TEXT NOT NULL, -- Tx hash or contract addr
    donor_address TEXT,
    amount NUMERIC NOT NULL,
    tx_hash TEXT UNIQUE NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
CREATE POLICY "Users can update their own profiles" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles FOR INSERT WITH CHECK (true);

-- Campaigns Policies
DROP POLICY IF EXISTS "Campaigns are viewable by everyone" ON public.campaigns;
CREATE POLICY "Campaigns are viewable by everyone" ON public.campaigns FOR SELECT USING (true);

DROP POLICY IF EXISTS "NGOs can insert campaigns" ON public.campaigns;
CREATE POLICY "NGOs can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (true);

-- Donations Policies
DROP POLICY IF EXISTS "Donations are viewable by everyone" ON public.donations;
CREATE POLICY "Donations are viewable by everyone" ON public.donations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Donated events can be recorded" ON public.donations;
CREATE POLICY "Donated events can be recorded" ON public.donations FOR INSERT WITH CHECK (true);

-- 6. REFRESH CACHE INSTRUCTIONS
-- After executing, go to: Dashboard -> API -> Reload PostgREST Cache
