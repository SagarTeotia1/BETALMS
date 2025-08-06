const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let eraser = false;
let brushColor = "#000000";
let brushSize = 5;
let lastX = 0;
let lastY = 0;

// DOM Elements
const colorPicker = document.getElementById("colorPicker");
const eraserBtn = document.getElementById("eraserBtn");
const brushSizeInput = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const imageUpload = document.getElementById("imageUpload");
const videoUpload = document.getElementById("videoUpload");
const uploadImageBtn = document.getElementById("uploadImageBtn");
const uploadVideoBtn = document.getElementById("uploadVideoBtn");
const bgVideo = document.getElementById("bgVideo");
const uploadGifBtn = document.getElementById("uploadGifBtn");
const gifUpload = document.getElementById("gifUpload");
const gifElement = document.getElementById("bgGif");

const uploadGlbBtn = document.getElementById("uploadGlbBtn");
const glbUpload = document.getElementById("glbUpload");
const modelViewer = document.getElementById("bgModel");


const testAssets = {
  images: ["../assets/swati-sharma-stylish-designer-indian-women-dress-3d-model-3d-model-obj-fbx-3.jpg"],
  gifs: ["../assets/6ov.gif"],
  videos: ["../assets/Nature Beautiful Flowers Video  beautiful flowers #naturelovers (480p).mp4"], // replace with video if you have one
  glbs: ["../assets/porsche_911.glb"]
};

let assetIndex = 0;


// ========== TOOLBAR ACTIONS ==========
colorPicker.addEventListener("change", (e) => {
  brushColor = e.target.value;
  eraser = false;
  eraserBtn.classList.remove("active");
});

eraserBtn.addEventListener("click", () => {
  eraser = !eraser;
  eraserBtn.classList.toggle("active");
});

brushSizeInput.addEventListener("input", (e) => {
  brushSize = parseInt(e.target.value);
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bgVideo.pause();
  bgVideo.src = "";
  bgVideo.style.display = "none";
});

saveBtn.addEventListener("click", () => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // If video is playing, draw current frame
  if (bgVideo.src && bgVideo.style.display === "block") {
    tempCtx.drawImage(bgVideo, 0, 0, canvas.width, canvas.height);
  }

  // Draw current canvas on top
  tempCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
});

// ========== DRAWING LOGIC ==========
function startDrawing(x, y) {
  drawing = true;
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

function drawLine(x, y) {
  if (!drawing) return;

  ctx.strokeStyle = eraser ? "#ffffff" : brushColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

// ========== MOUSE ==========
canvas.addEventListener("mousedown", (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener("mousemove", (e) => drawLine(e.offsetX, e.offsetY));
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// ========== TOUCH ==========
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  drawLine(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener("touchend", stopDrawing);

// ========== IMAGE & VIDEO ==========
uploadImageBtn.addEventListener("click", () => imageUpload.click());
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    bgVideo.style.display = "none";
  };
  img.src = URL.createObjectURL(file);
});

uploadVideoBtn.addEventListener("click", () => videoUpload.click());
videoUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const videoURL = URL.createObjectURL(file);
  bgVideo.src = videoURL;
  bgVideo.style.display = "block";
  bgVideo.play();
});
uploadGifBtn.addEventListener("click", () => gifUpload.click());

gifUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const gifURL = URL.createObjectURL(file);

  gifElement.src = gifURL;
  gifElement.style.display = "block";

  // Hide others
  bgVideo.style.display = "none";
  modelViewer.style.display = "none";
});
uploadGlbBtn.addEventListener("click", () => glbUpload.click());

glbUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const glbURL = URL.createObjectURL(file);
  modelViewer.src = glbURL;
  modelViewer.style.display = "block";

  // Hide others
  gifElement.style.display = "none";
  bgVideo.style.display = "none";
});

let drawingHistory = [];

function saveHistory() {
  drawingHistory.push(canvas.toDataURL());
  if (drawingHistory.length > 50) drawingHistory.shift(); // Limit memory usage
}
function drawLine(x, y) {
  if (!drawing) return;

  ctx.strokeStyle = eraser ? "#ffffff" : brushColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}
saveHistory();  // capture current state before drawing


const undoBtn = document.getElementById("undoBtn");
undoBtn.addEventListener("click", () => {
  if (drawingHistory.length > 0) {
    const lastImage = new Image();
    lastImage.src = drawingHistory.pop();
    lastImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(lastImage, 0, 0, canvas.width, canvas.height);
    };
  }
});

const testAssetBtn = document.getElementById("testAssetBtn");
testAssetBtn.addEventListener("click", () => {
  const typeOrder = ["images", "gifs", "videos", "glbs"];
  const currentType = typeOrder[assetIndex % typeOrder.length];

  switch (currentType) {
    case "images":
      const img = new Image();
      img.src = testAssets.images[0];
      img.onload = () => {
        ctx.drawImage(img, 50 * assetIndex, 50 * assetIndex, 200, 150); // shift each new image
      };
      break;
    case "gifs":
      gifElement.src = testAssets.gifs[0];
      gifElement.style.display = "block";
      break;
    case "videos":
      bgVideo.src = testAssets.videos[0];
      bgVideo.style.display = "block";
      bgVideo.play();
      break;
    case "glbs":
      modelViewer.src = testAssets.glbs[0];
      modelViewer.style.display = "block";
      break;
  }

  assetIndex++;
});
