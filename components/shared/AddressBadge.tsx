"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { truncateAddress } from "@/lib/utils";
import { POLYGONSCAN_BASE } from "@/lib/contracts";
import { toast } from "sonner";

interface AddressBadgeProps {
    address: string;
    label?: string;
    clickToCopy?: boolean;
    polygonscan?: boolean;
    className?: string;
}

export function AddressBadge({
    address,
    label,
    clickToCopy = true,
    polygonscan = false,
    className = ""
}: AddressBadgeProps) {
    const [copied, setCopied] = useState(false);

    const displayLabel = label || truncateAddress(address);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!clickToCopy) return;

        await navigator.clipboard.writeText(address);
        setCopied(true);
        toast.success("Address copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const badgeContent = (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted border border-border text-[12px] font-mono text-foreground transition-colors ${clickToCopy ? 'hover:border-border hover:border-primary/50 hover:bg-card cursor-pointer z-10 relative' : ''} ${className}`}
            onClick={clickToCopy ? handleCopy : undefined}
            title={address}
        >
            {displayLabel}
            {clickToCopy && (
                copied ? <Check size={12} className="text-success" /> : <Copy size={12} className="text-muted-foreground/70" />
            )}
        </span>
    );

    if (polygonscan) {
        return (
            <div className="inline-flex items-center gap-2 group">
                {badgeContent}
                <a
                    href={`${POLYGONSCAN_BASE}/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/70 hover:text-foreground transition-colors p-1"
                    title="View on Polygonscan"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink size={12} />
                </a>
            </div>
        );
    }

    return badgeContent;
}
