import { CheckCircle2, Circle, Clock, Camera } from "lucide-react";
import { IPFSLink } from "../shared/IPFSLink";

interface Milestone {
    id: string;
    title: string;
    amount: number;
    status: "completed" | "active" | "voting" | "pending";
    proofCid?: string;
    votesYes?: number;
    votesNo?: number;
}

interface MilestoneTrackerProps {
    milestones: Milestone[];
}

export function MilestoneTracker({ milestones }: MilestoneTrackerProps) {
    return (
        <div className="flex flex-col border border-border rounded-xl bg-muted/20 overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/40">
                <h3 className=" text-[18px] text-foreground tracking-wide">
                    Release Milestones
                </h3>
            </div>

            <div className="p-6">
                <div className="relative border-l border-border ml-3 space-y-8 pl-8">
                    {milestones.map((milestone, idx) => {
                        const isCompleted = milestone.status === "completed";
                        const isActive = milestone.status === "active";
                        const isVoting = milestone.status === "voting";

                        return (
                            <div key={milestone.id} className="relative">
                                {/* Timeline dot */}
                                <div className="absolute -left-[41px] top-1 flex items-center justify-center w-6 h-6 rounded-full bg-background border border-border z-10">
                                    {isCompleted ? (
                                        <CheckCircle2 size={14} className="text-success" />
                                    ) : isActive || isVoting ? (
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    ) : (
                                        <Circle size={10} className="text-muted-foreground/70" />
                                    )}
                                </div>

                                <div className={`flex flex-col border border-border rounded-lg p-4 transition-colors ${isActive || isVoting ? "bg-card border-accent/30 shadow-[0_0_15px_rgba(200,149,108,0.05)]" : "bg-muted/30"
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`text-[14px] font-medium ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                                            Phase {idx + 1}: {milestone.title}
                                        </h4>
                                        <span className="font-mono text-[12px] text-muted-foreground/70">
                                            {milestone.amount} MATIC
                                        </span>
                                    </div>

                                    {/* Status specific content */}
                                    {isCompleted && milestone.proofCid && (
                                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-[12px]">
                                            <span className="text-success flex items-center gap-1.5"><CheckCircle2 size={12} /> Funds Released</span>
                                            <div className="flex items-center gap-1.5 text-muted-foreground/70">
                                                <Camera size={12} />
                                                Proof: <IPFSLink cid={milestone.proofCid} className="text-muted-foreground" />
                                            </div>
                                        </div>
                                    )}

                                    {isVoting && (
                                        <div className="mt-3 pt-3 border-t border-border/50 flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-[12px]">
                                                <span className="text-warning flex items-center gap-1.5"><Clock size={12} /> Voting Active</span>
                                                <div className="flex items-center gap-1.5 text-muted-foreground/70">
                                                    <Camera size={12} className="text-success" />
                                                    Proof Submitted: <IPFSLink cid={milestone.proofCid || ""} className="text-muted-foreground" />
                                                </div>
                                            </div>

                                            {/* Voting progress bar */}
                                            <div className="w-full flex h-1.5 rounded-full overflow-hidden bg-muted">
                                                <div className="bg-success h-full" style={{ width: "73%" }} />
                                                <div className="bg-danger h-full" style={{ width: "12%" }} />
                                            </div>
                                            <div className="flex justify-between text-[10px] uppercase tracking-wider font-mono text-muted-foreground/70">
                                                <span className="text-success">73% Yes</span>
                                                <span className="text-danger">12% No</span>
                                            </div>
                                        </div>
                                    )}

                                    {isActive && (
                                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center text-[12px] text-primary">
                                            <Clock size={12} className="mr-1.5" /> Awaiting proof submission from NGO to trigger voting.
                                        </div>
                                    )}

                                    {milestone.status === "pending" && (
                                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center text-[12px] text-muted-foreground/70">
                                            <Clock size={12} className="mr-1.5" /> Locked until previous phases are verified.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
