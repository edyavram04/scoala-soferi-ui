import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';

function ElevFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // 1. Starea formularului
    const [formData, setFormData] = useState({
        nume: '',
        prenume: '',
        telefon: '',
        idInstructor: ''
    });

    const [instructori, setInstructori] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // A. Încărcăm lista de instructori pentru dropdown
        const fetchInstructori = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/instructori');
                setInstructori(res.data);
            } catch (err) {
                console.error("Nu am putut încărca instructorii");
            }
        };
        fetchInstructori();

        // B. Încărcăm datele elevului (Dacă e Editare)
        if (isEditMode) {
            const fetchElev = async () => {
                try {
                    const res = await axios.get(`http://localhost:8080/api/elevi/${id}`);
                    const data = res.data;

                    // Logică pentru a extrage corect ID-ul instructorului
                    let instructorId = '';
                    if (data.instructor && data.instructor.id) {
                        instructorId = data.instructor.id;
                    }

                    setFormData({
                        nume: data.nume || '',
                        prenume: data.prenume || '',
                        telefon: data.telefon || '',
                        idInstructor: instructorId
                    });
                } catch (err) {
                    console.error("Eroare la încărcare elev:", err);
                    setErrors({ general: "Nu s-au putut încărca datele elevului." });
                }
            };
            fetchElev();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Ștergem eroarea roșie imediat ce utilizatorul modifică câmpul
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Resetăm erorile anterioare

        // Pregătim datele. Nota: Backend-ul se așteaptă la un obiect Instructor, nu doar ID
        // Dar depinde cum ai făcut DTO-ul. Dacă ai lăsat ca în controllerul meu,
        // trebuie să trimitem structura corectă.

        const dateDeTrimis = {
            nume: formData.nume,
            prenume: formData.prenume,
            telefon: formData.telefon,
            // Java așteaptă un obiect: instructor: { id: ... }
            instructor: { id: parseInt(formData.idInstructor) }
        };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/elevi/${id}`, dateDeTrimis);
            } else {
                await axios.post('http://localhost:8080/api/elevi', dateDeTrimis);
            }
            navigate('/elevi');
        } catch (err) {
            console.error("Eroare API:", err);

            // --- INTERCEPTARE ERORI BACKEND (VALIDARE) ---
            if (err.response && err.response.status === 400) {
                // Backend-ul trimite map-ul de erori (ex: {nume: "...", telefon: "..."})
                setErrors(err.response.data);
            } else {
                setErrors({ general: "A apărut o eroare la salvare. Verifică conexiunea." });
            }
        }
    };

    const errorStyle = { color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' };

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Modifică Elev' : 'Adaugă Elev Nou'}</h1>

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
                        style={errors.nume ? {borderColor:'red'} : {}}
                    />
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
                        style={errors.prenume ? {borderColor:'red'} : {}}
                    />
                    {errors.prenume && <div style={errorStyle}>{errors.prenume}</div>}
                </div>

                {/* --- TELEFON --- */}
                <div className="form-group">
                    <label>Telefon:</label>
                    <input
                        type="text"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        placeholder="07xxxxxxxx"
                        style={errors.telefon ? {borderColor:'red'} : {}}
                    />
                    {errors.telefon && <div style={errorStyle}>{errors.telefon}</div>}
                </div>

                {/* --- INSTRUCTOR --- */}
                <div className="form-group">
                    <label>Instructor:</label>
                    <select
                        name="idInstructor"
                        value={formData.idInstructor}
                        onChange={handleChange}
                        style={errors.instructor ? {borderColor:'red'} : {}}
                    >
                        <option value="">-- Alege un Instructor --</option>
                        {instructori.map(instr => (
                            <option key={instr.id} value={instr.id}>
                                {instr.nume} {instr.prenume}
                            </option>
                        ))}
                    </select>
                    {/* Backend-ul s-ar putea să trimită eroarea pe cheia "instructor" fiind obiect */}
                    {errors.instructor && <div style={errorStyle}>{errors.instructor}</div>}
                </div>

                {/* --- BUTOANE GEMENE --- */}
                <div className="form-buttons">
                    <button type="submit">
                        {isEditMode ? 'Salvează' : 'Adaugă'}
                    </button>

                    <Link to="/elevi" className="cancel-button">
                        Anulează
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ElevFormPage;