let isDrawing = false;
let lastX = 0;
let lastY = 0;

const colorPicker = document.getElementById('colorPicker');
const canvasColor = document.getElementById('canvasColor');
const canvas = document.getElementById('myCanvas');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const retrieveButton = document.getElementById('retrieveButton');
const fontSizePicker = document.getElementById('fontSizePicker');
const ctx = canvas.getContext('2d');

ctx.lineWidth = 5;
ctx.lineJoin = "round";
ctx.lineCap = "round";

// Set up color picker
colorPicker.addEventListener('change', (event) => {
    ctx.strokeStyle = event.target.value;
});

// Set up background color picker
canvasColor.addEventListener('change', (event) => {
    ctx.fillStyle = event.target.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// Resize canvas to fit screen
function resizeCanvas() {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);

    canvas.width = window.innerWidth * 0.9; // Adjust width
    canvas.height = window.innerHeight * 0.5; // Adjust height
    ctx.drawImage(tempCanvas, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Handle drawing events for both mouse and touch
function startDrawing(x, y) {
    isDrawing = true;
    lastX = x;
    lastY = y;
}

function draw(x, y) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

// Mouse Events
canvas.addEventListener("mousedown", (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener("mousemove", (e) => draw(e.offsetX, e.offsetY));
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);


canvas.addEventListener("touchstart", (e) => {
    const rect = canvas.getBoundingClientRect();
    startDrawing(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
});

canvas.addEventListener("touchmove", (e) => {
    const rect = canvas.getBoundingClientRect();
    draw(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    e.preventDefault(); 
});

canvas.addEventListener("touchend", stopDrawing);

// Font size picker
fontSizePicker.addEventListener('change', (event) => {
    ctx.lineWidth = event.target.value;
});

// Clear canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save and download canvas
saveButton.addEventListener('click', () => {
    localStorage.setItem('canvasContents', canvas.toDataURL());
    let link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Retrieve saved signature
retrieveButton.addEventListener('click', () => {
    let savedCanvas = localStorage.getItem('canvasContents');
    if (savedCanvas) {
        let img = new Image();
        img.src = savedCanvas;
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
});