import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Importă useParams

function ElevFormPage() {
    // 2. Citește parametrii din URL. Căutăm un parametru numit "id"
    //    (definit în App.js ca "/elevi/edit/:id")
    const { id } = useParams();

    // 3. Verificăm dacă suntem în modul "Editare" (dacă 'id' există)
    const isEditMode = Boolean(id);

    // --- Starea (Memoria) rămâne la fel ---
    const [nume, setNume] = useState('');
    const [prenume, setPrenume] = useState('');
    const [telefon, setTelefon] = useState('');
    const [idInstructor, setIdInstructor] = useState('');
    const [instructori, setInstructori] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    // 4. useEffect: Rulează o dată, pentru a prelua datele
    useEffect(() => {
        // Funcția care ia lista de instructori (pentru dropdown)
        const fetchInstructori = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/instructori');
                setInstructori(response.data);
            } catch (err) {
                console.error("Eroare la preluarea instructorilor:", err);
                setError("Nu s-au putut încărca instructorii.");
            }
        };

        // Funcția care ia datele elevului (DOAR dacă suntem în Mod Editare)
        const fetchElev = async () => {
            if (isEditMode) { // Rulează doar dacă 'id' există
                try {
                    setLoading(true);
                    const response = await axios.get(`http://localhost:8080/api/elevi/${id}`);

                    // 5. Umple formularul cu datele primite de la backend
                    const elev = response.data;
                    setNume(elev.nume);
                    setPrenume(elev.prenume);
                    setTelefon(elev.telefon);
                    // Setăm ID-ul instructorului din dropdown
                    if (elev.instructor) {
                        setIdInstructor(elev.instructor.id);
                    }

                    setLoading(false);
                } catch (err) {
                    console.error("Eroare la preluarea elevului:", err);
                    setError("Nu s-au putut încărca datele elevului.");
                    setLoading(false);
                }
            }
        };

        fetchInstructori(); // Ia instructorii (rulează mereu)
        fetchElev(); // Ia datele elevului (rulează doar în mod editare)

    }, [id, isEditMode]); // Rulează din nou dacă 'id'-ul se schimbă

    // 6. Funcția de Salvare (acum e inteligentă)
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const elevData = {
            nume: nume,
            prenume: prenume,
            telefon: telefon,
            instructor: instructori.find(i => i.id === parseInt(idInstructor))
        };

        try {
            if (isEditMode) {
                // 7. MOD UPDATE (folosim PUT)
                await axios.put(`http://localhost:8080/api/elevi/${id}`, elevData);
            } else {
                // 8. MOD CREATE (folosim POST)
                await axios.post('http://localhost:8080/api/elevi', elevData);
            }

            // 9. După ce a salvat, mergi înapoi la listă
            navigate('/elevi');

        } catch (err) {
            console.error("Eroare la salvarea elevului:", err);
            setError("Nu s-a putut salva elevul.");
            setLoading(false);
        }
    };

    // Mesaj de încărcare special pentru modul de editare
    if (isEditMode && loading) {
        return <div className="App">Se încarcă datele elevului...</div>;
    }

    return (
        <div className="form-container">
            {/* 10. Titlul se schimbă în funcție de mod */}
            <h1>{isEditMode ? 'Modifică Elev' : 'Adaugă Elev Nou'}</h1>

            <form onSubmit={handleSubmit}>
                {/* ... (Restul formularului (Nume, Prenume, Telefon, Instructor)
               este EXACT la fel ca înainte) ... */}

                <div className="form-group">
                    <label htmlFor="nume">Nume:</label>
                    <input type="text" id="nume" value={nume} onChange={(e) => setNume(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="prenume">Prenume:</label>
                    <input type="text" id="prenume" value={prenume} onChange={(e) => setPrenume(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label htmlFor="telefon">Telefon:</label>
                    <input type="tel" id="telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} />
                </div>

                <div className="form-group">
                    <label htmlFor="instructor">Instructor:</label>
                    <select id="instructor" value={idInstructor} onChange={(e) => setIdInstructor(e.target.value)} required>
                        <option value="">Alege un instructor...</option>
                        {instructori.map(instr => (
                            <option key={instr.id} value={instr.id}>
                                {instr.nume} {instr.prenume}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="error-message">{error}</p>}

                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {/* Textul butonului se schimbă și el */}
                        {loading ? 'Se salvează...' : (isEditMode ? 'Salvează Modificările' : 'Salvează Elev')}
                    </button>
                    <button type="button" onClick={() => navigate('/elevi')} className="cancel-button">
                        Anulează
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ElevFormPage;