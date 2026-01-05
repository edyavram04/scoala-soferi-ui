import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function MasiniPage() {
    const [masini, setMasini] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMasini = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/masini');
            setMasini(res.data);
            setLoading(false);
        } catch (err) {
            alert("Eroare la încărcare!");
            setLoading(false);
        }
    };

    useEffect(() => { fetchMasini(); }, []);

    const handleDelete = async (nr) => {
        if (window.confirm(`Ștergi mașina ${nr}?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/masini/${nr}`);
                fetchMasini();
            } catch (e) {
                alert("Eroare la ștergere!");
            }
        }
    };

    if (loading) return <div>Se încarcă...</div>;

    return (
        <div className="elevi-page-container">
            <Link to="/meniu" className="back-button">⬅ Meniu Principal</Link>

            <h1>Parc Auto</h1>
            <Link to="/masini/nou" className="add-button">Adaugă Mașină</Link>

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
                {masini.map(m => (
                    <tr key={m.nrInmatriculare}>
                        <td>{m.nrInmatriculare}</td>
                        <td>{m.marca}</td>
                        <td>{m.model}</td>

                        {/* Afișăm ID-ul categoriei din obiectul legat */}
                        <td>
                            {m.categoriePermis ? m.categoriePermis.id : 'N/A'}
                        </td>

                        <td>
                            <Link to={`/masini/edit/${m.nrInmatriculare}`} className="edit-button">Modifică</Link>
                            <button onClick={() => handleDelete(m.nrInmatriculare)} className="delete-button">Șterge</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default MasiniPage;