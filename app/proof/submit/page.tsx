"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, MapPin, Upload, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { TransactionStatus } from "@/components/shared/TransactionStatus";
import Link from "next/link";
import { uploadToIPFS } from "@/lib/ipfs";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { client, chain } from "@/lib/thirdweb";
import { useCampaigns } from "@/hooks/useCampaigns";
import { toast } from "sonner";

export default function ProofSubmitPage() {
    const account = useActiveAccount();
    const { campaigns, loading: campaignsLoading } = useCampaigns();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const [selectedCampaign, setSelectedCampaign] = useState<string>("");
    const [milestoneIdx, setMilestoneIdx] = useState(0);
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [timestamp, setTimestamp] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [uploading, setUploading] = useState(false);
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<`0x${string}` | string>();
    const [ipfsCid, setIpfsCid] = useState<string>();

    const { mutate: sendTransaction } = useSendTransaction();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));

            // Real Geolocation
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    setLocation(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
                    setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setTimestamp(new Date().toISOString());
                }, (err) => {
                    console.error("Geo Error:", err);
                    toast.error("Failed to acquire GPS lock. Please enable location.");
                });
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !desc || !selectedCampaign || !account) {
            toast.error("Please fill all fields and connect wallet");
            return;
        }

        setUploading(true);
        try {
            // 1. IPFS Upload
            const { cid } = await uploadToIPFS(file);
            setIpfsCid(cid);
            setUploading(false);

            // 2. On-chain Notarization
            setTxStatus("pending");
            const transaction = prepareContractCall({
                contract: {
                    client,
                    chain,
                    address: selectedCampaign as `0x${string}`,
                },
                method: "function submitProof(uint256 _milestoneIndex, string _proofHash)",
                params: [BigInt(milestoneIdx), cid],
            });

            sendTransaction(transaction, {
                onSuccess: (data: any) => {
                    setTxHash(data.transactionHash);
                    setTxStatus("success");
                    toast.success("Proof notarized on-chain!");
                },
                onError: (error) => {
                    console.error(error);
                    setTxStatus("error");
                    toast.error("Blockchain submission failed");
                }
            });
        } catch (err) {
            console.error(err);
            setUploading(false);
            setTxStatus("error");
            toast.error("Process failed");
        }
    };

    return (
        <div className="min-h-screen bg-background pt-12 pb-24">
            <div className="max-w-2xl mx-auto px-4">

                <div className="mb-10">
                    <h1 className=" text-4xl text-foreground mb-3">
                        Submit Immutable Proof
                    </h1>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                        Upload geo-tagged media to unlock the next funding phase. The community will
                        audit this proof before releasing funds.
                    </p>
                </div>

                {txStatus !== "idle" ? (
                    <div className="bg-card border border-border p-8 rounded-xl">
                        <h3 className=" text-[24px] text-foreground mb-6 text-center">Submission Status</h3>
                        <TransactionStatus status={txStatus as any} txHash={txHash as `0x${string}`} />

                        {txStatus === "success" && ipfsCid && (
                            <div className="mt-8 pt-8 border-t border-border flex flex-col items-center text-center animate-in fade-in">
                                <CheckCircle2 size={48} className="text-success mb-4" />
                                <p className="text-[14px] text-foreground mb-2 font-medium">Successfully Pinned to IPFS</p>
                                <code className="text-[11px] text-muted-foreground/70 bg-muted px-3 py-1.5 rounded border border-border break-all max-w-full">
                                    ipfs://{ipfsCid}
                                </code>

                                <div className="mt-8 flex gap-4 w-full">
                                    <Link
                                        href="/dashboard"
                                        className="flex-1 py-2.5 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md text-[13px] font-medium"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    <Link
                                        href={`/campaigns/${selectedCampaign}`}
                                        className="flex-1 py-2.5 bg-primary text-bg-deep font-semibold rounded-md hover:opacity-90 transition-opacity text-[13px]"
                                    >
                                        View Campaign
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-card border border-border p-8 rounded-xl shadow-sm space-y-8">

                        {/* Media Upload Area */}
                        <div className="space-y-3">
                            <label className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground block">
                                Cryptographic Evidence
                            </label>

                            <div
                                className={`relative w-full aspect-video border-2 border-dashed rounded-xl overflow-hidden transition-colors ${preview ? "border-border" : "border-border hover:border-accent bg-muted/50 cursor-pointer flex flex-col items-center justify-center"}`}
                                onClick={!preview ? handleCapture : undefined}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Proof preview" className="w-full h-full object-cover" />

                                        {/* Geo overlay simulation */}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent p-4 flex flex-col gap-1 text-[11px] font-mono text-foreground drop-shadow-md">
                                            {location ? <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {location}</span> : <span className="animate-pulse">Extracting geolocation...</span>}
                                            {timestamp ? <span className="flex items-center gap-1.5"><Clock size={12} className="text-warning" /> {timestamp}</span> : null}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPreview(null); setFile(null); setLocation(""); setTimestamp(""); }}
                                            className="absolute top-4 right-4 bg-background/80 backdrop-blur border border-border text-muted-foreground hover:text-danger px-3 py-1.5 rounded text-[12px] transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border border-border mb-4">
                                            <Camera size={24} className="text-muted-foreground/70" />
                                        </div>
                                        <p className="text-[14px] text-foreground font-medium mb-1">Capture Live Photo</p>
                                        <p className="text-[12px] text-muted-foreground/70 max-w-xs text-center">Must contain valid EXIF data. Max size 5MB.</p>
                                    </>
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment" // Suggests back camera on mobile
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground block">
                                    Campaign Select
                                </label>
                                <select
                                    value={selectedCampaign}
                                    onChange={(e) => setSelectedCampaign(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-accent appearance-none disabled:opacity-50"
                                    disabled={campaignsLoading}
                                >
                                    <option value="" disabled>Select a Campaign</option>
                                    {campaigns?.map(c => (
                                        <option key={c.id} value={c.address}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground block">
                                    Target Milestone Index
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={milestoneIdx}
                                    onChange={(e) => setMilestoneIdx(parseInt(e.target.value))}
                                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[12px] font-mono uppercase tracking-wider text-muted-foreground block">
                                Verification Notes
                            </label>
                            <textarea
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                placeholder="Describe what is shown in the image. e.g. Distribution of 50 ration kits at Pandu Relief center..."
                                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-[14px] text-foreground focus:outline-none focus:border-accent h-32 resize-none placeholder:text-muted-foreground/70"
                                required
                            />
                        </div>

                        <div className="pt-6 border-t border-border flex justify-end">
                            <button
                                type="submit"
                                disabled={!file || !desc || !location || uploading || !selectedCampaign}
                                className="px-8 py-3 bg-primary text-bg-deep font-semibold rounded-lg hover:opacity-90 transition-opacity text-[14px] disabled:opacity-50 flex items-center justify-center min-w-[200px] gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <Upload size={16} className="animate-bounce" /> Pushing to IPFS...
                                    </>
                                ) : (
                                    <>
                                        <FileText size={16} /> Sign & Submit Proof
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
