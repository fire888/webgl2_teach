import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

console.clear();



const vSH = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

const fSH = `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;
varying vec2 vUv;
void main() {
    gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
}`

let darkenMaterial = `
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0), globalBloom);
  `;
let splitPars = `
    uniform vec2 resolution;
    uniform vec3 split;
  `;
let split = `
    vec2 sUv = gl_FragCoord.xy / resolution - split.xy;
    sUv.x += sUv.y * split.z / (resolution.x / resolution.y);
    float fsUv = fwidth(sUv.x);
  `;
let fbm = `
        // https://github.com/yiwenl/glsl-fbm/blob/master/3d.glsl
        #define NUM_OCTAVES 5

        float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
      
        float noise(vec3 p){
            vec3 a = floor(p);
            vec3 d = p - a;
            d = d * d * (3.0 - 2.0 * d);
      
            vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
            vec4 k1 = perm(b.xyxy);
            vec4 k2 = perm(k1.xyxy + b.zzww);
      
            vec4 c = k2 + a.zzzz;
            vec4 k3 = perm(c);
            vec4 k4 = perm(c + 1.0);
      
            vec4 o1 = fract(k3 * (1.0 / 41.0));
            vec4 o2 = fract(k4 * (1.0 / 41.0));
      
            vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
            vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
      
            return o4.y * d.y + o4.x * (1.0 - d.y);
        }
      
      
        float fbm(vec3 x) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100);
          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }  
  `;
let noise = `
  //	Simplex 3D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
  `



let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 2500);
camera.position.set(-1.25, 2, 5).setLength(14);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x244832);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", event => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    bloomComposer.setSize( innerWidth, innerHeight );
    finalComposer.setSize( innerWidth, innerHeight );
    gu.resolution.value.set(innerWidth, innerHeight);
})

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2.8, 0);
controls.autoRotate = true;
controls.autoRotateSpeed *= 0.125;
controls.enableDamping = true;
//controls.enablePan = false;
//controls.maxDistance = 20;
//controls.minDistance = 5;
//controls.minPolarAngle = Math.PI / 3;
//controls.maxPolarAngle = THREE.MathUtils.degToRad(95);

let light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa);
scene.add(light);


let v3 = new THREE.Vector3();
let c = new THREE.Color();

let gu = {
    globalBloom: {value: 0},
    time: {value: 0},
    resolution: {value: new THREE.Vector2(innerWidth, innerHeight)},
    split: {value: new THREE.Vector3(0.5, 0.25, Math.sin(Math.PI / 12))} //uv.x, uv.y, inclination
}

// <BACKGROUND>
let bgG = new THREE.SphereGeometry(1, 36, 18);
let bgM = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.fragmentShader = `
      #define ss(a, b, c) smoothstep(a, b, c)
      uniform float globalBloom;
      ${splitPars}
      ${shader.fragmentShader}
    `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
      float d = ss(0.2, 0.8, vUv.y);
      vec3 col = mix(vec3(0, 1, 1) * 0.25, vec3(0, 0.75, 1), d);
      
      ${split}
      
      col = mix(vec3(0), col, ss(-fsUv, fsUv, sUv.x));
      vec4 diffuseColor = vec4( col, opacity );`
        ).replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
      ${darkenMaterial}
      `
        );
        //console.log(shader.fragmentShader)
    }
})
bgM.defines = {"USE_UV" : ""};
let bg = new THREE.Mesh(bgG, bgM);
bg.scale.setScalar(1000);
scene.add(bg);

