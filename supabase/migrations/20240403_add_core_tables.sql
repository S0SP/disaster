-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    location text NOT NULL,
    ngo_name text NOT NULL,
    ngo_address text NOT NULL, -- Wallet Address
    target_amount numeric NOT NULL,
    raised_amount numeric DEFAULT 0,
    tx_hash text UNIQUE NOT NULL, -- Deployment hash on Polygon
    milestones jsonb NOT NULL DEFAULT '[]',
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
);

-- 2. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id text NOT NULL, -- External tx_hash or addr of campaign
    donor_address text, -- Wallet Address
    amount numeric NOT NULL,
    tx_hash text UNIQUE NOT NULL,
    is_anonymous boolean DEFAULT false,
    status text DEFAULT 'confirmed',
    created_at timestamptz DEFAULT now()
);

-- 3. RLS POLICIES (Public Read / Role-based Write)
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to campaigns for transparency
CREATE POLICY "Public Read Campaigns" ON public.campaigns
    FOR SELECT USING (true);

-- Allow authenticated NGOs to insert campaigns
CREATE POLICY "NGOs Insert Campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access to donations
CREATE POLICY "Public Read Donations" ON public.donations
    FOR SELECT USING (true);

-- Allow authenticated users to record donations
CREATE POLICY "Users Insert Donations" ON public.donations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. RPC FUNCTIONS (Optional for Dashboard Analytics)
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON AS $$
DECLARE
    total_raised numeric;
    total_campaigns bigint;
BEGIN
    SELECT SUM(raised_amount), COUNT(*) 
    INTO total_raised, total_campaigns 
    FROM public.campaigns;
    
    RETURN json_build_object(
        'total_raised', COALESCE(total_raised, 0),
        'active_campaigns', total_campaigns
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
