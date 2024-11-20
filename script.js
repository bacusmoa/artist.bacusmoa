const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let brushSize = document.getElementById('brushSize').value;
let brushColor = '#000000';
const drawingHistory = [];
let undoIndex = -1;

function resizeCanvas() {
  const newWidth = window.innerWidth * 0.6;
  const newHeight = window.innerHeight * 0.6;

  canvas.width = newWidth;
  canvas.height = newHeight;

  if (drawingHistory.length > 0) {
    redrawCanvas();
  }
}

resizeCanvas();

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', drawTouch);

document.getElementById('brushSize').addEventListener('input', (e) => {
  brushSize = e.target.value;
});

document.getElementById('clearCanvasButton').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawingHistory.length = 0;
  undoIndex = -1;
});

document.getElementById('themeToggleButton').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.getElementById('changelogButton').addEventListener('click', () => {
  window.open('https://yourwebsite.com/changelog', '_blank');
});

document.getElementById('undoButton').addEventListener('click', undoLastAction);

const colorPickerSwatch = document.getElementById('colorPickerSwatch');

colorPickerSwatch.addEventListener('click', () => {
  const colorPicker = document.createElement('input');
  colorPicker.setAttribute('type', 'color');
  colorPicker.setAttribute('style', 'position: absolute; visibility: hidden;');
  document.body.appendChild(colorPicker);

  colorPicker.click();

  colorPicker.addEventListener('input', (e) => {
    brushColor = e.target.value;
    colorPickerSwatch.style.backgroundColor = brushColor;
  });

  colorPicker.addEventListener('change', () => {
    document.body.removeChild(colorPicker);
  });

  colorPicker.addEventListener('blur', () => {
    document.body.removeChild(colorPicker);
  });
});

function startDrawing(e) {
  drawing = true;
  ctx.beginPath();
  draw(e);
}

function stopDrawing() {
  if (drawing) {
    drawingHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    undoIndex++;
  }
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  ctx.lineTo(mouseX, mouseY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mouseX, mouseY);
}

function drawTouch(e) {
  if (!drawing) return;

  const touch = e.touches[0];
  const touchX = touch.clientX - canvas.getBoundingClientRect().left;
  const touchY = touch.clientY - canvas.getBoundingClientRect().top;

  ctx.lineWidth = brushSize;
  ctx.lineCap = 'round';
  ctx.strokeStyle = brushColor;

  ctx.lineTo(touchX, touchY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(touchX, touchY);
}

function undoLastAction() {
  if (undoIndex > 0) {
    undoIndex--;
    ctx.putImageData(drawingHistory[undoIndex], 0, 0);
  } else if (undoIndex === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undoIndex--;
  }
}

function redrawCanvas() {
  if (undoIndex >= 0) {
    ctx.putImageData(drawingHistory[undoIndex], 0, 0);
  }
}

window.addEventListener('resize', resizeCanvas);
