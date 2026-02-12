import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const canvas = document.querySelector('#cyber-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

camera.position.set(0, 0.2, 5.5);

const ambient = new THREE.AmbientLight(0x4c7fff, 0.7);
scene.add(ambient);

const point = new THREE.PointLight(0x7ae7ff, 2.8, 40);
point.position.set(2, 3, 4);
scene.add(point);

const globeGroup = new THREE.Group();
scene.add(globeGroup);

const sphereGeometry = new THREE.IcosahedronGeometry(1.22, 16);
const sphereMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x102b66,
  emissive: 0x144073,
  emissiveIntensity: 0.35,
  roughness: 0.15,
  metalness: 0.6,
  transmission: 0.15,
  thickness: 1.2,
  clearcoat: 0.8,
  clearcoatRoughness: 0.18,
  wireframe: false
});
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
globeGroup.add(globe);

const wireGeometry = new THREE.IcosahedronGeometry(1.32, 5);
const wireMaterial = new THREE.MeshBasicMaterial({ color: 0x7ad9ff, wireframe: true, transparent: true, opacity: 0.35 });
const wireShell = new THREE.Mesh(wireGeometry, wireMaterial);
globeGroup.add(wireShell);

const starsGeometry = new THREE.BufferGeometry();
const starCount = 1200;
const positions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 28;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 28;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: 0xa9d9ff,
  size: 0.03,
  transparent: true,
  opacity: 0.75
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

const mouse = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  globe.rotation.y = elapsed * 0.25;
  globe.rotation.x = Math.sin(elapsed * 0.5) * 0.1;

  wireShell.rotation.y = -elapsed * 0.17;
  wireShell.rotation.x = elapsed * 0.08;

  globeGroup.position.x += (mouse.x * 0.65 - globeGroup.position.x) * 0.03;
  globeGroup.position.y += (mouse.y * 0.4 - globeGroup.position.y) * 0.03;

  point.position.x = 2 + mouse.x * 1.7;
  point.position.y = 3 + mouse.y * 1.2;

  stars.rotation.y = elapsed * 0.02;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();
