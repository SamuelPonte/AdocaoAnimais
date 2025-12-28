import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export default function Frontoffice() {
    const [animais, setAnimais] = useState([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;

    useEffect(() => {
        api.listAnimais()
            .then(setAnimais)
            .catch((e) => console.error(e));
    }, []);

    const filtrados = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return animais;
        return animais.filter((a) =>
            [a.nome, a.especie, a.raca, a.descricao].some((v) =>
                (v ?? "").toLowerCase().includes(term)
            )
        );
    }, [animais, q]);

    const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
    const pageSafe = Math.min(Math.max(page, 1), totalPages);
    const inicio = (pageSafe - 1) * pageSize;
    const pagina = filtrados.slice(inicio, inicio + pageSize);

    useEffect(() => setPage(1), [q]);

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
            <h1>Adopção de Animais</h1>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Pesquisar por nome, espécie, raça..."
                    style={{ flex: "1 1 280px", padding: 10 }}
                />
            </div>

            <div
                style={{
                    display: "grid",
                    gap: 12,
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                }}
            >
                {pagina.map((a) => (
                    <div
                        key={a.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "white",
                        }}
                    >
                        <div style={{ height: 160, background: "#f4f4f4" }}>
                            {a.foto ? (
                                <img
                                    src={a.foto}
                                    alt={a.nome}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{ padding: 12, color: "#666" }}>Sem foto</div>
                            )}
                        </div>

                        <div style={{ padding: 12 }}>
                            <h3 style={{ margin: "0 0 6px" }}>{a.nome}</h3>
                            <div style={{ color: "#444", fontSize: 14 }}>
                                <div><b>Espécie:</b> {a.especie ?? "-"}</div>
                                <div><b>Raça:</b> {a.raca ?? "-"}</div>
                                <div><b>Idade:</b> {a.idade ?? "-"}</div>
                            </div>

                            {a.descricao && (
                                <p style={{ marginTop: 10, color: "#333" }}>
                                    {a.descricao}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 18 }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe === 1}>
                    Anterior
                </button>
                <div style={{ alignSelf: "center" }}>
                    Página {pageSafe} / {totalPages}
                </div>
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={pageSafe === totalPages}
                >
                    Seguinte
                </button>
            </div>
        </div>
    );
}
