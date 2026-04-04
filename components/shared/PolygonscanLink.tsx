import { ExternalLink } from "lucide-react";
import { POLYGONSCAN_BASE } from "@/lib/contracts";

interface PolygonscanLinkProps {
    hash: string;
    type?: "tx" | "address" | "token";
    className?: string;
    label?: string;
}

export function PolygonscanLink({ hash, type = "tx", className = "", label }: PolygonscanLinkProps) {
    const url = `${POLYGONSCAN_BASE}/${type}/${hash}`;
    const displayLabel = label || `0x${hash.slice(2, 8)}...${hash.slice(-4)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${className}`}
            title={`View on Polygonscan: ${url}`}
        >
            <span className="font-mono">{displayLabel}</span>
            <ExternalLink size={12} className="opacity-70" />
        </a>
    );
}
