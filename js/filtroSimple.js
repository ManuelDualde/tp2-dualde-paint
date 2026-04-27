// --------------------------------------------------
// Filtros simples — funciones puras sobre pixel data
// Reciben un Uint8ClampedArray y lo modifican in-place
// --------------------------------------------------

function aplicarEscalaGrises(data) {
    for (let i = 0; i < data.length; i += 4) {
        const promedio = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i]     = promedio; // R
        data[i + 1] = promedio; // G
        data[i + 2] = promedio; // B
        // data[i + 3] = alpha, no se toca
    }
}

function aplicarNegativo(data) {
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
    }
}

function aplicarSepia(data) {
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i]     = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189)); // R
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168)); // G
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131)); // B
    }
}

function aplicarBinarizacion(data, umbral = 128) {
    for (let i = 0; i < data.length; i += 4) {
        const promedio = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const valor = promedio >= umbral ? 255 : 0;
        data[i]     = valor; // R
        data[i + 1] = valor; // G
        data[i + 2] = valor; // B
    }
}

// --------------------------------------------------
// BRILLO
// --------------------------------------------------
// factor = 0   → imagen completamente negra
// factor = 1   → imagen original sin cambios
// factor > 1   → imagen más brillante (hasta 2×)
// --------------------------------------------------
function aplicarBrillo(data, factor = 1) {
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.min(255, data[i]     * factor); // R
        data[i + 1] = Math.min(255, data[i + 1] * factor); // G
        data[i + 2] = Math.min(255, data[i + 2] * factor); // B
    }
}

// --------------------------------------------------
// POSTERIZACIÓN
// --------------------------------------------------
// Reduce la cantidad de colores posibles a "niveles" escalones.
// Ejemplo: niveles=4 → cada canal solo puede tomar los valores
// 0, 85, 170 o 255 (cuatro pasos uniformes).
// Produce un efecto de ilustración o cartel.
// --------------------------------------------------
function aplicarPosterizacion(data, niveles = 4) {
    const paso = 255 / (niveles - 1);
    for (let i = 0; i < data.length; i += 4) {
        data[i]     = Math.round(data[i]     / paso) * paso; // R
        data[i + 1] = Math.round(data[i + 1] / paso) * paso; // G
        data[i + 2] = Math.round(data[i + 2] / paso) * paso; // B
    }
}