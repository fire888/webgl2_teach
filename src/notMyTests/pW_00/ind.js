import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
//renderer.setClearColor(0x244832);
renderer.setClearColor(0x000000);
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


let v3 = new THREE.Vector3();

let gu = {
    globalBloom: {
        value: 0
    },
    time: {
        value: 0
    },
    resolution: {
        value: new THREE.Vector2(innerWidth, innerHeight)
    },
    split: {
        //value: new THREE.Vector3(0.5, 0.25, Math.sin(Math.PI / 12))
        value: new THREE.Vector3(0, 0, 1)
    } //uv.x, uv.y, inclination
}


let r = Math.sqrt(2) * 5;

// <GRASS>
let g = new THREE.InstancedBufferGeometry().setFromPoints(new Array(6).fill().map((v, i) => {return new THREE.Vector3(0, i * 0.2, 0)}));
let instPos = [];

for(let i = 0; i < 50000; i++){
    v3.setFromCylindricalCoords(
        Math.sqrt(Math.random() * r * r),
        Math.random() * Math.PI * 2, 0
    );
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
    gu.split.value.y = 0//0.5 + Math.sin(t) * 0.1;
    gu.split.value.z = 0//(Math.PI / 24) * Math.sin(t * 0.314);
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