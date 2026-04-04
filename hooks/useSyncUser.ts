"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function useSyncUser() {
    const account = useActiveAccount();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account?.address) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const syncProfile = async () => {
            setLoading(true);
            try {
                const walletAddress = account.address.toLowerCase();

                // 1. Fetch current profile
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("wallet_address", walletAddress)
                    .single();

                if (error && error.code !== "PGRST116") {
                    throw error;
                }

                if (data) {
                    setProfile(data);
                } else {
                    // 2. Create new profile if not exists
                    const { data: newProfile, error: insertError } = await supabase
                        .from("profiles")
                        .insert([
                            {
                                wallet_address: walletAddress,
                                user_role: 'DONOR' // Default role in schema
                            }
                        ])
                        .select()
                        .single();

                    if (insertError) throw insertError;
                    setProfile(newProfile);
                    toast.success("Welcome! Profile created.");
                }
            } catch (err) {
                console.error("Auth Sync Error:", err);
                toast.error("Failed to sync profile with database");
            } finally {
                setLoading(false);
            }
        };

        syncProfile();
    }, [account?.address]);

    return { profile, loading };
}
