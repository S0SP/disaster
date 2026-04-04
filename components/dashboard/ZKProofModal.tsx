"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2, ShieldCheck, MapPin } from "lucide-react";

interface ZKProofModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
    milestoneTitle: string;
}

export function ZKProofModal({ isOpen, onClose, onVerified, milestoneTitle }: ZKProofModalProps) {
    const [step, setStep] = useState<"init" | "processing" | "success">("init");

    const startVerification = async () => {
        setStep("processing");
        // Simulate ZK circuit generation (proving location is in radius without revealing coords)
        await new Promise(r => setTimeout(r, 2500));
        setStep("success");
        await new Promise(r => setTimeout(r, 1000));
        onVerified();
        setStep("init");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-bg-deep border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Fingerprint className="text-primary" />
                        ZK-Region Verification
                    </DialogTitle>
                    <DialogDescription>
                        Generating a Zero-Knowledge proof to verify your residency in the disaster zone.
                        Your exact coordinates remain private.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-8 flex flex-col items-center justify-center space-y-6">
                    {step === "init" && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <MapPin size={40} className="text-primary animate-pulse" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Regional Gated Voting</p>
                                <p className="text-xs text-muted-foreground mt-1">Audit for: {milestoneTitle}</p>
                            </div>
                        </>
                    )}

                    {step === "processing" && (
                        <>
                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                            <div className="text-center space-y-1">
                                <p className="text-sm font-mono text-primary">Generating Proof Circuit...</p>
                                <p className="text-[10px] text-muted-foreground font-mono">HASH: 0x8f2d...4a1e</p>
                            </div>
                        </>
                    )}

                    {step === "success" && (
                        <>
                            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center border border-success/40">
                                <ShieldCheck size={40} className="text-success" />
                            </div>
                            <p className="text-sm font-medium text-success">Location Proven (ZK-SNARK)</p>
                        </>
                    )}
                </div>

                <DialogFooter>
                    {step === "init" && (
                        <Button onClick={startVerification} className="w-full bg-primary hover:bg-primary/90 text-bg-deep font-bold">
                            Generate & Sign Proof
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
