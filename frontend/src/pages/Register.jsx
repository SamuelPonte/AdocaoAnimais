import { useState } from "react";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

        const u = username.trim();
        if (!u) return setMsg("Indica um email/username.");
        if (password.length < 6) return setMsg("A password deve ter pelo menos 6 caracteres.");
        if (password !== password2) return setMsg("As passwords não coincidem.");

        try {
            await api.register(u, password);
            nav("/backoffice/animais");
        } catch (e2) {
            setMsg(`Erro no registo: ${e2.message}`);
            console.error(e2);
        }
    }

    return (
        <div className="auth">
            <div className="auth-hero p-4 p-md-5 rounded-4 mb-4">
                <h1 className="auth-title mb-2">Criar Conta</h1>
                <p className="auth-subtitle mb-0">
                    Regista-te para poderes introduzir animais e gerir apenas os teus registos.
                </p>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-md-7 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title mb-3">Registo</h4>

                            {msg && <div className="alert alert-warning py-2">{msg}</div>}

                            <form onSubmit={onSubmit} className="d-grid gap-3">
                                <div>
                                    <label className="form-label">Email / Username</label>
                                    <input
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="exemplo@ipt.pt"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Password</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="form-text">Mínimo 6 caracteres (podes ter regras extra no Identity).</div>
                                </div>

                                <div>
                                    <label className="form-label">Confirmar password</label>
                                    <input
                                        className="form-control"
                                        type="password"
                                        value={password2}
                                        onChange={(e) => setPassword2(e.target.value)}
                                        required
                                    />
                                </div>

                                <button className="btn btn-success" type="submit">
                                    Criar conta
                                </button>

                                <div className="text-muted small">
                                    Já tens conta? <Link to="/login">Voltar ao login</Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="text-muted small mt-3">
                        Se o teu backend estiver com confirmação de conta obrigatória, o login automático após registo pode não ocorrer.
                    </div>
                </div>
            </div>
        </div>
    );
}
