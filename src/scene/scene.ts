import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { AxesHelper } from "three/src/helpers/AxesHelper.js";

import { low_freq_water } from "./water/surface";
// import water from "./water/example";
import lights from "./lighting";
import camera from "./camera";
import { getSky } from "./sky";
import water from "./water/custom";

const initScene = () => {
  const container = document.querySelector("#scene");
  if (!container) {
    return;
  }

  // Stats
  const stats = Stats();
  container.appendChild(stats.dom);

  // Renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Camera
  camera.position.set(0, 2, 0);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(10, 3, 0);
  controls.update();

  const scene = createScene(renderer);

  const render = () => {
    const time = performance.now() * 0.001;
    // low_freq_water.material.uniforms.time.value = time;
    water[0].material.uniforms.time.value = time;
    water[1].material.uniforms.time.value = (time + 0.1) / 8;
    renderer.render(scene, camera);
  };

  const animate = () => {
    requestAnimationFrame(animate);
    render();
    stats.update();
  };

  animate();
};

const createScene = (renderer: THREE.WebGLRenderer) => {
  const scene = new THREE.Scene();

  scene.add(new AxesHelper());

  // const sky = getSky(scene, renderer);
  // scene.add(sky);

  // scene.add(low_freq_water);
  scene.add(lights);
  scene.add(water[0]);
  water[1].position.y = -0.3;
  water[1].position.x = 0.1;
  scene.add(water[1]);

  return scene;
};

export { initScene };
