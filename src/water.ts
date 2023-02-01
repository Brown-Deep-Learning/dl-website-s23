// Three.js toon water mesh with custom toon shader

import * as THREE from "three";

export const get_water = (camera: THREE.PerspectiveCamera) => {
  // Set up depth buffer
  let depthTarget = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
  );
  depthTarget.texture.format = THREE.RGBFormat;
  depthTarget.texture.minFilter = THREE.NearestFilter;
  depthTarget.texture.magFilter = THREE.NearestFilter;
  depthTarget.texture.generateMipmaps = false;
  depthTarget.stencilBuffer = false;
  depthTarget.depthBuffer = true;
  depthTarget.depthTexture = new THREE.DepthTexture(0, 0);
  depthTarget.depthTexture.type = THREE.UnsignedShortType;

  // This is used as a hack to get the depth of the pixels at the water surface by redrawing the scene with the water in the depth buffer
  let depthTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight
  );
  depthTarget2.texture.format = THREE.RGBFormat;
  depthTarget2.texture.minFilter = THREE.NearestFilter;
  depthTarget2.texture.magFilter = THREE.NearestFilter;
  depthTarget2.texture.generateMipmaps = false;
  depthTarget2.stencilBuffer = false;
  depthTarget2.depthBuffer = true;
  depthTarget2.depthTexture = new THREE.DepthTexture(0, 0);
  depthTarget2.depthTexture.type = THREE.UnsignedShortType;

  let vertShader = `
				uniform float uTime;
				varying vec2 vUV;
				varying vec3 WorldPosition;
				void main() {
					vec3 pos = position;
					pos.z += cos(pos.x*5.0+uTime) * 0.1 * sin(pos.y * 5.0 + uTime);
					WorldPosition = pos;
					vUV = uv;
					//gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
				}
				`;
  let fragShader = `
				#include <packing>
				varying vec2 vUV;
				varying vec3 WorldPosition;
				uniform sampler2D uSurfaceTexture;
				uniform sampler2D uDepthMap;
				uniform sampler2D uDepthMap2;
				uniform float uTime;
				uniform float cameraNear;
				uniform float cameraFar;
				uniform vec4 uScreenSize;
				uniform bool isMask;
				float readDepth (sampler2D depthSampler, vec2 coord) {
					float fragCoordZ = texture2D(depthSampler, coord).x;
					float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
					return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
				}
				float getLinearDepth(vec3 pos) {
				    return -(viewMatrix * vec4(pos, 1.0)).z;
				}
				float getLinearScreenDepth(sampler2D map) {
				    vec2 uv = gl_FragCoord.xy * uScreenSize.zw;
				    return readDepth(map,uv);
				}
				void main(){
					vec4 color = vec4(0.0,0.7,1.0,0.5);
					vec2 pos = vUV * 2.0;
    				pos.y -= uTime * 0.002;
					vec4 WaterLines = texture2D(uSurfaceTexture,pos);
					color.rgba += WaterLines.r * 0.1;
					//float worldDepth = getLinearDepth(WorldPosition);
					float worldDepth = getLinearScreenDepth(uDepthMap2);
				    float screenDepth = getLinearScreenDepth(uDepthMap);
				    float foamLine = clamp((screenDepth - worldDepth),0.0,1.0) ;
				    if(foamLine < 0.001){
				        color.rgba += 0.2;
				    }
				    if(isMask){
				    	color = vec4(1.0);
				    }
					gl_FragColor = color;
				}
				`;

  let waterLinesTexture = new THREE.TextureLoader().load(
    "textures/WaterTexture.png",
    () => {
      waterLinesTexture.wrapS = waterLinesTexture.wrapT = THREE.RepeatWrapping;
      waterLinesTexture.repeat.set(10, 10);
      waterLinesTexture.offset.set(0, 0);
    }
  );

  let uniforms = {
    uTime: { value: 0.0 },
    uSurfaceTexture: { type: "t", value: waterLinesTexture },
    cameraNear: { value: camera.near },
    cameraFar: { value: camera.far },
    uDepthMap: { value: depthTarget.depthTexture },
    uDepthMap2: { value: depthTarget2.depthTexture },
    isMask: { value: false },
    uScreenSize: {
      value: new THREE.Vector4(
        window.innerWidth,
        window.innerHeight,
        1 / window.innerWidth,
        1 / window.innerHeight
      ),
    },
  };

  let water_geometry = new THREE.PlaneGeometry(50, 50, 50, 50);
  let water_material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    transparent: true,
    depthWrite: false,
  });
  let water = new THREE.Mesh(water_geometry, water_material);
  water.rotation.x = -Math.PI / 2;
  // water.position.y = -1;

  water.material.uniforms = uniforms;
  water.material = water_material;

  return water;
};

// let waterMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     time: { value: 1.0 },
//     color1: { value: new THREE.Color(0x4444ff) },
//     color2: { value: new THREE.Color(0x000033) },
//   },
//   vertexShader: `
//             uniform float time;
//             varying vec2 vUv;
//             void main() {
//               vUv = uv;
//               vec3 newPosition = position;
//               newPosition.z = sin(position.x + time * 0.2) * 3.0;
//               gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
//             }
//           `,
//   fragmentShader: `
//             uniform vec3 color1;
//             uniform vec3 color2;
//             varying vec2 vUv;
//             void main() {
//               vec3 color = mix(color1, color2, vUv.y);
//               gl_FragColor = vec4(color, 1.0);
//             }
//           `,
// });

// let water = new THREE.Mesh(waterGeometry, waterMaterial);
// water.rotation.x = -Math.PI / 2;
