import * as THREE from "three";
import noise from "../shaders/noise3D.glsl";

console.log(noise);

// Low-frequency water surface mesh
const low_freq_geometry = new THREE.PlaneGeometry(100, 100, 1000, 1000);
// Custom toon shader for low-frequency water surface

const low_freq_water = new THREE.Mesh(
  low_freq_geometry,
  new THREE.MeshToonMaterial()
);
low_freq_water.rotation.x = -Math.PI / 2;

export { low_freq_water };

// const low_freq_material = new THREE.ShaderMaterial({
//   uniforms: {
//     time: { value: 0.0 },
//     color: { value: new THREE.Color(0x000099) },
//   },
//   vertexShader: `
//   #define GLSLIFY 1
//   // Common varyings
//   varying vec2 vUv;
//   varying vec3 v_position;
//   varying vec3 v_normal;
//   uniform float time;

//   /*
//    * The main program
//    */
//   void main() {
//       // Save the varyings
//       v_position = position;
//       v_normal = normalize(normalMatrix * normal);

//       // Calculate the displacement
//       float displacement = sin(position.x * 2. + time) * 2.;

//       // Apply the displacement
//       vec3 newPosition = position + normal * displacement;

//       // Vertex shader output
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//   }
//   `,
//   fragmentShader: `
//   #define GLSLIFY 1
//   // Common uniforms
//   uniform vec2 u_resolution;
//   uniform float u_time;
//   uniform float u_frame;

//   // Common varyings
//   varying vec3 v_position;
//   varying vec3 v_normal;

//   /*
//    *  Calculates the diffuse factor produced by the light illumination
//    */
//   float diffuseFactor(vec3 normal, vec3 light_direction) {
//       float df = dot(normalize(normal), normalize(light_direction));

//       if (gl_FrontFacing) {
//           df = -df;
//       }

//       return max(0.0, df);
//   }

//   /*
//    * The main program
//    */
//   void main() {
//       // Use the mouse position to define the light direction
//       float min_resolution = min(u_resolution.x, u_resolution.y);
//       vec3 light_direction = vec3(0, -1.0, -1.0);

//       // Calculate the light diffusion factor
//       float df = diffuseFactor(v_normal, light_direction);

//       // // Define the toon shading steps
//       // float nSteps = 4.0;
//       // float step = sqrt(df) * nSteps;
//       // step = (floor(step) + smoothstep(0.48, 0.52, fract(step))) / nSteps;

//       // // Calculate the surface color
//       // float surface_color = step * step;

//       // Fragment shader output
//       vec3 color = vec3(0.0, 0.0, 1.0);
//       gl_FragColor = vec4(vec3(df * color), 1.0);
//   }
//   `,
// });
