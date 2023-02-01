import * as THREE from "three";

const lights = new THREE.Group();
const light = new THREE.DirectionalLight(0xffffff, 1);
// debug cube for light
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(0.1, 0.1, 0.1),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
cube.position.set(0, 1, 0);
light.position.set(0, 1, 0);
lights.add(light);
lights.add(cube);

export default lights;
