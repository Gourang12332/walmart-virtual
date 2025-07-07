"use client";

import { useEffect } from "react";
import * as THREE from "three";

interface OffersProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
}

const Offers = ({ scene, camera }: OffersProps) => {
  useEffect(() => {
    const offersText = ["🎁 20% off!", "🚀 Free shipping!", "🔥 BOGO shoes!", "🎉 ₹500 off!", "⭐ Free gift!"];
    const positions = [
      [0, 0.25, -5],
      [3, 0.25, -7],
      [-3, 0.25, -6],
      [1, 0.25, -9],
      [-2, 0.25, -4],
    ];

    const spheres: THREE.Mesh[] = [];
    const particles: THREE.Mesh[] = [];

    const infoBox = document.getElementById("infoBox") as HTMLDivElement;
    const collectSound = document.getElementById("collectSound") as HTMLAudioElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(0, 0);

    positions.forEach((pos, i) => {
      const mat = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x000000 });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mat);
      sphere.position.set(pos[0], pos[1], pos[2]);
      sphere.userData = { offer: offersText[i], collected: false };
      scene.add(sphere);
      spheres.push(sphere);
    });

    const getAimedObject = (): THREE.Mesh | null => {
      if(camera){raycaster.setFromCamera(pointer, camera);}
      const intersects = raycaster.intersectObjects(spheres.filter(o => !o.userData.collected));
      return intersects.length > 0 ? (intersects[0].object as THREE.Mesh) : null;
    };

    const animateCollect = (obj: THREE.Mesh) => {
      let scale = 1;
      const interval = setInterval(() => {
        scale -= 0.1;
        obj.scale.set(scale, scale, scale);
        if (scale <= 0) {
          obj.visible = false;
          clearInterval(interval);
        }
      }, 30);
    };

    const createParticles = (pos: THREE.Vector3) => {
      for (let i = 0; i < 30; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.05), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        p.position.copy(pos);
        p.userData = {
          velocity: new THREE.Vector3((Math.random() - 0.5) * 0.2, Math.random() * 0.3, (Math.random() - 0.5) * 0.2),
          life: 1,
        };
        scene.add(p);
        particles.push(p);
      }
    };

    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.position.add(p.userData.velocity);
        p.userData.life -= 0.02;
        if (p.material instanceof THREE.MeshBasicMaterial) {
          p.material.opacity = p.userData.life;
          p.material.transparent = true;
        }
        if (p.userData.life <= 0) {
          scene.remove(p);
          particles.splice(i, 1);
        }
      }
    };

    window.addEventListener("click", () => {
      const aimed = getAimedObject();
      if (aimed && !aimed.userData.collected) {
        aimed.userData.collected = true;
        animateCollect(aimed);
        createParticles(aimed.position);
        collectSound?.play();
        if (navigator.vibrate) navigator.vibrate(200);
        infoBox.innerText = "✅ Coupon collected! 🎉";
        setTimeout(() => {
          infoBox.innerText = "";
        }, 2000);
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);

      spheres.forEach(obj => {
        if (!obj.userData.collected && obj.material instanceof THREE.MeshPhongMaterial) {
            obj.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);
        }
        });


      const aimed = getAimedObject();
      if (aimed && !aimed.userData.collected) {
        infoBox.style.display = "block";
        infoBox.innerText = aimed.userData.offer + "\nClick to collect!";
        if (aimed.material instanceof THREE.MeshPhongMaterial) {
        aimed.material.emissive = new THREE.Color(0x00ff00);
        }

      } else {
        infoBox.style.display = "none";
        spheres.forEach(obj => {
    if (obj.material instanceof THREE.MeshPhongMaterial) {
      obj.material.emissive = new THREE.Color(0x000000);
     }
    });

      }

      updateParticles();
    };

    animate();
  }, []);

  return null;
};

export default Offers;
