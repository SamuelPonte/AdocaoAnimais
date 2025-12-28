import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const nav = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setErr("");
        try {
            await api.login(username, password);
            nav("/backoffice/animais");
        } catch (e2) {
            setErr("Login inválido.");
            console.error(e2);
        }
    }

    return (
        <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
            <h2>Backoffice — Login</h2>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Email / username"
                    style={{ padding: 10 }}
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    style={{ padding: 10 }}
                />
                <button type="submit">Entrar</button>
                {err && <div style={{ color: "crimson" }}>{err}</div>}
            </form>
        </div>
    );
}
