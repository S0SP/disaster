"use client";

import { useState } from "react";
import { Copy, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatMATIC } from "@/lib/utils";

// Mock user state
const USER = {
    address: "0x7Bf96...c8A1",
    reputation: 94, // Out of 100
    verified: true,
    zone: "Kamrup Metropolitan, Assam",
    votingPower: 1, // 1 Aadhaar = 1 Vote
    tokensStaked: 50,
};

export function IdentityBanner() {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText("0x7Bf968A4CcB1B6fAAfE562bDDc8A1");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!USER.verified) {
        return (
            <div className="bg-warning/10 border border-warning/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                        <ShieldCheck size={20} className="text-warning" />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-warning mb-1">Unverified Identity</h3>
                        <p className="text-[13px] text-muted-foreground max-w-lg">
                            You must verify your identity via Aadhaar/ZK-Proof to participate in local governance and vote on fund releases.
                        </p>
                    </div>
                </div>
                <Link
                    href="/verify"
                    className="shrink-0 px-6 py-2.5 bg-warning text-bg-deep font-semibold rounded-md hover:bg-warning/90 transition-colors text-[13px]"
                >
                    Verify Now
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border p-6 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">

            {/* Left side: Profile Info */}
            <div className="flex items-center gap-5">
                <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center border-2 border-success/30">
                        <span className="font-mono text-[16px] text-foreground">0x7B</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
                        <CheckCircle2 size={16} className="text-success bg-background rounded-full" />
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className=" text-[20px] text-foreground">{USER.address}</span>
                        <button onClick={copyAddress} className="text-muted-foreground/70 hover:text-foreground transition-colors" title="Copy Address">
                            {copied ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[12px]">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <ShieldCheck size={14} className="text-success" />
                            Verified Local
                        </span>
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin size={14} className="text-muted-foreground/70" />
                            {USER.zone}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right side: Stats */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <div className="flex-1 lg:flex-none border border-border bg-muted/30 rounded-lg p-3 text-center min-w-[120px]">
                    <div className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-mono mb-1">Voting Power</div>
                    <div className="text-[18px] font-semibold text-foreground">
                        {USER.votingPower} <span className="text-[12px] font-normal text-muted-foreground ml-1">Vote</span>
                    </div>
                </div>

                <div className="flex-1 lg:flex-none border border-border bg-muted/30 rounded-lg p-3 text-center min-w-[120px]">
                    <div className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-mono mb-1">Reputation</div>
                    <div className="text-[18px] font-semibold text-success">
                        {USER.reputation} <span className="text-[12px] font-normal text-muted-foreground ml-1">/ 100</span>
                    </div>
                </div>

                <div className="flex-1 lg:flex-none border border-border bg-muted/30 rounded-lg p-3 text-center min-w-[120px]">
                    <div className="text-[11px] text-muted-foreground/70 uppercase tracking-wider font-mono mb-1">Staked</div>
                    <div className="text-[18px] font-semibold text-foreground">
                        {formatMATIC(USER.tokensStaked)} <span className="text-[12px] font-normal text-muted-foreground ml-1">MATIC</span>
                    </div>
                </div>
            </div>

        </div>
    );
}
