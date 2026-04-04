"use client";

import { Suspense, lazy } from "react";

// Lazy load the huge Three.js dependency
const GlobeScene = lazy(() => import("./GlobeScene"));

export function GlobeCanvas() {
    return (
        <div className="w-full h-full relative cursor-move">
            <Suspense fallback={<GlobeLoader />}>
                <GlobeScene />
            </Suspense>
        </div>
    );
}

function GlobeLoader() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/30 rounded-full border border-border/50 backdrop-blur-sm animate-pulse-slow">
            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin mb-4" />
            <span className="text-[13px] text-muted-foreground/70 uppercase tracking-wider font-medium">Initializing Engine</span>
        </div>
    );
}
