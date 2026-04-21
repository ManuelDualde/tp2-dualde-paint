// --------------------------------------------------
// Programa principal
// --------------------------------------------------

let canvas = document.getElementById("lienzo");
let ctx = canvas.getContext("2d");

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let nroColor = document.getElementById("nroColor"); // Valor de color del input de rango
let grosorLapiz = document.getElementById("grosor-lapiz"); // Grosor lápiz
let grosorGoma = document.getElementById("grosor-goma"); // Grosor goma

// --------------------------------------------------
// comportamiento del mouse
// --------------------------------------------------
let mouseDown = false;
let pencilClicked = false;

let miLapiz = null;

canvas.addEventListener("mousedown", function (e) {
    mouseDown = true;
    if (pencilClicked) {
        let posX = e.offsetX;
        let posY = e.offsetY;
        miLapiz = new Pen(posX, posY, color, estilo);
        miLapiz.draw(ctx);
    }
}); // mousedown

canvas.addEventListener("mousemove", function (e) {
    if (mouseDown && pencilClicked && miLapiz != null) {
        let posX = e.offsetX;
        let posY = e.offsetY;
        miLapiz.moveTo(posX, posY);
        miLapiz.draw(ctx);
    }   
}); // mousemove

canvas.addEventListener("mouseup", function (e) {
    mouseDown = false;
}); // mouseup

// --------------------------------------------------
// comportamiento de los botones
// --------------------------------------------------
let botonLapiz = document.getElementById("btn-lapiz");
let botonGoma = document.getElementById("btn-goma");

botonLapiz.addEventListener("click", function () { // click sobre botón lápiz
    pencilClicked = true;
    color = nroColor.value;
    estilo = grosorLapiz.value;
}); // pencilButton click

botonGoma.addEventListener("click", function () { // click sobre botón goma
    pencilClicked = true;
    color = "white";
    estilo = grosorGoma.value;
}); // eraserButton click


function main() {
    
}
