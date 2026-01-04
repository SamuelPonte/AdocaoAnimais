/**
 * Lista de espécies suportadas no frontend.
 * @type {string[]}
 */
export const ESPECIES = [
    "Cao", "Gato", "Coelho", "Cavalo", "Girrafa", "Ovelha", "Cabra", "Papagaio", "Outro"
];

/**
 * Lista de portes suportados no frontend.
 * @type {string[]}
 */
export const PORTES = ["Pequeno", "Medio", "Grande"];

/**
 * Lista de sexos suportados no frontend.
 * @type {string[]}
 */
export const SEXOS = ["M", "F"];

/**
 * Mapa de valores internos para etiquetas apresentáveis ao utilizador.
 * @type {Record<string, string>}
 */
export const LABEL = {
    // espécies
    Cao: "Cão",
    Gato: "Gato",
    Coelho: "Coelho",
    Cavalo: "Cavalo",
    Girrafa: "Girrafa",
    Ovelha: "Ovelha",
    Cabra: "Cabra",
    Papagaio: "Papagaio",
    Outro: "Outro",

    // portes
    Pequeno: "Pequeno",
    Medio: "Médio",
    Grande: "Grande",

    // sexos
    M: "Macho",
    F: "Fêmea",
};

/**
 * Devolve a etiqueta legível associada a um valor interno.
 * Se não existir mapeamento, devolve o próprio valor (fallback).
 * @param {string} value
 * @returns {string}
 */
export function labelOf(value) {
    return LABEL[value] ?? value ?? "";
}
