const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushColor = "#000000";
let brushSize = 5;

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  if (event.touches) {
    const touch = event.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function startDrawing(event) {
  isDrawing = true;
  const { x, y } = getPointerPosition(event);
  lastX = x;
  lastY = y;
}

function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

function draw(event) {
  if (!isDrawing) return;
  event.preventDefault();
  const { x, y } = getPointerPosition(event);
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.strokeStyle = brushColor;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX = x;
  lastY = y;
}

canvas.addEventListener("mousedown", (event) => {
  saveCanvasState(); // Save state for mouse
  startDrawing(event);
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", (event) => {
  saveCanvasState(); // Save state for touch
  startDrawing(event);
});
canvas.addEventListener("touchmove", (event) => draw(event));
canvas.addEventListener("touchend", stopDrawing);

const brushSizeInput = document.getElementById("brushSize");
brushSizeInput.addEventListener("input", (event) => {
  brushSize = event.target.value;
});

const colorPickerSwatch = document.getElementById("colorPickerSwatch");
colorPickerSwatch.addEventListener("click", () => {
  const colorPicker = document.createElement("input");
  colorPicker.type = "color";
  colorPicker.value = brushColor;
  colorPicker.style.display = "none";
  document.body.appendChild(colorPicker);
  colorPicker.click();
  colorPicker.addEventListener("input", (event) => {
    brushColor = event.target.value;
    colorPickerSwatch.style.backgroundColor = brushColor;
  });
  colorPicker.addEventListener("blur", () => {
    document.body.removeChild(colorPicker);
  });
});

let undoStack = [];
function saveCanvasState() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 20) undoStack.shift();
}

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", () => {
  if (undoStack.length > 0) {
    const imageData = new Image();
    imageData.src = undoStack.pop();
    imageData.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imageData, 0, 0);
    };
  }
});

const clearCanvasButton = document.getElementById("clearCanvasButton");
clearCanvasButton.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  undoStack = [];
});

const themeToggleButton = document.getElementById("themeToggleButton");
themeToggleButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

const changelogButton = document.getElementById("changelogButton");
changelogButton.addEventListener("click", () => {
  window.location.href = "https://www.bacusmoa.com/artist";
});
