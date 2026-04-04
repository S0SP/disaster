export function DemoBanner() {
    return (
        <div className="fixed top-0 w-full h-[32px] bg-card border-b border-border z-50 flex items-center justify-center">
            <p className="text-[12px] text-muted-foreground/70">
                Demo — Polygon Amoy Testnet • Contracts verified on{' '}
                <a
                    href="https://amoy.polygonscan.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    Polygonscan
                </a>
            </p>
        </div>
    );
}
