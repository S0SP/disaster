export function SkeletonCard() {
    return (
        <div className="bg-card border border-border rounded-xl p-5 h-[220px] relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />

            <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-5 bg-muted rounded-full relative z-10" />
                <div className="w-20 h-4 bg-muted rounded relative z-10" />
            </div>

            <div className="w-3/4 h-6 bg-muted rounded mb-3 relative z-10" />
            <div className="w-1/2 h-4 bg-muted rounded mb-6 relative z-10" />

            <div className="w-1/3 h-4 bg-muted rounded mb-4 relative z-10" />

            <div className="w-full h-1.5 bg-muted rounded-full mb-3 relative z-10" />

            <div className="flex justify-between items-center mb-4">
                <div className="w-24 h-4 bg-muted rounded relative z-10" />
                <div className="w-12 h-4 bg-muted rounded relative z-10" />
            </div>
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="flex items-center justify-between p-4 border-b border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 shimmer" />
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 bg-muted rounded" />
                    <div className="w-24 h-3 bg-muted rounded" />
                </div>
            </div>
            <div className="w-20 h-5 bg-muted rounded-full relative z-10" />
        </div>
    );
}
