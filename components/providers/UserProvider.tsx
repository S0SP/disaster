"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSyncUser } from "@/hooks/useSyncUser";
import { useRouter, usePathname } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

interface UserContextType {
    profile: any;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const { profile, loading } = useSyncUser();
    const account = useActiveAccount();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const publicRoutes = ["/", "/campaigns", "/login"];
        const isPublicRoute = publicRoutes.some(p => pathname === p || pathname.startsWith("/campaigns/"));

        // 1. Unauthenticated users -> Redirect to Home if on private route
        if (!account && !isPublicRoute && pathname !== "/") {
            router.push("/");
            return;
        }

        // 2. Already onboarded users -> Redirect from /onboarding to /dashboard
        if (account && profile?.has_onboarded && pathname === "/onboarding") {
            router.push("/dashboard");
            return;
        }

        // 3. Authenticated but NOT onboarded -> Redirect to /onboarding
        if (account && profile && !profile.has_onboarded && pathname !== "/onboarding" && !isPublicRoute) {
            router.push("/onboarding");
        }
    }, [account, profile, loading, pathname, router]);

    // Barrier: Don't show protected content if loading or if we need to onboard
    const isPublicRoute = ["/", "/campaigns"].some(p => pathname === p || pathname.startsWith("/campaigns/"));

    if (!isPublicRoute && !account && !loading) {
        return null; // Or a nice login screen
    }

    return (
        <UserContext.Provider value={{ profile, loading }}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
