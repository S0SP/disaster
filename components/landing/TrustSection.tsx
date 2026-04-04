import { Shield, Lock, MapPin, Database, Clock, Verified } from "lucide-react";

export function TrustSection() {
    const TRUST_FEATURES = [
        {
            title: "Escrow Treasury",
            desc: "Funds locked in smart contract. NGOs can't access directly.",
            icon: Lock,
        },
        {
            title: "Identity Verified",
            desc: "1 Aadhaar = 1 vote. No fakes or duplicate accounts.",
            icon: Verified,
        },
        {
            title: "DAO Governance",
            desc: "51% majority required for every fund release.",
            icon: Shield,
        },
        {
            title: "Geo-fence Voting",
            desc: "Only locals within 3km can validate the relief.",
            icon: MapPin,
        },
        {
            title: "Immutable Proofs",
            desc: "Geo-tagged live photos pinned permanently on IPFS.",
            icon: Database,
        },
        {
            title: "Timelock + Auto-release",
            desc: "If no quorum: 50% auto-release after 72hrs.",
            icon: Clock,
        },
    ];

    return (
        <section className="py-24 bg-background">
            <div className="page-container">
                <div className="flex flex-col items-center text-center mb-16 animate-in">
                    <p className="label-text mb-4">BUILT ON VERIFIED TRUST</p>
                    <h2 className=" text-3xl md:text-4xl text-foreground">
                        Five layers of accountability
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TRUST_FEATURES.map((feature, idx) => (
                        <div
                            key={feature.title}
                            className="bg-card border border-border p-8 rounded-xl hover:shadow-[0_0_15px_rgba(200,149,108,0.05)] hover:border-border-accent transition-all duration-300 group animate-in"
                            style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-300">
                                <feature.icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            </div>
                            <h3 className="text-[18px] font-semibold text-foreground mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-[14px] text-muted-foreground leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
