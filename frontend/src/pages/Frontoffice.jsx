import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import "../styles/frontoffice.css";

function Modal({ title, children, onClose }) {
    // modal simples em React (não depende do JS do Bootstrap)
    return (
        <>
            <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
                        </div>
                        <div className="modal-body">{children}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" onClick={onClose} />
        </>
    );
}

export default function Frontoffice() {
    const [animais, setAnimais] = useState([]);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);

    // filtros
    const [fEspecie, setFEspecie] = useState("");
    const [fPorte, setFPorte] = useState("");
    const [fSexo, setFSexo] = useState("");

    // modal
    const [selected, setSelected] = useState(null);

    const pageSize = 9;

    useEffect(() => {
        api.listAnimais()
            .then(setAnimais)
            .catch((e) => console.error(e));
    }, []);

    const options = useMemo(() => {
        const norm = (s) => (s ?? "").toString().trim();
        const uniqSorted = (arr) =>
            [...new Set(arr.map(norm).filter(Boolean))].sort((a, b) => a.localeCompare(b));

        return {
            especies: uniqSorted(animais.map((a) => a.especie)),
            portes: uniqSorted(animais.map((a) => a.porte)),
            sexos: uniqSorted(animais.map((a) => a.sexo)),
        };
    }, [animais]);

    const filtrados = useMemo(() => {
        const term = q.trim().toLowerCase();

        return animais.filter((a) => {
            const okTexto =
                !term ||
                [a.nome, a.especie, a.raca, a.porte, a.sexo, a.descricao].some((v) =>
                    (v ?? "").toString().toLowerCase().includes(term)
                );

            const okEspecie = !fEspecie || (a.especie ?? "") === fEspecie;
            const okPorte = !fPorte || (a.porte ?? "") === fPorte;
            const okSexo = !fSexo || (a.sexo ?? "") === fSexo;

            return okTexto && okEspecie && okPorte && okSexo;
        });
    }, [animais, q, fEspecie, fPorte, fSexo]);

    const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
    const pageSafe = Math.min(Math.max(page, 1), totalPages);
    const inicio = (pageSafe - 1) * pageSize;
    const pagina = filtrados.slice(inicio, inicio + pageSize);

    useEffect(() => setPage(1), [q, fEspecie, fPorte, fSexo]);

    function limparFiltros() {
        setQ("");
        setFEspecie("");
        setFPorte("");
        setFSexo("");
    }

    function prev() {
        setPage((p) => Math.max(1, p - 1));
    }

    function next() {
        setPage((p) => Math.min(totalPages, p + 1));
    }

    return (
        <div className="frontoffice">
            {/* Hero */}
            <div className="frontoffice-hero p-4 p-md-5 rounded-4 mb-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-lg-7">
                        <h1 className="mb-2 frontoffice-title">Adopção de Animais</h1>
                        <p className="mb-0 frontoffice-subtitle">
                            Encontra o teu próximo companheiro.
                        </p>
                    </div>

                    <div className="col-12 col-lg-5">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text">🔎</span>
                            <input
                                className="form-control"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Pesquisar por nome, espécie, raça, porte..."
                                aria-label="Pesquisar"
                            />
                            {(q || fEspecie || fPorte || fSexo) && (
                                <button className="btn btn-outline-secondary" onClick={limparFiltros}>
                                    Limpar
                                </button>
                            )}
                        </div>

                        <div className="frontoffice-meta mt-2">
                            <span className="badge text-bg-light border">Total: {animais.length}</span>
                            <span className="badge text-bg-light border">Resultados: {filtrados.length}</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="row g-2 mt-3">
                    <div className="col-12 col-md-4">
                        <select className="form-select" value={fEspecie} onChange={(e) => setFEspecie(e.target.value)}>
                            <option value="">Todas as espécies</option>
                            {options.especies.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-4">
                        <select className="form-select" value={fPorte} onChange={(e) => setFPorte(e.target.value)}>
                            <option value="">Todos os portes</option>
                            {options.portes.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-4">
                        <select className="form-select" value={fSexo} onChange={(e) => setFSexo(e.target.value)}>
                            <option value="">Todos os sexos</option>
                            {options.sexos.map((x) => (
                                <option key={x} value={x}>{x}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Empty state */}
            {filtrados.length === 0 ? (
                <div className="alert alert-light border">
                    Não há animais a mostrar com a pesquisa/filtros atuais.
                </div>
            ) : (
                <>
                    {/* Grid */}
                    <div className="row g-3">
                        {pagina.map((a) => (
                            <div className="col-12 col-md-6 col-lg-4" key={a.id}>
                                <div className="card h-100 shadow-sm frontoffice-card">
                                    {a.foto ? (
                                        <img className="card-img-top frontoffice-img" src={a.foto} alt={a.nome} />
                                    ) : (
                                        <div className="frontoffice-noimg d-flex align-items-center justify-content-center">
                                            <span className="text-muted">Sem foto</span>
                                        </div>
                                    )}

                                    <div className="card-body">
                                        <div className="d-flex align-items-start justify-content-between gap-2">
                                            <h5 className="card-title mb-1">{a.nome ?? "—"}</h5>
                                            {a.especie && <span className="badge text-bg-primary">{a.especie}</span>}
                                        </div>

                                        <div className="text-muted small mb-2">
                                            {a.raca ? a.raca : "Raça não indicada"}
                                            {a.idade != null ? ` • ${a.idade} anos` : ""}
                                        </div>

                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            {a.porte && <span className="badge text-bg-light border">{a.porte}</span>}
                                            {a.sexo && <span className="badge text-bg-light border">{a.sexo}</span>}
                                        </div>

                                        {a.descricao && (
                                            <p className="card-text frontoffice-desc mb-0">{a.descricao}</p>
                                        )}
                                    </div>

                                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                                        <span className="text-muted small">ID: {a.id}</span>
                                        <button className="btn btn-outline-primary btn-sm" onClick={() => setSelected(a)}>
                                            Ver detalhes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mt-4">
                        <div className="text-muted">
                            Página <b>{pageSafe}</b> de <b>{totalPages}</b>
                        </div>

                        <div className="btn-group">
                            <button className="btn btn-outline-secondary" onClick={prev} disabled={pageSafe === 1}>
                                Anterior
                            </button>
                            <button className="btn btn-outline-secondary" onClick={next} disabled={pageSafe === totalPages}>
                                Seguinte
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modal */}
            {selected && (
                <Modal title={`Detalhes — ${selected.nome ?? "Animal"}`} onClose={() => setSelected(null)}>
                    <div className="row g-3">
                        <div className="col-12 col-md-5">
                            {selected.foto ? (
                                <img className="img-fluid rounded-3 border" src={selected.foto} alt={selected.nome} />
                            ) : (
                                <div className="frontoffice-modal-noimg d-flex align-items-center justify-content-center rounded-3 border">
                                    <span className="text-muted">Sem foto</span>
                                </div>
                            )}
                        </div>

                        <div className="col-12 col-md-7">
                            <div className="d-flex flex-wrap gap-2 mb-2">
                                {selected.especie && <span className="badge text-bg-primary">{selected.especie}</span>}
                                {selected.porte && <span className="badge text-bg-light border">{selected.porte}</span>}
                                {selected.sexo && <span className="badge text-bg-light border">{selected.sexo}</span>}
                                {selected.idade != null && <span className="badge text-bg-light border">{selected.idade} anos</span>}
                            </div>

                            <div className="mb-2">
                                <div className="text-muted small">Raça</div>
                                <div>{selected.raca ?? "—"}</div>
                            </div>

                            <div className="mb-2">
                                <div className="text-muted small">Descrição</div>
                                <div>{selected.descricao ?? "—"}</div>
                            </div>

                            <div className="mt-3 p-3 rounded-3 border bg-light">
                                <div className="fw-semibold">Contacto</div>
                                <div className="text-muted small">
                                    (exemplo) Dono/Responsável: <b>{selected.dono ?? "N/D"}</b>
                                </div>
                                <div className="text-muted small">
                                    Aqui podes depois colocar email/telefone quando tiveres na BD.
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
