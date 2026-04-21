// --------------------------------------------------
// Manejo de imagen y canvas
// --------------------------------------------------

let cargaImagen = document.getElementById("cargaImagen");

let btnImageIni = document.getElementById("btn-imageIni");
let btnEscalaGrises = document.getElementById("btn-escalaGrises");
let btnNegativo = document.getElementById("btn-negativo");
let btnSepia = document.getElementById("btn-sepia");
let btnBinarizacion = document.getElementById("btn-binarizacion");

let imageDataOriginal = null; // ImageData de la imagen original, nunca se modifica
let img = new Image();

// --------------------------------------------------
// Carga de imagen desde archivo
// --------------------------------------------------

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

// --------------------------------------------------
// Helper: aplica un filtro sobre una copia de la imagen original
// --------------------------------------------------

function aplicarFiltro(funcionFiltro, ...args) {
    if (!imageDataOriginal) return;

    // Clono los datos para no mutar la imagen original
    const copia = new ImageData(
        new Uint8ClampedArray(imageDataOriginal.data),
        imageDataOriginal.width,
        imageDataOriginal.height
    );

    funcionFiltro(copia.data, ...args);
    ctx.putImageData(copia, 0, 0);
}

// --------------------------------------------------
// Botones
// --------------------------------------------------

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
    aplicarFiltro(aplicarBinarizacion, 128); // umbral por defecto
});
