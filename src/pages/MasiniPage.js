import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function MasiniPage() {
    const [masini, setMasini] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Funcția care aduce datele din Java
    const fetchMasini = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:8080/api/masini');

            // Debugging
            console.log("Date primite (Masini):", res.data);

            setMasini(res.data);
        } catch (err) {
            console.error("Eroare la fetch masini:", err);
            setError("Nu am putut încărca lista de mașini. Verifică conexiunea cu serverul.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasini();
    }, []);

    // Funcția de ștergere
    const handleDelete = async (nrInmatriculare) => {
        if (window.confirm(`Ești sigur că vrei să ștergi mașina ${nrInmatriculare}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/masini/${nrInmatriculare}`);
                fetchMasini(); // Reîncărcăm lista
            } catch (e) {
                console.error(e);
                alert("Eroare la ștergere! Verifică dacă mașina nu este folosită deja în programări active.");
            }
        }
    };

    if (loading) return <div className="App">Se încarcă parcul auto...</div>;
    if (error) return <div className="App" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="elevi-page-container">

            {/* Buton Înapoi */}
            <Link to="/meniu" className="back-button">
                <i className="fa-solid fa-arrow-left"></i> Meniu Principal
            </Link>

            {/* Titlu cu Iconiță */}
            <h1><i className="fa-solid fa-car"></i> Gestiune Parc Auto</h1>

            {/* Buton Adăugare Modern */}
            <Link to="/masini/nou" className="add-button">
                <i className="fa-solid fa-plus"></i> Adaugă Mașină Nouă
            </Link>

            {masini.length === 0 ? (
                <p style={{textAlign: 'center', color: '#666', marginTop: '20px'}}>
                    Nu există mașini în baza de date.
                </p>
            ) : (
                <table className="elevi-table">
                    <thead>
                    <tr>
                        <th>Nr. Înmatriculare</th>
                        <th>Marcă</th>
                        <th>Model</th>
                        <th>Categorie</th>
                        <th>Acțiuni</th>
                    </tr>
                    </thead>
                    <tbody>
                    {masini.map((m) => (
                        <tr key={m.nrInmatriculare}>
                            {/* 1. Numărul - Stil "Plăcuță" */}
                            <td style={{
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                borderLeft: '4px solid #3498db',
                                paddingLeft: '10px'
                            }}>
                                {m.nrInmatriculare}
                            </td>

                            {/* 2. Marca */}
                            <td style={{fontWeight: '500'}}>{m.marca}</td>

                            {/* 3. Modelul */}
                            <td>{m.model}</td>

                            {/* 4. Categoria - Badge elegant */}
                            <td>
                                {m.categoriePermis ? (
                                    <span style={{
                                        backgroundColor: '#e0f2fe',
                                        color: '#0369a1',
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '0.85rem',
                                        display: 'inline-block'
                                    }}>
                                        <i className="fa-solid fa-id-card" style={{marginRight:'5px'}}></i>
                                        {m.categoriePermis.numeCategorie}
                                    </span>
                                ) : (
                                    <span style={{color: '#9ca3af', fontStyle: 'italic'}}>N/A</span>
                                )}
                            </td>

                            {/* 5. Butoane de Acțiune Rotunde */}
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Link
                                    to={`/masini/edit/${m.nrInmatriculare}`}
                                    className="edit-button"
                                    title="Modifică Mașina"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </Link>

                                <button
                                    onClick={() => handleDelete(m.nrInmatriculare)}
                                    className="delete-button"
                                    title="Șterge Mașina"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MasiniPage;