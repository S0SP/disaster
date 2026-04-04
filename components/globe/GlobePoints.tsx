"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";

const DEMO_POINTS = [
    { id: "1", lat: 26.0142, lng: 89.9523, name: "Dhubri, Assam", amount: "10.5 MATIC" },
    { id: "2", lat: 26.1445, lng: 91.7362, name: "Guwahati, Assam", amount: "18.2 MATIC" },
    { id: "3", lat: 24.8170, lng: 89.3710, name: "Rajshahi Region", amount: "8.0 MATIC" },
    { id: "4", lat: 22.5726, lng: 88.3639, name: "Kolkata, WB", amount: "25.0 MATIC" },
    { id: "5", lat: 24.8333, lng: 92.7789, name: "Silchar, Assam", amount: "4.1 MATIC" },
];

export default function GlobePoints() {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState<string | null>(null);

    // Animate the points slightly (pulsing)
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            // Rotating alongside the globe
            groupRef.current.rotation.y += 0.0005;

            // Pulse animation
            const scale = 1 + Math.sin(time * 2) * 0.15;
            groupRef.current.children.forEach((child) => {
                // Only scale the outer glow ring if we add one, or the point itself
                // For simplicity, scale the whole point slightly
                child.scale.setScalar(scale);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {DEMO_POINTS.map((point) => {
                const position = latLngToVector3(point.lat, point.lng, 0.794);
                const isHovered = hovered === point.id;

                return (
                    <mesh
                        key={point.id}
                        position={position}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            setHovered(point.id);
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={(e) => {
                            e.stopPropagation();
                            setHovered(null);
                            document.body.style.cursor = 'auto';
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            // In real app: router.push(`/campaigns/${point.id}`)
                            window.location.href = `/campaigns/${point.id}`;
                        }}
                    >
                        <sphereGeometry args={[0.015, 16, 16]} />
                        <meshStandardMaterial
                            color="#3b82f6" // Vibrant blue (matching theme primary approximately)
                            emissive="#3b82f6"
                            emissiveIntensity={isHovered ? 1.5 : 0.6}
                            roughness={0.2}
                        />

                        {/* Tooltip Overlay */}
                        {isHovered && (
                            <Html distanceFactor={10} zIndexRange={[100, 0]}>
                                <div className="bg-card border border-border px-3 py-2 rounded-lg whitespace-nowrap shadow-xl transform -translate-x-1/2 -translate-y-full mt-[-10px] pointer-events-none animate-in fade-in duration-200">
                                    <p className="text-[13px] font-semibold text-foreground mb-1">
                                        {point.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground font-mono mb-2">
                                        {point.amount} raised
                                    </p>
                                    <p className="text-[10px] text-success uppercase tracking-wider font-medium">
                                        → View Campaign
                                    </p>
                                </div>
                            </Html>
                        )}
                    </mesh>
                );
            })}
        </group>
    );
}
