"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { formatMATIC } from "@/lib/utils";

const DEMO_CAMPAIGNS = [
    {
        id: "1",
        name: "Dhubri Flood Relief",
        ngoName: "Goonj Foundation",
        location: "Dhubri, Assam",
        raised: 10.5,
        target: 15,
        status: "active",
        milestone: "M2 of 4"
    },
    {
        id: "2",
        name: "Guwahati Bank Erosion Relief",
        ngoName: "SEEDS India",
        location: "Guwahati, Assam",
        raised: 18.2,
        target: 20,
        status: "voting",
        milestone: "M3 of 3"
    },
    {
        id: "3",
        name: "Silchar Urban Flood Recovery",
        ngoName: "CARE India",
        location: "Silchar, Assam",
        raised: 4.1,
        target: 12,
        status: "pending",
        milestone: "M1 of 4"
    },
    {
        id: "4",
        name: "Kolkata Cyclone Shelter",
        ngoName: "Oxfam India",
        location: "Kolkata, WB",
        raised: 25.0,
        target: 25.0,
        status: "completed",
        milestone: "Completed"
    }
];

export function ActiveCampaigns() {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="page-container relative">
                <div className="flex flex-col items-start mb-12 animate-in">
                    <p className="label-text mb-4">ACTIVE CAMPAIGNS</p>
                    <div className="w-full flex justify-between items-end">
                        <h2 className=" text-3xl md:text-4xl text-foreground">
                            Where your funds are working
                        </h2>
                        <Link
                            href="/campaigns"
                            className="text-[14px] text-muted-foreground hover:text-foreground flex items-center gap-1 group transition-colors"
                        >
                            View all campaigns
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Horizontal scroll container */}
                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scroll">
                    {DEMO_CAMPAIGNS.map((camp, idx) => {
                        const progressPct = Math.min(100, Math.round((camp.raised / camp.target) * 100));

                        return (
                            <Link
                                key={camp.id}
                                href={`/campaigns/${camp.id}`}
                                className="w-[300px] md:w-[350px] shrink-0 card-interactive p-6 flex flex-col snap-start group animate-in"
                                style={{ animationDelay: `${idx * 0.15}s` }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <StatusBadge status={camp.status as any} />
                                    <span className="text-[12px] text-muted-foreground/70 uppercase tracking-wide">
                                        {camp.milestone}
                                    </span>
                                </div>

                                <h3 className=" text-2xl text-foreground mb-2 line-clamp-2">
                                    {camp.name}
                                </h3>

                                <p className="text-[13px] text-muted-foreground mb-4 flex items-center gap-1.5">
                                    by {camp.ngoName} <span className="text-success text-[10px]">✓</span>
                                </p>

                                <div className="flex items-center gap-1.5 mb-8 text-[13px] text-muted-foreground/70">
                                    <MapPin size={14} />
                                    {camp.location}
                                </div>

                                <div className="mt-auto pt-4 border-t border-border">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-[14px] font-semibold text-foreground tracking-tight">
                                            {progressPct}%
                                        </span>
                                        <span className="text-[12px] text-muted-foreground">
                                            {camp.target} MATIC target
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
                        )
                    })}
                </div>

                <style jsx global>{`
          .hide-scroll::-webkit-scrollbar {
            display: none;
          }
          .hide-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
            </div>
        </section>
    );
}
