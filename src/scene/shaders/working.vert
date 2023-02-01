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

    dummyPosition = newPosition;
    dummyPosition.x /= 64.;
    dummyPosition.y /= 8.;
    float noise3 = snoise(vec3(dummyPosition.x, dummyPosition.y, time * 1.));
    noise3 /= 8.;
    newPosition = newPosition + normal * noise3;

    dummyPosition = newPosition;
    dummyPosition.x /= 1.;
    dummyPosition.y /= 32.;
    float noise4 = snoise(vec3(dummyPosition.x, dummyPosition.y, time * 1.));
    noise4 /= 8.;
    newPosition = newPosition + normal * noise4;

    // pass the new position to the vertex shader
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    noise = (noise + noise1 + noise2 + noise3 + noise4);

    // vertex color depends on height difference
    float heightDifference = noise;
    vColor = vec3((1. - color.r) * heightDifference + color.r, (1. - color.g) * heightDifference + color.g, (1. - color.b) * heightDifference + color.b);

}