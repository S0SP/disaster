import Link from "next/link";
import { PolygonscanLink } from "@/components/shared/PolygonscanLink";
import { CONTRACT_ADDRESSES } from "@/lib/contracts";

export function Footer() {
    return (
        <footer className="border-t border-border mt-20 pt-16 pb-8 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Column 1: About */}
                    <div>
                        <h3 className=" text-[18px] text-foreground tracking-wide mb-4">
                            sahayata
                        </h3>
                        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-sm">
                            A decentralized disaster relief platform built on Polygon.
                            Ensuring transparency, immutability, and community-driven governance for every rupee donated.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div className="md:ml-auto">
                        <h4 className="text-[12px] font-mono tracking-wider uppercase text-muted-foreground/70 mb-4">
                            Explore
                        </h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <Link href="/dashboard" className="text-[14px] text-muted-foreground hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/campaigns" className="text-[14px] text-muted-foreground hover:text-primary transition-colors">
                                    Campaigns
                                </Link>
                            </li>
                            <li>
                                <Link href="/governance" className="text-[14px] text-muted-foreground hover:text-primary transition-colors">
                                    Governance
                                </Link>
                            </li>
                            <li>
                                <Link href="/verify" className="text-[14px] text-muted-foreground hover:text-primary transition-colors">
                                    Verify Identity
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contracts */}
                    <div className="md:ml-auto">
                        <h4 className="text-[12px] font-mono tracking-wider uppercase text-muted-foreground/70 mb-4">
                            Contracts (Amoy)
                        </h4>
                        <ul className="flex flex-col gap-3">
                            <li className="flex flex-col">
                                <span className="text-[11px] text-muted-foreground/70 uppercase tracking-wide">Vault</span>
                                <PolygonscanLink hash={CONTRACT_ADDRESSES.sahayataVault} type="address" className="text-[12px] text-muted-foreground hover:text-primary" />
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[11px] text-muted-foreground/70 uppercase tracking-wide">Governor</span>
                                <PolygonscanLink hash={CONTRACT_ADDRESSES.daoGovernor} type="address" className="text-[12px] text-muted-foreground hover:text-primary" />
                            </li>
                            <li className="flex flex-col">
                                <span className="text-[11px] text-muted-foreground/70 uppercase tracking-wide">Proof Registry</span>
                                <PolygonscanLink hash={CONTRACT_ADDRESSES.proofRegistry} type="address" className="text-[12px] text-muted-foreground hover:text-primary" />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[13px] text-muted-foreground/70  italic tracking-wide">
                        "Verified trust, not blind faith."
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-[13px] text-muted-foreground/70">
                            Built for Hackathon 2025
                        </span>
                        <span className="text-[13px] text-muted-foreground/70">
                            Open source. Auditable. Trustless.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
