"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { useActiveAccount } from "thirdweb/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, ShieldCheck, Download, ExternalLink } from "lucide-react";
import { POLYGONSCAN_BASE } from "@/lib/contracts";

export function DonorDashboard() {
    const account = useActiveAccount();
    const { campaigns, loading } = useCampaigns();

    // In a real app, we'd fetch specific donations from Supabase or on-chain events
    // For this prototype, we'll simulate the donor's perspective
    const myImpact = {
        totalDonated: campaigns?.length ? 12.5 : 0,
        campaignsSupported: campaigns?.length ? 3 : 0,
        livesImpacted: campaigns?.length ? "450+" : 0,
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Syncing Impact Data...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-card border border-border p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Your Impact Dashboard</h2>
                    <p className="text-muted-foreground text-sm">Transparent tracking of your contributions to active disaster zones.</p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-success border-success/20 bg-success/5 px-3 py-1">
                        Verified Donor
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: "Total Contributed", value: `${myImpact.totalDonated} MATIC`, icon: <Heart className="text-primary" /> },
                    { label: "Campaigns Helped", value: myImpact.campaignsSupported, icon: <ShieldCheck className="text-success" /> },
                    { label: "Est. Lives Impacted", value: myImpact.livesImpacted, icon: <TrendingUp className="text-warning" /> }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            {stat.icon}
                            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium">Contribution History</h3>
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Campaign</th>
                                <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Amount</th>
                                <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-[11px] font-mono uppercase tracking-wider text-muted-foreground text-right">Receipt</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {campaigns?.slice(0, 3).map((c, i) => (
                                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{c.title}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{c.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono">{(4 + i).toFixed(1)} MATIC</td>
                                    <td className="px-6 py-4">
                                        <Badge className="bg-success/10 text-success border-success/20 text-[10px] uppercase font-bold">In Escrow</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                                                <Download size={14} />
                                            </Button>
                                            <a
                                                href={`${POLYGONSCAN_BASE}/address/${c.address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
