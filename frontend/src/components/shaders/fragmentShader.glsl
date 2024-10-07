// Fragment Shader

uniform vec3 uLightPosition1;
uniform vec3 uLightPosition2;
uniform vec3 uLightPosition3;
uniform vec3 uLightColor1;
uniform vec3 uLightColor2;
uniform vec3 uLightColor3;
uniform vec3 uAmbientLightColor;
uniform float uShininess; // Shininess uniform

varying vec3 vPosition;
varying vec3 vNormal; // Passed from vertex shader

void main() {
    vec3 objectColor = vec3(0.2, 0.8, 1.0); // Base object color

    // Compute light direction vectors
    vec3 lightDir1 = normalize(uLightPosition1 - vPosition);
    vec3 lightDir2 = normalize(uLightPosition2 - vPosition);
    vec3 lightDir3 = normalize(uLightPosition3 - vPosition);

    // Compute view direction (assuming the viewer is at the origin in world space)
    vec3 viewDir = normalize(-vPosition);

    // Compute basic diffuse lighting (simple Lambertian reflectance)
    float diff1 = max(dot(normalize(vNormal), lightDir1), 0.0);
    float diff2 = max(dot(normalize(vNormal), lightDir2), 0.0);
    float diff3 = max(dot(normalize(vNormal), lightDir3), 0.0);

    // Compute reflection vectors
    vec3 reflectDir1 = reflect(-lightDir1, normalize(vNormal));
    vec3 reflectDir2 = reflect(-lightDir2, normalize(vNormal));
    vec3 reflectDir3 = reflect(-lightDir3, normalize(vNormal));

    // Compute specular highlights using the Phong model
    float spec1 = pow(max(dot(viewDir, reflectDir1), 0.0), uShininess);
    float spec2 = pow(max(dot(viewDir, reflectDir2), 0.0), uShininess);
    float spec3 = pow(max(dot(viewDir, reflectDir3), 0.0), uShininess);

    // Combine light contributions for diffuse
    vec3 lightEffect1 = uLightColor1 * diff1;
    vec3 lightEffect2 = uLightColor2 * diff2;
    vec3 lightEffect3 = uLightColor3 * diff3;

    // Combine light contributions for specular
    vec3 specEffect1 = uLightColor1 * spec1;
    vec3 specEffect2 = uLightColor2 * spec2;
    vec3 specEffect3 = uLightColor3 * spec3;

    // Add ambient light contribution
    vec3 ambientEffect = uAmbientLightColor;

    // Final color is the sum of base color, diffuse light effects, specular highlights, and ambient light
    vec3 finalColor = objectColor * (lightEffect1 + lightEffect2 + lightEffect3) + (specEffect1 + specEffect2 + specEffect3) + ambientEffect;

    // Set the final color with alpha transparency (e.g., 0.5 for 50% transparency)
    gl_FragColor = vec4(finalColor, 0.5);
}
