"use client";

import { AnimatedCounter } from "../shared/AnimatedCounter";
import { Users, Banknote, ShieldCheck } from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";

export function StatsBar() {
    const { campaigns, loading } = useCampaigns();

    const totalVolume = campaigns.reduce((sum, c) => sum + (Number(c.raised_amount) || 0), 0);
    // For demo purposes, we'll assume a portion is released or get a separate count
    const releasedFunds = totalVolume * 0.7; // Mock logic until we have release tracking

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-6 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Banknote size={24} className="text-primary" />
                </div>
                <div>
                    <div className="text-[12px] text-muted-foreground/70 uppercase tracking-widest font-mono mb-1">
                        Total Relief Funds
                    </div>
                    <div className=" text-3xl font-bold text-foreground">
                        <AnimatedCounter value={totalVolume} duration={1500} /> <span className="text-[14px] text-muted-foreground font-sans border-l border-border pl-2 ml-1">MATIC</span>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-6 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <ShieldCheck size={24} className="text-success" />
                </div>
                <div>
                    <div className="text-[12px] text-muted-foreground/70 uppercase tracking-widest font-mono mb-1">
                        Verified & Released
                    </div>
                    <div className=" text-3xl font-bold text-foreground">
                        <AnimatedCounter value={releasedFunds} duration={1500} /> <span className="text-[14px] text-success font-sans ml-1 text-sm">MATIC</span>
                    </div>
                </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-6 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-info/10 flex items-center justify-center shrink-0">
                    <Users size={24} className="text-info" />
                </div>
                <div>
                    <div className="text-[12px] text-muted-foreground/70 uppercase tracking-widest font-mono mb-1">
                        Active verifiers
                    </div>
                    <div className=" text-3xl font-bold text-foreground">
                        <AnimatedCounter value={84} duration={1500} />
                    </div>
                </div>
            </div>
        </div>
    );
}
