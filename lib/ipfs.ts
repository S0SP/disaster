"use client";

/**
 * UTILITY: IPFS Evidence Uploader
 * This helper handles the multi-step process of preparing relief evidence
 * for on-chain notarization.
 */

export interface IPFSResponse {
    cid: string;
    url: string;
}

export async function uploadToIPFS(file: File): Promise<IPFSResponse> {
    // 1. In production, this would use a Server Action to protect Pinata Keys
    // For now, we simulate the CID generation to maintain the flow

    console.log("Preparing IPFS upload for:", file.name);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock CID for development (Matches IPFS standard format)
    const mockCid = "Qm" + Array.from({ length: 44 }, () =>
        "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36))
    ).join("");

    return {
        cid: mockCid,
        url: `https://gateway.pinata.cloud/ipfs/${mockCid}`
    };
}
