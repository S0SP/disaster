"use client";

import { ArrowDownCircle, Camera, CheckCircle2 } from "lucide-react";
import { PolygonscanLink } from "../shared/PolygonscanLink";
import { useDonations } from "@/hooks/useCampaigns";
import { truncateAddress } from "@/lib/utils";

export function ActivityFeed() {
    const { donations, loading } = useDonations();

    const getIcon = (type: string) => {
        switch (type) {
            case "donation": return <ArrowDownCircle size={16} className="text-success" />;
            case "proof": return <Camera size={16} className="text-warning" />;
            case "vote": return <CheckCircle2 size={16} className="text-info" />;
            default: return <Camera size={16} className="text-muted-foreground" />;
        }
    };

    if (loading) return (
        <div className="bg-card border border-border p-6 rounded-xl animate-pulse h-full min-h-[400px]" />
    );

    return (
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col h-full shadow-sm">
            <h3 className=" text-[20px] font-bold text-foreground mb-6">Live Activity</h3>

            <div className="flex-1 flex flex-col gap-6">
                {donations.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-[13px] italic text-center px-4">
                        Waiting for global relief activity to commence...
                    </div>
                ) : donations.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/5 transition-all">
                                {getIcon("donation")}
                            </div>
                            {idx !== donations.length - 1 && (
                                <div className="w-[1px] h-full bg-border/50 my-2 flex-grow"></div>
                            )}
                        </div>
                        <div className="pt-0.5 pb-4 flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="text-[14px] text-foreground font-semibold">
                                    {activity.is_anonymous ? "Anonymous Relief" : truncateAddress(activity.donor_address || "Community")}
                                </h4>
                                <span className="text-[10px] text-muted-foreground/60 font-mono uppercase">RECENT</span>
                            </div>
                            <p className="text-[13px] text-muted-foreground mt-1 mb-2 leading-relaxed">
                                {activity.amount} MATIC deposited to disaster vault.
                            </p>

                            <PolygonscanLink hash={activity.tx_hash} type="tx" className="text-[10px] text-primary/70 hover:text-primary transition-colors font-mono" />
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2.5 border border-border rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-mono tracking-wider uppercase">
                Audit All Records
            </button>
        </div>
    );
}
