import "./style.css";
// import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { gsap, selector } from "gsap";
import { initText } from "./rest";
import { textBoxContent, textBoxContent2 } from "./data";

const imgPath = "https://via.placeholder.com/250x300";
const personName1 = "Sam";
const personName2 = "Thomas";
const textBoxElement = document.getElementById("text-element");
initText(textBoxContent, imgPath, personName1);
/**
 * Loaders
 */
const listener = new THREE.AudioListener();
const loadingBarElement = document.querySelector(".loading-bar");
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let sceneReady = false;
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
  },

  // Progress
  (itemUrl, itemsLoaded, itemsTotal) => {
    // Calculate the progress and update the loadingBarElement
    const progressRatio = itemsLoaded / itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
  }
);
const fbxLoader = new FBXLoader(loadingManager);
const sound = new THREE.PositionalAudio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("masters/loop.ogg", function (buffer) {
  console.log(buffer);
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.setRefDistance(2000);
  sound.play();
});

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
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

/**
 * Model
 */

// fbxLoader.load("models/Static_All.fbx", (fbx) => {
//   fbx.scale.set(0.17, 0.17, 0.17);
//   console.log(fbx);
//   scene.add(fbx);
// });

fbxLoader.load("Floor.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/Dozent_L.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/Dozent_R.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/Door_L.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/Door_R.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  fbx.add(sound);
  scene.add(fbx);
});

fbxLoader.load("models/Infoscreen.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/PC_Setup_02.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
});

fbxLoader.load("models/PC_Setup_03.fbx", (fbx) => {
  fbx.scale.set(0.17, 0.17, 0.17);
  console.log(fbx);
  scene.add(fbx);
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
      initText(textBoxContent2, imgPath, personName2);

    } else if (intersects[0].object.name === "Human_L") {
      click.play();
      initText(textBoxContent, imgPath, personName1);

    } else if (intersects[0].object.parent.name === "PC_Setup_03") {
      click.play();
    } else if (intersects[0].object.parent.name === "PC_Setup_02") {
      click.play();
    } else if (intersects[0].object.name === "TV") {
      click.play();
      window.open("http://infoscreen.sae.ch/", "_blank").focus();
    } else if (intersects[0].object.name === "Door_02") {
      click.play();
    } else if (intersects[0].object.name === "Door_03") {
      click.play();
    }
  }
}

// Close Elements

function closeTextBoxes() {
  closeAudio.play();
  textBoxElement.classList.remove("visible");
  // studentProject.classList.remove("visible");
  // studentProjectTitle.innerHTML = "";
  // studentProjectText.innerHTML = "";
  // textBoxTitle.innerHTML = "";
  // textBoxText.innerHTML = "";
}
canvas.addEventListener('click', function () {
  if (textBoxElement.classList.contains("visible")) {
    closeTextBoxes();
  }
})


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
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

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
