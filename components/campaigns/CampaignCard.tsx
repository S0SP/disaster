import Link from "next/link";
import { MapPin } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { formatMATIC } from "@/lib/utils";

interface CampaignCardProps {
    id: string;
    name: string;
    ngoName: string;
    location: string;
    raised: number;
    target: number;
    status: "active" | "voting" | "pending" | "completed" | "failed";
    milestone: string;
}

export function CampaignCard({ id, name, ngoName, location, raised, target, status, milestone }: CampaignCardProps) {
    const progressPct = Math.min(100, Math.round((raised / target) * 100));

    return (
        <Link
            href={`/campaigns/${id}`}
            className="card-interactive p-6 flex flex-col group h-full"
        >
            <div className="flex justify-between items-start mb-6">
                <StatusBadge status={status} />
                <span className="text-[12px] text-muted-foreground/70 uppercase tracking-wide">
                    {milestone}
                </span>
            </div>

            <h3 className=" text-2xl text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {name}
            </h3>

            <p className="text-[13px] text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
                by {ngoName} <span className="text-success text-[10px]">✓</span>
            </p>

            <div className="flex items-center gap-1.5 mb-8 text-[13px] text-muted-foreground/70">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{location}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-border">
                <div className="flex justify-between items-end mb-3">
                    <span className="text-[14px] font-semibold text-foreground tracking-tight">
                        {progressPct}%
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                        {formatMATIC(target)} target
                    </span>
                </div>

                <div className="w-full h-[4px] bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            </div>
        </Link>
    );
}
