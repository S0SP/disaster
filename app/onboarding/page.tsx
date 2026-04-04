"use client";

import { useUser } from "@/components/providers/UserProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Heart, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ROLES = [
    {
        id: "DONOR",
        title: "Donor",
        description: "Contribute to disaster relief and track your impact",
        icon: Heart,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        id: "NGO",
        title: "NGO / Relief Org",
        description: "Launch campaigns and submit on-chain proof of work",
        icon: Building2,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        id: "VOTER",
        title: "Local Verifier",
        description: "Verify community proofs and vote on fund releases",
        icon: Users,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
];

export default function OnboardingPage() {
    const { profile, loading } = useUser();
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleRoleSelect = async () => {
        if (!selectedRole || !profile) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    user_role: selectedRole,
                    has_onboarded: true
                })
                .eq("id", profile.id);

            if (error) throw error;

            toast.success(`Welcome! Your role is now ${selectedRole}`);
            // Force a reload or router push to trigger UserProvider check
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            toast.error("Failed to update role");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    Choose Your Role
                </h1>
                <p className="text-muted-foreground text-[16px] max-w-xl mx-auto">
                    To get started, please select how you will be participating in the SAHAYATA ecosystem.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-12">
                {ROLES.map((role) => (
                    <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                            "relative flex flex-col items-center text-center p-8 bg-card border-[1.5px] rounded-2xl transition-all duration-300 group",
                            selectedRole === role.id
                                ? "border-primary shadow-2xl shadow-primary/10 ring-4 ring-primary/5 scale-[1.02]"
                                : "border-border hover:border-muted-foreground/30 hover:scale-[1.01]"
                        )}
                    >
                        {selectedRole === role.id && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground animate-in zoom-in">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}

                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", role.bg)}>
                            <role.icon className={cn("w-8 h-8", role.color)} />
                        </div>

                        <h3 className="text-xl font-bold text-foreground mb-3">{role.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed leading-[1.6]">
                            {role.description}
                        </p>
                    </button>
                ))}
            </div>

            <button
                onClick={handleRoleSelect}
                disabled={!selectedRole || isSubmitting}
                className="w-full max-w-sm py-4 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:grayscale"
            >
                {isSubmitting ? "Updating..." : "Confirm My Role"}
            </button>

            <p className="mt-8 text-xs text-muted-foreground text-center">
                Note: NGO and Verifier roles may require additional on-chain identity verification.
            </p>
        </div>
    );
}