// <SUPERSTRUCTURE>
let sstructG = new THREE.IcosahedronGeometry(900, 20);
//console.log(sstructG);
let ssCenters = [];
let ssPhase = [];
let ssPos = sstructG.attributes.position;
let vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
for(let i = 0; i < ssPos.count / 3; i++){
    vA.fromBufferAttribute(ssPos, i * 3 + 0);
    vB.fromBufferAttribute(ssPos, i * 3 + 1);
    vC.fromBufferAttribute(ssPos, i * 3 + 2);
    v3.addVectors(vA, vB).add(vC).divideScalar(3);
    ssCenters.push(v3.x, v3.y, v3.z, v3.x, v3.y, v3.z, v3.x, v3.y, v3.z);
    let rnd = Math.random();
    ssPhase.push(rnd, rnd, rnd);
}
sstructG.setAttribute("centers", new THREE.Float32BufferAttribute(ssCenters, 3));
sstructG.setAttribute("phase", new THREE.Float32BufferAttribute(ssPhase, 1));
let sstructM = new THREE.MeshBasicMaterial({
    wireframe: true,
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.time = gu.time;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
        uniform float time;
        attribute vec3 centers;
        attribute float phase;
        varying float vHVal;
        ${shader.vertexShader}
      `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
          
          float t = time;
          vec3 dir = position - centers;
          float dirLen = length(dir);
          float hVal =  0.6 + pow(sin((centers.y * 0.05 + phase) * PI2 - t),1.) * 0.4;
          vHVal = hVal;
          transformed = centers + normalize(dir) * dirLen * hVal;
        `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float globalBloom;
        varying float vHVal;
        ${splitPars}
        ${shader.fragmentShader}
      `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity )`,
            `
        ${split}
        float spl = ss(-fsUv, fsUv, sUv.x);
        vec3 darkSide = mix(vec3(1, 0, 1), vec3(0.5, 0.5, 1), vHVal);
        vec3 col = mix(darkSide, diffuse, spl);
        vec4 diffuseColor = vec4( col, opacity );`
        ).replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
        ${darkenMaterial}
        `
        );
        //console.log(shader.fragmentShader);
    }
});
let sstruct = new THREE.Mesh(sstructG, sstructM);
scene.add(sstruct);
// <SUPERSTRUCTURE>

// <THINGS>
let thingG = BufferGeometryUtils.mergeBufferGeometries([
    new CapsuleGeometry(1, 20),
    new THREE.TorusGeometry(4, 0.25, 16, 72).rotateX(-Math.PI * 0.5).translate(0, 2.25, 0),
    new THREE.TorusGeometry(4, 0.25, 16, 72).rotateX(-Math.PI * 0.5).translate(0, -2.25, 0)
]);
let thingM = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.time = gu.time;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
        uniform float time;
        attribute float instData;
        varying vec3 vPos;
        ${shader.vertexShader}
      `.replace(
            `include <begin_vertex>`,
            `include <begin_vertex>
          float t = mod(time * 0.1, 10.) * PI2 + instData * PI2;
          vPos = position;
          transformed.y += sin(t) * 5.;
        `
        );
        shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float globalBloom;
        ${splitPars}
        varying vec3 vPos;
        ${shader.fragmentShader}
      `.replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
          ${split}
          
          float splt = ss(-fsUv, fsUv, sUv.x);
          
          vec3 col = mix(gl_FragColor.rgb * 0.5, gl_FragColor.rgb, splt);
          
          float y = abs(vPos.y);
          float stripe = ss(5.25, 4.75, y);
          col = mix(col, vec3(1, 0.875, 1), stripe );
          float thinStripeRad = step(3., length(vPos.xz));
          vec3 colStripe = mix(vec3(0, 0, 1), vec3(0.75, 1, 0.875), splt);
          col = mix(col, colStripe, thinStripeRad);
          gl_FragColor.rgb = col;
          
          ${darkenMaterial}
          vec3 bloomColor = mix(vec3(1), col, globalBloom * (1. - splt) * thinStripeRad);
          gl_FragColor.rgb = mix(gl_FragColor.rgb, bloomColor, (1. - splt) * thinStripeRad);
        `
        );
        //console.log(shader.fragmentShader);
    }
});
thingM.defines = {"USE_UV" : ""};
let thing = new THREE.InstancedMesh(thingG, thingM, 7);
let dummy = new THREE.Object3D();
let instData = [];
for(let i = 0; i < 7; i++){
    dummy.position.setFromCylindricalCoords(100, Math.PI * 2 / 7 * i + Math.PI * 0.5, 10);
    dummy.updateMatrix();
    thing.setMatrixAt(i, dummy.matrix)
    instData.push(Math.random());
}
thingG.setAttribute("instData", new THREE.InstancedBufferAttribute(new Float32Array(instData), 1));
scene.add(thing);
// </THINGS>

