// src/main.js
import { createScene } from './components/scene.js';
import { createCamera } from './components/camera.js';
import { createRenderer } from './components/renderer.js';
import { addLights } from './components/lights.js';
import { addObjects } from './components/objects.js';
import { setupControls, setupMovement } from './components/controls.js';
import * as THREE from 'three';


const clock = new THREE.Clock();


let scene, camera, renderer;
let cube, plane, shaderCube, beveledcube;
let pointLights;
let yaw = 0;  // Left-right rotation (around Y-axis)
let pitch = 0;  // Up-down rotation (around X-axis)
const maxPitch = Math.PI / 2 - 0.01; // Limit pitch to avoid looking directly up or down


const params = {
    cubeColor: 0x0000ff,
    planeColor: 0x00ff00,
    cubePositionX: 0,
    cubePositionY: 0.5,
    cubePositionZ: 0,
    lightColor1: 0x0000ff,
    lightColor2: 0xff0000,
    lightColor3: 0x0000ff,
    ambientColor: 0x102030,
    spinVelocity: 0.0005
};

const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    down: false,
    up: false,
    lookLeft: false,
    lookRight: false,
    lookUp: false,
    lookDown: false
};

let objects = {};

// Initialize everything
function init() {
    scene = createScene();
    camera = createCamera();
    renderer = createRenderer();

    
    pointLights = addLights(scene);

    
    addObjects(scene, pointLights, (returnedObjects) => {
        objects = returnedObjects;
        cube = objects.cube;
        plane = objects.plane;
        beveledcube = objects.beveledcube1;

        
        setupControls(params, cube, plane, pointLights, beveledcube);  
        setupMovement(movement);

        animate();
    });
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getElapsedTime(); // Keep track of elapsed time

    // Update uTime for any shader materials that use it
    scene.traverse((object) => {
        if (object.material && object.material.uniforms) {
            if (object.material.uniforms.uTime) {
                object.material.uniforms.uTime.value = deltaTime;
            }
            if (object.material.uniforms.uLightColor1) {
                object.material.uniforms.uLightColor1.value = pointLights[0].color;
                object.material.uniforms.uLightPosition1.value = pointLights[0].position;
            }
            if (object.material.uniforms.uLightColor2) {
                object.material.uniforms.uLightColor2.value = pointLights[1].color;
                object.material.uniforms.uLightPosition2.value = pointLights[1].position;
            }
            if (object.material.uniforms.uLightColor3) {
                object.material.uniforms.uLightColor3.value = pointLights[2].color;
                object.material.uniforms.uLightPosition3.value = pointLights[2].position;
            }
            if (object.material.uniforms.uAmbientLightColor) {
                object.material.uniforms.uAmbientLightColor.value = pointLights[3].color.clone().multiplyScalar(pointLights[3].intensity);  // Update ambient light color
            }
        }
    });

    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    // Move forward/backward
    camera.getWorldDirection(forward);
    forward.y = 0; // Ignore vertical direction
    forward.normalize();

    // Calculate right direction
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const speed = 0.5;
    if (movement.forward) camera.position.add(forward.clone().multiplyScalar(speed));
    if (movement.backward) camera.position.add(forward.clone().multiplyScalar(-speed));
    if (movement.right) camera.position.add(right.clone().multiplyScalar(speed));
    if (movement.left) camera.position.add(right.clone().multiplyScalar(-speed));
    if (movement.down) camera.position.y -= speed;
    if (movement.up) camera.position.y += speed;

    const rotationSpeed = 0.02; // Adjust rotation speed as necessary
    if (movement.lookLeft) yaw += rotationSpeed;
    if (movement.lookRight) yaw -= rotationSpeed;
    if (movement.lookUp) pitch = Math.min(maxPitch, pitch + rotationSpeed);  // Limit pitch to avoid gimbal lock
    if (movement.lookDown) pitch = Math.max(-maxPitch, pitch - rotationSpeed);

    // Apply yaw (rotation around the Y axis) and pitch (rotation around the X axis)
    camera.rotation.order = 'YXZ';  // Make sure the camera rotates in the correct order: yaw first, then pitch
    camera.rotation.y = yaw;  // Apply yaw (left-right rotation)
    camera.rotation.x = pitch;

    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();



    const spinAngle = params.spinVelocity; 
    if (objects.regularCube) {
        objects.regularCube.rotation.x += spinAngle; 
        objects.regularCube.rotation.y += spinAngle; 
    }
    if (objects.shaderCube1) {
        objects.shaderCube1.rotation.x += spinAngle; 
        objects.shaderCube1.rotation.y += spinAngle; 
    }
    if (objects.shaderCube2) {
        objects.shaderCube2.rotation.x += spinAngle; 
        objects.shaderCube2.rotation.y += spinAngle; 
    }
    if (objects.shaderCube3) {
        objects.shaderCube3.rotation.x += spinAngle; 
        objects.shaderCube3.rotation.y += spinAngle;
    }
    if (objects.shaderCube4) {
        objects.shaderCube4.rotation.x += spinAngle; 
        objects.shaderCube4.rotation.y += spinAngle;
    }
    
    //if (objects.beveledcube1) {
    //    objects.beveledcube1.traverse((child) => {
    //        if (child.isMesh) {
    //            child.rotation.x += spinAngle + spinAngle + spinAngle; 
    //            child.rotation.y += spinAngle;
    //        }
    //    });
    //}

    renderer.render(scene, camera);
}

init();
