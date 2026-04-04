"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { client, chain } from "@/lib/thirdweb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZKProofModal } from "./ZKProofModal";
import { CheckCircle2, XCircle, ExternalLink, MapPin, Eye } from "lucide-react";
import { toast } from "sonner";

export function VoterDashboard() {
    const account = useActiveAccount();
    const { campaigns, loading } = useCampaigns();
    const { mutate: sendTransaction } = useSendTransaction();

    const [zkModalOpen, setZkModalOpen] = useState(false);
    const [activeVote, setActiveVote] = useState<{ addr: string, idx: number, app: boolean, title: string } | null>(null);

    // Filter campaigns that have proofs submitted (IPFS hashes) in their milestones
    const pendingProofs = campaigns?.flatMap(camp =>
        (camp.milestones || []).map((m: any, idx: number) => ({
            ...m,
            campaignAddress: camp.address,
            campaignTitle: camp.title,
            milestoneIdx: idx
        }))
    ).filter((m: any) => m.proofIpfsHash && !m.released) || [];

    const triggerVote = (addr: string, idx: number, app: boolean, title: string) => {
        if (!account) return toast.error("Connect wallet to vote");
        setActiveVote({ addr, idx, app, title });
        setZkModalOpen(true);
    };

    const handleOnChainVote = () => {
        if (!activeVote) return;
        const { addr, idx, app } = activeVote;

        toast.promise(
            new Promise((resolve, reject) => {
                const transaction = prepareContractCall({
                    contract: {
                        client,
                        chain,
                        address: addr as `0x${string}`,
                    },
                    method: "function voteOnMilestone(uint256 _milestoneIndex, bool _approve)",
                    params: [BigInt(idx), app],
                });

                sendTransaction(transaction, {
                    onSuccess: () => {
                        resolve("Vote cast successfully");
                        setZkModalOpen(false);
                    },
                    onError: (err) => reject(err),
                });
            }),
            {
                loading: "Broadcasting Vote to Polygon...",
                success: "Vote recorded on-chain!",
                error: (err) => `Voting failed: ${err.message || "Unknown error"}`,
            }
        );
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading audits...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card border border-border p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Local Verification Portal</h2>
                    <p className="text-muted-foreground text-sm">Audit NGO evidence to authorize fund disbursements.</p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
                        Verified Local Resident
                    </Badge>
                </div>
            </div>

            <div className="grid gap-4">
                {pendingProofs.length === 0 ? (
                    <div className="p-12 border border-dashed border-border rounded-xl text-center">
                        <p className="text-muted-foreground">No pending milestone audits found in your region.</p>
                    </div>
                ) : (
                    pendingProofs.map((proof, i) => (
                        <div key={i} className="bg-card border border-border p-6 rounded-xl group hover:border-accent transition-colors">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 aspect-square bg-muted rounded-lg overflow-hidden border border-border relative">
                                    {/* Link to IPFS evidence */}
                                    <a href={`https://gateway.pinata.cloud/ipfs/${proof.proofIpfsHash}`} target="_blank" rel="noopener noreferrer" className="group/img">
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                            <Eye className="text-white" />
                                        </div>
                                        <img
                                            src={`https://gateway.pinata.cloud/ipfs/${proof.proofIpfsHash}`}
                                            alt="Proof evidence"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.currentTarget.src = "/placeholder-proof.jpg")}
                                        />
                                    </a>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">
                                                {proof.campaignTitle}
                                            </h4>
                                            <h3 className="text-xl font-semibold">{proof.title}</h3>
                                        </div>
                                        <Badge variant="secondary" className="font-mono">
                                            {proof.amount} MATIC
                                        </Badge>
                                    </div>

                                    <div className="flex gap-4 text-xs">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin size={14} className="text-primary" />
                                            <span>2.4km from Disaster Zone</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <ExternalLink size={14} />
                                            <span className="font-mono truncate max-w-[120px]">{proof.proofIpfsHash}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-border/50 flex gap-3">
                                        <Button
                                            onClick={() => triggerVote(proof.campaignAddress, proof.milestoneIdx, true, proof.title)}
                                            className="flex-1 bg-success/10 text-success hover:bg-success hover:text-white border-success/20 gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Approve Release
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => triggerVote(proof.campaignAddress, proof.milestoneIdx, false, proof.title)}
                                            className="px-4 border-danger/20 text-danger/70 hover:bg-danger hover:text-white"
                                        >
                                            <XCircle size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ZKProofModal
                isOpen={zkModalOpen}
                onClose={() => setZkModalOpen(false)}
                onVerified={handleOnChainVote}
                milestoneTitle={activeVote?.title || ""}
            />
        </div>
    );
}
