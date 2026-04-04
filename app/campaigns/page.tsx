import { CampaignGrid } from "@/components/campaigns/CampaignGrid";
import { Plus } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Campaigns | Sahayata",
    description: "Browse verified disaster relief campaigns.",
};

export default function CampaignsPage() {
    return (
        <div className="min-h-screen bg-background pt-12 pb-24">
            <div className="page-container">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8">
                    <div>
                        <h1 className=" text-4xl text-foreground mb-3">
                            Relief Campaigns
                        </h1>
                        <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
                            Explore active disaster zones requiring immediate funding. Every listed
                            campaign is backed by a verified NGO and bound to an immutable smart contract.
                        </p>
                    </div>

                    <Link
                        href="/campaigns/create"
                        className="shrink-0 px-5 py-2.5 bg-primary text-bg-deep font-semibold rounded-md hover:opacity-90 transition-colors text-[13px] flex items-center gap-2 w-fit"
                    >
                        <Plus size={16} />
                        Start Campaign
                    </Link>
                </div>

                <CampaignGrid />
            </div>
        </div>
    );
}
