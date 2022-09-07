const canvas = document.querySelector("canvas"),
toolbtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtn = document.querySelectorAll(".colors .option"),
picker = document.querySelector("#color-picker"),
clear = document.querySelector(".clear-canvas"),
save = document.querySelector(".save-image"),
art = canvas.getContext("2d");

//global variables with default value
let prevMouseX, prevMouseY, snapshot,
isDrawing = false, 
selectedTool = "brush",
selectedColor = "#000",
brushWidth = 5;

const setCanvasBackground = () => {
    art.fillStyle = "#fff";
    art.fillRect(0, 0, canvas.width, canvas.height);
    art.fillStyle = selectedColor;
}

//follow the mouse pointer
window.addEventListener("load", () =>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    if(!fillColor.checked){
        return art.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    art.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    art.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))
    art.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? art.fill() : art.stroke();
}

const drawTriangle = (e) => {
    art.beginPath();
    art.moveTo(prevMouseX, prevMouseY);
    art.lineTo(e.offsetX, e.offsetY);
    art.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    art.closePath();
    fillColor.checked ? art.fill() : art.stroke();
}

const startDrawing = (e) => {
    isDrawing = true;
    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    art.beginPath(); //start a new path
    art.lineWidth = brushWidth; //passing the value of brushwidth to linewidth
    snapshot = art.getImageData(0, 0, canvas.width, canvas.height);
    art.strokeStyle = selectedColor;
    art.fillStyle = selectedColor;
}

const drawing = (e) => {
    if(!isDrawing) return; //if isDrawing is false return here
    art.putImageData(snapshot, 0, 0);
    if(selectedTool === "brush" || selectedTool === "eraser"){
        art.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        art.lineTo(e.offsetX, e.offsetY); // creating lines
        art.stroke(); //colors the line
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else{
        drawTriangle(e);
    }
    
}

toolbtns.forEach(btn => {
    btn.addEventListener("click", () =>{ //add click event to tools
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

picker.addEventListener("change", () => {
    picker.parentElement.style.background = picker.value;
    picker.parentElement.click();
});

clear.addEventListener("click", () => {
    art.clearRect(0, 0, canvas.width, canvas.height);
});

save.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});


canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mousemove", drawing);