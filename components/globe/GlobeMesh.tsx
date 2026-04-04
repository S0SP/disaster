"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

export default function GlobeMesh() {
    const meshRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);

    // Using locally downloaded textures for reliability
    const [colorMap, normalMap, specularMap, nightLights] = useTexture([
        "/textures/earth-color.jpg",
        "/textures/earth-normal.jpg",
        "/textures/earth-specular.jpg",
        "/textures/earth-lights.jpg"
    ]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.0005;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y += 0.0005;
        }
    });

    return (
        <group>
            {/* Base Earth Sphere (Reduced Size) */}
            <mesh ref={meshRef} castShadow receiveShadow>
                <sphereGeometry args={[0.784, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    normalScale={new THREE.Vector2(1.5, 1.5)} // More pronounced topography
                    shininess={30}
                    specular={new THREE.Color("#555555")}
                    emissiveMap={nightLights}
                    emissive="#FFFFFF"
                    emissiveIntensity={1.8} // Powerful "Beast" glow effect
                />
            </mesh>

            {/* Atmosphere (Slightly larger than globe) */}
            <mesh ref={atmosphereRef}>
                <sphereGeometry args={[0.799, 64, 64]} />
                <meshBasicMaterial
                    color="hsl(var(--primary))"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}


