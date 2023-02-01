import * as THREE from "three";

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);

export default camera;
