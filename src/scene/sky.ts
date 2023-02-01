import * as THREE from "three";

import { Sky } from "three/examples/jsm/objects/Sky.js";

export const getSky = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  const sky = new Sky();
  sky.scale.setScalar(10000);
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

  const sun = new THREE.Vector3();

  const updateSun = () => {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    // water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    if (renderTarget !== undefined) renderTarget.dispose();

    renderTarget = pmremGenerator.fromScene(sky as unknown as THREE.Scene);

    scene.environment = renderTarget.texture;
  };

  updateSun();

  return sky;
};
