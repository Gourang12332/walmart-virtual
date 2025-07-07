"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface CharacterProps {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  stairs: THREE.Mesh[];
}

const Character = ({ scene, camera, stairs }: CharacterProps) => {
  console.log("Character loaded")
  useEffect(() => {
    let character: THREE.Group;
    let velocity = new THREE.Vector3();
    let yaw = 0;
    let pitch = 0;
    const sensitivity = 0.002;
    let currentFloor = 0;
    let targetY = 0;

    const keys: { [key: string]: boolean } = {};

    const footsteps = document.getElementById("footsteps") as HTMLAudioElement;
    const infoBox = document.getElementById("infoBox") as HTMLDivElement;

    const loader = new GLTFLoader();
    loader.load("https://modelviewer.dev/shared-assets/models/Astronaut.glb", (gltf) => {
      character = gltf.scene;
      character.position.set(2, 0, -3);
      scene.add(character);
    });

    document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
    document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

    document.body.requestPointerLock =
      document.body.requestPointerLock || (document.body as any).mozRequestPointerLock;
    document.body.addEventListener("click", () => {
      document.body.requestPointerLock();
    });

    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement === document.body) {
        yaw -= e.movementX * sensitivity;
        pitch -= e.movementY * sensitivity;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
      }
    });

    const animate = () => {
      requestAnimationFrame(animate);

      if (character) {
        let moveVec = new THREE.Vector3();
        if (keys["w"]) moveVec.z -= 1;
        if (keys["s"]) moveVec.z += 1;
        if (keys["a"]) moveVec.x -= 1;
        if (keys["d"]) moveVec.x += 1;

        let isMoving = moveVec.length() > 0;

        if (isMoving) {
          moveVec.normalize();

          const forward = new THREE.Vector3();
          if(camera){
            camera.getWorldDirection(forward);
          }
          forward.y = 0;
          forward.normalize();

          const right = new THREE.Vector3();
          right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

          const finalMove = new THREE.Vector3();
          finalMove.add(forward.clone().multiplyScalar(-moveVec.z));
          finalMove.add(right.clone().multiplyScalar(moveVec.x));

          velocity.lerp(finalMove.multiplyScalar(0.1), 0.2);

          character.rotation.y = Math.atan2(forward.x, forward.z);
        } else {
          velocity.lerp(new THREE.Vector3(0, 0, 0), 0.1);
        }

        if (isMoving && footsteps && footsteps.paused) {
          footsteps.play();
        } else if (!isMoving && footsteps && !footsteps.paused) {
          footsteps.pause();
          footsteps.currentTime = 0;
        }

        character.position.add(velocity);

        const charPos = character.position.clone();
        const headOffset = new THREE.Vector3(0, 3, 0);
        const cameraPos = charPos.clone().add(headOffset);
        camera.position.copy(cameraPos);

        const lookDir = new THREE.Vector3(0, 0, -1);
        lookDir.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
        lookDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        camera.lookAt(camera.position.clone().add(lookDir));

        // Floor jump up
        if (keys[" "]) {
          if (currentFloor < 2) {
            const stair = stairs[currentFloor];
            if (character.position.distanceTo(new THREE.Vector3(stair.position.x, character.position.y, stair.position.z)) < 2) {
              targetY += 5; // floorHeight
              currentFloor++;
            }
          }
          keys[" "] = false;
        }

        // Floor down
        if (keys["shift"]) {
          if (currentFloor > 0) {
            const stair = stairs[currentFloor - 1];
            if (character.position.distanceTo(new THREE.Vector3(stair.position.x, character.position.y, stair.position.z)) < 2) {
              targetY -= 5;
              currentFloor--;
            }
          }
          keys["shift"] = false;
        }

        // Smooth vertical interpolation
        character.position.y += (targetY - character.position.y) * 0.1;
      }
    };

    animate();
  }, []);

  return null;
};

export default Character;
