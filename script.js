const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPickerSwatch = document.getElementById('colorPickerSwatch');
const clearCanvasButton = document.getElementById('clearCanvasButton');
const undoButton = document.getElementById('undoButton');
const brushSizeInput = document.getElementById('brushSize');

let isDrawing = false;
let brushColor = '#000000';
let brushSize = 5;
let actions = []; // Stores complete strokes
let currentStroke = [];
let canvasRect;

// Adjust canvas resolution to match its CSS size
function resizeCanvas() {
  const style = getComputedStyle(canvas);
  const width = parseFloat(style.width); // Get CSS width
  const height = parseFloat(style.height); // Get CSS height

  canvas.width = width; // Set internal resolution
  canvas.height = height;
  canvasRect = canvas.getBoundingClientRect(); // Update bounding rectangle
  redrawCanvas(); // Redraw canvas to match new resolution
}

// Redraw the entire canvas based on the `actions` array
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actions.forEach(stroke => {
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.beginPath();
    stroke.lines.forEach((line, index) => {
      if (index === 0) {
        ctx.moveTo(line.startX, line.startY);
      }
      ctx.lineTo(line.endX, line.endY);
      ctx.stroke();
    });
  });
}

// Clear the canvas and reset actions
clearCanvasButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  actions = [];
});

// Undo the last stroke
undoButton.addEventListener('click', () => {
  actions.pop(); // Remove the last stroke
  redrawCanvas(); // Redraw the canvas
});

// Change brush size
brushSizeInput.addEventListener('input', (e) => {
  brushSize = e.target.value;
});

// Color picker
colorPickerSwatch.style.backgroundColor = brushColor;
colorPickerSwatch.addEventListener('click', () => {
  const input = document.createElement('input');
  input.type = 'color';
  input.style.opacity = '0';
  input.addEventListener('input', (e) => {
    brushColor = e.target.value;
    colorPickerSwatch.style.backgroundColor = brushColor;
  });
  input.click();
  input.remove();
});

// Handle drawing
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  currentStroke = { color: brushColor, size: brushSize, lines: [] };

  const startX = e.clientX - canvasRect.left;
  const startY = e.clientY - canvasRect.top;
  currentStroke.lines.push({ startX, startY, endX: startX, endY: startY });
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;

  const endX = e.clientX - canvasRect.left;
  const endY = e.clientY - canvasRect.top;
  const lastLine = currentStroke.lines[currentStroke.lines.length - 1];

  ctx.beginPath();
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.moveTo(lastLine.endX, lastLine.endY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  currentStroke.lines.push({ startX: lastLine.endX, startY: lastLine.endY, endX, endY });
});

// Toggle theme functionality
document.getElementById('themeToggleButton').addEventListener('click', function () {
  // Toggle dark class on the body element
  document.body.classList.toggle('dark');
});

// Changelog button functionality
document.getElementById('changelogButton').addEventListener('click', function () {
  // Open changelog in a new tab
  window.open('https://www.bacusmoa.com/artist', '_blank');
});


canvas.addEventListener('mouseup', () => {
  if (isDrawing) {
    actions.push(currentStroke);
    currentStroke = [];
  }
  isDrawing = false;
});

canvas.addEventListener('mouseout', () => {
  if (isDrawing) {
    actions.push(currentStroke);
    currentStroke = [];
  }
  isDrawing = false;
});

// Resize canvas on window resize
window.addEventListener('resize', resizeCanvas);

// Initialize canvas size
resizeCanvas();
