"use client";

import { useState } from "react";
import { Search, Filter, LayoutGrid, Map as MapIcon } from "lucide-react";
import { CampaignCard } from "./CampaignCard";

// Mock data
const DEMO_CAMPAIGNS = [
    { id: "1", name: "Dhubri Flood Relief Phase 1", ngoName: "Goonj Foundation", location: "Dhubri, Assam", raised: 10.5, target: 15, status: "active" as const, milestone: "M2 of 4" },
    { id: "2", name: "Guwahati Bank Erosion Relief", ngoName: "SEEDS India", location: "Guwahati, Assam", raised: 18.2, target: 20, status: "voting" as const, milestone: "M3 of 3" },
    { id: "3", name: "Silchar Urban Flood Recovery", ngoName: "CARE India", location: "Silchar, Assam", raised: 4.1, target: 12, status: "pending" as const, milestone: "M1 of 4" },
    { id: "4", name: "Kolkata Cyclone Shelter", ngoName: "Oxfam India", location: "Kolkata, WB", raised: 25.0, target: 25.0, status: "completed" as const, milestone: "Completed" },
    { id: "5", name: "Kaziranga Animal Rescue", ngoName: "WTI India", location: "Kaziranga, Assam", raised: 2.5, target: 8, status: "failed" as const, milestone: "Refunded" },
    { id: "6", name: "Majuli Island Medical Camp", ngoName: "Doctors For You", location: "Majuli, Assam", raised: 0, target: 10, status: "pending" as const, milestone: "M1 of 2" },
];

export function CampaignGrid() {
    const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredCampaigns = DEMO_CAMPAIGNS.filter(camp => {
        const matchesSearch = camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            camp.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || camp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-8 w-full mt-8">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/40 p-2 rounded-lg border border-border">

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                    <input
                        type="text"
                        placeholder="Search campaigns, locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-[13px] text-foreground focus:outline-none focus:border-text-secondary transition-colors placeholder:text-muted-foreground/70"
                    />
                </div>

                {/* Filters & View Toggle */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-40">
                        <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-card border border-border rounded-md pl-8 pr-8 py-2 text-[13px] text-foreground focus:outline-none focus:border-text-secondary transition-colors appearance-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="voting">Voting</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex items-center bg-card border border-border rounded-md p-1 shrink-0">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-1.5 rounded-sm transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode("map")}
                            className={`p-1.5 rounded-sm transition-colors ${viewMode === "map" ? "bg-muted text-foreground" : "text-muted-foreground/70 hover:text-muted-foreground"}`}
                            title="Map View"
                        >
                            <MapIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {viewMode === "grid" ? (
                filteredCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                        {filteredCampaigns.map(camp => (
                            <CampaignCard key={camp.id} {...camp} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-border rounded-xl bg-muted/30">
                        <p className="text-muted-foreground text-[14px]">No campaigns found matching your criteria.</p>
                    </div>
                )
            ) : (
                <div className="w-full h-[600px] bg-muted border border-border rounded-xl flex items-center justify-center animate-in fade-in duration-300">
                    {/* We will replace this with a Map component or Mini Globe later */}
                    <div className="text-center">
                        <MapIcon size={32} className="mx-auto mb-4 text-muted-foreground/70 opacity-50" />
                        <p className="text-[14px] text-muted-foreground">Interactive Map View Coming Later</p>
                    </div>
                </div>
            )}
        </div>
    );
}
