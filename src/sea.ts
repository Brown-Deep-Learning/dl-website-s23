// Ocean waves using three.js

import * as THREE from "three";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { Water } from "three/examples/jsm/objects/Water.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";

import { get_water } from "./water";

let container =
  document.querySelector("#sea") ||
  document.body.appendChild(document.createElement("div"));
let stats: Stats;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let water: THREE.Mesh;
let sun: THREE.Vector3;

init();
animate();

function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    20000
  );
  camera.position.set(30, 30, 100);

  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

  // water = new Water(waterGeometry, {
  //   textureWidth: 1024,
  //   textureHeight: 1024,
  //   waterNormals: new THREE.TextureLoader().load(
  //     "textures/waternormals.jpg",
  //     function (texture) {
  //       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //     }
  //   ),
  //   sunDirection: new THREE.Vector3(),
  //   sunColor: 0xffffff,
  //   waterColor: 0x001e0f,
  //   distortionScale: 3.7,
  //   fog: scene.fog !== undefined,
  // });

  // water.rotation.x = -Math.PI / 2;

  water = get_water(camera);
  scene.add(water);

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;

  skyUniforms["turbidity"].value = 10;
  skyUniforms["rayleigh"].value = 2;
  skyUniforms["mieCoefficient"].value = 0.005;
  skyUniforms["mieDirectionalG"].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  let renderTarget: THREE.WebGLRenderTarget;

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    // water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    if (renderTarget !== undefined) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene(sky as unknown as THREE.Scene);

    scene.environment = renderTarget.texture;
  }

  updateSun();

  controls = new OrbitControls(camera, renderer.domElement);
  // controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  //

  stats = Stats();
  container.appendChild(stats.dom);

  // GUI

  // const gui = new GUI();

  // const folderSky = gui.addFolder("Sky");
  // folderSky.add(parameters, "elevation", 0, 90, 0.1).onChange(updateSun);
  // folderSky.add(parameters, "azimuth", -180, 180, 0.1).onChange(updateSun);
  // folderSky.open();

  // const waterUniforms = water.material.uniforms;

  // const folderWater = gui.addFolder("Water");
  // folderWater
  //   .add(waterUniforms.distortionScale, "value", 0, 8, 0.1)
  //   .name("distortionScale");
  // folderWater.add(waterUniforms.size, "value", 0.1, 10, 0.1).name("size");
  // folderWater.open();

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  const time = performance.now() * 0.001;

  water.material.uniforms["uTime"].value += 0.1;

  renderer.render(scene, camera);
}
