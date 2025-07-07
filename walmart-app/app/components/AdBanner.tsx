"use client";

import { useEffect } from "react";
import * as THREE from "three";

interface AdBannerProps {
  scene: THREE.Scene;
}

const AdBanner = ({ scene }: AdBannerProps) => {
  useEffect(() => {
    const canvasAd = document.createElement("canvas");
    canvasAd.width = 512;
    canvasAd.height = 100;
    const ctxAd = canvasAd.getContext("2d")!;
    ctxAd.fillStyle = "black";
    ctxAd.fillRect(0, 0, canvasAd.width, canvasAd.height);
    ctxAd.fillStyle = "white";
    ctxAd.font = "bold 48px sans-serif";
    ctxAd.fillText("SALE 50% OFF!", 50, 80);

    const textureAd = new THREE.CanvasTexture(canvasAd);

    const adMaterial = new THREE.MeshBasicMaterial({ map: textureAd, side: THREE.DoubleSide });
    const adPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), adMaterial);
    adPlane.position.set(0, 4.5, -10);
    scene.add(adPlane);

    let offsetX = 50;

    const updateAd = () => {
      ctxAd.fillStyle = "black";
      ctxAd.fillRect(0, 0, canvasAd.width, canvasAd.height);
      ctxAd.fillStyle = "white";
      ctxAd.font = "bold 48px sans-serif";
      ctxAd.fillText("SALE 50% OFF!", offsetX, 80);
      offsetX -= 2;
      if (offsetX < -300) offsetX = 512;
      textureAd.needsUpdate = true;
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateAd();
    };

    animate();
  }, []);

  return null;
};

export default AdBanner;
