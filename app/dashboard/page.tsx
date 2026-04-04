"use client";

import { useUser } from "@/components/providers/UserProvider";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { FundFlowChart } from "@/components/dashboard/FundFlowChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CampaignProgressList } from "@/components/dashboard/CampaignProgressList";
import { VoterDashboard } from "@/components/dashboard/VoterDashboard";
import { DonorDashboard } from "@/components/dashboard/DonorDashboard";
import { NGODashboard } from "@/components/dashboard/NGODashboard";
import { ExternalLink, LayoutDashboard, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";
import { CONTRACT_ADDRESSES, POLYGONSCAN_BASE } from "@/lib/contracts";

export default function DashboardPage() {
  const { profile, loading } = useUser();

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center animate-pulse">Synchronizing with Polygon...</div>;

  const isVoter = profile?.user_role === "VOTER";
  const isDonor = profile?.user_role === "DONOR";
  const isNGO = profile?.user_role === "NGO";

  return (
    <div className="min-h-screen bg-background pt-12 pb-24">
      <div className="page-container">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {isVoter && <ShieldCheck className="text-primary" size={32} />}
              {isDonor && <Heart className="text-primary" size={32} />}
              {(isNGO || !profile?.user_role) && <LayoutDashboard className="text-primary" size={32} />}
              <h1 className=" text-4xl text-foreground">
                {isVoter ? "Verifier Dashboard" : isDonor ? "Donor Impact" : "NGO Dashboard"}
              </h1>
            </div>
            <p className="text-[14px] text-muted-foreground max-w-2xl">
              {isVoter
                ? "Regional verification portal for auditing NGO disaster relief evidence."
                : isDonor
                  ? "Personalized overview of your contributions and global relief impact."
                  : "Global overview of all escrowed funds, community verifications, and relief distribution across active zones."
              }
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href={`${POLYGONSCAN_BASE}/address/${CONTRACT_ADDRESSES.sahayataVault}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-md text-[13px] text-muted-foreground hover:text-foreground hover:border-text-secondary transition-colors"
            >
              Vault <ExternalLink size={14} />
            </a>
            <Link
              href="/campaigns"
              className="flex items-center justify-center px-6 py-2 bg-text-primary text-bg-primary font-semibold rounded-md hover:bg-text-secondary transition-colors text-[13px]"
            >
              All Campaigns
            </Link>
          </div>
        </div>

        {isVoter ? (
          <VoterDashboard />
        ) : isDonor ? (
          <DonorDashboard />
        ) : isNGO ? (
          <NGODashboard />
        ) : (
          <>
            <StatsBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <FundFlowChart />
                <CampaignProgressList />
              </div>
              <div className="lg:col-span-1">
                <ActivityFeed />
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
