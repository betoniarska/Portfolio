// Vertex Shader
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    // Calculate position in world space
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    
    // Transform the normal to world space
    vNormal = normalize(normalMatrix * normal);
    
    // Standard position transformation
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
