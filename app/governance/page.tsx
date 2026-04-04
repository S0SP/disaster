import { IdentityBanner } from "@/components/governance/IdentityBanner";
import { ProposalCard } from "@/components/governance/ProposalCard";

export const metadata = {
    title: "Local Governance | Sahayata",
    description: "Participate in transparent milestone approvals.",
};

const ACTIVE_PROPOSALS = [
    {
        id: "prop-1",
        campaignId: "2",
        campaignName: "Guwahati Bank Erosion Relief",
        title: "Release Phase 3: Water Purification",
        amount: 7,
        status: "active" as const,
        endTime: "14h 22m",
        votesYes: 142,
        votesNo: 23,
        proofCid: "QmZZZpizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    },
    {
        id: "prop-2",
        campaignId: "6",
        campaignName: "Majuli Island Medical Camp",
        title: "Release Phase 1: Setup & Doctors",
        amount: 5,
        status: "active" as const,
        endTime: "42h 10m",
        votesYes: 8,
        votesNo: 2,
        proofCid: "QmAAApizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    }
];

const PAST_PROPOSALS = [
    {
        id: "prop-3",
        campaignId: "1",
        campaignName: "Dhubri Flood Relief Phase 1",
        title: "Release Phase 2: Rations",
        amount: 4,
        status: "passed" as const,
        endTime: "Ended",
        votesYes: 240,
        votesNo: 15,
        proofCid: "QmBBBpizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    },
    {
        id: "prop-4",
        campaignId: "5",
        campaignName: "Kaziranga Animal Rescue",
        title: "Release Phase 1: Boat Rentals",
        amount: 8,
        status: "rejected" as const,
        endTime: "Ended",
        votesYes: 12,
        votesNo: 85,
        proofCid: "QmCCCpizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"
    }
];

export default function GovernancePage() {
    return (
        <div className="min-h-screen bg-background pt-12 pb-24">
            <div className="page-container">

                <div className="mb-12">
                    <h1 className=" text-4xl text-foreground mb-3">
                        Local Governance
                    </h1>
                    <p className="text-[14px] text-muted-foreground max-w-2xl leading-relaxed">
                        Your verified identity grants you voting rights for relief campaigns within a 3km radius of your registered address. 1 Aadhaar = 1 Vote.
                    </p>
                </div>

                <IdentityBanner />

                <div className="mb-16">
                    <h2 className=" text-2xl text-foreground mb-6">Active Proposals</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {ACTIVE_PROPOSALS.map(prop => (
                            <ProposalCard key={prop.id} {...prop} />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className=" text-2xl text-foreground mb-6">Past Decisions</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {PAST_PROPOSALS.map(prop => (
                            <ProposalCard key={prop.id} {...prop} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
