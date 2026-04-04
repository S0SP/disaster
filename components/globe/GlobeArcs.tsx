"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "@/lib/geo";

// Active arcs for demo: Bangalore -> Dhubri, Mumbai -> Guwahati, Delhi -> Kolkata
const DEMO_ARCS = [
    { start: { lat: 12.9716, lng: 77.5946 }, end: { lat: 26.0142, lng: 89.9523 } }, // Bangalore -> Dhubri
    { start: { lat: 19.0760, lng: 72.8777 }, end: { lat: 26.1445, lng: 91.7362 } }, // Mumbai -> Guwahati
    { start: { lat: 28.7041, lng: 77.1025 }, end: { lat: 22.5726, lng: 88.3639 } }, // Delhi -> Kolkata
];

function calculateArc(start: { lat: number, lng: number }, end: { lat: number, lng: number }) {
    const startVec = latLngToVector3(start.lat, start.lng, 0.794);
    const endVec = latLngToVector3(end.lat, end.lng, 0.794);

    // Control point in the middle, pushed outwards
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    // Distance between points to determine height of arc
    const distance = startVec.distanceTo(endVec);

    // Normalize and multiply by radius + height
    midPoint.normalize().multiplyScalar(0.794 + Math.max(distance * 0.3, 0.1));

    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return curve.getPoints(50);
}

function ArcMesh({ start, end, delay }: { start: any, end: any, delay: number }) {
    const points = useMemo(() => calculateArc(start, end), [start, end]);

    // Create a tube geometry around the line
    const curve = new THREE.CatmullRomCurve3(points);

    // Light particle traveling along the arc
    const particleRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (particleRef.current) {
            const time = (state.clock.getElapsedTime() + delay) % 3; // 3 seconds per traversal
            const progress = time / 3;

            const point = curve.getPoint(progress);
            particleRef.current.position.copy(point);

            // Fade opacity at edges
            const isVisible = progress > 0.05 && progress < 0.95;
            particleRef.current.visible = isVisible;
        }
    });

    return (
        <group>
            {/* The invisible track or very faint line */}
            <mesh>
                <tubeGeometry args={[curve, 64, 0.002, 8, false]} />
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent={true}
                    opacity={0.1}
                />
            </mesh>

            {/* Flowing particle */}
            <mesh ref={particleRef}>
                <sphereGeometry args={[0.008, 8, 8]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    emissive="#3b82f6"
                    emissiveIntensity={2.0}
                />
            </mesh>
        </group>
    );
}

export default function GlobeArcs() {
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.0005; // Sync with globe rotation
        }
    });

    return (
        <group ref={groupRef}>
            {DEMO_ARCS.map((arc, idx) => (
                <ArcMesh
                    key={idx}
                    start={arc.start}
                    end={arc.end}
                    delay={idx * 1.2} // Staggered animations
                />
            ))}
        </group>
    );
}
