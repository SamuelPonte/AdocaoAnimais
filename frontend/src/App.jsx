import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import Frontoffice from "./pages/Frontoffice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BackofficeAnimais from "./pages/BackofficeAnimais";

function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container app-container">
                <Link className="navbar-brand" to="/">Adopção Animais</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Frontoffice</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/register">Criar conta</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/backoffice/animais">Backoffice</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <div className="container app-container my-4">
                <Routes>
                    <Route path="/" element={<Frontoffice />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/backoffice/animais" element={<BackofficeAnimais />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

