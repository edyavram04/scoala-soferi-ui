import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';

function InstructorFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // 1. Folosim un singur obiect pentru date
    const [formData, setFormData] = useState({
        nume: '',
        prenume: '',
        cnp: '',
        telefon: ''
    });

    // 2. State pentru erori specifice (cheie: mesaj)
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode) {
            const fetchInstructor = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/instructori/${id}`);
                    const data = response.data;

                    // Mapăm datele (verificăm și litere mari/mici pentru siguranță)
                    setFormData({
                        nume: data.nume || '',
                        prenume: data.prenume || '',
                        cnp: data.cnp || data.CNP || '',
                        telefon: data.telefon || ''
                    });
                } catch (err) {
                    console.error("Eroare la încărcare:", err);
                    setErrors({ general: "Nu s-au putut încărca datele instructorului." });
                }
            };
            fetchInstructor();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Ștergem eroarea roșie imediat ce utilizatorul începe să corecteze câmpul
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors({}); // Resetăm erorile vechi

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/instructori/${id}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/instructori', formData);
            }
            navigate('/instructori');
        } catch (err) {
            console.error("Eroare API:", err);

            // --- AICI PRINDEM ERORILE DE VALIDARE DIN JAVA ---
            if (err.response && err.response.status === 400) {
                // Backend-ul trimite: { "cnp": "CNP invalid", "nume": "..." }
                setErrors(err.response.data);
            } else {
                // Eroare generică (server picat, etc.)
                setErrors({ general: "A apărut o eroare la salvare. Verifică conexiunea." });
            }
        }
    };

    // Stil pentru textul mic roșu
    const errorStyle = { color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' };

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Modifică Instructor' : 'Adaugă Instructor'}</h1>

            {errors.general && (
                <div className="error-message">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* --- NUME --- */}
                <div className="form-group">
                    <label>Nume:</label>
                    <input
                        type="text"
                        name="nume"
                        value={formData.nume}
                        onChange={handleChange}
                        // Dacă există eroare pe acest câmp, facem chenarul roșu
                        style={errors.nume ? {borderColor: 'red'} : {}}
                    />
                    {/* Afișăm mesajul venit din Java */}
                    {errors.nume && <div style={errorStyle}>{errors.nume}</div>}
                </div>

                {/* --- PRENUME --- */}
                <div className="form-group">
                    <label>Prenume:</label>
                    <input
                        type="text"
                        name="prenume"
                        value={formData.prenume}
                        onChange={handleChange}
                        style={errors.prenume ? {borderColor: 'red'} : {}}
                    />
                    {errors.prenume && <div style={errorStyle}>{errors.prenume}</div>}
                </div>

                {/* --- CNP --- */}
                <div className="form-group">
                    <label>CNP:</label>
                    <input
                        type="text"
                        name="cnp"
                        value={formData.cnp}
                        onChange={handleChange}
                        maxLength="13"
                        style={errors.cnp ? {borderColor: 'red'} : {}}
                    />
                    {errors.cnp && <div style={errorStyle}>{errors.cnp}</div>}
                </div>

                {/* --- TELEFON --- */}
                <div className="form-group">
                    <label>Telefon:</label>
                    <input
                        type="text"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        style={errors.telefon ? {borderColor: 'red'} : {}}
                    />
                    {errors.telefon && <div style={errorStyle}>{errors.telefon}</div>}
                </div>

                {/* --- BUTOANE GEMENE (Stiluri din App.css) --- */}
                <div className="form-buttons">
                    <button type="submit">
                        {isEditMode ? 'Salvează' : 'Adaugă'}
                    </button>

                    {/* Folosim Link cu clasa cancel-button pentru a fi identic cu butonul de salvare */}
                    <Link to="/instructori" className="cancel-button">
                        Anulează
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default InstructorFormPage;