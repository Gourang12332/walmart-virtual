"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import Mall from "./Mall";
import Character from "./Character";
import Offers from "./offers";
import AdBanner from "./AdBanner";
import { useState } from "react";

const SceneCanvas = () => {
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const stairsRef = useRef<THREE.Mesh[]>([]);
  const [isCameraReady, setIsCameraReady] = useState(false);

  useEffect(() => {
    const scene = sceneRef.current;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    setIsCameraReady(true);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lights
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    // Add placeholder stairs so Character receives them
    for (let i = 0; i < 2; i++) {
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(2, 5, 2),
        new THREE.MeshPhongMaterial({ color: 0x888888 })
      );
      stair.position.set(5, 2.5 + i * 5, -5);
      scene.add(stair);
      stairsRef.current.push(stair);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);
  console.log("camera is"  + cameraRef)
  return (
  <>
    <Mall scene={sceneRef.current} />
    {isCameraReady && (
      <>
        <Character
          scene={sceneRef.current}
          camera={cameraRef.current!}
          stairs={stairsRef.current}
        />
        <Offers
          scene={sceneRef.current}
          camera={cameraRef.current!}
        />
      </>
    )}
    <AdBanner scene={sceneRef.current} />
  </>
);


};

export default SceneCanvas;
