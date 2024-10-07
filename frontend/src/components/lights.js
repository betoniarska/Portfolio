//src/components/lights

import * as THREE from 'three';



export function addLights(scene) {

    const lights = [];

    const pointLight1 = new THREE.PointLight(0xF95738, 1000, 0);
    pointLight1.position.set(0, 500, 0);
    scene.add(pointLight1);
    lights.push(pointLight1); 

    
    const pointLight2 = new THREE.PointLight(0xF5F5DC, 1000, 0); 
    pointLight2.position.set(50, 500, 0);
    scene.add(pointLight2);
    lights.push(pointLight2);

    
    const pointLight3 = new THREE.PointLight(0x708090, 10, 0); 
    pointLight3.position.set(-50, 100, 0);
    scene.add(pointLight3);
    lights.push(pointLight3); 

    const ambientLight = new THREE.AmbientLight(0x102030, 10); 
    scene.add(ambientLight);
    lights.push(ambientLight);

    return lights;
    
}