import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

/* ==============================
   SCENE
============================== */

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x00030a);

/* ==============================
   CAMERA
============================== */

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.z = 4;

/* ==============================
   RENDERER
============================== */

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.15;

document.getElementById("earth").appendChild(renderer.domElement);

/* ==============================
   EARTH GROUP
============================== */

const earthGroup = new THREE.Group();

scene.add(earthGroup);

/* ==============================
   TEXTURES
============================== */

const loader = new THREE.TextureLoader();

loader.setCrossOrigin("anonymous");

const earthTexture = loader.load(
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
);

const earthNormal = loader.load(
  "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
);

const earthSpecular = loader.load(
  "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
);

const nightTexture = loader.load(
  "https://threejs.org/examples/textures/planets/earth_lights_2048.png",
);

const cloudTexture = loader.load(
  "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
);

/* ==============================
   EARTH
============================== */

const earthGeometry = new THREE.SphereGeometry(1.35, 128, 128);

const earthMaterial = new THREE.MeshPhongMaterial({
  map: earthTexture,

  normalMap: earthNormal,

  specularMap: earthSpecular,

  specular: new THREE.Color(0x333333),

  shininess: 10,
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

earthGroup.add(earth);

/* ==============================
   CITY LIGHTS
============================== */

const nightMaterial = new THREE.MeshBasicMaterial({
  map: nightTexture,

  transparent: true,

  opacity: 0.8,

  blending: THREE.AdditiveBlending,
});

const nightEarth = new THREE.Mesh(earthGeometry, nightMaterial);

nightEarth.scale.setScalar(1.002);

earthGroup.add(nightEarth);

/* ==============================
   CLOUDS
============================== */

const cloudGeometry = new THREE.SphereGeometry(1.385, 96, 96);

const cloudMaterial = new THREE.MeshPhongMaterial({
  map: cloudTexture,

  transparent: true,

  opacity: 0.65,

  depthWrite: false,
});

const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);

earthGroup.add(clouds);

/* ==============================
   ATMOSPHERE
============================== */

const atmosphereGeometry = new THREE.SphereGeometry(1.46, 96, 96);

const atmosphereMaterial = new THREE.ShaderMaterial({
  transparent: true,

  side: THREE.BackSide,

  blending: THREE.AdditiveBlending,

  vertexShader: `

            varying vec3 vNormal;

            void main() {

                vNormal =
                    normalize(
                        normalMatrix *
                        normal
                    );

                gl_Position =
                    projectionMatrix *
                    modelViewMatrix *
                    vec4(
                        position,
                        1.0
                    );
            }

        `,

  fragmentShader: `

            varying vec3 vNormal;

            void main() {

                float intensity =
                    pow(
                        0.75 -
                        dot(
                            vNormal,
                            vec3(
                                0.0,
                                0.0,
                                1.0
                            )
                        ),
                        3.0
                    );

                gl_FragColor =
                    vec4(
                        0.12,
                        0.5,
                        1.0,
                        intensity
                    );
            }

        `,
});

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

earthGroup.add(atmosphere);

/* ==============================
   STARS
============================== */

const starGeometry = new THREE.BufferGeometry();

const starCount = 8000;

const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i += 3) {
  const radius = 40 + Math.random() * 100;

  const theta = Math.random() * Math.PI * 2;

  const phi = Math.acos(2 * Math.random() - 1);

  positions[i] = radius * Math.sin(phi) * Math.cos(theta);

  positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);

  positions[i + 2] = radius * Math.cos(phi);
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,

  size: 0.06,

  transparent: true,

  opacity: 0.8,
});

const stars = new THREE.Points(starGeometry, starMaterial);

scene.add(stars);

/* ==============================
   LIGHTING
============================== */

const ambient = new THREE.AmbientLight(0x202020, 0.25);

scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 3.2);

sun.position.set(-5, 2, 5);

scene.add(sun);

/* ==============================
   BLUE RIM LIGHT
============================== */

const rim = new THREE.PointLight(0x38bdf8, 3, 10);

rim.position.set(3, 0, -4);

scene.add(rim);

/* ==============================
   MOUSE
============================== */

let dragging = false;

let previousX = 0;
let previousY = 0;

let velocityX = 0;
let velocityY = 0;

renderer.domElement.addEventListener("pointerdown", (event) => {
  dragging = true;

  previousX = event.clientX;

  previousY = event.clientY;

  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!dragging) return;

  const dx = event.clientX - previousX;

  const dy = event.clientY - previousY;

  velocityX = dx * 0.004;

  velocityY = dy * 0.004;

  earthGroup.rotation.y += velocityX;

  earthGroup.rotation.x += velocityY;

  earthGroup.rotation.x = THREE.MathUtils.clamp(
    earthGroup.rotation.x,
    -0.7,
    0.7,
  );

  previousX = event.clientX;

  previousY = event.clientY;
});

renderer.domElement.addEventListener("pointerup", () => {
  dragging = false;
});

/* ==============================
   ZOOM
============================== */

renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    camera.position.z += event.deltaY * 0.0015;

    camera.position.z = THREE.MathUtils.clamp(camera.position.z, 2.3, 7);
  },
  { passive: true },
);

/* ==============================
   ANIMATION
============================== */

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (!dragging) {
    earthGroup.rotation.y += delta * 0.12;

    earthGroup.rotation.y += velocityX;

    earthGroup.rotation.x += velocityY;

    velocityX *= 0.94;
    velocityY *= 0.94;
  }

  /* Cloud movement */

  clouds.rotation.y += delta * 0.02;

  /* Star movement */

  stars.rotation.y += delta * 0.001;

  renderer.render(scene, camera);
}

animate();

/* ==============================
   RESIZE
============================== */

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
