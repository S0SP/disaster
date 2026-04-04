import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SAHAYATA - Decentralized Disaster Relief",
  description: "Transparent, community-governed disaster relief with blockchain accountability",
};

import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen pb-0">
        <AppProviders>
          <DemoBanner />
          <Navbar />
          <main className="pt-[88px] min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
