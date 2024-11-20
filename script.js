const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let brushSize = document.getElementById('brushSize').value;
let brushColor = '#000000'; // Default color
let actions = []; // Stack to store all actions
let currentPath = []; // Stores the current drawing path

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width; // Match the CSS width
  canvas.height = rect.height; // Match the CSS height
}

resizeCanvas();

canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  currentPath = [];
  addPoint(e);
});

canvas.addEventListener('mouseup', () => {
  drawing = false;
  if (currentPath.length > 0) {
    actions.push([...currentPath]); // Save the current path to actions stack
  }
  ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function addPoint(event) {
  const { x, y } = getMousePos(event);
  currentPath.push({ x, y, color: brushColor, size: brushSize });
}

function draw(event) {
  if (!drawing) return;
  addPoint(event);

  const { x, y } = currentPath[currentPath.length - 1];
  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  if (currentPath.length > 1) {
    const { x: prevX, y: prevY } = currentPath[currentPath.length - 2];
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = e.target.value;
});

document.getElementById('colorPickerSwatch').addEventListener('click', () => {
  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';
  colorPicker.style.display = 'none';
  colorPicker.addEventListener('change', (e) => {
    brushColor = e.target.value;
    colorPicker.remove();
  });
  document.body.appendChild(colorPicker);
  colorPicker.click();
});

document.getElementById('clearCanvasButton').addEventListener('click', () => {
  actions = []; // Clear all actions
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('themeToggleButton').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.getElementById('changelogButton').addEventListener('click', () => {
  window.open('https://changelogs.bacusmoa.com', '_blank');
});

document.getElementById('undoButton').addEventListener('click', () => {
  actions.pop(); // Remove the last action
  redrawCanvas();
});

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const path of actions) {
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
      const { x, y, color, size } = path[i];
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  }
}

window.addEventListener('resize', () => {
  const prevActions = [...actions];
  resizeCanvas();
  actions = prevActions; // Reapply saved actions after resizing
  redrawCanvas();
});
