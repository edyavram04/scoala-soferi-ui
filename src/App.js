import React from 'react';
import './App.css';
// 1. Importă uneltele de care avem nevoie de la React Router
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// 2. Importă componentele noastre (paginile)
import LoginForm from './components/LoginForm';
import EleviPage from "./pages/EleviPage";
import ElevFormPage from './pages/ElevFormPage';


// 3. Creează o componentă Meniu (deocamdată simplă)
function MeniuPrincipal() {
    return (
        <div>
            <h1>Meniu Principal (Pagina Protejată)</h1>
            <p>Ai reușit să te loghezi!</p>
            <nav>
                <ul>
                    <li>
                        {/* Adaugă un Link React (nu un <a>) */}
                        <Link to="/elevi">Gestionează Elevi</Link>
                    </li>
                    {/* Aici vei adăuga link-uri noi */}
                    <li><Link to="/instructori">Gestionează Instructori</Link></li>
                    <li><Link to="/masini">Gestionează Mașini</Link></li>
                </ul>
            </nav>
        </div>
    );
}
// 4. Creează o componentă Login
function PaginaLogin() {
    return (
        <div className="App">
            <LoginForm />
        </div>
    );
}

// 5. Acesta devine "Harta" principală a aplicației
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<PaginaLogin />} />
                <Route path="/meniu" element={<MeniuPrincipal />} />

                <Route path="/elevi" element={<EleviPage />} />

                {/* 2. ADaugă RUTA NOUĂ PENTRU FORMULAR */}
                <Route path="/elevi/nou" element={<ElevFormPage />} />
                <Route path="/elevi/edit/:id" element={<ElevFormPage />} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;