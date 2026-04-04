import Link from "next/link";
import { Camera, Clock, ExternalLink } from "lucide-react";
import { IPFSLink } from "../shared/IPFSLink";

interface ProposalCardProps {
    id: string;
    campaignId: string;
    campaignName: string;
    title: string;
    amount: number;
    status: "active" | "passed" | "rejected";
    endTime: string;
    votesYes: number;
    votesNo: number;
    proofCid: string;
}

export function ProposalCard({
    id,
    campaignId,
    campaignName,
    title,
    amount,
    status,
    endTime,
    votesYes,
    votesNo,
    proofCid
}: ProposalCardProps) {
    const totalVotesCast = votesYes + votesNo;
    const yesPct = totalVotesCast > 0 ? Math.round((votesYes / totalVotesCast) * 100) : 0;
    const noPct = totalVotesCast > 0 ? Math.round((votesNo / totalVotesCast) * 100) : 0;

    const isPassed = status === "passed";
    const isRejected = status === "rejected";
    const isActive = status === "active";

    let statusBadgeClasses = "bg-warning/10 text-warning border-warning/30";
    let statusText = "Active Voting";

    if (isPassed) {
        statusBadgeClasses = "bg-success/10 text-success border-success/30";
        statusText = "Passed";
    } else if (isRejected) {
        statusBadgeClasses = "bg-danger/10 text-danger border-danger/30";
        statusText = "Rejected";
    }

    return (
        <div className="bg-muted/30 border border-border p-6 rounded-xl hover:border-border hover:border-primary/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-mono block mb-1">
                        {campaignName}
                    </span>
                    <h3 className=" text-[22px] text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                </div>
                <div className={`px-2.5 py-1 text-[11px] border rounded font-medium flex items-center gap-1.5 uppercase tracking-wide shrink-0 ${statusBadgeClasses}`}>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />}
                    {statusText}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6 text-[13px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground/70 font-mono uppercase">Request:</span>
                    <span className="font-medium text-foreground">{amount} MATIC</span>
                </div>

                {isActive && (
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-muted-foreground/70" />
                        Ends in {endTime}
                    </div>
                )}

                <div className="flex items-center gap-1.5">
                    <Camera size={14} className="text-muted-foreground/70" />
                    Proof: <IPFSLink cid={proofCid} className="text-primary" />
                </div>
            </div>

            <div className="pt-5 border-t border-border mt-auto">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[12px] text-muted-foreground/70 uppercase tracking-wider font-mono">Current Tally</span>
                    <div className="text-[12px] font-mono">
                        <span className="text-success">{yesPct}% YES</span>
                        <span className="text-muted-foreground/70 mx-2">|</span>
                        <span className="text-danger">{noPct}% NO</span>
                    </div>
                </div>

                <div className="w-full flex h-1.5 rounded-full overflow-hidden bg-card mb-5">
                    <div className={`${isRejected ? 'bg-muted' : 'bg-success'} h-full transition-all`} style={{ width: `${yesPct}%` }} />
                    <div className={`${isPassed ? 'bg-muted' : 'bg-danger'} h-full transition-all`} style={{ width: `${noPct}%` }} />
                </div>

                <div className="flex gap-3">
                    {isActive ? (
                        <Link
                            href={`/campaigns/${campaignId}`}
                            className="flex-1 py-2.5 bg-text-primary text-bg-primary text-center font-semibold rounded-md hover:bg-text-secondary transition-colors text-[13px]"
                        >
                            Cast Vote
                        </Link>
                    ) : (
                        <Link
                            href={`/campaigns/${campaignId}`}
                            className="flex-1 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:bg-muted text-center font-medium rounded-md transition-colors text-[13px] flex items-center justify-center gap-2"
                        >
                            View Campaign Details <ExternalLink size={14} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
