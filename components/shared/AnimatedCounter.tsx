"use client";

import { useEffect, useRef, useState } from "react";
import { formatMATIC } from "@/lib/utils";

interface AnimatedCounterProps {
    value: number;
    format?: "number" | "matic" | "percent";
    duration?: number;
    className?: string;
}

export function AnimatedCounter({
    value,
    format = "number",
    duration = 1500,
    className = ""
}: AnimatedCounterProps) {
    const [count, setCount] = useState(0);
    const countRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let startTime: number | null = null;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;

                        // easeOutQuart
                        const easeOutProgress = 1 - Math.pow(1 - Math.min(progress / duration, 1), 4);

                        const currentCount = value * easeOutProgress;
                        setCount(currentCount);

                        if (progress < duration) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(value);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 }
        );

        if (countRef.current) {
            observer.observe(countRef.current);
        }

        return () => observer.disconnect();
    }, [value, duration]);

    const displayValue = () => {
        if (format === "matic") {
            return formatMATIC(count);
        }
        if (format === "percent") {
            return `${count.toFixed(1)}%`;
        }
        // "number"
        return Math.round(count).toLocaleString();
    };

    return (
        <span ref={countRef} className={className}>
            {displayValue()}
        </span>
    );
}
