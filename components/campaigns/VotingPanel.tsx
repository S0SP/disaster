"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { TransactionStatus } from "../shared/TransactionStatus";

interface VotingPanelProps {
    campaignId: string;
    milestoneId: string;
    votesYes: number;
    votesNo: number;
    totalVoters: number;
}

export function VotingPanel({ campaignId, milestoneId, votesYes, votesNo, totalVoters }: VotingPanelProps) {
    const [vote, setVote] = useState<"yes" | "no" | null>(null);
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<string>();

    const totalVotesCast = votesYes + votesNo;
    const yesPct = totalVotesCast > 0 ? Math.round((votesYes / totalVotesCast) * 100) : 0;
    const noPct = totalVotesCast > 0 ? Math.round((votesNo / totalVotesCast) * 100) : 0;
    const quorumPct = Math.round((totalVotesCast / totalVoters) * 100);

    const handleVote = (selectedVote: "yes" | "no") => {
        setVote(selectedVote);
        setTxStatus("pending");

        // Simulate transaction
        setTimeout(() => {
            setTxStatus("success");
            setTxHash("0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
        }, 2500);
    };

    if (txStatus !== "idle" && txStatus !== "error") {
        return (
            <div className="bg-card border border-border p-6 rounded-xl mb-8">
                <h3 className=" text-[20px] text-foreground mb-4">Cast your vote</h3>
                <TransactionStatus status={txStatus as any} txHash={txHash} />
                {txStatus === "success" && (
                    <p className="text-[13px] text-muted-foreground mt-4">
                        Thank you for participating in local governance. Your identity validation weight has been applied.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="bg-card border border-border p-6 rounded-xl mb-8 border-l-2 border-l-warning/50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                <div>
                    <h3 className=" text-[20px] text-foreground mb-2 tracking-wide">
                        Active Community Vote
                    </h3>
                    <p className="text-[13px] text-muted-foreground">
                        Release Phase 2 funds? Requires 51% approval from verified locals within 3km of the camp.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => handleVote("yes")}
                        className="flex items-center gap-2 px-4 py-2 bg-success/10 hover:bg-success/20 border border-success/30 text-success rounded-md text-[13px] font-medium transition-colors"
                    >
                        <ThumbsUp size={16} />
                        Approve
                    </button>
                    <button
                        onClick={() => handleVote("no")}
                        className="flex items-center gap-2 px-4 py-2 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-md text-[13px] font-medium transition-colors"
                    >
                        <ThumbsDown size={16} />
                        Reject
                    </button>
                </div>
            </div>

            <div className="pt-5 border-t border-border flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <span className="text-[12px] text-muted-foreground/70">Passes at &gt;50%</span>
                    <div className="text-right">
                        <div className="flex gap-4 text-[12px] font-mono">
                            <span className="text-success">{yesPct}% YES</span>
                            <span className="text-danger">{noPct}% NO</span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex h-2 rounded-full overflow-hidden bg-muted">
                    <div className="bg-success h-full" style={{ width: `${yesPct}%` }} />
                    <div className="bg-danger h-full" style={{ width: `${noPct}%` }} />
                </div>

                <div className="flex justify-between items-center text-[12px] mt-1">
                    <span className="text-muted-foreground/70">{totalVotesCast} votes cast</span>
                    <span className="text-muted-foreground/70">{quorumPct}% Quorum Reached</span>
                </div>
            </div>
        </div>
    );
}
