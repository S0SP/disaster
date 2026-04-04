import { ExternalLink } from "lucide-react";
import { IPFS_GATEWAY } from "@/lib/contracts";

interface IPFSLinkProps {
    cid: string;
    className?: string;
    label?: string;
}

export function IPFSLink({ cid, className = "", label }: IPFSLinkProps) {
    const url = `${IPFS_GATEWAY}${cid}`;
    const displayLabel = label || `${cid.slice(0, 6)}...${cid.slice(-4)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 hover:text-foreground transition-colors ${className}`}
            title={`View on IPFS: ${cid}`}
        >
            <span className="font-mono">{displayLabel}</span>
            <ExternalLink size={12} className="opacity-70" />
        </a>
    );
}
