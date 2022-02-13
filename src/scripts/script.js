import "../styles/style.css";
// import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { gsap } from "gsap";
import { initText } from "./utils/rest";
import { textBoxContent, textBoxContent2 } from "./utils/data";

const imgPath = ["img/sammy.jpg", "img/Tommy.png"];
const personName1 = "Sam";
const personName2 = "Thomas";
const project1 = document.querySelector(".project-1");
const project2 = document.querySelector(".project-2");
const projectAudio1 = document.querySelector(".audio-project-1");
const projectAudio2 = document.querySelector(".audio-project-2");
const studentProjects = document.querySelectorAll(".student-container");
const textBoxElement = document.getElementById("text-element");
const ovrly = document.querySelector(".overlay");
const ovrlyBtn = document.getElementById("overlay-btn");

GreenAudioPlayer.init({
  selector: ".song-1",
  stopOthersOnPlay: true,
});

GreenAudioPlayer.init({
  selector: ".song-2",
  stopOthersOnPlay: true,
});

/**
 * Loaders
 */
const listener = new THREE.AudioListener();
const loadingBarElement = document.querySelector(".loading-bar");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let loadSong = true;
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    // Wait a little
    window.setTimeout(() => {
      // Animate overlay
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0,
        delay: 1,
      });

      // Update loadingBarElement
      loadingBarElement.classList.add("ended");
      loadingBarElement.style.transform = "";
    }, 500);

    window.setTimeout(() => {
      sceneReady = true;
    }, 2000);
  }
);

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Overlay
 */
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
  // wireframe: true,
  transparent: true,
  uniforms: {
    uAlpha: { value: 1 },
  },
  vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `,
});
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlay);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -80;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.right = 70;
directionalLight.shadow.camera.bottom = -10;
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

/**
 * Models
 */

const fbxLoader = new FBXLoader(loadingManager);
const models = [
  "models/Floor.fbx",
  "models/Dozent_L.fbx",
  "models/Dozent_R.fbx",
  "models/Door_L.fbx",
  "models/Door_R.fbx",
  "models/Infoscreen.fbx",
  "models/PC_Setup_02.fbx",
  "models/PC_Setup_03.fbx",
  "models/reception.fbx"
];

models.forEach((element) => {
  fbxLoader.load(element, (fbx) => {
    scene.add(fbx);
  });
});

function onDocumentMouseMove(event) {
  var mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (
    intersects &&
    intersects.length > 0 &&
    intersects[0].object.name !== "Floor"
  ) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
}
const click = new Audio("masters/click.ogg");
const closeAudio = new Audio("masters/close.ogg");

function onClick(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects && intersects.length > 0) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }

  if (intersects.length > 0) {
    console.log(intersects[0].object);
    if (intersects[0].object.name === "Human_R") {
      click.play();
      initText(textBoxContent2, imgPath[1], personName2);
    } else if (intersects[0].object.name === "Human_L") {
      click.play();
      initText(textBoxContent, imgPath[0], personName1);
    } else if (intersects[0].object.parent.name === "PC_Setup_03") {
      click.play();
      project1.classList.add("visible");
    } else if (intersects[0].object.parent.name === "PC_Setup_02") {
      click.play();
      project2.classList.add("visible");
    } else if (intersects[0].object.name === "TV") {
      click.play();
      window.open("http://infoscreen.sae.ch/", "_blank").focus();
    } else if (intersects[0].object.name === "Door_02") {
      projectAudio1.classList.add("visible");
      click.play();
    } else if (intersects[0].object.name === "Door_03") {
      projectAudio2.classList.add("visible");
      click.play();
    }
  }
}

// Close Elements
function closeTextBoxes() {
  if (textBoxElement.classList.contains("visible")) {
    closeAudio.play();
    textBoxElement.classList.remove("visible");
  }

  for (let i = 0; i < studentProjects.length; i++) {
    const element = studentProjects[i];
    if (element.classList.contains("visible")) {
      closeAudio.play();
      element.classList.remove("visible");
    }
  }
}
canvas.addEventListener("click", function () {
  closeTextBoxes();
  var sounds = document.getElementsByTagName("audio");
  for (let i = 0; i < sounds.length; i++) sounds[i].pause();

  if (!loadSong) {
    playSong();
  }
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = -20;
camera.position.y = 16;
camera.position.z = 30;
scene.add(camera);

/**
 * Audio Handling
 */
camera.add(listener);
const audioLoader = new THREE.AudioLoader();
const positionalAudio = new THREE.PositionalAudio(listener);

function playSong() {
  audioLoader.load("students/mic-check.ogg", function (buffer) {
    positionalAudio.setBuffer(buffer);
    positionalAudio.setRefDistance(20);
    positionalAudio.setVolume(0.05);
    positionalAudio.loop = true;
    positionalAudio.muted = true;
    positionalAudio.play();
    positionalAudio.setDirectionalCone(180, 230, 0.1);
    positionalAudio.position.y = 1;
    positionalAudio.position.z = 10;
  });
}



ovrlyBtn.addEventListener("click", function () {
  ovrly.classList.add("open");
    playSong();
});

const playbtn = document.querySelectorAll(".holder");
playbtn.forEach((element) => {
  element.addEventListener("click", function () {
    loadSong = false;
    positionalAudio.stop();
  });
});

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.domElement.addEventListener("click", onClick, false);
renderer.domElement.addEventListener("mousemove", onDocumentMouseMove, false);

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update materials

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
