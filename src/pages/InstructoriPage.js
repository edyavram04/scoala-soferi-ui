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
            const response = await axios.get('http://localhost:8080/api/instructori');
            setInstructori(response.data);
            setLoading(false);
        } catch (err) {
            setError('Nu s-au putut încărca instructorii.');
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
                fetchInstructori();
            } catch (err) {
                alert('Eroare: Nu se poate șterge instructorul (posibil are elevi).');
            }
        }
    };

    if (loading) return <div className="loading">Se încarcă...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="elevi-page-container">
            {/* --- BUTONUL NOU PENTRU MENIU --- */}
            <Link to="/meniu" className="back-button">
                ⬅ Meniu Principal
            </Link>

            <h1>Gestiune Instructori</h1>

            <Link to="/instructori/nou" className="add-button">
                Adaugă Instructor Nou
            </Link>

            <table className="elevi-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Prenume</th>
                    <th>CNP</th> {/* Am păstrat coloana CNP */}
                    <th>Telefon</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {instructori.map(instr => (
                    <tr key={instr.id}>
                        <td>{instr.id}</td>
                        <td>{instr.nume}</td>
                        <td>{instr.prenume}</td>
                        <td>{instr.cnp}</td> {/* Am păstrat afișarea CNP */}
                        <td>{instr.telefon}</td>
                        <td>
                            <Link to={`/instructori/edit/${instr.id}`} className="edit-button">
                                Modifică
                            </Link>
                            <button onClick={() => handleDelete(instr.id)} className="delete-button">
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

export default InstructoriPage;