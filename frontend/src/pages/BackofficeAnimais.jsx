import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/backoffice-animais.css";
import { useAuth } from "../App";
import { ESPECIES, PORTES, SEXOS, labelOf } from "../constants/enums";


const vazio = {
    id: 0,
    nome: "",
    especie: "",
    raca: "",
    idade: 0,
    sexo: "",
    porte: "",
    descricao: "",
    foto: ""
};

export default function BackofficeAnimais() {
    const nav = useNavigate();
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [animais, setAnimais] = useState([]);
    const [form, setForm] = useState(vazio);
    const [msg, setMsg] = useState("");

    const RACAS_POR_ESPECIE = {
        Cao: ["SRD", "Labrador", "PastorAlemao", "Bulldog", "Outro"],
        Gato: ["SRD", "Persa", "Siamês", "MaineCoon", "Outro"],
        Coelho: ["Anão", "Belier", "Outro"],
        Cavalo : ["Árabe", "Frísio", "Gypsy Vanner", "Outro"],
        Girrafa : ["Girafa-Masai", "Girafa-Reticulada", "Outro"],
        Ovelha : ["Dorper","Merino","Suffolk", "Outro"],
        Cabra : ["Serrana","Saanen", "Outro"],
        Papagaio : ["Curica", "Araras", "Outro"],
        Outro: ["Outro"]
    };

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
            setMsg(`Erro a criar: ${e2.message}`);
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
            setMsg(`Erro a guardar: ${e2.message}`);
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
            setMsg(`Erro a guardar: ${e2.message}`);
            console.error(e2);
        }
    }

    async function sair() {
        await logout();    
        nav("/login");
    }

    const isEditing = !!form.id;

    return (
        <div className="container app-container my-4 backoffice-animais">
            {/* Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                    <h2 className="mb-1">Backoffice</h2>
                    <div className="text-muted small">Gestão de animais</div>
                </div>

                <div className="d-flex align-items-center gap-2">
          <span className="badge text-bg-light border backoffice-user">
            {user?.user ?? "—"}
          </span>
                    <button className="btn btn-outline-danger btn-sm" onClick={sair}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Message */}
            {msg && (
                <div className="alert alert-info py-2" role="alert">
                    {msg}
                </div>
            )}

            {/* Form card */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <h5 className="mb-0">{isEditing ? "Editar Animal" : "Criar Animal"}</h5>
                        {isEditing && (
                            <span className="badge text-bg-warning">Modo edição</span>
                        )}
                    </div>
                </div>

                <div className="card-body">
                    <form onSubmit={isEditing ? guardar : criar} className="row g-3">
                        <div className="col-12 col-md-4">
                            <label className="form-label">Nome</label>
                            <input
                                className="form-control"
                                value={form.nome}
                                onChange={(e) => setField("nome", e.target.value)}
                                placeholder="Ex.: Luna"
                                required
                            />
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label">Espécie</label>
                            <select
                                className="form-select"
                                value={form.especie}
                                onChange={(e) => {
                                    const esp = e.target.value;
                                    setField("especie", esp);

                                    // reset da raça se mudar de espécie
                                    const racas = RACAS_POR_ESPECIE[esp] ?? [];
                                    if (!racas.includes(form.raca)) {
                                        setField("raca", "");
                                    }
                                }}
                                required
                            >
                                <option value="">Seleciona a espécie</option>
                                {ESPECIES.map(x => (
                                    <option key={x} value={x}>{labelOf(x)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-4">
                            <label className="form-label">Raça</label>
                            <select
                                className="form-select"
                                value={form.raca}
                                onChange={(e) => setField("raca", e.target.value)}
                                disabled={!form.especie}
                            >
                                <option value="">
                                    {form.especie ? "Seleciona a raça" : "Escolhe primeiro a espécie"}
                                </option>
                                {(RACAS_POR_ESPECIE[form.especie] ?? []).map(x => (
                                    <option key={x} value={x}>{labelOf(x)}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-6 col-md-3">
                            <label className="form-label">Idade</label>
                            <input
                                className="form-control"
                                type="number"
                                min="0"
                                value={form.idade}
                                onChange={(e) => setField("idade", Number(e.target.value))}
                            />
                        </div>

                        <div className="col-6 col-md-3">
                            <label className="form-label">Sexo</label>
                            <select
                                className="form-select"
                                value={form.sexo}
                                onChange={(e) => setField("sexo", e.target.value)}
                                required
                            >
                                <option value="">Seleciona o sexo</option>
                                {SEXOS.map(x => (
                                    <option key={x} value={x}>{labelOf(x)}</option>
                                ))}
                            </select>

                        </div>

                        <div className="col-12 col-md-6">
                            <label className="form-label">Porte</label>
                            <select
                                className="form-select"
                                value={form.porte}
                                onChange={(e) => setField("porte", e.target.value)}
                                required
                            >
                                <option value="">Seleciona o porte</option>
                                {PORTES.map(x => (
                                    <option key={x} value={x}>{x}</option>
                                ))}
                            </select>

                        </div>

                        <div className="col-12">
                            <label className="form-label">URL da Foto</label>
                            <input
                                className="form-control"
                                value={form.foto}
                                onChange={(e) => setField("foto", e.target.value)}
                                placeholder="https://..."
                            />
                            <div className="form-text">
                                Dica: usa uma imagem pública (URL) para aparecer no frontoffice.
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={form.descricao}
                                onChange={(e) => setField("descricao", e.target.value)}
                                placeholder="Personalidade, necessidades, etc."
                            />
                        </div>

                        <div className="col-12 d-flex flex-wrap gap-2">
                            <button className={`btn ${isEditing ? "btn-primary" : "btn-success"}`} type="submit">
                                {isEditing ? "Guardar" : "Criar"}
                            </button>

                            {isEditing && (
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setForm(vazio)}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* List */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                <h4 className="mb-0">Os meus animais</h4>
                <span className="badge text-bg-secondary">{meus.length}</span>
            </div>

            {meus.length === 0 ? (
                <div className="alert alert-light border">
                    Ainda não criaste animais.
                </div>
            ) : (
                <div className="row g-3">
                    {meus.map((a) => (
                        <div className="col-12 col-md-6 col-lg-4" key={a.id}>
                            <div className="card h-100 shadow-sm">
                                {a.foto ? (
                                    <img className="card-img-top" src={a.foto} alt={a.nome} />
                                ) : (
                                    <div className="card-img-top backoffice-noimg d-flex align-items-center justify-content-center">
                                        <span className="text-muted">Sem foto</span>
                                    </div>
                                )}

                                <div className="card-body">
                                    <h5 className="card-title mb-1">{a.nome}</h5>
                                    <div className="text-muted small mb-2">
                                        {a.especie}{a.raca ? ` • ${a.raca}` : ""}{a.idade != null ? ` • ${a.idade} anos` : ""}
                                    </div>

                                    {a.descricao && (
                                        <p className="card-text backoffice-desc">
                                            {a.descricao}
                                        </p>
                                    )}
                                </div>

                                <div className="card-footer bg-white d-flex gap-2">
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => editar(a)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => apagar(a.id)}>
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}
