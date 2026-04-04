"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import GlobeMesh from "./GlobeMesh";
import GlobePoints from "./GlobePoints";
import GlobeArcs from "./GlobeArcs";

export default function GlobeScene() {
    return (
        <Canvas
            camera={{ position: [0, 0, 2.8], fov: 45 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            dpr={[1, 2]} // Cap DPR at 2 for performance
            className="w-full h-full"
        >
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.0} castShadow />
            <pointLight position={[-10, 0, 5]} intensity={0.5} color="hsl(var(--primary))" />
            <directionalLight position={[0, 0, 5]} intensity={1.0} />

            <Suspense fallback={null}>
                <group rotation={[0, -Math.PI / 2, 0]}>
                    <GlobeMesh />
                    <GlobePoints />
                    <GlobeArcs />
                </group>
            </Suspense>

            <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI * 0.3}
                maxPolarAngle={Math.PI * 0.7}
                rotateSpeed={0.5}
                dampingFactor={0.05}
                enableDamping={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
            />
        </Canvas>
    );
}
