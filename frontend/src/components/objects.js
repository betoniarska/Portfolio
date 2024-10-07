//src/components/objects.js

import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



function loadTexture(path, onLoad, onError, repeat = { x: 1, y: 1 }) {
    const textureLoader = new THREE.TextureLoader();
    
    textureLoader.load(path, (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeat.x, repeat.y); // Set repeat values
        onLoad(texture);
    }, undefined, onError);
}
function createCustomShaderMaterial(lights, shininessValue, texture = null) {
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            uLightColor1: { value: lights[0].color },
            uLightPosition1: { value: lights[0].position.clone() },
            uLightColor2: { value: lights[1].color },
            uLightPosition2: { value: lights[1].position.clone() },
            uLightColor3: { value: lights[2].color },
            uLightPosition3: { value: lights[2].position.clone() },
            uAmbientLightColor: { value: lights[3].color },  // Ambient light uniform
            uShininess: { value: shininessValue },  // Shininess uniform
            uTexture: { value: texture },  // Add texture uniform (null if no texture)
        },
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1,
        depthWrite: true
    });
}


function createCustomTransparentShaderMaterial(lights, shininessValue) {
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            uLightColor1: { value: lights[0].color },
            uLightPosition1: { value: lights[0].position.clone() },
            uLightColor2: { value: lights[1].color },
            uLightPosition2: { value: lights[1].position.clone() },
            uLightColor3: { value: lights[2].color },
            uLightPosition3: { value: lights[2].position.clone() },
            uAmbientLightColor: { value: lights[3].color },  // Ambient light uniform
            uShininess: { value: shininessValue },  // Add shininess uniform
        },
        side: THREE.DoubleSide,
        transparent: true,      // Enable transparency
        opacity: 0.5,           // Optional: Set global opacity (0.5 for 50% transparency)
        depthWrite: false       // Optional: Disable depth writing for overlapping transparency
    });
}


function loadGLTFModel(path, scene, lights, position = { x: 0, y: 0, z: 0 }, scale = { x: 1, y: 1, z: 1 }, onError = null, callback = null) {
    const loader = new GLTFLoader();
    const shininessValue = 1; // Add shininess value here

    loader.load(
        path,
        (gltf) => {
            const model = gltf.scene;
            model.position.set(position.x, position.y, position.z);
            model.scale.set(scale.x, scale.y, scale.z);
            
            // Traverse the model's children to apply the custom shader material
            model.traverse((child) => {
                if (child.isMesh) {
                    // Use createCustomTransparentShaderMaterial and pass shininessValue
                    child.material = createCustomShaderMaterial(lights, shininessValue);
                }
            });

            scene.add(model);
            
            // If a callback is provided, return the model
            if (callback) {
                callback(model);
            }
        },
        undefined,
        (error) => {
            console.error('Error loading GLB model:', error);
            if (onError) onError(error);
        }
    );
}


// Generalized Cube creation
function createCube(scene, options) {
    const {
        size = { x: 1, y: 4, z: 1 },  
        position = { x: 0, y: 10, z: 0 },  
        color = 0x1111ff,  
        texture = null      
    } = options;

    const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);


    const cubeMaterial = new THREE.MeshStandardMaterial({
        map: texture || null,
        side: THREE.DoubleSide,
        color: color // Use color only if no texture
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(position.x, position.y, position.z);
    scene.add(cube);
    return cube;
}

function createShaderCube(scene, options) {
    const {
        size = { x: 2, y: 2, z: 2 },  
        position = { x: 0, y: 10, z: 0 },  
        color = 0x1111ff,  
        texture = null,
        lights,
        shininessValue = 32      
    } = options;

    const cubeGeometry = new THREE.BoxGeometry(size.x, size.y, size.z);

    const cubeMaterial = createCustomTransparentShaderMaterial(lights, shininessValue);

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(position.x, position.y, position.z);
    scene.add(cube);
    return cube;
}

function createShaderBall(scene, options) {
    const {
        size = 10,  
        position = { x: 10, y: 15, z: -50 },  
        color = 0xffffff,  
        texture = null,
        lights      
    } = options;

    const ballGeometry = new THREE.SphereGeometry(size, 32, 32);
    const ballMaterial = new createCustomShaderMaterial(lights);

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(position.x, position.y, position.z);
    scene.add(ball);
    return ball;

}

// Generalized Plane creation
function createPlane(scene, lights) {
    const planeGeometry = new THREE.PlaneGeometry(500, 500);
    const planeMaterial = createCustomShaderMaterial(lights);

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
    return plane;
}

// Generalized Ball creation
function createBall(scene, options) {
    const {
        size = 100,  
        position = { x: 10, y: 15, z: -50 },  
        color = 0xffffff,  
        texture = null      
    } = options;

    const ballGeometry = new THREE.SphereGeometry(size, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
        map: texture || null,
        color: color,
        side: THREE.DoubleSide
    });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(position.x, position.y, position.z);
    scene.add(ball);
    return ball;
}

// Function to add objects
export function addObjects(scene, lights, callback) {
    const objects = {};
    const textures = {
        woodFloor: '/assets/WoodFloor051.png',  // Textures
        brick: '/assets/pexels-pixabay-220182.jpg',       
    };

    objects.beveledcube1 = null;  // Initialize as null

    loadGLTFModel('/assets/beveledcube.glb', scene, lights, { x: -10, y: -10, z: -30 }, { x: 10, y: 10, z: 10}, null, (model) => {
        objects.beveledcube1 = model;  // Assign the loaded model to the objects.beveledcube1
    });

    loadTexture(textures.woodFloor, 
        (texture) => {
            console.log('Wood texture loaded:', texture);

            

            callback(objects);
        },
        (error) => {
            console.error('Error loading wood texture:', error);
        },
        { x: 1, y: 1 } // repeat amount
    );

    
    loadTexture(textures.brick, 
        (texture) => {
            console.log('Brick texture loaded:', texture);

            

            objects.shaderCube2 = createShaderCube(scene, { //test cube with custom shaders
                size: { x: 300, y: 300, z: 300 }, 
                position: { x: 0, y: 0, z: 0 }, 
                texture: null,
                lights: lights 
            });
            



            objects.shaderCube1 = createShaderCube(scene, { //test cube with custom shaders
                size: { x: 350, y: 350, z: 350 }, 
                position: { x: 0, y: 0, z:0 }, 
                texture: null,
                lights: lights 
            });
            objects.shaderCube3 = createShaderCube(scene, { //test cube with custom shaders
                size: { x: 400, y: 400, z: 400 }, 
                position: { x: 0, y: 0, z: 0 }, 
                texture: null,
                lights: lights 
            });
            objects.shaderCube4 = createShaderCube(scene, { //test cube with custom shaders
                size: { x: 450, y: 450, z: 450 }, 
                position: { x: 0, y: 0, z: 0 }, 
                texture: null,
                lights: lights 
            });
            
            

            

            
            
            
        },
        (error) => {
            console.error('Error loading brick texture:', error);
        },
        { x: 1, y: 1 } // repeat amount
    );

    
}
