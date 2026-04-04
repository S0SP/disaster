"use client";

import { PolygonscanLink } from "@/components/shared/PolygonscanLink";
import { ArrowDownCircle, Camera, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FEED_ITEMS = [
    { id: 1, type: "donation", text: "0xf3...a2 donated 0.5 MATIC to Dhubri Relief", time: "2 min ago", hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef" },
    { id: 2, type: "proof", text: "Tranche 2 proof submitted — Guwahati Camp", time: "5 min ago", hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" },
    { id: 3, type: "donation", text: "0x7b...c1 donated 1.2 MATIC to Silchar Relief", time: "8 min ago", hash: "0x1111111111111111111111111111111111111111111111111111111111111111" },
    { id: 4, type: "vote", text: "Vote passed: 73% YES — Dhubri Tranche 1", time: "12 min ago", hash: "0x2222222222222222222222222222222222222222222222222222222222222222" },
    { id: 5, type: "donation", text: "0x4a...9d donated 5.0 MATIC to Kaziranga Relief", time: "15 min ago", hash: "0x3333333333333333333333333333333333333333333333333333333333333333" },
];

export function LiveFeed() {
    const getIcon = (type: string) => {
        switch (type) {
            case "donation": return <ArrowDownCircle size={14} className="text-success" />;
            case "proof": return <Camera size={14} className="text-warning" />;
            case "vote": return <CheckCircle2 size={14} className="text-info" />;
            default: return <CheckCircle2 size={14} />;
        }
    };

    const getColorClass = (type: string) => {
        switch (type) {
            case "donation": return "bg-success";
            case "proof": return "bg-warning";
            case "vote": return "bg-info";
            default: return "bg-muted";
        }
    };

    return (
        <div className="w-full border-y border-border bg-muted/30 overflow-hidden relative h-12 flex items-center">
            {/* Gradient masks for smooth edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none"></div>

            {/* Scrolling container */}
            <div className="flex animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] w-max">
                {/* We duplicate the items to create a seamless loop */}
                {[...FEED_ITEMS, ...FEED_ITEMS].map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className="flex items-center gap-3 px-6 shrink-0 border-r border-border/50 last:border-0"
                    >
                        <div className="relative flex items-center justify-center">
                            <div className={cn("w-2 h-2 rounded-full", getColorClass(item.type))} />
                            <div className={cn("absolute inset-0 rounded-full animate-ping opacity-50", getColorClass(item.type))} />
                        </div>

                        <span className="text-[13px] text-foreground whitespace-nowrap">
                            {item.text}
                        </span>

                        <span className="text-[12px] text-muted-foreground/70 whitespace-nowrap ml-2">
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    );
}
