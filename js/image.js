
// Manejo de imagen y canvas

let cargaImagen = document.getElementById("cargaImagen");

let btnImageIni = document.getElementById("btn-imageIni");
let btnEscalaGrises = document.getElementById("btn-escalaGrises");
let btnNegativo = document.getElementById("btn-negativo");
let btnSepia = document.getElementById("btn-sepia");
let btnBinarizacion = document.getElementById("btn-binarizacion");
let btnPosterizacion = document.getElementById("btn-posterizacion");
let btnPixelado = document.getElementById("btn-pixelado");
let brilloSlider = document.getElementById("brillo-slider");

// Filtros avanzados
let btnSaturacion = document.getElementById("btn-saturacion");
let btnBordes = document.getElementById("btn-bordes");
let btnBlur = document.getElementById("btn-blur");

let imageDataOriginal = null; // ImageData de la imagen original, nunca se modifica
let img = new Image();

// Carga de imagen desde archivo

cargaImagen.addEventListener("change", function (e) {
    const archivo = e.target.files[0];
    if (!archivo) return;
    const lector = new FileReader();
    lector.onload = (evento) => {
        img.src = evento.target.result;
    };
    lector.readAsDataURL(archivo);
});

img.onload = () => {
    ctx.drawImage(img, 0, 0, img.width, img.height);
    imageDataOriginal = ctx.getImageData(0, 0, img.width, img.height); // Guardo original
};

// filtro sobre una copia de la imagen original

function aplicarFiltro(funcionFiltro, ...args) {
    if (!imageDataOriginal) return;

    const copia = new ImageData(
        new Uint8ClampedArray(imageDataOriginal.data),
        imageDataOriginal.width,
        imageDataOriginal.height
    );

    funcionFiltro(copia.data, ...args);
    ctx.putImageData(copia, 0, 0);
}

// Botones

btnImageIni.addEventListener("click", function () {
    if (!imageDataOriginal) return;
    ctx.putImageData(imageDataOriginal, 0, 0);
});

btnEscalaGrises.addEventListener("click", function () {
    aplicarFiltro(aplicarEscalaGrises);
});

btnNegativo.addEventListener("click", function () {
    aplicarFiltro(aplicarNegativo);
});

btnSepia.addEventListener("click", function () {
    aplicarFiltro(aplicarSepia);
});

btnBinarizacion.addEventListener("click", function () {
    aplicarFiltro(aplicarBinarizacion, 128); 
});

btnPosterizacion.addEventListener("click", function () {
    aplicarFiltro(aplicarPosterizacion, 4); // 4 niveles de color
});

// la barra va de 0 a 100, 50 es el valor original, 0 negro y 100 doble brillo
brilloSlider.addEventListener("input", function () {
    const factor = this.value / 50;
    aplicarFiltro(aplicarBrillo, factor);
});

btnPixelado.addEventListener("click", function () {
    if (!imageDataOriginal) return;
    aplicarFiltro(aplicarPixelado, imageDataOriginal.width, imageDataOriginal.height, 10); // bloques de 10px
});

// Botones de filtros avanzados

btnSaturacion.addEventListener("click", function () {
    aplicarFiltro(aplicarSaturacion, 1.5); // factor 1.5 = colores más vivos
});

btnBordes.addEventListener("click", function () {
    if (!imageDataOriginal) return;
    aplicarFiltro(aplicarDeteccionBordes, imageDataOriginal.width, imageDataOriginal.height);
});

btnBlur.addEventListener("click", function () {
    if (!imageDataOriginal) return;
    aplicarFiltro(aplicarBlur, imageDataOriginal.width, imageDataOriginal.height, 2); // radio 2
});
