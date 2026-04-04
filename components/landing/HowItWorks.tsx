"use client";

import { Shield, Camera, Vote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        num: "01",
        title: "DONATE",
        desc: "Funds go into escrow vault. No one can touch it.",
        icon: Shield,
        color: "text-primary",
    },
    {
        num: "02",
        title: "VERIFY",
        desc: "NGO submits proof on IPFS. Geo-tag, timestamps, invoices.",
        icon: Camera,
        color: "text-foreground",
    },
    {
        num: "03",
        title: "RELEASE",
        desc: "Community votes to release funds. 51% approval needed.",
        icon: Vote,
        color: "text-success",
    },
];

export function HowItWorks() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="how-it-works" className="py-24 bg-background relative border-t border-border">
            <div className="page-container relative z-10">
                <div className={cn("flex flex-col items-center text-center mb-20", isVisible ? "animate-in fade-in slide-in-from-bottom-4 duration-700" : "opacity-0")}>
                    <p className="label-text mb-4">HOW IT WORKS</p>
                    <h2 className=" text-3xl md:text-4xl text-foreground font-semibold">
                        From donation to verified delivery
                    </h2>
                </div>

                <div
                    ref={containerRef}
                    className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
                >
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[64px] left-[16%] right-[16%] h-[1px]">
                        <svg width="100%" height="2" className="overflow-visible opacity-20">
                            <line
                                x1="0" y1="1" x2="100%" y2="1"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="6 6"
                                className={cn("text-border transition-all duration-1000", isVisible ? "stroke-dashoffset-0" : "stroke-dashoffset-full")}
                                style={{
                                    strokeDashoffset: isVisible ? 0 : 1000,
                                    transitionTimingFunction: "ease-in-out"
                                }}
                            />
                        </svg>
                    </div>

                    {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.num}
                                className={cn(
                                    "relative flex flex-col items-center text-center group cursor-default transition-all duration-500",
                                    isVisible ? "animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards" : "opacity-0"
                                )}
                                style={{
                                    animationDelay: `${idx * 0.15}s`,
                                }}
                            >
                                <div className="w-32 h-32 mb-8 relative flex items-center justify-center">
                                    <div className="absolute inset-0 bg-muted/50 rounded-full group-hover:scale-110 transition-transform duration-500 border border-border/50 group-hover:border-primary/30"></div>
                                    <Icon size={32} className={cn("relative z-10 transition-colors duration-300", step.color)} />
                                    <div className="absolute -top-2 -right-2 bg-card border border-border px-2 py-0.5 rounded text-[12px] font-mono text-muted-foreground shadow-sm">
                                        {step.num}
                                    </div>
                                </div>

                                <div className="w-8 h-[1px] bg-border mb-6 group-hover:bg-primary transition-colors duration-300"></div>

                                <h3 className=" text-2xl text-foreground mb-4 font-medium tracking-tight group-hover:text-primary transition-colors duration-300">
                                    {step.title}
                                </h3>

                                <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[240px]">
                                    {step.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

