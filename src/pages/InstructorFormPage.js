import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

function InstructorFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [cnp, setCnp] = useState(''); // Stare pentru CNP
    const [telefon, setTelefon] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if (isEditMode) {
            const fetchInstructor = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/instructori/${id}`);
                    const data = response.data;
                    setNume(data.nume);
                    setPrenume(data.prenume);
                    setCnp(data.cnp); // Încărcăm CNP-ul existent
                    setTelefon(data.telefon);
                    setLoading(false);
                } catch (err) {
                    setError("Nu s-au putut încărca datele instructorului.");
                    setLoading(false);
                }
            };
            fetchInstructor();
        }
    }, [id, isEditMode]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Trimitem și CNP-ul
        const instructorData = { nume, prenume, cnp, telefon };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/instructori/${id}`, instructorData);
            } else {
                await axios.post('http://localhost:8080/api/instructori', instructorData);
            }
            navigate('/instructori');
        } catch (err) {
            console.error(err);
            setError("Eroare la salvare.");
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Modifică Instructor' : 'Adaugă Instructor'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nume:</label>
                    <input type="text" value={nume} onChange={e => setNume(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Prenume:</label>
                    <input type="text" value={prenume} onChange={e => setPrenume(e.target.value)} required />
                </div>

                {/* Câmpul Nou pentru CNP */}
                <div className="form-group">
                    <label>CNP:</label>
                    <input type="text" value={cnp} onChange={e => setCnp(e.target.value)} required maxLength="13" />
                </div>

                <div className="form-group">
                    <label>Telefon:</label>
                    <input type="tel" value={telefon} onChange={e => setTelefon(e.target.value)} />
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Se salvează...' : 'Salvează'}
                    </button>
                    <button type="button" onClick={() => navigate('/instructori')} className="cancel-button">
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}

export default InstructorFormPage;