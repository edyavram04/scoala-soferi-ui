import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function MasiniPage() {
    const [masini, setMasini] = useState([]);
    const [loading, setLoading] = useState(true);

    // Funcția care aduce datele din Java
    const fetchMasini = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/masini');

            // --- DEBUGGING: Vezi în consola browserului (F12) ce date vin ---
            console.log("Date primite de la server (Masini):", res.data);

            setMasini(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Eroare la fetch masini:", err);
            alert("Nu am putut încărca lista de mașini. Verifică dacă serverul Java merge.");
            setLoading(false);
        }
    };

    // Se execută când pagina se încarcă
    useEffect(() => {
        fetchMasini();
    }, []);

    // Funcția de ștergere
    const handleDelete = async (nrInmatriculare) => {
        if (window.confirm(`Ești sigur că vrei să ștergi mașina ${nrInmatriculare}?`)) {
            try {
                // Atenție: URL-ul trebuie să corespundă cu Controller-ul tău (@DeleteMapping("/{id}"))
                await axios.delete(`http://localhost:8080/api/masini/${nrInmatriculare}`);
                // Reîncărcăm lista după ștergere
                fetchMasini();
            } catch (e) {
                console.error(e);
                alert("Eroare la ștergere! Verifică dacă mașina nu este folosită deja în programări.");
            }
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Se încarcă datele...</div>;

    return (
        <div className="elevi-page-container">
            {/* Buton Înapoi */}
            <Link to="/meniu" className="back-button">⬅ Meniu Principal</Link>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1> Parc Auto</h1>
                <Link to="/masini/nou" className="add-button">➕ Adaugă Mașină</Link>
            </div>

            {masini.length === 0 ? (
                <p style={{textAlign: 'center'}}>Nu există mașini în baza de date.</p>
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
                            {/* 1. Numărul */}
                            <td style={{fontWeight: 'bold'}}>{m.nrInmatriculare}</td>

                            {/* 2. Marca */}
                            <td>{m.marca}</td>

                            {/* 3. Modelul */}
                            <td>{m.model}</td>

                            {/* 4. Categoria (Partea Delicată) */}
                            <td>
                                {/* Logica de mai jos încearcă să afișeze 'denumire' SAU 'categorie' SAU 'id'.
                                       Asta te protejează indiferent cum ai numit câmpul în Java.
                                    */}
                                {m.categoriePermis ? (
                                    <span style={{
                                        backgroundColor: '#e3f2fd',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        color: '#0d47a1'
                                    }}>
                                            {m.categoriePermis.numeCategorie}
                                        </span>
                                ) : (
                                    <span style={{color: 'red', fontStyle: 'italic'}}>Nedefinit</span>
                                )}
                            </td>

                            {/* 5. Butoane */}
                            <td>
                                <Link to={`/masini/edit/${m.nrInmatriculare}`} className="edit-button" style={{marginRight: '10px'}}>
                                     Modifică
                                </Link>
                                <button onClick={() => handleDelete(m.nrInmatriculare)} className="delete-button">
                                     Șterge
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