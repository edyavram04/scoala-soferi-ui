import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; // Asigură-te că importă stilurile

function Navbar() {
    const location = useLocation();

    // Lista de rute unde NU vrem să apară bara (ex: Login)
    if (location.pathname === '/login' || location.pathname === '/') {
        return null;
    }

    return (
        <nav className="navbar">
            <Link to="/meniu" className="brand-logo">
                Ready<span className="brand-accent">2</span>Drive
            </Link>

            <div className="nav-links">
                {/* Putem adăuga un buton mic de "Meniu" dacă ești pe alte pagini */}
                {location.pathname !== '/meniu' && (
                    <Link to="/meniu" className="logout-btn-nav" style={{marginRight: '10px', borderColor: '#3498db'}}>
                         Meniu
                    </Link>
                )}

                <Link to="/login" className="logout-btn-nav">
                    Deconectare
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;