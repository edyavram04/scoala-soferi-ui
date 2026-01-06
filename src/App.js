import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';

// Importăm componentele
import Navbar from './components/Navbar'; // <--- IMPORTUL NOU
import LoginForm from './components/LoginForm';
import EleviPage from "./pages/EleviPage";
import ElevFormPage from './pages/ElevFormPage';
import InstructoriPage from './pages/InstructoriPage';
import InstructorFormPage from './pages/InstructorFormPage';
import MasiniPage from './pages/MasiniPage';
import MasinaFormPage from './pages/MasinaFormPage';
import InscrieriPage from './pages/InscrieriPage';
import StatisticiPage from './pages/StatisticiPage';

// Componenta Meniu Principal (am scos Navbar-ul din ea, că acum e global)
function MeniuPrincipal() {
    return (
        <div className="dashboard-container">
            <h1>Panou de Control</h1>
            <p>Bine ai venit! Selectează o opțiune de mai jos.</p>

            <div className="dashboard-section-title">Activitate Zilnică</div>
            <div className="menu-grid">
                <Link to="/inscrieri" className="nav-card card-green">
                    <h3>Registru Înscrieri</h3>
                    <p>Adaugă cursanți noi, alocă instructori și programează ședințe.</p>
                </Link>
                <Link to="/statistici" className="nav-card card-purple">
                    <h3>Rapoarte și Statistici</h3>
                    <p>Vezi performanța școlii, încasările și topul instructorilor.</p>
                </Link>
            </div>

            <div className="dashboard-section-title">Administrare Date</div>
            <div className="menu-grid">
                <Link to="/elevi" className="nav-card card-blue">
                    <h3>Elevi</h3>
                    <p>Gestionează baza de date a cursanților.</p>
                </Link>
                <Link to="/instructori" className="nav-card card-blue">
                    <h3>Instructori</h3>
                    <p>Adaugă sau modifică datele instructorilor auto.</p>
                </Link>
                <Link to="/masini" className="nav-card card-orange">
                    <h3>Parc Auto</h3>
                    <p>Gestionează mașinile școlii, ITP și alocări.</p>
                </Link>
            </div>
        </div>
    );
}

function PaginaLogin() {
    return (
        <div className="App">
            <LoginForm />
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            {/* Navbar-ul este pus AICI, ca să fie vizibil peste tot */}
            <Navbar />

            <Routes>
                <Route path="/login" element={<PaginaLogin />} />
                <Route path="/meniu" element={<MeniuPrincipal />} />

                <Route path="/elevi" element={<EleviPage />} />
                <Route path="/elevi/nou" element={<ElevFormPage />} />
                <Route path="/elevi/edit/:id" element={<ElevFormPage />} />

                <Route path="/instructori" element={<InstructoriPage />} />
                <Route path="/instructori/nou" element={<InstructorFormPage />} />
                <Route path="/instructori/edit/:id" element={<InstructorFormPage />} />

                <Route path="/masini" element={<MasiniPage />} />
                <Route path="/masini/nou" element={<MasinaFormPage />} />
                <Route path="/masini/edit/:nr" element={<MasinaFormPage />} />

                <Route path="/inscrieri" element={<InscrieriPage />} />
                <Route path="/statistici" element={<StatisticiPage />} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;