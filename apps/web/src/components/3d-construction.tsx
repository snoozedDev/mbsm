"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { useTheme } from "next-themes";
import { forwardRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Chair = forwardRef(function Chair() {
  const gltf = useLoader(GLTFLoader, "/chair.glb");
  const theme = useTheme();

  useEffect(() => {
    gltf.scene.traverse((child: any) => {
      if (child instanceof THREE.Mesh) {
        const color = getComputedStyle(
          document.documentElement
        ).getPropertyValue(`--${child.material.name}`);
        const newColor = new THREE.Color(`hsl(${color.split(" ").join(", ")})`);
        child.material = new THREE.MeshBasicMaterial({
          color: newColor,
          name: child.material.name,
        });
      }
    });
  }, [gltf.scene, theme]);

  return (
    <mesh>
      <primitive object={gltf.scene} />
    </mesh>
  );
});

export const ThreeDConstruction = () => {
  return (
    <div className="max-w-lg w-full h-96">
      <Canvas flat camera={{ position: [5, 2, 5], fov: 55 }}>
        <Chair />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
};
