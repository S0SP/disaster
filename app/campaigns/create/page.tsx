"use client";

import { useState } from "react";
import { Plus, Trash2, Shield, MapPin } from "lucide-react";
import { TransactionStatus } from "@/components/shared/TransactionStatus";
import { formatMATIC } from "@/lib/utils";
import Link from "next/link";
import { prepareContractCall, toWei } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useUser } from "@/components/providers/UserProvider";

interface MilestoneEntry {
    title: string;
    amount: string;
    desc: string;
}

export default function CreateCampaignPage() {
    const account = useActiveAccount();
    const { profile } = useUser();

    // UI State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [ngoName, setNgoName] = useState("");
    const [milestones, setMilestones] = useState<MilestoneEntry[]>([
        { title: "Initial Emergency Assessment", amount: "5", desc: "For deployment of advance team." }
    ]);

    // Transaction State
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<`0x${string}` | string>();

    const { mutate: sendTransaction } = useSendTransaction();

    // Handlers
    const addMilestone = () => {
        setMilestones([...milestones, { title: "", amount: "", desc: "" }]);
    };

    const removeMilestone = (idx: number) => {
        if (milestones.length <= 1) return;
        const next = [...milestones];
        next.splice(idx, 1);
        setMilestones(next);
    };

    const updateMilestone = (idx: number, field: keyof MilestoneEntry, value: string) => {
        const next = [...milestones];
        next[idx][field] = value;
        setMilestones(next);
    };

    const totalRequested = milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description || !location || !ngoName || totalRequested <= 0) {
            toast.error("Please fill all required fields");
            return;
        }
        if (!account) {
            toast.error("Please connect your wallet first");
            return;
        }

        setTxStatus("pending");
        try {
            // 1. Prepare On-chain Deployment
            const transaction = prepareContractCall({
                contract: {
                    client,
                    chain,
                    address: CONTRACT_ADDRESSES.campaignFactory,
                },
                method: "function createCampaign(string name, string description, uint256 targetAmount)",
                params: [name, description, toWei(totalRequested.toString())],
            });

            sendTransaction(transaction, {
                onSuccess: async (data: any) => {
                    const hash = (data.transactionHash || data.hash) as `0x${string}`;
                    setTxHash(hash);
                    setTxStatus("success");
                    toast.success("Campaign deployed to Polygon!");

                    // 2. Sync Metadata to Supabase
                    const { error } = await supabase.from("campaigns").insert([{
                        title: name,
                        description,
                        location,
                        ngo_name: ngoName,
                        ngo_address: account.address,
                        target_amount: totalRequested,
                        tx_hash: hash,
                        milestones: milestones,
                        status: "active"
                    }]);

                    if (error) {
                        console.error("Supabase Sync Error:", error);
                        toast.error("Metadata sync failed, but contract is deployed.");
                    }
                },
                onError: (error: any) => {
                    console.error(error);
                    setTxStatus("error");
                    toast.error(error.message || "Deployment failed");
                }
            });

        } catch (err: any) {
            console.error(err);
            setTxStatus("error");
            toast.error(err.message || "Failed to launch campaign");
        }
    };

    return (
        <div className="min-h-screen bg-background pt-12 pb-24 font-sans">
            <div className="max-w-3xl mx-auto px-4">

                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-3">
                            Register New Campaign
                        </h1>
                        <p className="text-[14px] text-muted-foreground leading-relaxed">
                            Create a smart contract instance for a new disaster zone. Funds will be raised into
                            escrow and released strictly according to the milestones you define below.
                        </p>
                    </div>

                    <div className="bg-warning/10 border border-warning/30 text-warning px-4 py-2 rounded-lg text-[12px] flex items-center gap-2 shrink-0">
                        <Shield size={14} />
                        NGO Identity Verification Required
                    </div>
                </div>

                {txStatus !== "idle" ? (
                    <div className="bg-card border border-border p-8 rounded-xl text-center">
                        <h3 className="text-[24px] font-bold text-foreground mb-6">Contract Deployment</h3>
                        <TransactionStatus status={txStatus as any} txHash={txHash} />

                        {txStatus === "success" && (
                            <div className="mt-8 flex justify-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="px-6 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md text-[13px] font-medium"
                                >
                                    Go to Dashboard
                                </Link>
                                <Link
                                    href={`/campaigns/${txHash}`}
                                    className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-md hover:opacity-90 transition-opacity text-[13px]"
                                >
                                    View Live Page
                                </Link>
                            </div>
                        )}

                        {txStatus === "error" && (
                            <button
                                onClick={() => setTxStatus("idle")}
                                className="mt-6 text-[13px] text-primary hover:underline"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-12">

                        {/* Section 1: Core Details */}
                        <div className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-6">
                            <h2 className="text-[20px] font-semibold text-foreground border-b border-border/50 pb-4">
                                1. Situation Overview
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Campaign Title</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Kerala Flood Rehabilitation 2024"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">NGO Entity Name</label>
                                        <input
                                            type="text"
                                            value={ngoName}
                                            onChange={e => setNgoName(e.target.value)}
                                            placeholder="Official NGO Name"
                                            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Disaster Location</label>
                                        <div className="relative">
                                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                                            <input
                                                type="text"
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                placeholder="City, State"
                                                className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-primary transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">Detailed Impact Description</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Explain the urgency, the specific disaster, and how funds will be utilized..."
                                        className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-primary h-32 resize-none transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Milestones */}
                        <div className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-6">
                            <div className="flex justify-between items-center border-b border-border/50 pb-4">
                                <h2 className="text-[20px] font-semibold text-foreground">
                                    2. Release Milestones (Tranches)
                                </h2>
                                <div className="text-[12px] font-mono bg-muted px-3 py-1 rounded-md text-muted-foreground">
                                    Total: <span className="text-primary font-bold">{formatMATIC(totalRequested)} MATIC</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {milestones.map((m, idx) => (
                                    <div key={idx} className="relative p-5 border border-border bg-muted/20 rounded-lg group transition-colors hover:border-muted-foreground/30">
                                        <div className="absolute -left-3 top-5 w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-mono text-muted-foreground z-10 shadow-sm">
                                            {idx + 1}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                            <div className="md:col-span-3">
                                                <input
                                                    type="text"
                                                    value={m.title}
                                                    onChange={e => updateMilestone(idx, "title", e.target.value)}
                                                    placeholder="Milestone title (e.g. Emergency Supply Kits)"
                                                    className="w-full bg-background border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary transition-colors font-medium"
                                                    required
                                                />
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={m.amount}
                                                    onChange={e => updateMilestone(idx, "amount", e.target.value)}
                                                    placeholder="Amount"
                                                    className="w-full bg-background border border-border rounded-md pl-3 pr-12 py-2 text-[13px] text-foreground font-mono focus:outline-none focus:border-primary transition-colors"
                                                    required
                                                    min="0.1"
                                                    step="0.1"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/70 font-mono">MATIC</span>
                                            </div>
                                        </div>

                                        <textarea
                                            value={m.desc}
                                            onChange={e => updateMilestone(idx, "desc", e.target.value)}
                                            placeholder="Evidence to be provided (e.g. Purchase receipts, geo-tagged photos of distribution centers)"
                                            className="w-full bg-background border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:border-primary h-16 resize-none transition-colors"
                                            required
                                        />

                                        {milestones.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(idx)}
                                                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground/70 hover:text-red-500 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                                title="Remove Milestone"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addMilestone}
                                className="w-full py-3 border border-dashed border-border rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                Add Funding Milestone
                            </button>
                        </div>

                        {/* Section 3: Finalize */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl max-w-lg text-center">
                                <Shield className="text-primary shrink-0" size={20} />
                                <p className="text-[13px] text-muted-foreground leading-relaxed">
                                    By deploying, you agree to milestone-based fund locking. Funds will be released
                                    only after community verification of submitted proofs.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full md:w-auto min-w-[280px] py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all text-[15px]"
                            >
                                Deploy Campaign Smart Contract
                            </button>
                            <p className="text-[11px] text-muted-foreground/60 font-mono">
                                Network: Polygon Amoy Testnet • Gas Sponsored
                            </p>
                        </div>

                    </form>
                )}

            </div>
        </div>
    );
}
