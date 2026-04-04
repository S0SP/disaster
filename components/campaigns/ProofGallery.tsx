"use client";

import { useState } from "react";
import { Camera, MapPin, Calendar, ExternalLink, X } from "lucide-react";
import { IPFSLink } from "../shared/IPFSLink";
import * as Dialog from "@radix-ui/react-dialog";

interface ProofItem {
    id: string;
    cid: string;
    url: string; // usually ipfs gateway url
    description: string;
    timestamp: string;
    location: string;
    verifiedBy: number;
}

interface ProofGalleryProps {
    proofs: ProofItem[];
}

export function ProofGallery({ proofs }: ProofGalleryProps) {
    const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);

    if (proofs.length === 0) {
        return (
            <div className="border border-dashed border-border p-8 rounded-xl bg-muted/30 text-center">
                <Camera size={24} className="mx-auto mb-3 text-muted-foreground/70" />
                <p className="text-[14px] text-muted-foreground">No proofs submitted yet.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {proofs.map((proof) => (
                    <button
                        key={proof.id}
                        onClick={() => setSelectedProof(proof)}
                        className="group relative aspect-square bg-muted rounded-lg overflow-hidden border border-border hover:border-border hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-text-secondary transition-all"
                    >
                        {/* We use an img tag with an IPFS gateway URL */}
                        <img
                            src={proof.url}
                            alt={proof.description}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <Camera size={20} className="text-foreground" />
                            <span className="text-[12px] font-medium text-foreground px-3 text-center">View Details</span>
                        </div>

                        {/* Badges overlay */}
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-background/80 backdrop-blur text-[10px] uppercase font-mono text-success rounded border border-success/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success" />
                            Verified
                        </div>
                    </button>
                ))}
            </div>

            <Dialog.Root open={!!selectedProof} onOpenChange={(open) => !open && setSelectedProof(null)}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 animate-in fade-in" />
                    <Dialog.Content className="fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] w-full sm:w-[calc(100%-64px)] max-w-4xl h-full sm:h-[80vh] sm:max-h-[800px] bg-card sm:border border-border shadow-2xl sm:rounded-xl z-50 flex flex-col sm:flex-row overflow-hidden outline-none animate-in zoom-in-95 duration-200">

                        {/* Left side - Image */}
                        <div className="w-full sm:w-2/3 h-[50vh] sm:h-full bg-background relative flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border">
                            {selectedProof && (
                                <img
                                    src={selectedProof.url}
                                    alt="Proof Document"
                                    className="max-w-full max-h-full object-contain"
                                />
                            )}
                        </div>

                        {/* Right side - Details */}
                        <div className="w-full sm:w-1/3 flex flex-col h-[50vh] sm:h-full bg-card overflow-y-auto">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <Dialog.Title className=" text-[20px] text-foreground">Immutable Proof</Dialog.Title>
                                        <Dialog.Description className="sr-only">Detailed view of the cryptographic proof including geolocation and community verification.</Dialog.Description>
                                    </div>
                                    <Dialog.Close asChild>
                                        <button className="text-muted-foreground/70 hover:text-foreground transition-colors">
                                            <X size={20} />
                                        </button>
                                    </Dialog.Close>
                                </div>

                                {selectedProof && (
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[12px] text-muted-foreground/70 uppercase tracking-wider mb-2">Description</p>
                                            <p className="text-[14px] text-foreground leading-relaxed">{selectedProof.description}</p>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-border">
                                            <div className="flex items-start gap-3 text-[13px]">
                                                <MapPin size={16} className="text-muted-foreground/70 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-muted-foreground">GPS Location</p>
                                                    <p className="font-mono text-foreground mt-1">{selectedProof.location}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 text-[13px]">
                                                <Calendar size={16} className="text-muted-foreground/70 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-muted-foreground">Timestamp</p>
                                                    <p className="font-mono text-foreground mt-1">{selectedProof.timestamp}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 text-[13px]">
                                                <Camera size={16} className="text-success shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-muted-foreground">Community Verification</p>
                                                    <p className="text-success mt-1">{selectedProof.verifiedBy} local verifiers approved</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-border mt-auto">
                                            <p className="text-[12px] text-muted-foreground/70 uppercase tracking-wider mb-3">On-Chain Record</p>
                                            <div className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg">
                                                <span className="text-[12px] text-muted-foreground">IPFS CID</span>
                                                <IPFSLink cid={selectedProof.cid} />
                                            </div>

                                            <a href={`${selectedProof.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 mt-3 border border-border hover:bg-muted hover:text-foreground rounded-md text-[13px] text-muted-foreground transition-colors">
                                                <ExternalLink size={14} />
                                                View Raw File
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
