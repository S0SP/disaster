"use client";

import Link from "next/link";
import { formatMATIC } from "@/lib/utils";
import { useCampaigns } from "@/hooks/useCampaigns";

export function CampaignProgressList() {
    const { campaigns, loading } = useCampaigns();

    if (loading) return (
        <div className="bg-card border border-border p-6 rounded-xl animate-pulse min-h-[300px]" />
    );

    return (
        <div className="bg-card border border-border p-6 rounded-xl overflow-hidden shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className=" text-[20px] font-bold text-foreground">Active Relief Efforts</h3>
                <Link href="/campaigns" className="text-[12px] text-muted-foreground hover:text-primary transition-colors font-medium">
                    EXPLORE ALL
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b border-border text-[11px] text-muted-foreground/70 uppercase tracking-widest font-mono">
                            <th className="pb-3 font-medium">Distaster Zone</th>
                            <th className="pb-3 font-medium">Raised</th>
                            <th className="pb-3 font-medium">Target</th>
                            <th className="pb-3 font-medium">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {campaigns.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-muted-foreground text-sm italic">
                                    No active campaigns found. Launch one from the NGO portal.
                                </td>
                            </tr>
                        ) : campaigns.map(camp => {
                            const pct = Math.min(100, Math.round((Number(camp.raised_amount || 0) / Number(camp.target_amount)) * 100));

                            return (
                                <tr key={camp.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="py-4">
                                        <Link href={`/campaigns/${camp.tx_hash}`} className="text-[14px] text-foreground font-semibold group-hover:text-primary transition-colors truncate block max-w-[250px]">
                                            {camp.title}
                                        </Link>
                                        <span className="text-[11px] text-muted-foreground/60 block mt-0.5">{camp.location} • {camp.ngo_name}</span>
                                    </td>
                                    <td className="py-4 text-[13px] text-foreground font-mono">
                                        {formatMATIC(camp.raised_amount || 0)}
                                    </td>
                                    <td className="py-4 text-[13px] text-muted-foreground font-mono">
                                        {formatMATIC(camp.target_amount)}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                                                <div
                                                    className={`h-full transition-all duration-500 ${pct === 100 ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-primary shadow-[0_0_8px_rgba(100,255,218,0.3)]'}`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <span className="text-[11px] text-muted-foreground/80 font-mono w-8">{pct}%</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