// </BACKGROUND>

let r = Math.sqrt(2) * 5;

// <GROUND>
let groundG = new THREE.IcosahedronGeometry(r + 0.15, 2);
let gPos = groundG.attributes.position;
let col = [];
for(let i = 0; i < gPos.count; i++){
    v3.fromBufferAttribute(gPos, i);
    if (v3.y >= 0) {
        gPos.setY(i, 0);
    }
}
groundG.computeVertexNormals();
let groundM = new THREE.MeshLambertMaterial({
    color: "aqua",
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
      varying float vY;
      ${shader.vertexShader}
    `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        vY = position.y;
      `
        )
        shader.fragmentShader = `
      #define ss(a, b, c) smoothstep(a, b, c)
      uniform float globalBloom;
      ${splitPars}
      varying float vY;
      ${shader.fragmentShader}
    `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
      ${split}
      vec3 col1 = mix(vec3(0, 1, 1) * 0.175, diffuse * 0.5, ss(0., -5., vY));
      vec3 col2 = mix(vec3(0.125), diffuse * 0.5, ss(0., -5., vY));
      vec3 col = mix(col2, col1, ss(-fsUv, fsUv, sUv.x));
      vec4 diffuseColor = vec4( col, opacity );`
        ).replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
        ${darkenMaterial}
        `
        );
    }
});
let ground = new THREE.Mesh(groundG, groundM);
scene.add(ground);
// </GROUND>

// <GRASS>
let g = new THREE.InstancedBufferGeometry().setFromPoints(new Array(6).fill().map((v, i) => {return new THREE.Vector3(0, i * 0.2, 0)}));
let instPos = [];

for(let i = 0; i < 50000; i++){
    v3.setFromCylindricalCoords(Math.sqrt(Math.random() * r * r), Math.random() * Math.PI * 2, 0);
    instPos.push(v3.x, v3.y, v3.z, 0.8 + Math.random() * 0.2);
}
g.setAttribute("instPos", new THREE.InstancedBufferAttribute(new Float32Array(instPos), 4)); // position, scale
let m = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.time = gu.time;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
      uniform float time;
      attribute vec4 instPos;
      attribute float lineDistance;
      
      varying float vLineDistance;
      varying float vNoise;
      ${noise}
      ${shader.vertexShader}
    `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        vLineDistance = lineDistance;
        transformed.y *= instPos.w;
        
        float t = time * 0.1;
        vec3 wind = vec3(1, 0, 1);
        vec2 instUV = instPos.xz / 20.;
        instUV.y *= 0.875;
        instUV.x -= t;
        float n  = snoise(vec3( instUV * 5., t));
        float n2 = snoise(vec3( (instUV + vec2(2.)) * 5., 0.));
        n = n * 0.5 + 0.5;
        vNoise = n;
        transformed.y *= 0.5 + (1. - n) * 0.5;
        transformed += wind * vec3(0.5, 1, 0.25) * vec3(n, 1, n2) * pow(position.y, 2.7);
        transformed += instPos.xyz;
      `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
      #define ss(a, b, c) smoothstep(a, b, c)
      uniform float globalBloom;
      uniform float time;
      ${splitPars}
      varying float vLineDistance;
      varying float vNoise;
      ${shader.fragmentShader}
    `.replace(
            `vec4 diffuseColor = vec4( diffuse, opacity );`,
            `
      ${split}
      float sf = ss(-fsUv, fsUv, sUv.x);
      float ld = vLineDistance;
      vec3 col = mix(diffuse * 0.25, diffuse, pow(ld, 2.7));
      col = mix(mix(vec3(0.5), vec3(0.75),  pow(ld, 2.7)), col, sf);
      
      float pin = ss(0.9, 0.95, ld) - ss(0.95, 1., ld);
      col = mix(col, mix(vec3(0.5, 1, 0), vec3(0, 0.5, 1), 1. - vNoise), pin * sf);
      
      vec4 diffuseColor = vec4( col, opacity );
      `
        ).replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
        ${darkenMaterial}
        `
        );
        //console.log(shader.fragmentShader);
    }
});
let l = new THREE.Line(g, m);
l.computeLineDistances();
scene.add(l);
// </GRASS>

