import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function InstructoriPage() {
    const [instructori, setInstructori] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchInstructori = async () => {
        try {
            // Resetăm eroarea la fiecare nouă încercare
            setError('');
            const response = await axios.get('http://localhost:8080/api/instructori');
            setInstructori(response.data);
        } catch (err) {
            console.error(err);
            setError('Nu s-au putut încărca instructorii. Verifică serverul.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInstructori();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Ești sigur că vrei să ștergi acest instructor?')) {
            try {
                await axios.delete(`http://localhost:8080/api/instructori/${id}`);
                fetchInstructori(); // Reîmprospătăm lista
            } catch (err) {
                alert('Eroare: Nu se poate șterge instructorul. Probabil are elevi sau mașini alocate.');
            }
        }
    };

    if (loading) return <div className="App">Se încarcă lista de instructori...</div>;
    if (error) return <div className="App" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="elevi-page-container">

            {/* Buton Înapoi cu Iconiță */}
            <Link to="/meniu" className="back-button">
                <i className="fa-solid fa-arrow-left"></i> Meniu Principal
            </Link>

            {/* Titlu cu Iconiță specifică (User Tie) */}
            <h1><i className="fa-solid fa-user-tie"></i> Gestiune Instructori</h1>

            {/* Buton Adăugare Modern */}
            <Link to="/instructori/nou" className="add-button">
                <i className="fa-solid fa-plus"></i> Adaugă Instructor Nou
            </Link>

            <table className="elevi-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Prenume</th>
                    <th>CNP</th>
                    <th>Telefon</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {instructori.map(instr => (
                    <tr key={instr.id}>
                        <td>{instr.id}</td>
                        <td style={{fontWeight: '500'}}>{instr.nume}</td>
                        <td style={{fontWeight: '500'}}>{instr.prenume}</td>
                        <td style={{fontFamily: 'monospace', letterSpacing: '1px'}}>{instr.cnp}</td>
                        <td>{instr.telefon}</td>

                        {/* Butoane de Acțiune Rotunde */}
                        <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link
                                to={`/instructori/edit/${instr.id}`}
                                className="edit-button"
                                title="Modifică Instructor"
                            >
                                <i className="fa-solid fa-pen"></i>
                            </Link>

                            <button
                                onClick={() => handleDelete(instr.id)}
                                className="delete-button"
                                title="Șterge Instructor"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default InstructoriPage;