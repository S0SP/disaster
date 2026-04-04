'use client';

import { useState } from "react";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogClose
} from "@/components/ui/dialog";
import { X, Shield } from "lucide-react";
import { TransactionStatus } from "@/components/shared/TransactionStatus";
import { formatMATIC } from "@/lib/utils";

interface DonationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    campaignName: string;
    campaignTarget: number;
    campaignRaised: number;
    campaignId: string; // Add campaignId
}

export function DonationModal({ open, onOpenChange, campaignName, campaignTarget, campaignRaised, campaignId }: DonationModalProps) {
    const [amount, setAmount] = useState<string>("10");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<string>();

    const { mutate: sendTransaction } = useSendTransaction();

    const remaining = Math.max(0, campaignTarget - campaignRaised);

    const handleDonate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

        setTxStatus("pending");
        try {
            // 1. Prepare on-chain donation (Assuming campaignId is the contract address)
            // If it's a vault based system, we might send to a central vault with campaign ID
            // For now, let's assume direct MATIC transfer to the campaign contract
            const transaction = prepareContractCall({
                contract: {
                    client,
                    chain,
                    address: campaignId as `0x${string}`,
                },
                method: "function donate() payable", // Correct method from SahayataCampaign.sol
                params: [],
                value: toWei(amount),
            });

            sendTransaction(transaction, {
                onSuccess: async (data: any) => {
                    const hash = data.transactionHash;
                    setTxHash(hash);
                    setTxStatus("success");
                    toast.success("Donation confirmed on-chain!");

                    // 2. Sync to Supabase
                    await supabase.from("donations").insert([{
                        campaign_id: campaignId,
                        amount: Number(amount),
                        tx_hash: hash,
                        is_anonymous: isAnonymous,
                        status: "confirmed"
                    }]);
                },
                onError: (error) => {
                    console.error(error);
                    setTxStatus("error");
                    toast.error("Internal transaction failed");
                }
            });
        } catch (err) {
            console.error(err);
            setTxStatus("error");
            toast.error("Failed to initiate donation");
        }
    };

    const presetAmounts = ["10", "50", "100", "500"];

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (txStatus === "pending") return;
            if (!open) {
                // Reset state on close
                setTimeout(() => setTxStatus("idle"), 300);
            }
            onOpenChange(open);
        }}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 animate-in fade-in" />
                <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[calc(100%-32px)] max-w-[480px] bg-card border border-border shadow-2xl rounded-xl p-6 z-50 animate-in zoom-in-95 duration-200">

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <DialogTitle className="text-[20px] font-semibold text-foreground  tracking-wide">
                                Fund Relief
                            </DialogTitle>
                            <DialogDescription className="text-[13px] text-muted-foreground mt-1">
                                {campaignName}
                            </DialogDescription>
                        </div>

                        <DialogClose asChild>
                            <button
                                className="text-muted-foreground/70 hover:text-foreground transition-colors disabled:opacity-50"
                                aria-label="Close"
                                disabled={txStatus === "pending"}
                            >
                                <X size={20} />
                            </button>
                        </DialogClose>
                    </div>

                    {txStatus !== "idle" ? (
                        <div className="py-4">
                            <TransactionStatus
                                status={txStatus as any}
                                txHash={txHash}
                                errorMessage={txStatus === "error" ? "Transaction failed" : undefined}
                            />

                            {txStatus === "success" && (
                                <div className="mt-8 flex justify-center">
                                    <DialogClose asChild>
                                        <button className="px-6 py-2 bg-muted border border-border text-foreground rounded-md text-[13px] hover:bg-card">
                                            Close Window
                                        </button>
                                    </DialogClose>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleDonate} className="space-y-6">

                            <div>
                                <div className="flex justify-between text-[12px] mb-2">
                                    <label className="text-muted-foreground font-medium uppercase tracking-wider">Amount (MATIC)</label>
                                    <span className="text-muted-foreground/70">~ {formatMATIC(remaining)} remaining</span>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground  text-[18px]">₹</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        min="1"
                                        step="1"
                                        max={remaining}
                                        required
                                        className="w-full bg-background border border-border rounded-lg pl-8 pr-4 py-3 text-[18px] text-foreground font-mono focus:outline-none focus:border-accent transition-colors"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-muted-foreground/70 font-mono">
                                        MATIC
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {presetAmounts.map(preset => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => setAmount(preset)}
                                            className={`px-3 py-1.5 rounded text-[12px] font-mono border transition-colors ${amount === preset ? "bg-primary/10 border-accent text-primary" : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-text-secondary"}`}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setAmount(remaining.toString())}
                                        className="px-3 py-1.5 rounded text-[12px] font-mono border border-border bg-muted text-muted-foreground hover:text-foreground hover:border-text-secondary transition-colors"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/50 border border-border rounded-lg">
                                <input
                                    type="checkbox"
                                    id="anonymous"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 rounded border-border bg-background focus:ring-accent focus:ring-offset-0 text-primary cursor-pointer"
                                />
                                <label htmlFor="anonymous" className="flex-1 text-[13px] text-muted-foreground cursor-pointer cursor-default">
                                    Make my donation anonymous
                                </label>
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-background border border-border rounded-lg text-[12px] text-muted-foreground/70">
                                <Shield size={14} className="text-success shrink-0" />
                                <p>Funds are locked in a smart contract and released only upon community verified proof of work.</p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-primary text-bg-deep font-semibold rounded-lg hover:opacity-90 transition-opacity text-[14px]"
                            >
                                Donate {formatMATIC(Number(amount) || 0)}
                            </button>
                        </form>
                    )}

                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
