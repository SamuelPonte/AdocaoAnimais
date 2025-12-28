import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Frontoffice from "./pages/Frontoffice";
import Login from "./pages/Login";
import BackofficeAnimais from "./pages/BackofficeAnimais";

export default function App() {
    return (
        <BrowserRouter>
            <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 12 }}>
                    <Link to="/">Frontoffice</Link>
                    <Link to="/login">Backoffice</Link>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Frontoffice />} />
                <Route path="/login" element={<Login />} />
                <Route path="/backoffice/animais" element={<BackofficeAnimais />} />
            </Routes>
        </BrowserRouter>
    );
}

