import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';


import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import EleviPage from "./pages/EleviPage";
import ElevFormPage from './pages/ElevFormPage';
import InstructoriPage from './pages/InstructoriPage';
import InstructorFormPage from './pages/InstructorFormPage';
import MasiniPage from './pages/MasiniPage';
import MasinaFormPage from './pages/MasinaFormPage';
import InscrieriPage from './pages/InscrieriPage';
import StatisticiPage from './pages/StatisticiPage';

//COMPONENTA MENIU PRINCIPAL (DASHBOARD)
function MeniuPrincipal() {
    return (
        <div className="dashboard-container">

            {/* Header Dashboard */}
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className="fa-solid fa-gauge-high" style={{ color: '#4e54c8' }}></i>
                    Panou de Administrare
                </h1>
                <p style={{ color: '#6b7280', fontSize: '1.05rem', margin: 0 }}>
                    Bine ai venit. Selectează un modul pentru a începe gestionarea școlii auto.
                </p>
            </div>

            {/* SECTIUNEA 1: OPERAȚIUNI & RAPOARTE */}
            <div className="dashboard-section-title">
                <i className="fa-solid fa-briefcase" style={{marginRight: '8px'}}></i> Operațiuni Principale
            </div>

            <div className="menu-grid">
                {/* Card Înscrieri */}
                <Link to="/inscrieri" className="nav-card card-green">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h3>Registru Înscrieri</h3>
                            <p>Gestionează dosarele cursanților activi și programările.</p>
                        </div>
                        <i className="fa-solid fa-folder-open" style={{ fontSize: '2.5rem', opacity: 0.2, color: '#27ae60' }}></i>
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', fontWeight: '600', color: '#27ae60', display:'flex', alignItems:'center', gap:'5px' }}>
                        Accesează Modulul <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </Link>

                {/* Card Statistici */}
                <Link to="/statistici" className="nav-card card-purple">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h3>Rapoarte Financiare</h3>
                            <p>Analiza performanței, încasări și grafice de evoluție.</p>
                        </div>
                        <i className="fa-solid fa-chart-pie" style={{ fontSize: '2.5rem', opacity: 0.2, color: '#8e44ad' }}></i>
                    </div>
                    <div style={{ marginTop: '20px', fontSize: '0.9rem', fontWeight: '600', color: '#8e44ad', display:'flex', alignItems:'center', gap:'5px' }}>
                        Vezi Rapoartele <i className="fa-solid fa-arrow-right"></i>
                    </div>
                </Link>
            </div>

            {/* SECTIUNEA 2: GESTIUNE RESURSE */}
            <div className="dashboard-section-title" style={{ marginTop: '50px' }}>
                <i className="fa-solid fa-database" style={{marginRight: '8px'}}></i> Administrare Resurse
            </div>

            <div className="menu-grid">
                {/* Card Elevi */}
                <Link to="/elevi" className="nav-card card-blue">
                    <div style={{marginBottom: '15px'}}>
                        <i className="fa-solid fa-user-graduate" style={{ fontSize: '2rem', color: '#3498db', marginBottom: '10px' }}></i>
                    </div>
                    <h3>Cursanți</h3>
                    <p>Baza de date completă a elevilor înscriși.</p>
                </Link>

                {/* Card Instructori */}
                <Link to="/instructori" className="nav-card card-blue">
                    <div style={{marginBottom: '15px'}}>
                        <i className="fa-solid fa-user-tie" style={{ fontSize: '2rem', color: '#2980b9', marginBottom: '10px' }}></i>
                    </div>
                    <h3>Instructori</h3>
                    <p>Evidența personalului și a colaboratorilor.</p>
                </Link>

                {/* Card Mașini */}
                <Link to="/masini" className="nav-card card-orange">
                    <div style={{marginBottom: '15px'}}>
                        <i className="fa-solid fa-car" style={{ fontSize: '2rem', color: '#d35400', marginBottom: '10px' }}></i>
                    </div>
                    <h3>Parc Auto</h3>
                    <p>Gestiune flotă, ITP și alocări pe instructori.</p>
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
            <Navbar />
            <Routes>
                <Route path="/login" element={<PaginaLogin />} />
                <Route path="/meniu" element={<MeniuPrincipal />} />

                {/* Rute Elevi */}
                <Route path="/elevi" element={<EleviPage />} />
                <Route path="/elevi/nou" element={<ElevFormPage />} />
                <Route path="/elevi/edit/:id" element={<ElevFormPage />} />

                {/* Rute Instructori */}
                <Route path="/instructori" element={<InstructoriPage />} />
                <Route path="/instructori/nou" element={<InstructorFormPage />} />
                <Route path="/instructori/edit/:id" element={<InstructorFormPage />} />

                {/* Rute Mașini */}
                <Route path="/masini" element={<MasiniPage />} />
                <Route path="/masini/nou" element={<MasinaFormPage />} />
                <Route path="/masini/edit/:nr" element={<MasinaFormPage />} />

                {/* Alte Rute */}
                <Route path="/inscrieri" element={<InscrieriPage />} />
                <Route path="/statistici" element={<StatisticiPage />} />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;