// <BEETLES>
let beetlePts = [
    [-1, 1], [0, 0], [1, 1],
    [-0.5, -1], [0, -0.5], [0.5, -1]
].map(p => {return new THREE.Vector2(p[0], p[1])});
let beetleG = new THREE.InstancedBufferGeometry().setFromPoints(beetlePts).rotateX(Math.PI * - 0.5).rotateY(Math.PI * -0.5);
beetleG.setIndex([0, 1, 1, 2, 3, 4, 4, 5, 3, 0, 4, 1, 5, 2]);
let instPosBeetle = [];
let instPhaseBeetle = [];
let instColor = [];
new Array(250).fill().forEach(p => {
    v3.random().subScalar(0.5).multiplyScalar(14).setY(1 + Math.random());
    instPosBeetle.push(v3.x, v3.y, v3.z);
    instPhaseBeetle.push(Math.random());
    c.setHSL(Math.random(), 1, 0.5);
    instColor.push(c.r, c.g, c.b);
});
beetleG.setAttribute("instPos", new THREE.InstancedBufferAttribute(new Float32Array(instPosBeetle), 3));
beetleG.setAttribute("instPhase", new THREE.InstancedBufferAttribute(new Float32Array(instPhaseBeetle), 1));
beetleG.setAttribute("color", new THREE.InstancedBufferAttribute(new Float32Array(instColor), 3));
let beetleM = new THREE.LineBasicMaterial({
    //color: 0xccff00,
    vertexColors: true,
    transparent: true,
    //opacity: 1,
    onBeforeCompile: shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.time = gu.time;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
      uniform float time;
      attribute vec3 instPos;
      attribute float instPhase;
      varying float vInstRadius;
      ${shader.vertexShader}
    `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        // position
        vec3 iPos = instPos;
        iPos.x = -7. + mod(instPos.x - (-7.) + time * 0.75, 14.);
        iPos.y += sin(iPos.x + instPhase * 7.) * (0.5 * instPhase + 0.5);
        iPos.z += sin(iPos.x * 0.5) * (instPhase - 0.5) * 2.;
        
        // swaying
        vec3 sclPos = position * (1. - instPhase * 0.5);
        float t = (mod(time, 20.) + instPhase + sclPos.x * 0.1) * PI2 * 5. * (1. + instPhase * 0.5);
        float tVal = sin(t) * 0.5 + 0.5;
        float angle = (-PI / 6.) + (PI * 2. / 3.) * tVal;
        vec3 swayPos = vec3(sclPos.x, sin(angle) * abs(sclPos.z), cos(angle) * sclPos.z);
        
        transformed = swayPos * 0.075 + iPos;
        vInstRadius = length(iPos);
      `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
      #define ss(a, b, c) smoothstep(a, b, c)
      uniform float globalBloom;
      varying float vInstRadius;
      ${splitPars}
      ${shader.fragmentShader}
    `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
      
      ${split}
      
      float a = ss(7., 6.75, vInstRadius);
      float splt = ss(-fsUv, fsUv, sUv.x);
      vec3 col = mix(vec3(0.25, 0.25, 0), diffuseColor.rgb, splt);
      
      diffuseColor.rgb = col;
      diffuseColor.a *= a;
      `
        ).replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
        ${darkenMaterial}
        vec3 bloomColor = mix(vec3(1), col, globalBloom * (1. - splt));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, bloomColor, 1. - splt);
        `
        );
        //console.log(shader.fragmentShader);
    }
});
let beetle = new THREE.LineSegments(beetleG, beetleM);
scene.add(beetle);
// </BEETLES>

// <TREE>
const loader = new OBJLoader();
loader.load( 'https://threejs.org/examples/models/obj/tree.obj', function ( object ) {

    let tree = object.children[0];

    let lines = new THREE.LineSegments(new THREE.EdgesGeometry(tree.geometry, 20), new THREE.LineBasicMaterial({
        color: 0x88ffaa,
        transparent: true,
        opacity: 0.75,
        onBeforeCompile: shader => {
            shader.uniforms.globalBloom = gu.globalBloom;
            shader.uniforms.resolution = gu.resolution;
            shader.uniforms.split = gu.split;
            shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float globalBloom;
        ${splitPars}
        ${shader.fragmentShader}
      `.replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,
                `
        ${split}
        float splt = ss(-fsUv, fsUv, sUv.x);
        vec4 col = mix(vec4(0.5, 0, 0.5, 1), vec4(diffuse, opacity), splt);
        vec4 diffuseColor = col;`
            ).replace(
                `#include <dithering_fragment>`,
                `#include <dithering_fragment>
          ${darkenMaterial}
          vec3 bloomColor = mix(vec3(1), col.rgb, globalBloom * (1. - splt));
          gl_FragColor.rgb = mix(gl_FragColor.rgb, bloomColor, 1. - splt);
        `
            );
        }
    }));
    tree.add(lines);

    tree.material.color.set(0x00eeff);
    tree.material.side = THREE.DoubleSide;
    tree.material.defines = {"USE_UV": ""};
    tree.material.polygonOffset = true;
    tree.material.polygonOffsetFactor = 1;
    tree.material.onBeforeCompile = shader => {
        shader.uniforms.globalBloom = gu.globalBloom;
        shader.uniforms.time = gu.time;
        shader.uniforms.resolution = gu.resolution;
        shader.uniforms.split = gu.split;
        shader.vertexShader = `
        varying vec3 vPos;
        ${shader.vertexShader}
      `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
        vPos = vec3(modelMatrix * vec4(position, 1.));
        `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
        uniform float globalBloom;
        uniform float time;
        ${splitPars}
        varying vec3 vPos;
        
        #define ss(a, b, c) smoothstep(a, b, c)
        
        ${fbm}
        ${shader.fragmentShader}
      `.replace(
            `#include <dithering_fragment>`,
            `#include <dithering_fragment>
        float t = time * 0.2;
        float d = clamp(fbm((vPos - vec3(0, 1, 0) * t) * 2.5), 0., 1.);
        float dissolve = 0.5;
        
        ${split}
        
        if((sUv.x > 0.) && (vPos.y < 0.5 || d < dissolve) ) discard;
        
        float solidify = ss(dissolve + 0.2, dissolve, d);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.75, 1, 0.875), solidify);
        gl_FragColor.rgb = mix(vec3(0.25, 0.25, 0.5), gl_FragColor.rgb, ss(-fsUv, fsUv, sUv.x));
        
        ${darkenMaterial}
        `
        );
        //console.log(shader.fragmentShader)
    }
    tree.scale.multiplyScalar( 7 );
    scene.add( tree );
    //console.log(tree)

    // <TREE_POINTS>
    let treePts = [];
    let treeNor = [];
    const sampler = new MeshSurfaceSampler( tree ).build();

    let _position = new THREE.Vector3();
    let _normal = new THREE.Vector3();

    let foliageCounter = 0;
    while(foliageCounter < 75000){
        sampler.sample( _position, _normal);
        //console.log(_position.length());
        if (_position.length() > 0.45){
            treePts.push(_position.clone().multiplyScalar(7));
            if (Math.random() < 0.33) _normal.randomDirection();
            treeNor.push(_normal.x, _normal.y, _normal.z, Math.random()); // normal, distance
            foliageCounter++;
        }
    }

    let treePointsG = new THREE.BufferGeometry().setFromPoints(treePts);
    treePointsG.setAttribute("treeNor", new THREE.Float32BufferAttribute(treeNor, 4));
    let treePointsM = new THREE.PointsMaterial({
        color: 0x88ffaa,
        sizeAttenuation: false,
        size: 5,
        transparent: true,
        //blending: THREE.AdditiveBlending,
        onBeforeCompile: shader => {
            shader.uniforms.globalBloom = gu.globalBloom;
            shader.uniforms.time = gu.time;
            shader.uniforms.resolution = gu.resolution;
            shader.uniforms.split = gu.split;
            shader.vertexShader = `
        uniform float time;
        attribute vec4 treeNor;
        varying float distRatio;
        varying float vHeight;
        ${noise}
        ${shader.vertexShader}
      `.replace(
                `#include <begin_vertex>`,
                `#include <begin_vertex>
          float dist = treeNor.w;
          vec3 newPos = treeNor.xyz * treeNor.w * 1.5;
          newPos.y -= pow(dist, 2.7 * 2.7) * 2.;
          transformed += newPos;
          
          distRatio = dist;
          
          float t = time * 0.05;
          vec3 sway = vec3(2, 0.5, 0.5) * 0.75;
          vec2 instUV = position.xz / 20.;
          instUV.y *= 0.875;
          instUV.x -= t;
          float n  = snoise(vec3( instUV * 5., t));
          float n2 = snoise(vec3( (instUV + vec2(2.)) * 5., t));
          float n3 = snoise(vec3( (instUV + vec2(-2)) * 10., t));
          n = n * 0.5 + 0.5;
          transformed += sway * dist * vec3(n, n2, n3) * pow(dist, 2.7);
          vHeight = transformed.y;
        `
            ).replace(
                `gl_PointSize = size;`,
                `float d = 1. - dist;
          d = pow(d, 2.7);
        gl_PointSize = size * (0.75 + 0.25 * d);`
            );
            //console.log(shader.vertexShader);

            shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float globalBloom;
        ${splitPars}
        varying float distRatio;
        varying float vHeight;
        ${shader.fragmentShader}
      `.replace(
                `#include <clipping_planes_fragment>`,
                `#include <clipping_planes_fragment>
          vec2 uv = gl_PointCoord * 2. -  1.;
          float dist = length(uv);
          if(dist > 1.) discard;
        `
            ).replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,
                `
        ${split}
        
        float d = pow(ss(0., 1., dist), 2.7);
        vec3 col = mix(1. - diffuse * 0.5, diffuse, ss(-fsUv, fsUv, sUv.x));
        col = col * (0.75 + 0.25 * pow(distRatio, 2.7));
        
        float od = fwidth(dist);
        float or = ss(1., 1. - od, dist);
        float oh = ss(0.25, 0.75, vHeight);
        
        vec4 diffuseColor = vec4(col, or * oh );`
            ).replace(
                `#include <premultiplied_alpha_fragment>`,
                `#include <premultiplied_alpha_fragment>
        ${darkenMaterial}
        `
            );
            console.log(shader.fragmentShader);
        }
    });
    let treePoints = new THREE.Points(treePointsG, treePointsM);
    scene.add(treePoints);
    // </TREE_POINTS>

} );
// </TREE>

