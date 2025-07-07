"use client";

import * as THREE from "three";
import { useEffect } from "react";

interface MallProps {
  scene: THREE.Scene;
}

const Mall = ({ scene }: MallProps) => {
  useEffect(() => {
    const floorHeight = 5;

    // Floors
    for (let i = 0; i < 3; i++) {
      const floorTexture = new THREE.TextureLoader().load("/home_ceramic_tile.webp");
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(10, 10);

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshPhongMaterial({ map: floorTexture })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = i * floorHeight;
      scene.add(floor);
    }

    // Stairs
    for (let i = 0; i < 2; i++) {
      const stair = new THREE.Mesh(
        new THREE.BoxGeometry(2, floorHeight, 2),
        new THREE.MeshPhongMaterial({ color: 0x888888 })
      );
      stair.position.set(5, floorHeight / 2 + i * floorHeight, -5);
      scene.add(stair);
    }

    // Walls
    for (let i = 0; i < 3; i++) {
      const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, opacity: 0.8, transparent: true });

      const backWall = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 0.5), wallMaterial);
      backWall.position.set(0, 2.5 + i * floorHeight, -15);
      scene.add(backWall);

      const frontWall = new THREE.Mesh(new THREE.BoxGeometry(30, 5, 0.5), wallMaterial);
      frontWall.position.set(0, 2.5 + i * floorHeight, 15);
      scene.add(frontWall);

      const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 30), wallMaterial);
      leftWall.position.set(-15, 2.5 + i * floorHeight, 0);
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 30), wallMaterial);
      rightWall.position.set(15, 2.5 + i * floorHeight, 0);
      scene.add(rightWall);
    }

    // Shelves & spheres
    const shelfMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xffaa00 });

    const walls = [
      { x: 0, z: -14.5, skipGround: false },
      { x: -14.5, z: 0, skipGround: false },
      { x: 14.5, z: 0, skipGround: false },
      { x: 0, z: 14.5, skipGround: true }
    ];

    for (let floor = 0; floor < 3; floor++) {
      const yBase = floor * floorHeight;

      walls.forEach(wall => {
        if (floor === 0 && wall.skipGround) return;

        for (let i = 0; i < 3; i++) {
          const yPos = 1 + i * 1.5 + yBase;
          const shelf = new THREE.Mesh(new THREE.BoxGeometry(20, 0.2, 1), shelfMaterial);
          shelf.position.set(wall.x, yPos, wall.z);
          if (wall.x !== 0) shelf.rotation.y = Math.PI / 2;
          scene.add(shelf);

          for (let j = -8; j <= 8; j += 4) {
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), sphereMaterial);
            if (wall.x === 0) {
              sphere.position.set(j, yPos + 0.5, wall.z + 0.5);
            } else {
              sphere.position.set(wall.x + (wall.x > 0 ? -0.5 : 0.5), yPos + 0.5, j);
            }
            scene.add(sphere);
          }
        }
      });
    }

    // Props: pillars
    for (let i = 0; i < 3; i++) {
      for (let j = -10; j <= 10; j += 10) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 5, 16), new THREE.MeshPhongMaterial({ color: 0x999999 }));
        pillar.position.set(j, 2.5 + i * floorHeight, 0);
        scene.add(pillar);
      }
    }

    // Railings
    for (let i = 0; i < 3; i++) {
      const railingMaterial = new THREE.MeshPhongMaterial({ color: 0x88ccee, opacity: 0.4, transparent: true });
      const railing = new THREE.Mesh(new THREE.BoxGeometry(30, 1, 0.2), railingMaterial);
      railing.position.set(0, 5 + i * floorHeight, -14.8);
      scene.add(railing);
    }

    // Ceilings
    for (let i = 0; i < 3; i++) {
      const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshPhongMaterial({ color: 0xdddddd }));
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = floorHeight + i * floorHeight;
      scene.add(ceiling);
    }

    // Shops (first & second floor)
    const shopMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, opacity: 0.9, transparent: true });
    const shopSize = 8;

    // First floor
    const shop1Walls = [
      new THREE.Mesh(new THREE.BoxGeometry(shopSize, 4, 0.3), shopMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, shopSize), shopMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(shopSize, 4, 0.3), shopMaterial)
    ];
    shop1Walls[0].position.set(-10, 2 + floorHeight, -10);
    shop1Walls[1].position.set(-14, 2 + floorHeight, -10);
    shop1Walls[2].position.set(-10, 2 + floorHeight, -14);
    shop1Walls.forEach(wall => scene.add(wall));

    // Second floor
    const shop2Walls = [
      new THREE.Mesh(new THREE.BoxGeometry(shopSize, 4, 0.3), shopMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(0.3, 4, shopSize), shopMaterial),
      new THREE.Mesh(new THREE.BoxGeometry(shopSize, 4, 0.3), shopMaterial)
    ];
    shop2Walls[0].position.set(10, 2 + 2 * floorHeight, 10);
    shop2Walls[1].position.set(14, 2 + 2 * floorHeight, 10);
    shop2Walls[2].position.set(10, 2 + 2 * floorHeight, 14);
    shop2Walls.forEach(wall => scene.add(wall));

    // Skybox
    const skyGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skyMat = new THREE.MeshBasicMaterial({ color: 0xaeefff, side: THREE.BackSide });
    const skyBox = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyBox);

  }, []);

  return null;
};

export default Mall;
