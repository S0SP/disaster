import { MapPin, Calendar, Users, Share2 } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { AddressBadge } from "../shared/AddressBadge";

interface CampaignHeaderProps {
    name: string;
    ngoName: string;
    ngoAddress: string;
    location: string;
    status: "active" | "voting" | "pending" | "completed" | "failed";
    createdAt: string;
    description: string;
}

export function CampaignHeader({
    name,
    ngoName,
    ngoAddress,
    location,
    status,
    createdAt,
    description
}: CampaignHeaderProps) {
    return (
        <div className="flex flex-col mb-12">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <StatusBadge status={status} size="lg" />
                        <span className="text-[12px] font-mono text-muted-foreground/70 px-2 py-1 rounded bg-muted border border-border">
                            NATURE: FLOOD
                        </span>
                    </div>

                    <h1 className=" text-4xl md:text-5xl text-foreground mb-4 tracking-tight leading-tight">
                        {name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground/70">By</span>
                            <span className="text-foreground font-medium">{ngoName}</span>
                            <span className="text-success text-[10px]">✓</span>
                            <AddressBadge address={ngoAddress} polygonscan className="ml-1" />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-muted-foreground/70" />
                            {location}
                        </div>

                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-muted-foreground/70" />
                            Started {createdAt}
                        </div>
                    </div>
                </div>

                <button className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted hover:text-foreground transition-colors text-[13px] text-muted-foreground">
                    <Share2 size={16} />
                    Share
                </button>
            </div>

            <div className="mt-4 max-w-3xl">
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                    {description}
                </p>
            </div>
        </div>
    );
}
