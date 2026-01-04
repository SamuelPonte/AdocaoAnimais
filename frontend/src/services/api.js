// Base da API (mesmo domínio)
const BASE = "";


/**
 * Função genérica para pedidos HTTP.
 * @param {string} path
 * @param {object} options
 * @returns {Promise<any|string|null>}
 */
async function request(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });

    if (res.status === 204) return null;

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${text}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    return res.text();
}

/**
 * Serviço de comunicação com a API backend.
 * @type {object}
 */
export const api = {
    /**
     * Autenticação
     * @param {string} username
     * @param {string} password
     * @returns {Promise<any>}
     */
    login: (username, password) =>
        request("/api/AutenticacaoApi/login", {
            method: "POST",
            body: JSON.stringify({
                Username: username,
                Password: password,
            }),
        }),
    /**
     * Registar utilizador
     * @param {string} username
     * @param {string} password
     * @returns {Promise<any>}
     */
    register: (username, password) =>
        request("/api/AutenticacaoApi/register", {
            method: "POST",
            body: JSON.stringify({
                Username: username,
                Password: password,
            }),
        }),

    /**
     * Saber quem sou eu
     * @returns {Promise<any>}
     */
    whoami: () => request("/api/AutenticacaoApi/whoami"),

    /**
     * Sair da sessão
     * @returns {Promise<any>}
     */
    logout: () => request("/api/AutenticacaoApi/logout", {
        method: "POST"
    }),
    
    /**
     * Animais
     * @returns {Promise<any[]>}
     */
    listAnimais: () => request("/api/AnimaisApi"),

    /**
     * Criar animal
     * @param {object} animal
     * @returns {Promise<any>}
     */
    createAnimal: (animal) =>
        request("/api/AnimaisApi", { 
            method: "POST",
            body: JSON.stringify({
                nome: animal.nome,
                especie: animal.especie,   // "Cao" etc
                raca: animal.raca,
                idade: animal.idade,
                sexo: animal.sexo,         // "M" ou "F"
                porte: animal.porte,       // "Medio" etc
                descricao: animal.descricao,
                foto: animal.foto
            }) 
        }),

    /**
     * Atualizar o animal criado
     * @param {number} id
     * @param {object} animal
     * @returns {Promise<any>}
     */
    updateAnimal: (id, animal) =>
        request(`/api/AnimaisApi/${id}`, { 
            method: "PUT", 
            body: JSON.stringify(animal) 
        }),

    /**
     * Eliminar o animal criado
     * @param {number} id
     * @returns {Promise<any>}
     */
    deleteAnimal: (id) =>
        request(`/api/AnimaisApi/${id}`, { 
            method: "DELETE" 
        }),
    
    /**
     * Likes
     * @returns {Promise<object>}
     */
    likesSummary: () => 
        request("/api/LikesApi/summary", { 
            credentials: "include" 
        }),
    
    /**
     * Dar o like 
     * @param {number} animalId
     * @returns {Promise<any>}
     */
    toggleLike: (animalId) => 
        request(`/api/LikesApi/toggle/${animalId}`, { 
            method: "POST", 
            credentials: "include" 
        }),

};
