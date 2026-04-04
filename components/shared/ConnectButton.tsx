"use client";

import { useActiveAccount, useConnect, useDisconnect } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";
import { cn, formatMATIC, truncateAddress } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Wallet, LogOut, Copy, ExternalLink, ChevronDown, Users } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/providers/UserProvider";
import Link from "next/link";

export function ConnectButton() {
    const { profile, loading: profileLoading } = useUser();
    const account = useActiveAccount();
    const { connect, isConnecting } = useConnect();
    const { disconnect } = useDisconnect();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleConnect = async () => {
        try {
            await connect(async () => {
                const wallet = wallets[0];
                await wallet.connect({
                    client,
                    strategy: "google",
                });
                return wallet;
            });
            toast.success("Successfully signed in");
        } catch (e) {
            console.error(e);
            toast.error("Failed to sign in with Google");
        }
    };

    const handleCopy = async () => {
        if (account?.address) {
            await navigator.clipboard.writeText(account.address);
            toast.success("Address copied");
            setDropdownOpen(false);
        }
    };

    if (!account) {
        return (
            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-success/10 border border-success/20 rounded text-[10px] text-success uppercase tracking-wider font-bold">
                    <span className="w-1 h-1 bg-success rounded-full animate-pulse"></span>
                    Gas-free
                </div>
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-all disabled:opacity-50 text-[13px] font-semibold"
                >
                    {isConnecting ? (
                        <>
                            <div className="w-3 h-3 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
                            Connecting
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                                />
                            </svg>
                            Sign in with Google
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border text-foreground rounded-md hover:border-primary/40 transition-all group"
            >
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Wallet size={12} className="text-primary" />
                </div>
                <div className="flex flex-col items-start leading-none gap-0.5">
                    <span className="font-mono text-[13px] font-medium">{truncateAddress(account.address)}</span>
                    {profile && (
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">{profile.role}</span>
                    )}
                </div>
                <ChevronDown size={14} className={cn("text-muted-foreground/50 transition-transform", dropdownOpen && "rotate-180")} />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-border/50 bg-muted/30">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Authenticated via Google</p>
                        <p className="font-mono text-[11px] text-foreground break-all leading-tight">{account.address}</p>
                    </div>

                    <div className="py-1.5">
                        <button
                            onClick={handleCopy}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 transition-colors"
                        >
                            <Copy size={16} /> Copy Address
                        </button>
                        <Link
                            href="/onboarding"
                            onClick={() => setDropdownOpen(false)}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 transition-colors"
                        >
                            <Users size={16} /> Switch Role
                        </Link>
                        <a
                            href={`https://amoy.polygonscan.com/address/${account.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full text-left px-4 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-3 transition-colors"
                        >
                            <ExternalLink size={16} /> View on Polygonscan
                        </a>
                        <div className="h-[1px] bg-border/50 my-1"></div>
                        <button
                            onClick={() => {
                                const w = wallets[0];
                                disconnect(w);
                                setDropdownOpen(false);
                                toast.info("Disconnected");
                            }}
                            className="w-full text-left px-4 py-2.5 text-[13px] text-danger hover:bg-danger/5 flex items-center gap-3 transition-colors"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
