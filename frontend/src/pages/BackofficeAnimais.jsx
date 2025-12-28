import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const vazio = {
    id: 0,
    nome: "",
    especie: "",
    raca: "",
    idade: 0,
    sexo: "",
    porte: "",
    descricao: "",
    foto: "",
};

export default function BackofficeAnimais() {
    const nav = useNavigate();
    const [user, setUser] = useState(null);
    const [animais, setAnimais] = useState([]);
    const [form, setForm] = useState(vazio);
    const [msg, setMsg] = useState("");

    async function load() {
        const a = await api.listAnimais();
        setAnimais(a);
    }

    useEffect(() => {
        api.whoami()
            .then((u) => setUser(u))
            .catch(() => nav("/login"));
    }, [nav]);

    useEffect(() => {
        if (user) load().catch(console.error);
    }, [user]);

    const meus = useMemo(() => {
        const me = user?.user;
        if (!me) return [];
        return animais.filter((a) => a.dono === me);
    }, [animais, user]);

    function setField(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    async function criar(e) {
        e.preventDefault();
        setMsg("");
        try {
            await api.createAnimal(form);
            setForm(vazio);
            await load();
            setMsg("Animal criado com sucesso.");
        } catch (e2) {
            setMsg("Erro a criar (precisas de estar autenticado).");
            console.error(e2);
        }
    }

    async function editar(a) {
        setMsg("");
        setForm(a);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function guardar(e) {
        e.preventDefault();
        setMsg("");
        try {
            await api.updateAnimal(form.id, form);
            setForm(vazio);
            await load();
            setMsg("Alterações guardadas.");
        } catch (e2) {
            setMsg("Não tens permissões para editar este animal.");
            console.error(e2);
        }
    }

    async function apagar(id) {
        if (!confirm("Apagar este animal?")) return;
        setMsg("");
        try {
            await api.deleteAnimal(id);
            await load();
            setMsg("Animal apagado.");
        } catch (e2) {
            setMsg("Não tens permissões para apagar este animal.");
            console.error(e2);
        }
    }

    async function sair() {
        try { await api.logout(); } catch {}
        nav("/login");
    }

    return (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <h2>Backoffice — Animais</h2>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ color: "#444" }}>{user?.user}</span>
                    <button onClick={sair}>Logout</button>
                </div>
            </div>

            {msg && <div style={{ marginBottom: 12 }}>{msg}</div>}

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 18,
                    background: "white",
                }}
            >
                <h3 style={{ marginTop: 0 }}>{form.id ? "Editar Animal" : "Criar Animal"}</h3>

                <form onSubmit={form.id ? guardar : criar} style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                        <input value={form.nome} onChange={(e) => setField("nome", e.target.value)} placeholder="Nome" />
                        <input value={form.especie} onChange={(e) => setField("especie", e.target.value)} placeholder="Espécie" />
                        <input value={form.raca} onChange={(e) => setField("raca", e.target.value)} placeholder="Raça" />
                        <input
                            value={form.idade}
                            onChange={(e) => setField("idade", Number(e.target.value))}
                            placeholder="Idade"
                            type="number"
                            min="0"
                        />
                        <input value={form.sexo} onChange={(e) => setField("sexo", e.target.value)} placeholder="Sexo" />
                        <input value={form.porte} onChange={(e) => setField("porte", e.target.value)} placeholder="Porte" />
                    </div>

                    <input value={form.foto} onChange={(e) => setField("foto", e.target.value)} placeholder="URL da Foto" />

                    <textarea
                        value={form.descricao}
                        onChange={(e) => setField("descricao", e.target.value)}
                        placeholder="Descrição"
                        rows={3}
                    />

                    <div style={{ display: "flex", gap: 10 }}>
                        <button type="submit">{form.id ? "Guardar" : "Criar"}</button>
                        {form.id ? <button type="button" onClick={() => setForm(vazio)}>Cancelar</button> : null}
                    </div>
                </form>
            </div>

            <h3>Os meus animais</h3>

            <div style={{ display: "grid", gap: 12 }}>
                {meus.map((a) => (
                    <div
                        key={a.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: 12,
                            padding: 12,
                            background: "white",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            flexWrap: "wrap",
                        }}
                    >
                        <div style={{ minWidth: 240 }}>
                            <b>{a.nome}</b> — {a.especie} {a.raca ? `(${a.raca})` : ""}
                            <div style={{ color: "#555", fontSize: 14 }}>Idade: {a.idade ?? "-"}</div>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => editar(a)}>Editar</button>
                            <button onClick={() => apagar(a.id)}>Apagar</button>
                        </div>
                    </div>
                ))}

                {meus.length === 0 && <div style={{ color: "#666" }}>Ainda não criaste animais.</div>}
            </div>
        </div>
    );
}
