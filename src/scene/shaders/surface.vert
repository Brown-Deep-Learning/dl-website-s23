// #include noise3D.glsl

// precision highp float;

// uniform float time;
// uniform vec3 color;

// varying vec3 vColor;

// vec3 GerstnerWave(vec4 wave, vec3 p) {
//     float steepness = wave.z;
//     float wavelength = wave.w;
//     float k = 2.0 * 1. / wavelength;
//     float c = sqrt(9.8 / k);
//     vec2 d = normalize(wave.xy);
//     float f = k * (dot(d, p.xy) - c * time);
//     float a = steepness / k;

//     return vec3(d.x * (a * cos(f)), d.y * (a * cos(f)), a * sin(f));
// }

// void main() {
//     // use noise3D to get a value
//     vec3 dummyPosition = position.xyz;
//     // dummyPosition.x += time;
//     // dummyPosition.y += time;

//     dummyPosition.x /= 64.;
//     dummyPosition.y /= 64.;

//     float noise = snoise(vec3(dummyPosition.x, dummyPosition.y, time / 2.));
//     // use the noise value to displace the vertex
//     vec3 newPosition = position + normal * noise;
//     float noiseSum = noise;

//     dummyPosition = newPosition;
//     dummyPosition.x /= 64.;
//     dummyPosition.y /= 64.;
//     noise = snoise(vec3(dummyPosition.x, dummyPosition.y, -time / 2.));
//     // noise /= 8.;
//     newPosition = newPosition + normal * noise;
//     noiseSum += noise;

//     dummyPosition = newPosition;
//     dummyPosition.x /= 64.;
//     dummyPosition.y /= 16.;
//     noise = snoise(vec3(dummyPosition.x, dummyPosition.y, time / 2.));
//     // noise /= 8.;
//     newPosition = newPosition + normal * noise;
//     noiseSum += noise;

//     dummyPosition = newPosition;
//     dummyPosition.x /= 64.;
//     dummyPosition.y /= 16.;
//     noise = snoise(vec3(dummyPosition.x, dummyPosition.y, -time / 2.));
//     // noise /= 8.;
//     newPosition = newPosition + normal * noise;
//     noiseSum += noise;

//     dummyPosition = newPosition;
//     dummyPosition.x /= 16.;
//     dummyPosition.y /= 64.;
//     noise = snoise(vec3(dummyPosition.x, dummyPosition.y, time / 2.));
//     // noise /= 8.;
//     newPosition = newPosition + normal * noise;
//     noiseSum += noise;

//     dummyPosition = newPosition;
//     dummyPosition.x /= 16.;
//     dummyPosition.y /= 64.;
//     noise = snoise(vec3(dummyPosition.x, dummyPosition.y, -time / 2.));
//     // noise /= 8.;
//     newPosition = newPosition + normal * noise;
//     noiseSum += noise;

//     // newPosition = position;
//     vec3 g1 = GerstnerWave(vec4(1., 0., 0.5, 0.1), newPosition / 10.) + snoise(newPosition / 100.) / 8.;
//     newPosition += g1;
//     vec3 g2 = GerstnerWave(vec4(-1., 1., 0.5, 0.2), newPosition / 10.) + snoise(newPosition / 100.) / 8.;
//     newPosition += g2;
//     vec3 g3 = GerstnerWave(vec4(-2, 2, 0.5, 0.2), newPosition / 10.) + snoise(newPosition / 100.) / 8.;
//     newPosition += g3;
//     // newPosition += GerstnerWave(vec4(1., 0., 0.5, 0.5), newPosition / 10.);

//     // pass the new position to the vertex shader
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

//     // noise = (noise + noise1 + noise2 + noise3 + noise4);

//     // vertex color depends on height difference
//     float heightDifference = g1.z + g2.z + 0.5;
//     vColor = vec3((1. - color.r) * heightDifference + color.r, (1. - color.g) * heightDifference + color.g, (1. - color.b) * heightDifference + color.b);

// }

#include noise3D.glsl

precision highp float;

uniform float time;
uniform vec3 color;

varying vec3 vColor;

void main() {
    // use noise3D to get a value
    vec3 dummyPosition = position;
    // dummyPosition.x += time;
    // dummyPosition.y += time;

    dummyPosition.x /= 32.;
    dummyPosition.y /= 16.;

    float noise = snoise(vec3(dummyPosition.x, dummyPosition.y, time / 3.));
    // use the noise value to displace the vertex
    vec3 newPosition = position + normal * noise;

    dummyPosition = newPosition;
    dummyPosition.x /= 32.;
    dummyPosition.y /= 16.;
    float noise1 = snoise(vec3(dummyPosition.x, dummyPosition.y, time));
    noise1 /= 8.;
    newPosition = newPosition + normal * noise1;

    dummyPosition = newPosition;
    dummyPosition.x /= 16.;
    dummyPosition.y /= 8.;
    float noise2 = snoise(vec3(dummyPosition.x, dummyPosition.y, time * 2.));
    noise2 /= 8.;
    newPosition = newPosition + normal * noise2;

    // pass the new position to the vertex shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    noise = (noise + noise1 + noise2);

    // vertex color depends on height difference
    float heightDifference = noise;
    vColor = vec3((1. - color.r) * heightDifference + color.r, (1. - color.g) * heightDifference + color.g, (1. - color.b) * heightDifference + color.b);

}