// Filtros avanzados
// Reciben un Uint8ClampedArray y lo modifican


// La saturación mide qué tan "vivo" es un color.
// se cambia entre la versión gris del píxel
// y el color original usando un factor multiplicador.
//   factor = 0   → imagen en escala de grises
//   factor = 1   → imagen original sin cambios
//   factor > 1   → colores más intensos
//   factor < 1   → colores apagados
function aplicarSaturacion(data, factor = 1.5) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculamos el brillo percibido del píxel (luminancia)
        const gris = 0.299 * r + 0.587 * g + 0.114 * b;

        // se cambia color_nuevo = gris + factor * (color_original - gris)
        data[i]     = Math.min(255, Math.max(0, gris + factor * (r - gris))); // R
        data[i + 1] = Math.min(255, Math.max(0, gris + factor * (g - gris))); // G
        data[i + 2] = Math.min(255, Math.max(0, gris + factor * (b - gris))); // B
    }
}



// Detecta cambios bruscos de intensidad
// Un valor alto indica un borde pronunciado.
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

            //detecta bordes verticales
            const gx =
                -1 * luminancia(x - 1, y - 1) + 1 * luminancia(x + 1, y - 1) +
                -2 * luminancia(x - 1, y)     + 2 * luminancia(x + 1, y) +
                -1 * luminancia(x - 1, y + 1) + 1 * luminancia(x + 1, y + 1);

            //detecta bordes horizontales
            const gy =
                -1 * luminancia(x - 1, y - 1) + -2 * luminancia(x, y - 1) + -1 * luminancia(x + 1, y - 1) +
                 1 * luminancia(x - 1, y + 1) +  2 * luminancia(x, y + 1) +  1 * luminancia(x + 1, y + 1);

            //cuánto cambia la imagen en ese punto
            const magnitud = Math.min(255, Math.sqrt(gx * gx + gy * gy));

            const idx = (y * width + x) * 4;
            data[idx]     = magnitud; // R
            data[idx + 1] = magnitud; // G
            data[idx + 2] = magnitud; // B
            // Los bordes de la imagen quedan en negro
        }
    }
}



// El blur suaviza la imagen promediando cada píxel
// con sus vecinos dentro de una ventana cuadrada.
function aplicarBlur(data, width, height, radio = 2) {
    // Trabajamos sobre una copia para no leer píxeles ya modificados
    const original = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            let sumaR = 0, sumaG = 0, sumaB = 0;
            let cantidad = 0;

            // Recorremos pixeles vecinos (radio × radio alrededor del píxel)
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
