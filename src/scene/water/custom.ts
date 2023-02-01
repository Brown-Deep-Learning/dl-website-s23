import * as THREE from "three";

// @ts-ignore
import surfaceVertexShader from "../shaders/surface.vert";
// @ts-ignore
import surfaceFragmentShader from "../shaders/surface.frag";

const geometry = new THREE.PlaneGeometry(100, 100, 1000, 1000);
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0x22bbee) },
  },
  vertexShader: surfaceVertexShader,
  fragmentShader: surfaceFragmentShader,
});

const water = new THREE.Mesh(geometry, material);
water.rotation.x = -Math.PI / 2;

const geometry2 = new THREE.PlaneGeometry(100, 100, 1000, 1000);
const material2 = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 },
    color: { value: new THREE.Color(0xffffff) },
  },
  vertexShader: surfaceVertexShader,
  fragmentShader: surfaceFragmentShader,
});

const water2 = new THREE.Mesh(geometry2, material2);
water2.rotation.x = -Math.PI / 2;

export default [water, water2];
