"use client";

import Link from "next/link";
import { AnimatedCounter } from "../shared/AnimatedCounter";
import { ArrowRight } from "lucide-react";
import { GlobeCanvas } from "../globe/GlobeCanvas";

export function HeroSection() {
    return (
        <section className="relative min-h-[calc(100vh-88px)] flex flex-col justify-center overflow-hidden py-20 lg:py-0 mesh-grid">
            <div className="page-container relative z-10 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

                {/* Left Column */}
                <div className="w-full lg:w-[45%] flex flex-col items-start pt-10  lg:pt-0">
                    <div className="mb-6 animate-in stagger-1 pl-2.5">
                        <p className="label-text mb-1">
                            Decentralized Disaster Relief Governance
                        </p>
                        <p className="text-[12px] text-muted-foreground uppercase tracking-[0.2em] font-medium opacity-70">
                            From donation to verified delivery
                        </p>
                    </div>

                    <h1 className=" text-5xl lg:text-[60px] leading-[1.1] tracking-tight text-foreground mb-6 animate-in stagger-2">
                        Transparent relief, <br className="hidden md:block" />
                        verified by the <br className="hidden md:block" />
                        community.
                    </h1>

                    <p className="text-[16px] text-muted-foreground leading-relaxed max-w-[480px] mb-10 animate-in stagger-3">
                        Every rupee tracked. Every proof immutable. Every decision
                        community-governed.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 animate-in stagger-4 mb-12">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:scale-[1.02] hover:shadow-[0_0_20px_hsla(var(--primary),0.2)] transition-all duration-200 text-[14px]"
                        >
                            View Dashboard
                        </Link>
                        <Link
                            href="/campaigns"
                            className="px-6 py-3 bg-transparent text-foreground border border-border group hover:border-border hover:border-primary/50 rounded-md transition-all duration-200 text-[14px] flex items-center gap-2"
                        >
                            Explore Campaigns
                            <ArrowRight size={16} className="text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition-all" />
                        </Link>
                    </div>

                    {/* Stat Counters */}
                    <div className="flex items-center gap-6 md:gap-10 border-t border-border pt-8 animate-in" style={{ animationDelay: "0.5s" }}>
                        <div className="flex flex-col">
                            <span className=" text-[28px] text-primary">
                                ₹<AnimatedCounter value={2450000} duration={2000} />
                            </span>
                            <span className="text-[12px] text-muted-foreground">donated</span>
                        </div>
                        <div className="w-[1px] h-10 bg-border"></div>
                        <div className="flex flex-col">
                            <span className=" text-[28px] text-foreground">
                                <AnimatedCounter value={8} duration={1500} />
                            </span>
                            <span className="text-[12px] text-muted-foreground">camps</span>
                        </div>
                        <div className="w-[1px] h-10 bg-border"></div>
                        <div className="flex flex-col">
                            <span className=" text-[28px] text-foreground">
                                <AnimatedCounter value={147} duration={2000} />
                            </span>
                            <span className="text-[12px] text-muted-foreground">voters</span>
                        </div>
                        <div className="w-[1px] h-10 bg-border"></div>
                        <div className="flex flex-col">
                            <span className=" text-[28px] text-success">
                                <AnimatedCounter value={100} format="percent" duration={1500} />
                            </span>
                            <span className="text-[12px] text-muted-foreground">tracked</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Globe */}
                <div className="w-full lg:w-[55%] h-[400px] md:h-[500px] lg:h-[600px] relative mt-8 lg:mt-0 lg:-translate-y-6 lg:translate-x-12 opacity-0 animate-in" style={{ animationDelay: "0.6s" }}>
                    <GlobeCanvas />
                </div>

            </div>
        </section>
    );
}
