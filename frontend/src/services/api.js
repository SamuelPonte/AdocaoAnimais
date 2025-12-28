const BASE = ""; // mesmo domínio => vazio

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

export const api = {
    login: (username, password) =>
        request("/api/AutenticacaoApi/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
        }),
    whoami: () => request("/api/AutenticacaoApi/whoami"),
    logout: () => request("/api/AutenticacaoApi/logout", { method: "POST" }),

    listAnimais: () => request("/api/AnimaisApi"),
    createAnimal: (animal) =>
        request("/api/AnimaisApi", { method: "POST", body: JSON.stringify(animal) }),
    updateAnimal: (id, animal) =>
        request(`/api/AnimaisApi/${id}`, { method: "PUT", body: JSON.stringify(animal) }),
    deleteAnimal: (id) =>
        request(`/api/AnimaisApi/${id}`, { method: "DELETE" }),
};
