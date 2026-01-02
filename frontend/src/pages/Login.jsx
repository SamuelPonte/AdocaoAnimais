import { useState } from "react";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useAuth } from "../App";

export default function Login() {
    const nav = useNavigate();
    const { refresh } = useAuth()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");

        try {
            await api.login(username.trim(), password);
            await refresh();
            nav("/backoffice/animais");
        } catch (e2) {
            // setMsg(`Login inválido: ${e2.message}`);
            setMsg('Email ou Password incorreta');
            console.error(e2);
        }
    }

    return (
        <div className="auth">
            <div className="row justify-content-center">
                <div className="col-12 col-md-7 col-lg-5">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title mb-3">Login</h4>

                            {msg && <div className="alert alert-warning py-2">{msg}</div>}

                            <form onSubmit={onSubmit} className="d-grid gap-3">
                                <div>
                                    <label className="form-label">Email</label>
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
                                </div>

                                <button className="btn btn-primary" type="submit">
                                    Entrar
                                </button>

                                <div className="text-muted small">
                                    Ainda não tens conta? <Link to="/register">Criar conta</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
