export const ESPECIES = [
    "Cao", "Gato", "Coelho", "Cavalo", "Girrafa", "Ovelha", "Cabra", "Papagaio", "Outro"
];

export const PORTES = ["Pequeno", "Medio", "Grande"];
export const SEXOS = ["M", "F"];

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

export function labelOf(value) {
    return LABEL[value] ?? value ?? "";
}
