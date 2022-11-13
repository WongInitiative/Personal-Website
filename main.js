import './style.css';

import * as THREE from 'three'; //import ThreeJS library
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import spaceimg from './space.jpg';
import keltonimg from './Kelton.jpg';
import moonimg from './moon.jpg';
import normalimg from './normal.jpg';


var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}



//Need 3 things: Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //Arguments: FOV, Aspect Ratio (inner width/inner height), View Frustum (which objects visible relative to camera)
const renderer = new THREE.WebGLRenderer({  //Tell the renderer which dom element to use for the render
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);  //Sets the pixel ratio of the camera to that of the device
renderer.setSize(window.innerWidth, window.innerHeight); //Make canvas full screen by setting renderer size to window size
camera.position.setZ(30); //Camera is centered currently so move it along the z-axis for a better starting perspective
camera.position.setX(-3);

renderer.render(scene, camera);

//Create Torus geometry and texture it
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus); //Add torus to the scene

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

//const controls = new OrbitControls(camera, renderer.domElement);

//Create Random Stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

//Add space texture
const spaceTexture = new THREE.TextureLoader().load(spaceimg);
scene.background = spaceTexture;

//Add avatar cube
const keltonTexture = new THREE.TextureLoader().load(keltonimg);

const kelton = new THREE.Mesh(
  new THREE.BoxGeometry(2.6, 3, 3),
  new THREE.MeshBasicMaterial({map: keltonTexture})
);

scene.add(kelton);

//Add moon
const moonTexture = new THREE.TextureLoader().load(moonimg);
const normalTexture = new THREE.TextureLoader().load(normalimg);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

kelton.position.z = -5;
kelton.position.x = 2;

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  kelton.rotation.y += 0.01;
  kelton.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera;
moveCamera();



//Animate torus
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.z += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.x += 0.01;

  moon.rotation.x += 0.005;
  //controls.update();

  renderer.render(scene, camera);
}

animate();


