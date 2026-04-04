import { CheckCircle2, XCircle } from "lucide-react";
import { PolygonscanLink } from "./PolygonscanLink";

interface TransactionStatusProps {
    status: "pending" | "success" | "error";
    txHash?: string;
    errorMessage?: string;
}

export function TransactionStatus({ status, txHash, errorMessage }: TransactionStatusProps) {
    if (status === "pending") {
        return (
            <div className="flex flex-col gap-2 p-3 bg-muted border border-border rounded-lg animate-in">
                <div className="flex items-center gap-2">
                    <div className="relative w-3 h-3 flex items-center justify-center">
                        <div className="absolute inset-0 bg-warning rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-1.5 h-1.5 bg-warning rounded-full"></div>
                    </div>
                    <span className="text-[13px] text-foreground font-medium">Transaction submitted...</span>
                </div>
                {txHash && (
                    <div className="pl-5">
                        <PolygonscanLink hash={txHash} className="text-[11px] text-muted-foreground" />
                    </div>
                )}
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex flex-col gap-2 p-3 bg-success/5 border border-success/30 rounded-lg animate-in">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-success" />
                    <span className="text-[13px] text-success font-medium">Confirmed</span>
                </div>
                {txHash && (
                    <div className="pl-5">
                        <PolygonscanLink hash={txHash} className="text-[11px] text-success" />
                    </div>
                )}
            </div>
        );
    }

    // Error state
    return (
        <div className="flex flex-col gap-2 p-3 bg-danger/5 border border-danger/30 rounded-lg animate-in">
            <div className="flex items-center gap-2">
                <XCircle size={14} className="text-danger" />
                <span className="text-[13px] text-danger font-medium">Failed</span>
            </div>
            {errorMessage && (
                <div className="pl-5">
                    <p className="text-[12px] text-danger/80">{errorMessage}</p>
                    <span className="text-[11px] text-muted-foreground/70 mt-1 block">Try again</span>
                </div>
            )}
        </div>
    );
}
