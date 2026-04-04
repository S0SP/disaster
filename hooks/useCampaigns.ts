"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useCampaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data, error } = await supabase
                .from("campaigns")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) console.error("Fetch Campaigns Error:", error);
            else setCampaigns(data || []);
            setLoading(false);
        };

        fetchCampaigns();

        // Use a unique channel name to avoid collisions
        const channelName = `campaigns-${Math.random().toString(36).substring(7)}`;
        const subscription = supabase
            .channel(channelName)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "campaigns"
            }, (payload) => {
                fetchCampaigns();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return { campaigns, loading };
}

export function useDonations(campaignId?: string) {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            let query = supabase
                .from("donations")
                .select("*")
                .order("created_at", { ascending: false });

            if (campaignId) {
                query = query.eq("campaign_id", campaignId);
            }

            const { data, error } = await query;

            if (error) console.error("Fetch Donations Error:", error);
            else setDonations(data || []);
            setLoading(false);
        };

        fetchDonations();

        const channelName = `donations-${campaignId || "global"}-${Math.random().toString(36).substring(7)}`;
        const subscription = supabase
            .channel(channelName)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "donations",
                filter: campaignId ? `campaign_id=eq.${campaignId}` : undefined
            }, (payload) => {
                fetchDonations();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [campaignId]);

    return { donations, loading };
}
