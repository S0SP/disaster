"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CampaignHeader } from "@/components/campaigns/CampaignHeader";
import { MilestoneTracker } from "@/components/campaigns/MilestoneTracker";
import { VotingPanel } from "@/components/campaigns/VotingPanel";
import { ProofGallery } from "@/components/campaigns/ProofGallery";
import { DonationModal } from "@/components/campaigns/DonationModal";
import { AddressBadge } from "@/components/shared/AddressBadge";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data as fallback
const MOCK_CAMPAIGN = {
  id: "2",
  address: "0x1234567890123456789012345678901234567890",
  title: "Guwahati Bank Erosion Relief",
  ngo_name: "SEEDS India",
  ngo_address: "0x89D24A6b4CcB1B6fAA2625fE562bDD9a23260359",
  location: "Guwahati, Assam",
  status: "voting",
  created_at: "Oct 12, 2025",
  description: "Severe bank erosion by the Brahmaputra river has displaced 500+ families in the Uzan Bazar and Pandu areas. This campaign funds immediate temporary shelters, medical camps, and essential food supplies over the next 4 weeks. All purchases are heavily audited with local merchant invoices.",
  raised_amount: 18.2,
  target_amount: 20,
  milestones: [
    { title: "Emergency Rations & Med Kits", amount: 5, status: "completed", proofIpfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
    { title: "Temporary Shelter Tents", amount: 8, status: "completed", proofIpfsHash: "QmYYYpizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
    { title: "Water Purification Units", amount: 7, status: "voting", proofIpfsHash: "QmZZZpizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
  ]
};

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      if (!id) return;

      // Try fetching by ID or Hash
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .or(`id.eq.${id},tx_hash.eq.${id}`)
        .maybeSingle();

      if (data) {
        setCampaign(data);
      } else if (id === "2") {
        // Fallback for demo ID
        setCampaign(MOCK_CAMPAIGN);
      }
      setLoading(false);
    }

    fetchCampaign();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="page-container space-y-12">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    </div>
  );

  if (!campaign) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">Campaign Not Found</h1>
      <p className="text-muted-foreground mb-6">The campaign you are looking for does not exist or has been removed.</p>
      <button onClick={() => window.history.back()} className="text-primary hover:underline">Go Back</button>
    </div>
  );

  const progressPct = Math.min(100, Math.round(((campaign.raised_amount || 0) / campaign.target_amount) * 100));

  // Extract proofs from milestones
  const proofs = (campaign.milestones || [])
    .filter((m: any) => m.proofIpfsHash)
    .map((m: any, idx: number) => ({
      id: `p${idx}`,
      cid: m.proofIpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${m.proofIpfsHash}`,
      description: m.title + " - Evidence",
      timestamp: new Date().toISOString(), // Mock timestamp
      location: campaign.location,
      verifiedBy: Math.floor(Math.random() * 100) + 10 // Mock verifier count
    }));

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="page-container">

        {/* Top Header */}
        <CampaignHeader
          id={campaign.id}
          name={campaign.title || campaign.name}
          ngoName={campaign.ngo_name || campaign.ngoName}
          ngoAddress={campaign.ngo_address || campaign.ngoAddress}
          location={campaign.location}
          status={campaign.status}
          createdAt={campaign.created_at || campaign.createdAt}
          description={campaign.description}
          raised={campaign.raised_amount || campaign.raised || 0}
          target={campaign.target_amount || campaign.target}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content (Left) */}
          <div className="lg:col-span-2 flex flex-col gap-12">

            {/* Funding Progress (inline) */}
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className=" text-4xl text-foreground tracking-tight mb-1">
                    {campaign.raised_amount || 0} <span className="text-[20px] text-muted-foreground">MATIC</span>
                  </div>
                  <div className="text-[13px] text-muted-foreground font-mono">
                    raised of {campaign.target_amount} MATIC target
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[24px] font-semibold text-foreground tracking-tight">
                    {progressPct}%
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${progressPct === 100 ? 'bg-success' : 'bg-primary'}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsDonateOpen(true)}
                  className="flex-1 py-3.5 bg-text-primary text-bg-primary font-semibold rounded-lg hover:bg-text-secondary transition-colors text-[14px]"
                >
                  Fund this Campaign
                </button>
              </div>
            </div>

            {/* Voting Panel (shown conditionally if active voting phase) */}
            {campaign.status === "voting" && (
              <VotingPanel
                campaignId={campaign.address || campaign.tx_hash}
                milestoneId="current"
                votesYes={142}
                votesNo={23}
                totalVoters={250}
              />
            )}

            {/* Proof Gallery */}
            {(proofs.length > 0) && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className=" text-[24px] text-foreground">Immutable Proofs</h3>
                  <span className="text-[12px] text-muted-foreground/70 px-3 py-1 bg-muted rounded-full border border-border">
                    Stored on IPFS
                  </span>
                </div>
                <ProofGallery proofs={proofs} />
              </div>
            )}

            {/* Milestones */}
            <MilestoneTracker milestones={campaign.milestones || []} />

          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* NGO Information */}
            <div className="bg-card border border-border p-6 rounded-xl">
              <h4 className="text-[12px] text-muted-foreground/70 uppercase tracking-wider font-mono mb-4">
                Organizer
              </h4>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full border border-border flex items-center justify-center text-muted-foreground  text-xl">
                  {campaign.ngo_name?.[0] || 'S'}
                </div>
                <div>
                  <div className="text-[15px] font-medium text-foreground">{campaign.ngo_name || campaign.ngoName}</div>
                  <div className="text-[12px] text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    Verified Organization
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-[12px] mb-2">
                  <span className="text-muted-foreground">On-Chain Rep:</span>
                  <span className="text-foreground font-mono">98/100</span>
                </div>
                <div className="flex justify-between items-center text-[12px]">
                  <span className="text-muted-foreground">Track Record:</span>
                  <span className="text-foreground">Multiple successful camps</span>
                </div>
              </div>
            </div>

            {/* Contract Details */}
            <div className="bg-muted/30 border border-border p-6 rounded-xl">
              <h4 className="text-[12px] text-muted-foreground/70 uppercase tracking-wider font-mono mb-4">
                Smart Contract
              </h4>
              <div className="space-y-3 text-[13px]">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Contract Address</span>
                  <AddressBadge address={campaign.address || "0x1234567890123456789012345678901234567890"} polygonscan />
                </div>
                <div className="flex flex-col gap-1 pt-3 border-t border-border/50">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground font-mono select-all">Polygon Amoy Testnet</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      <DonationModal
        open={isDonateOpen}
        onOpenChange={setIsDonateOpen}
        campaignName={campaign.title || campaign.name}
        campaignTarget={campaign.target_amount || campaign.target}
        campaignRaised={campaign.raised_amount || campaign.raised || 0}
        campaignId={campaign.address || campaign.tx_hash}
      />
    </div>
  );
}
