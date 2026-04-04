"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ThirdwebProvider } from "thirdweb/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { UserProvider } from "./UserProvider";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThirdwebProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <UserProvider>
                        {children}
                        <Toaster theme="system" position="bottom-right" />
                    </UserProvider>
                </ThemeProvider>
            </ThirdwebProvider>
        </QueryClientProvider>
    );
}
