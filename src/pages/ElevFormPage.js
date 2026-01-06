import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import '../App.css';

function ElevFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. Am scos CNP-ul din starea inițială
    const [formData, setFormData] = useState({
        nume: '',
        prenume: '',
        telefon: '',
        idInstructor: ''
    });

    const [instructori, setInstructori] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Încărcăm lista de instructori
        const fetchInstructori = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/instructori');
                setInstructori(res.data);
            } catch (err) {
                console.error("Nu am putut încărca instructorii");
            }
        };
        fetchInstructori();

        // Încărcăm datele elevului (dacă e editare)
        if (id) {
            const fetchElev = async () => {
                try {
                    const res = await axios.get(`http://localhost:8080/api/elevi/${id}`);
                    const data = res.data;

                    // Logica de siguranță pentru instructor
                    let instructorGasit = '';
                    if (data.instructor && data.instructor.id) {
                        instructorGasit = data.instructor.id;
                    } else if (data.idInstructor) {
                        instructorGasit = data.idInstructor;
                    }

                    setFormData({
                        nume: data.nume || '',
                        prenume: data.prenume || '',
                        // CNP a fost eliminat de aici
                        telefon: data.telefon || '',
                        idInstructor: instructorGasit
                    });

                } catch (err) {
                    console.error("Eroare la încărcare elev:", err);
                }
            };
            fetchElev();
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const formatNume = (text) => {
        if (!text) return "";
        return text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- VALIDARE ---
        const newErrors = {};
        let isValid = true;
        const numeRegex = /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/;
        const cifreRegex = /^[0-9]+$/;

        if (!formData.nume || !numeRegex.test(formData.nume)) {
            newErrors.nume = "Nume invalid (doar litere).";
            isValid = false;
        }
        if (!formData.prenume || !numeRegex.test(formData.prenume)) {
            newErrors.prenume = "Prenume invalid (doar litere).";
            isValid = false;
        }

        // Validarea pentru CNP a fost ștearsă

        if (!formData.telefon || !cifreRegex.test(formData.telefon) || formData.telefon.length < 10) {
            newErrors.telefon = "Telefon invalid (minim 10 cifre).";
            isValid = false;
        }
        if (!formData.idInstructor) {
            newErrors.idInstructor = "Alege un instructor!";
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid) return;

        // --- TRIMITERE DATE ---
        const dateDeTrimis = {
            nume: formatNume(formData.nume),
            prenume: formatNume(formData.prenume),
            // Nu mai trimitem CNP la server
            telefon: formData.telefon,
            instructor: { id: parseInt(formData.idInstructor) }
        };

        try {
            if (id) {
                await axios.put(`http://localhost:8080/api/elevi/${id}`, dateDeTrimis);
            } else {
                await axios.post('http://localhost:8080/api/elevi', dateDeTrimis);
            }
            navigate('/elevi');
        } catch (err) {
            console.error(err);
            setErrors({ general: "Eroare la salvare! Verifică consola." });
        }
    };

    const errorStyle = { color: '#e74c3c', fontSize: '0.85rem', marginTop: '5px' };

    return (
        <div className="form-container">
            <h1>{id ? 'Modifică Elev' : 'Adaugă Elev Nou'}</h1>
            {errors.general && <div className="error-message">{errors.general}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nume:</label>
                    <input type="text" name="nume" value={formData.nume} onChange={handleChange} style={errors.nume ? {borderColor:'red'} : {}} />
                    {errors.nume && <div style={errorStyle}>{errors.nume}</div>}
                </div>

                <div className="form-group">
                    <label>Prenume:</label>
                    <input type="text" name="prenume" value={formData.prenume} onChange={handleChange} style={errors.prenume ? {borderColor:'red'} : {}} />
                    {errors.prenume && <div style={errorStyle}>{errors.prenume}</div>}
                </div>

                {/* Câmpul CNP a fost șters complet din HTML */}

                <div className="form-group">
                    <label>Telefon:</label>
                    <input type="text" name="telefon" value={formData.telefon} onChange={handleChange} style={errors.telefon ? {borderColor:'red'} : {}} />
                    {errors.telefon && <div style={errorStyle}>{errors.telefon}</div>}
                </div>

                <div className="form-group">
                    <label>Instructor:</label>
                    <select name="idInstructor" value={formData.idInstructor} onChange={handleChange} style={errors.idInstructor ? {borderColor:'red'} : {}}>
                        <option value="">-- Alege un Instructor --</option>
                        {instructori.map(instr => (
                            <option key={instr.id} value={instr.id}>
                                {instr.nume} {instr.prenume}
                            </option>
                        ))}
                    </select>
                    {errors.idInstructor && <div style={errorStyle}>{errors.idInstructor}</div>}
                </div>

                <div className="form-buttons">
                    <button type="submit">
                        {id ? 'Salvează Modificările' : 'Adaugă Elev'}
                    </button>

                    {/* AM MODIFICAT AICI: Fără style={{...}}, doar className */}
                    <Link to="/elevi" className="cancel-button">
                        Anulează
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ElevFormPage;