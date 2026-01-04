import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Frontoffice from "./pages/Frontoffice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BackofficeAnimais from "./pages/BackofficeAnimais";
import { api } from "./services/api";

/**
 * Contexto de autenticação da aplicação.
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para acesso ao contexto de autenticação.
 */
export function useAuth() {
    return useContext(AuthContext);
}

/**
 * Provider responsável por gerir o estado de autenticação.
 */
function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Atualiza o utilizador autenticado
    async function refresh() {
        setLoading(true);
        try {
            const u = await api.whoami();
            setUser(u?.user ? u : null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    // Termina a sessão do utilizador
    async function logout() {
        try { await api.logout(); } catch {}
        await refresh();
    }

    // Verifica sessão ao iniciar a aplicação
    useEffect(() => { refresh(); }, []);

    return (
        <AuthContext.Provider value={{ user, isLogged: !!user?.user, loading, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Barra de navegação da aplicação.
 */
function NavBar() {
    const { user, isLogged, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    const location = useLocation();

    // Fecha o menu ao mudar de rota
    useEffect(() => { setOpen(false); }, [location.pathname]);
    

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container app-container">
                <Link className="navbar-brand" to="/">Adoção Animais</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="nav"
                    aria-expanded={open ? "true" : "false"}
                    aria-label="Toggle navigation"
                    onClick={() => setOpen(v => !v)}
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="nav">
                    <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>Frontoffice</NavLink>
                        </li>

                        {!isLogged && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login">Login</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register">Criar conta</NavLink>
                                </li>
                            </>
                        )}

                        {isLogged && (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/backoffice/animais">Backoffice</NavLink>
                                </li>
                                
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

/**
 * Rota protegida para utilizadores autenticados.
 */
function ProtectedRoute({ children }) {
    const { isLogged, loading } = useAuth();

    if (loading) {
        return (
            <div className="container app-container my-4">
                <div className="alert alert-light border mb-0">A verificar sessão…</div>
            </div>
        );
    }

    if (!isLogged) return <Login />;
    return children;
}

/**
 * Componente principal da aplicação.
 */
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <NavBar />
                <div className="container app-container my-4">
                    <Routes>
                        <Route path="/" element={<Frontoffice />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/backoffice/animais"
                            element={
                                <ProtectedRoute>
                                    <BackofficeAnimais />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}
