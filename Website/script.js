const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let brushSize = document.getElementById('brushSize').value;
let brushColor = document.getElementById('colorPicker').value;

// Resize the canvas based on the screen size
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;  // 80% of window width
  canvas.height = window.innerHeight * 0.6;  // 60% of window height
}

resizeCanvas(); // Initial resize

// Mouse and touch event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', drawTouch);

// Brush size and color event listeners
document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = e.target.value;
});

document.getElementById('colorPicker').addEventListener('input', (e) => {
  brushColor = e.target.value;
});

// Clear canvas event listener
document.getElementById('clearCanvasButton').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Theme toggle event listener
document.getElementById('themeToggleButton').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Changelog button event listener
document.getElementById('changelogButton').addEventListener('click', () => {
  window.open('https://yourwebsite.com/changelog', '_blank');
});

function startDrawing(e) {
  drawing = true;
  draw(e);
}

function stopDrawing() {
  drawing = false;
  ctx.beginPath();
}

// Draw function for mouse events
function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect(); // Get canvas position relative to viewport
  const mouseX = e.clientX - rect.left; // Get mouse X relative to canvas
  const mouseY = e.clientY - rect.top;  // Get mouse Y relative to canvas

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  // Draw line from the last position to the current position
  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.beginPath(); // Start a new path to continue drawing
  ctx.moveTo(mouseX, mouseY); // Move the path to the current mouse position
}

// Draw function for touch events
function drawTouch(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect(); // Get canvas position relative to viewport
  const touch = e.touches[0];
  const touchX = touch.clientX - rect.left; // Get touch X relative to canvas
  const touchY = touch.clientY - rect.top;  // Get touch Y relative to canvas

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  // Draw line from the last position to the current position
  ctx.lineTo(touchX, touchY);
  ctx.stroke();
  ctx.beginPath(); // Start a new path to continue drawing
  ctx.moveTo(touchX, touchY); // Move the path to the current touch position
}

// Resize the canvas whenever the window is resized
window.addEventListener('resize', resizeCanvas);
