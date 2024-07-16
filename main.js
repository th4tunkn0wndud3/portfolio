import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new THREE.Scene();
const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const loader = new GLTFLoader();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

let mixer;
loader.load('models/sith-holocron/scene.gltf', (gltf) => {
  const model = gltf.scene;
  scene.add(model);
  model.scale.set(50, 50, 50)
  model.position.set(0, 0, 0)

  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  const action = mixer.clipAction(clips[0]);
  action.play();
}, undefined, function(err){
  console.error(err);
})

const ambientLight = new THREE.AmbientLight(0x404040, 10);
scene.add(ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25;
controls.enableZoom = false;

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

animate()