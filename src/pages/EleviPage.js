import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function EleviPage() {
    const [elevi, setElevi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // 1. Am mutat funcția de "fetch"
    //    pentru a o putea apela din nou după ștergere
    const fetchElevi = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.get('http://localhost:8080/api/elevi');
            setElevi(response.data);
        } catch (err) {
            console.error("Eroare la preluarea elevilor:", err);
            setError('Nu s-au putut prelua datele elevilor.');
        } finally {
            setLoading(false);
        }
    };

    // useEffect rulează funcția o dată la încărcare
    useEffect(() => {
        fetchElevi();
    }, []);

    // 2. Funcția nouă pentru ȘTERGERE
    const handleDelete = async (idElev) => {
        // Adăugăm o confirmare, ca să nu ștergem din greșeală
        if (window.confirm('Ești sigur că vrei să ștergi acest elev?')) {
            try {
                // 3. Trimite cererea DELETE la backend
                await axios.delete(`http://localhost:8080/api/elevi/${idElev}`);

                // 4. Reîncarcă lista de elevi pentru a reflecta schimbarea
                fetchElevi();

            } catch (err) {
                console.error("Eroare la ștergerea elevului:", err);
                setError('Nu s-a putut șterge elevul.');
            }
        }
    };

    // ... (părțile cu 'loading' și 'error' rămân la fel) ...
    if (loading) {
        return <div className="App">Se încarcă elevii...</div>;
    }
    if (error) {
        return <div className="App" style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div className="elevi-page-container">
            <h1>Gestiune Elevi</h1>

            <Link to="/elevi/nou" className="add-button">
                Adaugă Elev Nou
            </Link>

            <table className="elevi-table">
                <thead>
                {/* ... (antetul tabelului) ... */}
                </thead>
                <tbody>
                {elevi.map(elev => (
                    <tr key={elev.id}>
                        <td>{elev.id}</td>
                        <td>{elev.nume}</td>
                        <td>{elev.prenume}</td>
                        <td>{elev.telefon}</td>
                        <td>{elev.instructor ? elev.instructor.nume : 'N/A'}</td>
                        <td>
                            {/* (2) AICI E MODIFICAREA: Schimbă <button> în <Link> */}
                            <Link to={`/elevi/edit/${elev.id}`} className="edit-button">
                                Modifică
                            </Link>

                            <button onClick={() => handleDelete(elev.id)} className="delete-button">
                                Șterge
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default EleviPage;