import React from 'react';
import './App.css';
// 1. Importă uneltele de care avem nevoie de la React Router
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// 2. Importă componentele noastre (paginile)
import LoginForm from './components/LoginForm';
import EleviPage from "./pages/EleviPage";
import ElevFormPage from './pages/ElevFormPage';
import InstructoriPage from './pages/InstructoriPage';
import InstructorFormPage from './pages/InstructorFormPage';
import MasiniPage from './pages/MasiniPage';
import MasinaFormPage from './pages/MasinaFormPage';
import InscrieriPage from './pages/InscrieriPage';



function MeniuPrincipal() {
    return (
        <div className="meniu-container">
            <h1>Meniu Principal (Pagina Protejată)</h1>
            <p>Bine ai venit în aplicația de gestiune!</p>

            <nav>
                <ul>
                    {/* --- BUTONUL NOU ȘI CEL MAI IMPORTANT --- */}
                    <li>
                        <Link to="/inscrieri" style={{fontWeight: 'bold', color: 'green'}}>
                            📝 Registru Înscrieri (Programări)
                        </Link>
                    </li>
                    <hr /> {/* O linie de separare ca să se vadă frumos */}

                    {/* --- BUTOANELE VECHI --- */}
                    <li>
                        <Link to="/elevi">👨‍🎓 Gestionează Elevi</Link>
                    </li>

                    <li>
                        <Link to="/instructori">👮‍♂️ Gestionează Instructori</Link>
                    </li>

                    <li>
                        <Link to="/masini">🚗 Gestionează Mașini</Link>
                    </li>

                    <li>
                        <Link to="/cursuri">📚 Tipuri Cursuri (Oferta)</Link>
                    </li>
                </ul>
            </nav>

            <br />
            <Link to="/login" style={{color: 'red'}}>Deconectare</Link>
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
                <Route path="/instructori" element={<InstructoriPage />} />
                <Route path="/instructori/nou" element={<InstructorFormPage />} />
                <Route path="/instructori/edit/:id" element={<InstructorFormPage />} />
                <Route path="/masini" element={<MasiniPage />} />



                <Route path="/masini/nou" element={<MasinaFormPage />} />
                <Route path="/masini/edit/:nr" element={<MasinaFormPage />} />
                <Route path="/inscrieri" element={<InscrieriPage />} />


                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;