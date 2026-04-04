"use client";

import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall, toWei } from "thirdweb";
import { client, chain } from "@/lib/thirdweb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Upload,
    CheckCircle2,
    ArrowRight,
    ClipboardList,
    AlertCircle,
    ExternalLink,
    Wallet
} from "lucide-react";
import { toast } from "sonner";
import { formatMATIC } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export function NGODashboard() {
    const account = useActiveAccount();
    const { campaigns, loading } = useCampaigns();
    const { mutate: sendTransaction } = useSendTransaction();

    // Modals state
    const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
    const [submitProofOpen, setSubmitProofOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
    const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number | null>(null);

    // Form state
    const [msTitle, setMsTitle] = useState("");
    const [msAmount, setMsAmount] = useState("");
    const [ipfsCID, setIpfsCID] = useState("");

    // Filter campaigns where the current user is the NGO
    const myCampaigns = campaigns?.filter(c =>
        c.ngo_address?.toLowerCase() === account?.address?.toLowerCase() ||
        c.address?.toLowerCase() === account?.address?.toLowerCase() // Fallback
    ) || [];

    const handleAddMilestone = async () => {
        if (!selectedCampaign || !msTitle || !msAmount) return;

        toast.promise(
            new Promise((resolve, reject) => {
                const transaction = prepareContractCall({
                    contract: {
                        client,
                        chain,
                        address: (selectedCampaign.address || selectedCampaign.tx_hash) as `0x${string}`,
                    },
                    method: "function addMilestone(string memory _title, uint256 _amount)",
                    params: [msTitle, toWei(msAmount)],
                });

                sendTransaction(transaction, {
                    onSuccess: async () => {
                        // Sync to Supabase
                        const { data } = await supabase.from("campaigns").select("milestones").eq("id", selectedCampaign.id).single();
                        const updated = [...(data?.milestones || []), { title: msTitle, amount: Number(msAmount), status: "pending" }];
                        await supabase.from("campaigns").update({ milestones: updated }).eq("id", selectedCampaign.id);

                        setAddMilestoneOpen(false);
                        setMsTitle("");
                        setMsAmount("");
                        resolve("Milestone registered");
                    },
                    onError: (err) => reject(err),
                });
            }),
            {
                loading: "Broadcasting milestone to Polygon...",
                success: "Milestone successfully registered on-chain!",
                error: "Failed to register milestone",
            }
        );
    };

    const handleSubmitProof = async () => {
        if (!selectedCampaign || selectedMilestoneIdx === null || !ipfsCID) return;

        toast.promise(
            new Promise((resolve, reject) => {
                const transaction = prepareContractCall({
                    contract: {
                        client,
                        chain,
                        address: (selectedCampaign.address || selectedCampaign.tx_hash) as `0x${string}`,
                    },
                    method: "function submitProof(uint256 _milestoneIndex, string memory _proofHash)",
                    params: [BigInt(selectedMilestoneIdx), ipfsCID],
                });

                sendTransaction(transaction, {
                    onSuccess: async () => {
                        // Sync to Supabase
                        const { data } = await supabase.from("campaigns").select("milestones").eq("id", selectedCampaign.id).single();
                        const updated = [...(data?.milestones || [])];
                        if (updated[selectedMilestoneIdx]) {
                            updated[selectedMilestoneIdx].proofIpfsHash = ipfsCID;
                            updated[selectedMilestoneIdx].status = "verifying";
                        }
                        await supabase.from("campaigns").update({ milestones: updated }).eq("id", selectedCampaign.id);

                        setSubmitProofOpen(false);
                        setIpfsCID("");
                        resolve("Proof submitted");
                    },
                    onError: (err) => reject(err),
                });
            }),
            {
                loading: "Uploading evidence hash to blockchain...",
                success: "Proof submitted for community verification!",
                error: "Submission failed",
            }
        );
    };

    const handleRelease = async (campaign: any, milestoneIdx: number) => {
        toast.promise(
            new Promise((resolve, reject) => {
                const transaction = prepareContractCall({
                    contract: {
                        client,
                        chain,
                        address: (campaign.address || campaign.tx_hash) as `0x${string}`,
                    },
                    method: "function releaseMilestone(uint256 _milestoneIndex)",
                    params: [BigInt(milestoneIdx)],
                });

                sendTransaction(transaction, {
                    onSuccess: async () => {
                        // Sync to Supabase
                        const { data } = await supabase.from("campaigns").select("milestones").eq("id", campaign.id).single();
                        const updated = [...(data?.milestones || [])];
                        if (updated[milestoneIdx]) {
                            updated[milestoneIdx].released = true;
                            updated[milestoneIdx].status = "completed";
                        }
                        await supabase.from("campaigns").update({ milestones: updated }).eq("id", campaign.id);
                        resolve("Funds released");
                    },
                    onError: (err) => reject(err),
                });
            }),
            {
                loading: "Executing fund release...",
                success: "Funds successfully disbursed to NGO wallet!",
                error: (err: any) => `Release failed: Quorum not reached or insufficient balance`,
            }
        );
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading NGO profile...</div>;

    if (!account) return (
        <div className="p-12 border border-dashed border-border rounded-xl text-center bg-card">
            <AlertCircle className="mx-auto mb-4 text-warning" size={32} />
            <h3 className="text-lg font-semibold mb-2">Wallet Disconnected</h3>
            <p className="text-muted-foreground mb-6">Connect your NGO administrator wallet to manage campaigns.</p>
            <div className="flex justify-center">
                <Button className="bg-primary text-bg-deep gap-2">
                    <Wallet size={16} /> Link Admin Wallet
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-xl">
                <div>
                    <h2 className="text-2xl font-semibold mb-1 text-foreground">NGO Management Portal</h2>
                    <p className="text-muted-foreground text-sm">Oversee relief operations, submit evidence, and request fund releases.</p>
                </div>
                <Button className="bg-primary text-bg-deep gap-2" onClick={() => window.location.href = '/campaigns/create'}>
                    <Plus size={18} /> Launch New Campaign
                </Button>
            </div>

            <div className="space-y-6">
                {myCampaigns.length === 0 ? (
                    <div className="p-20 text-center border border-dashed border-border rounded-xl bg-muted/20">
                        <ClipboardList className="mx-auto mb-4 text-muted-foreground/50" size={48} />
                        <h3 className="text-xl font-medium mb-2">No Active Campaigns</h3>
                        <p className="text-muted-foreground">You haven't launched any disaster relief campaigns yet.</p>
                    </div>
                ) : (
                    myCampaigns.map((camp) => (
                        <div key={camp.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-border bg-muted/30">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{camp.title}</h3>
                                            <Badge variant={camp.status === 'active' ? 'default' : 'secondary'}>
                                                {camp.status.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <ExternalLink size={12} /> {camp.location}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right bg-primary/5 border border-primary/10 p-3 rounded-lg">
                                        <div className="text-lg font-mono font-bold text-primary">
                                            {formatMATIC(camp.raised_amount || 0)} / {formatMATIC(camp.target_amount)}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Escrowed Funds</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold flex items-center gap-2 text-foreground">
                                        <ClipboardList size={18} className="text-primary" />
                                        Relief Milestones
                                    </h4>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                                        onClick={() => {
                                            setSelectedCampaign(camp);
                                            setAddMilestoneOpen(true);
                                        }}
                                    >
                                        <Plus size={14} /> Add Milestone
                                    </Button>
                                </div>

                                <div className="grid gap-3">
                                    {(camp.milestones || []).length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic py-4">No milestones defined for this campaign.</p>
                                    ) : (
                                        camp.milestones.map((m: any, idx: number) => (
                                            <div key={idx} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted/20 border border-border/80 rounded-lg gap-4 hover:bg-muted/30 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground border border-border">M{idx + 1}</span>
                                                        <span className="font-medium text-[15px]">{m.title}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="font-mono">{m.amount} MATIC</span>
                                                        {m.proofIpfsHash && (
                                                            <a
                                                                href={`https://gateway.pinata.cloud/ipfs/${m.proofIpfsHash}`}
                                                                target="_blank"
                                                                className="flex items-center gap-1 text-primary hover:underline group"
                                                            >
                                                                View Evidence <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 w-full md:w-auto">
                                                    {m.released ? (
                                                        <Badge className="bg-success/10 text-success border-success/20 gap-1 px-4 py-1.5">
                                                            <CheckCircle2 size={12} /> Funds Disbursed
                                                        </Badge>
                                                    ) : m.proofIpfsHash ? (
                                                        <>
                                                            <Badge variant="outline" className="text-warning border-warning/20 bg-warning/5 animate-pulse py-1.5">
                                                                Awaiting Verifiers
                                                            </Badge>
                                                            <Button
                                                                size="sm"
                                                                className="bg-primary text-bg-deep hover:bg-primary/90 font-bold"
                                                                onClick={() => handleRelease(camp, idx)}
                                                            >
                                                                Execute Release
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Button
                                                            variant="secondary"
                                                            size="sm"
                                                            className="gap-2 w-full md:w-auto border-border"
                                                            onClick={() => {
                                                                setSelectedCampaign(camp);
                                                                setSelectedMilestoneIdx(idx);
                                                                setSubmitProofOpen(true);
                                                            }}
                                                        >
                                                            <Upload size={14} /> Submit Proof
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <Dialog open={addMilestoneOpen} onOpenChange={setAddMilestoneOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Register New Milestone</DialogTitle>
                        <DialogDescription>
                            Define a new relief objective. Funds will be locked until community verification.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Milestone Title</Label>
                            <Input id="title" placeholder="e.g. Distribution of 500 ration kits" value={msTitle} onChange={e => setMsTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Target Amount (MATIC)</Label>
                            <Input id="amount" type="number" placeholder="5.0" value={msAmount} onChange={e => setMsAmount(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddMilestoneOpen(false)}>Cancel</Button>
                        <Button className="bg-primary text-bg-deep" onClick={handleAddMilestone}>Register Milestone</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={submitProofOpen} onOpenChange={setSubmitProofOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Relief Evidence</DialogTitle>
                        <DialogDescription>
                            Provide the IPFS CID of photos/invoices as proof of work for this milestone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="cid">IPFS Content ID (CID)</Label>
                            <Input id="cid" placeholder="Qm..." value={ipfsCID} onChange={e => setIpfsCID(e.target.value)} />
                        </div>
                        <p className="text-[11px] text-muted-foreground bg-muted p-2 rounded">
                            Note: This hash will be permanently recorded on Polygon. Verifiers will use this to audit your work.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSubmitProofOpen(false)}>Cancel</Button>
                        <Button className="bg-primary text-bg-deep" onClick={handleSubmitProof}>Upload Proof</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
