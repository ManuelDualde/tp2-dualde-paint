// --------------------------------------------------
// Filtros avanzados — funciones puras sobre pixel data
// Reciben un Uint8ClampedArray y lo modifican in-place
// Los filtros de convolución también reciben width y height
// porque necesitan acceder a píxeles vecinos
// --------------------------------------------------


// --------------------------------------------------
// SATURACIÓN
// --------------------------------------------------
// La saturación mide qué tan "vivo" es un color.
// Técnica: interpolamos entre la versión gris del píxel
// y el color original usando un factor multiplicador.
//   factor = 0   → imagen en escala de grises
//   factor = 1   → imagen original sin cambios
//   factor > 1   → colores más intensos (hipersaturado)
//   factor < 1   → colores apagados
// --------------------------------------------------
function aplicarSaturacion(data, factor = 1.5) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculamos el brillo percibido del píxel (luminancia)
        // usando pesos estándar que reflejan la sensibilidad del ojo humano
        const gris = 0.299 * r + 0.587 * g + 0.114 * b;

        // Interpolamos: color_nuevo = gris + factor * (color_original - gris)
        // Si factor=1 → color_original. Si factor=0 → gris puro.
        data[i]     = Math.min(255, Math.max(0, gris + factor * (r - gris))); // R
        data[i + 1] = Math.min(255, Math.max(0, gris + factor * (g - gris))); // G
        data[i + 2] = Math.min(255, Math.max(0, gris + factor * (b - gris))); // B
    }
}


// --------------------------------------------------
// DETECCIÓN DE BORDES — Operador Sobel
// --------------------------------------------------
// El operador Sobel detecta cambios bruscos de intensidad
// (bordes) mediante dos kernels de convolución 3x3:
//
//   Gx (gradiente horizontal):     Gy (gradiente vertical):
//   -1  0  +1                      -1  -2  -1
//   -2  0  +2                       0   0   0
//   -1  0  +1                      +1  +2  +1
//
// Para cada píxel se calcula:
//   magnitud = √(Gx² + Gy²)
// Un valor alto indica un borde pronunciado.
// La función necesita width y height para navegar la grilla 2D.
// --------------------------------------------------
function aplicarDeteccionBordes(data, width, height) {
    // Trabajamos sobre una copia para no leer píxeles ya modificados
    const original = new Uint8ClampedArray(data);

    // Función auxiliar: devuelve la luminancia del píxel en (x, y)
    function luminancia(x, y) {
        const idx = (y * width + x) * 4;
        return 0.299 * original[idx] + 0.587 * original[idx + 1] + 0.114 * original[idx + 2];
    }

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {

            // Aplicamos el kernel Sobel-X (detecta bordes verticales)
            const gx =
                -1 * luminancia(x - 1, y - 1) + 1 * luminancia(x + 1, y - 1) +
                -2 * luminancia(x - 1, y)     + 2 * luminancia(x + 1, y) +
                -1 * luminancia(x - 1, y + 1) + 1 * luminancia(x + 1, y + 1);

            // Aplicamos el kernel Sobel-Y (detecta bordes horizontales)
            const gy =
                -1 * luminancia(x - 1, y - 1) + -2 * luminancia(x, y - 1) + -1 * luminancia(x + 1, y - 1) +
                 1 * luminancia(x - 1, y + 1) +  2 * luminancia(x, y + 1) +  1 * luminancia(x + 1, y + 1);

            // Magnitud del gradiente: cuánto cambia la imagen en ese punto
            const magnitud = Math.min(255, Math.sqrt(gx * gx + gy * gy));

            const idx = (y * width + x) * 4;
            data[idx]     = magnitud; // R
            data[idx + 1] = magnitud; // G
            data[idx + 2] = magnitud; // B
            // Los bordes de la imagen (fila/columna 0 y última) quedan en negro
        }
    }
}


// --------------------------------------------------
// BLUR — Desenfoque por promedio (Box Blur)
// --------------------------------------------------
// El blur suaviza la imagen promediando cada píxel
// con sus vecinos dentro de una ventana cuadrada.
//
// Para un radio r, la ventana tiene (2r+1) × (2r+1) píxeles.
// El nuevo valor de cada canal es el promedio de todos
// los píxeles dentro de esa ventana.
//
//   radio = 1 → ventana 3×3  (9 píxeles)
//   radio = 2 → ventana 5×5  (25 píxeles)
//   radio = 3 → ventana 7×7  (49 píxeles)
//
// A mayor radio, mayor desenfoque pero más costo de cómputo.
// --------------------------------------------------
function aplicarBlur(data, width, height, radio = 2) {
    // Trabajamos sobre una copia para no leer píxeles ya modificados
    const original = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let sumaR = 0, sumaG = 0, sumaB = 0;
            let cantidad = 0;

            // Recorremos la ventana de vecinos (radio × radio alrededor del píxel)
            for (let dy = -radio; dy <= radio; dy++) {
                for (let dx = -radio; dx <= radio; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;

                    // Solo consideramos píxeles que estén dentro de los límites
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const idx = (ny * width + nx) * 4;
                        sumaR += original[idx];
                        sumaG += original[idx + 1];
                        sumaB += original[idx + 2];
                        cantidad++;
                    }
                }
            }

            // Escribimos el promedio en el píxel actual
            const idx = (y * width + x) * 4;
            data[idx]     = sumaR / cantidad; // R
            data[idx + 1] = sumaG / cantidad; // G
            data[idx + 2] = sumaB / cantidad; // B
        }
    }
}
