"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@/components/shared/ConnectButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Menu, X, PlusCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useUser } from "../providers/UserProvider";

interface NavLink {
    name: string;
    href: string;
    icon?: any;
}

export function Navbar() {
    const pathname = usePathname();
    const { profile } = useUser();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = useMemo(() => {
        const base: NavLink[] = [
            { name: "Explore", href: "/campaigns" },
            { name: "Governance", href: "/governance" },
        ];

        if (profile?.has_onboarded) {
            base.unshift({ name: "Dashboard", href: "/dashboard" });

            if (profile.user_role === "NGO") {
                base.push({ name: "Launch", href: "/campaigns/create", icon: PlusCircle });
            }
            if (profile.user_role === "VOTER") {
                base.push({ name: "Audit Queue", href: "/verify", icon: ShieldCheck });
            }
        }

        return base;
    }, [profile]);

    return (
        <>
            <nav
                className={cn(
                    "fixed top-[32px] w-full h-[56px] z-40 transition-colors duration-300 border-b",
                    scrolled ? "bg-background/90 backdrop-blur-md border-border" : "bg-background border-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <Link href="/" className="lowercase text-[32px] text-foreground tracking-[0.05em] font-bold">
                        Sahayata
                    </Link>

                    {/* Desktop Items Grouped Right */}
                    <div className="hidden md:flex items-center gap-12 ml-auto">
                        <div className="flex items-center gap-8">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "text-[14px] transition-all relative font-medium flex items-center gap-2",
                                            isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        {link.icon && <link.icon size={14} className="text-primary" />}
                                        {link.name}
                                        {isActive && (
                                            <span className="absolute -bottom-[6px] left-0 w-full h-[1.5px] bg-primary" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="w-[1px] h-4 bg-border"></div>

                        <div className="flex items-center gap-6">
                            <ThemeToggle />
                            <ConnectButton />
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 w-full bg-background z-50 transform transition-transform duration-300 md:hidden flex flex-col p-6 pt-24",
                    mobileOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <button
                    className="absolute top-[48px] right-4 text-muted-foreground"
                    onClick={() => setMobileOpen(false)}
                >
                    <X size={24} />
                </button>

                <div className="flex flex-col gap-6 items-center">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "text-lg font-medium tracking-wide flex items-center gap-3",
                                    isActive ? "text-foreground border-b-2 border-border hover:border-primary/50 pb-1" : "text-muted-foreground"
                                )}
                            >
                                {link.icon && <link.icon size={18} className="text-primary" />}
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="mt-8 flex flex-col items-center gap-4">
                        <ThemeToggle />
                        <ConnectButton />
                    </div>
                </div>
            </div>
        </>
    );
}