// <POSTPROCESSING>
const params = {
    bloomStrength: 5,
    bloomThreshold: 0,
    bloomRadius: 1
};

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const bloomComposer = new EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

const finalPass = new ShaderPass(
    new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: vSH,
        fragmentShader: fSH,
        defines: {}
    } ), 'baseTexture'
);
finalPass.needsSwap = true;

const finalComposer = new EffectComposer( renderer );
finalComposer.addPass( renderScene );
finalComposer.addPass( finalPass );
// <POSTPROCESSING>

let clock = new THREE.Clock();

renderer.setAnimationLoop( _ => {
    let t = clock.getElapsedTime();
    gu.time.value = t;
    gu.split.value.y = 0.5 + Math.sin(t) * 0.1;
    gu.split.value.z = (Math.PI / 24) * Math.sin(t * 0.314);
    controls.update();
    gu.globalBloom.value = 1;

    bloomComposer.render();
    gu.globalBloom.value = 0;
    finalComposer.render();
    //renderer.render(scene, camera);
})

function CapsuleGeometry(R, L){

    let r = R;
    let R1 = R - r;
    let a = Math.asin(R1 / L);

    let path = new THREE.Path();
    path.absarc(0, -L * 0.5, R, Math.PI * 1.5, a);
    path.absarc(0,  L * 0.5, r, a, Math.PI * 0.5);

    let pts = path.getPoints(5);

    let g = new THREE.LatheBufferGeometry(pts);

    return g;
}