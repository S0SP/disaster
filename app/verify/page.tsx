"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, MapPin, Smartphone } from "lucide-react";
import { TransactionStatus } from "@/components/shared/TransactionStatus";
import Link from "next/link";

export default function VerifyPage() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [aadhaar, setAadhaar] = useState("");
    const [otp, setOtp] = useState("");
    const [location, setLocation] = useState("");
    const [txStatus, setTxStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
    const [txHash, setTxHash] = useState<string>();

    const requestOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (aadhaar.length === 12) {
            setStep(2);
        }
    };

    const verifyOTP = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === 6) {
            setStep(3);
        }
    };

    const captureLocation = () => {
        // Simulate geolocation API
        setTimeout(() => {
            setLocation("Guwahati, Assam (26.1445° N, 91.7362° E)");
            setStep(4);
        }, 1500);
    };

    const mintSBT = () => {
        setTxStatus("pending");
        setTimeout(() => {
            setTxStatus("success");
            setTxHash("0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
        }, 4000);
    };

    return (
        <div className="min-h-screen bg-background pt-12 pb-24">
            <div className="max-w-2xl mx-auto px-4">

                <div className="text-center mb-12">
                    <ShieldCheck size={48} className="text-success mx-auto mb-6" />
                    <h1 className=" text-4xl text-foreground mb-3">
                        Identity Verification
                    </h1>
                    <p className="text-[14px] text-muted-foreground leading-relaxed">
                        Sahayata uses zero-knowledge proofs to cryptographically verify your Aadhaar and location
                        without storing your personal data. This mints a Soulbound Token (SBT) granting you voting rights.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-8 shadow-sm">

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-10 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-border -z-10 -translate-y-1/2" />
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-mono transition-colors ${step > i
                                        ? "bg-success text-bg-primary border border-success"
                                        : step === i
                                            ? "bg-primary text-bg-deep border border-accent"
                                            : "bg-muted text-muted-foreground/70 border border-border"
                                    }`}
                            >
                                {step > i ? <CheckCircle2 size={16} /> : i}
                            </div>
                        ))}
                    </div>

                    <div className="min-h-[250px] flex flex-col justify-center">

                        {/* Step 1: Aadhaar */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-[18px] font-semibold text-foreground mb-2">Aadhaar Verification</h3>
                                <p className="text-[13px] text-muted-foreground mb-6">Enter your 12-digit Aadhaar number to receive an OTP.</p>
                                <form onSubmit={requestOTP} className="space-y-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="XXXX XXXX XXXX"
                                            value={aadhaar}
                                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-[16px] tracking-widest text-foreground font-mono focus:outline-none focus:border-accent text-center transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={aadhaar.length !== 12}
                                        className="w-full py-3 bg-text-primary text-bg-primary font-semibold rounded-lg hover:bg-text-secondary transition-colors text-[14px] disabled:opacity-50"
                                    >
                                        Request OTP
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 2: OTP */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h3 className="text-[18px] font-semibold text-foreground mb-2">Verify OTP</h3>
                                <p className="text-[13px] text-muted-foreground mb-6">Enter the 6-digit code sent to your registered mobile number.</p>
                                <form onSubmit={verifyOTP} className="space-y-6">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="XXXXXX"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-[24px] tracking-[1em] text-foreground font-mono focus:outline-none focus:border-accent text-center transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={otp.length !== 6}
                                        className="w-full py-3 bg-text-primary text-bg-primary font-semibold rounded-lg hover:bg-text-secondary transition-colors text-[14px] disabled:opacity-50"
                                    >
                                        Verify & Continue
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Step 3: Location */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-info/10 flex items-center justify-center mb-4">
                                    <MapPin size={24} className="text-info" />
                                </div>
                                <h3 className="text-[18px] font-semibold text-foreground mb-2">Device Geolocation</h3>
                                <p className="text-[13px] text-muted-foreground mb-8 max-w-sm">
                                    Sahayata needs to cryptographically bind your device's location to your verified identity
                                    to assign you to the correct local governance zone.
                                </p>
                                <button
                                    onClick={captureLocation}
                                    className="w-full py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors text-[14px] flex justify-center items-center gap-2"
                                >
                                    <Smartphone size={18} />
                                    Allow Location Access
                                </button>
                            </div>
                        )}

                        {/* Step 4: Mint SBT */}
                        {step === 4 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">

                                {txStatus === "idle" ? (
                                    <>
                                        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4 mx-auto border border-success/30">
                                            <ShieldCheck size={28} className="text-success" />
                                        </div>
                                        <h3 className="text-[20px]  text-foreground mb-2">Verification Complete</h3>

                                        <div className="bg-muted/50 border border-border p-4 rounded-lg my-6 text-left">
                                            <div className="flex flex-col gap-3 text-[13px] text-muted-foreground font-mono">
                                                <div className="flex justify-between">
                                                    <span>ZK-Proof Generated:</span>
                                                    <span className="text-success">Success</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Governance Zone:</span>
                                                    <span className="text-foreground">{location.split(',')[0]}</span>
                                                </div>
                                                <div className="flex justify-between pt-3 border-t border-border/50">
                                                    <span>Voting Weight:</span>
                                                    <span className="text-foreground">1 Vote / Campaign</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={mintSBT}
                                            className="w-full py-3.5 bg-primary text-bg-deep font-semibold rounded-lg hover:opacity-90 transition-opacity text-[14px]"
                                        >
                                            Mint Gov Identity (SBT)
                                        </button>
                                    </>
                                ) : (
                                    <div className="py-6">
                                        <TransactionStatus
                                            status={txStatus as any}
                                            txHash={txHash}
                                        />
                                        {txStatus === "success" && (
                                            <div className="mt-8">
                                                <Link
                                                    href="/governance"
                                                    className="px-6 py-2 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors rounded-md text-[13px]"
                                                >
                                                    Go to Governance Dashboard
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
