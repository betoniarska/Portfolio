// src/components/controls.js
import { GUI } from 'dat.gui';

export function setupControls(params, cube, plane, pointLights) {
    const gui = new GUI();
    
    
    gui.addColor(params, 'cubeColor').onChange((value) => {
        cube.material.color.set(value);
    });

    gui.addColor(params, 'planeColor').onChange((value) => {
        plane.material.color.set(value);
    });
    gui.add(params, 'spinVelocity', 0, 0.1).name('Spin Velocity');

    
    gui.addColor(params, 'ambientColor').onChange((value) => {
        pointLights[3].color.set(value);
    });

    

    
}

export function setupMovement(movement) {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w': movement.forward = true; break;
            case 's': movement.backward = true; break;
            case 'a': movement.left = true; break;
            case 'd': movement.right = true; break;
            case 'e': movement.down = true; break;
            case 'q': movement.up = true; break;
            case "ArrowUp" : movement.lookUp = true; break;
            case "ArrowDown" : movement.lookDown = true; break;
            case "ArrowLeft" : movement.lookLeft = true; break;
            case "ArrowRight" : movement.lookRight = true; break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w': movement.forward = false; break;
            case 's': movement.backward = false; break;
            case 'a': movement.left = false; break;
            case 'd': movement.right = false; break;
            case 'e': movement.down = false; break;
            case 'q': movement.up = false; break;
            case "ArrowUp" : movement.lookUp = false; break;
            case "ArrowDown" : movement.lookDown = false; break;
            case "ArrowLeft" : movement.lookLeft = false; break;
            case "ArrowRight" : movement.lookRight = false; break;
        }
    });
}
