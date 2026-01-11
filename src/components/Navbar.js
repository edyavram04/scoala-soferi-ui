import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

function Navbar() {
    const location = useLocation();


    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

    return (
        <nav className="navbar">
            {/* 1. ZONA STÂNGA: LOGO */}
            <Link to="/meniu" className="brand-logo">
                <i className="fa-solid fa-car-side"></i> Ready2Drive
            </Link>

            {/* 2. ZONA CENTRU: MENIURILE PRINCIPALE */}
            <div className="navbar-center">

                {/* Buton Înscrieri */}
                <Link to="/inscrieri" className={`nav-link ${isActive('/inscrieri')}`}>
                    <i className="fa-solid fa-file-signature"></i> Înscrieri
                </Link>

                {/* Buton Statistici */}
                <Link to="/statistici" className={`nav-link ${isActive('/statistici')}`}>
                    <i className="fa-solid fa-chart-pie"></i> Statistici
                </Link>

                {/* DROPDOWN ADMINISTRARE*/}
                <div className="dropdown-container">
                    <Link to="/meniu" className={`nav-link ${isActive('/elevi') || isActive('/instructori') || isActive('/masini') ? 'active' : ''}`}>
                        <i className="fa-solid fa-database"></i> Administrare <i className="fa-solid fa-chevron-down arrow-icon"></i>
                    </Link>

                    {/* Lista care apare la hover */}
                    <div className="dropdown-menu">
                        <Link to="/elevi" className="dropdown-item">
                            <i className="fa-solid fa-user-graduate" style={{color: '#3498db'}}></i> Elevi
                        </Link>
                        <Link to="/instructori" className="dropdown-item">
                            <i className="fa-solid fa-user-tie" style={{color: '#2980b9'}}></i> Instructori
                        </Link>
                        <Link to="/masini" className="dropdown-item">
                            <i className="fa-solid fa-car" style={{color: '#d35400'}}></i> Parc Auto
                        </Link>
                    </div>
                </div>

            </div>

            {/*3. ZONA DREAPTA: LOGOUT */}
            <div className="nav-links">
                <Link to="/login" className="logout-btn-nav">
                    <i className="fa-solid fa-right-from-bracket"></i> Ieșire
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;