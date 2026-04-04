"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useCampaigns } from "@/hooks/useCampaigns";

export function FundFlowChart() {
    const [mounted, setMounted] = useState(false);
    const { campaigns, loading } = useCampaigns();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || loading) return (
        <div className="w-full h-[300px] flex items-center justify-center bg-muted/30 rounded-xl border border-border animate-pulse">
            <span className="text-muted-foreground/70">Syncing Financial Records...</span>
        </div>
    );

    // Aggregate data for the chart
    // For this prototype, we'll create a few data points based on campaign totals
    const totalRaised = campaigns?.reduce((acc, c) => acc + (parseFloat(c.raised_amount) || 0), 0) || 0;
    const totalReleased = campaigns?.reduce((acc, c) => {
        const released = (c.milestones || []).filter((m: any) => m.released).reduce((mAcc: number, m: any) => mAcc + (parseFloat(m.amount) || 0), 0);
        return acc + released;
    }, 0) || 0;

    // Simulated historical progression for the area chart based on real current totals
    const chartData = [
        { name: "Start", raised: 0, released: 0 },
        { name: "Phase 1", raised: totalRaised * 0.3, released: totalReleased * 0.2 },
        { name: "Phase 2", raised: totalRaised * 0.6, released: totalReleased * 0.5 },
        { name: "Current", raised: totalRaised, released: totalReleased },
    ];

    return (
        <div className="bg-card border border-border p-6 rounded-xl mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
                <div>
                    <h3 className=" text-[20px] text-foreground">Escrow Fund Flow</h3>
                    <p className="text-[13px] text-muted-foreground">Blockchain-verified deposits vs regional releases (Polygon)</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-[12px] text-muted-foreground/70">Total Locked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                        <span className="text-[12px] text-muted-foreground/70">Total Released</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRaised" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C8956C" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#C8956C" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorReleased" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5B9279" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#5B9279" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#666666' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#666666' }}
                            tickFormatter={(value) => `${value.toFixed(1)}M`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A1816', borderColor: '#2E2E2E', borderRadius: '8px', fontSize: '13px' }}
                            itemStyle={{ color: '#E0E0E0' }}
                            formatter={(val: number) => [`${val.toFixed(2)} MATIC`, ""]}
                        />
                        <Area type="monotone" dataKey="raised" stroke="#C8956C" strokeWidth={2} fillOpacity={1} fill="url(#colorRaised)" />
                        <Area type="monotone" dataKey="released" stroke="#5B9279" strokeWidth={2} fillOpacity={1} fill="url(#colorReleased)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
