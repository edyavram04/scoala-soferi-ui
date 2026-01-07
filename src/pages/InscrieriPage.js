import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function InscrieriPage() {
    const [inscrieri, setInscrieri] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listele pentru Dropdown-uri
    const [elevi, setElevi] = useState([]);
    const [cursuri, setCursuri] = useState([]);
    const [instructori, setInstructori] = useState([]);
    const [masini, setMasini] = useState([]);

    // Datele formularului
    const [selElev, setSelElev] = useState('');
    const [selCurs, setSelCurs] = useState('');
    const [selInstr, setSelInstr] = useState('');
    const [selMasina, setSelMasina] = useState('');
    const [dataStart, setDataStart] = useState('');
    const [starePlata, setStarePlata] = useState('Neplatit');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rInscrieri, rElevi, rCursuri, rInstr, rMasini] = await Promise.all([
                axios.get('http://localhost:8080/api/inscrieri'),
                axios.get('http://localhost:8080/api/elevi'),
                axios.get('http://localhost:8080/api/cursuri'),
                axios.get('http://localhost:8080/api/instructori'),
                axios.get('http://localhost:8080/api/masini')
            ]);

            setInscrieri(rInscrieri.data);
            setElevi(rElevi.data);
            setCursuri(rCursuri.data);
            setInstructori(rInstr.data);
            setMasini(rMasini.data);
        } catch (e) {
            console.error("Eroare server", e);
            alert("Nu s-au putut încărca datele. Verifică backend-ul.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGICA UI: Auto-selectare Instructor ---
    const handleSelectElev = (e) => {
        const idElevSelectat = parseInt(e.target.value);
        setSelElev(idElevSelectat);

        const elevGasit = elevi.find(el => el.id === idElevSelectat);
        if (elevGasit && elevGasit.instructor) {
            setSelInstr(elevGasit.instructor.id);
        } else {
            setSelInstr('');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            idElev: selElev,
            idCurs: selCurs,
            idInstructor: selInstr,
            nrMasina: selMasina,
            dataStart: dataStart,
            starePlata: starePlata
        };

        try {
            await axios.post('http://localhost:8080/api/inscrieri', payload);
            alert("Înscriere salvată cu succes!");
            fetchData();
            // Resetare
            setSelElev(''); setSelCurs(''); setSelInstr(''); setSelMasina(''); setDataStart('');
        } catch (err) {
            alert("Eroare la salvare! Verifică toate câmpurile.");
        }
    };

    const handleDelete = async (idElev, idCurs) => {
        if(window.confirm("Ești sigur că vrei să ștergi această înscriere?")) {
            try {
                await axios.delete(`http://localhost:8080/api/inscrieri?idElev=${idElev}&idCurs=${idCurs}`);
                fetchData();
            } catch (err) {
                alert("Eroare la ștergere.");
            }
        }
    };

    // Funcție mică pentru culoarea statusului
    const getStatusStyle = (status) => {
        if (status === 'Achitat') return { background: '#d1fae5', color: '#065f46', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' };
        if (status === 'Avans') return { background: '#fef3c7', color: '#92400e', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' };
        return { background: '#fee2e2', color: '#991b1b', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' };
    };

    if (loading) return <div className="App">Se încarcă datele...</div>;

    return (
        <div className="elevi-page-container" style={{maxWidth: '1200px'}}>

            <Link to="/meniu" className="back-button">
                <i className="fa-solid fa-arrow-left"></i> Meniu Principal
            </Link>

            <h1><i className="fa-solid fa-file-signature"></i> Registru Înscrieri & Sincronizare</h1>

            {/* --- FORMULAR TIP CARD --- */}
            <div className="form-container" style={{maxWidth: '100%', marginTop: '30px', padding: '30px'}}>
                <h3 style={{borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px'}}>
                    <i className="fa-solid fa-plus-circle" style={{color: 'var(--primary-color)'}}></i> Adaugă Înscriere Nouă
                </h3>

                <form onSubmit={handleSave}>
                    {/* Grid Layout pentru Formular */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px'}}>

                        {/* 1. ELEV */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-user-graduate"></i> Elev:</label>
                            <select value={selElev} onChange={handleSelectElev} required>
                                <option value="">-- Alege Elev --</option>
                                {elevi.map(e => (
                                    <option key={e.id} value={e.id}>{e.nume} {e.prenume}</option>
                                ))}
                            </select>
                        </div>

                        {/* 2. INSTRUCTOR */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-user-tie"></i> Instructor:</label>
                            <select value={selInstr} onChange={e=>setSelInstr(e.target.value)} required style={{backgroundColor: '#f9fafb'}}>
                                <option value="">-- Alege Instructor --</option>
                                {instructori.map(i => (
                                    <option key={i.id} value={i.id}>{i.nume} {i.prenume}</option>
                                ))}
                            </select>
                        </div>

                        {/* 3. CURS */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-book"></i> Tip Curs:</label>
                            <select value={selCurs} onChange={e=>setSelCurs(e.target.value)} required>
                                <option value="">-- Alege Curs --</option>
                                {cursuri.map(c => <option key={c.idCurs} value={c.idCurs}>{c.denumire}</option>)}
                            </select>
                        </div>

                        {/* 4. MASINA */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-car"></i> Mașina:</label>
                            <select value={selMasina} onChange={e=>setSelMasina(e.target.value)} required>
                                <option value="">-- Alege Mașina --</option>
                                {masini.map(m => <option key={m.nrInmatriculare} value={m.nrInmatriculare}>{m.marca} ({m.nrInmatriculare})</option>)}
                            </select>
                        </div>

                        {/* 5. DATA */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-calendar-days"></i> Data Start:</label>
                            <input type="date" value={dataStart} onChange={e=>setDataStart(e.target.value)} required/>
                        </div>

                        {/* 6. PLATA */}
                        <div className="form-group">
                            <label><i className="fa-solid fa-money-bill-wave"></i> Status Plată:</label>
                            <select value={starePlata} onChange={e=>setStarePlata(e.target.value)}>
                                <option value="Neplatit">Neplătit</option>
                                <option value="Avans">Avans</option>
                                <option value="Achitat">Achitat</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-buttons" style={{marginTop: '20px'}}>
                        <button type="submit" className="add-button" style={{justifyContent: 'center', width: '100%'}}>
                            <i className="fa-solid fa-check"></i> Salvează și Sincronizează
                        </button>
                    </div>
                </form>
            </div>

            {/* --- TABEL DATE --- */}
            <table className="elevi-table">
                <thead>
                <tr>
                    <th>Elev</th>
                    <th>Curs</th>
                    <th>Instructor</th>
                    <th>Mașina</th>
                    <th>Data Start</th>
                    <th>Status Plată</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {inscrieri.map((item, idx) => (
                    <tr key={idx}>
                        <td style={{fontWeight: '500'}}>{item.elev?.nume} {item.elev?.prenume}</td>
                        <td>{item.curs?.denumire}</td>
                        <td>
                            {item.instructor ? (
                                <span><i className="fa-solid fa-user-tie" style={{color:'#9ca3af', marginRight:'5px'}}></i>{item.instructor.nume} {item.instructor.prenume}</span>
                            ) : '-'}
                        </td>
                        <td>
                            {item.masina ? (
                                <span style={{fontSize:'0.9rem'}}><i className="fa-solid fa-car-side" style={{color:'#9ca3af', marginRight:'5px'}}></i>{item.masina.marca} <small>({item.masina.nrInmatriculare})</small></span>
                            ) : '-'}
                        </td>
                        <td>{item.dataStart}</td>
                        <td>
                            <span style={getStatusStyle(item.starePlata)}>
                                {item.starePlata}
                            </span>
                        </td>
                        <td>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(item.id.idElev, item.id.idCurs)}
                                title="Șterge Înscrierea"
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                ))}
                {inscrieri.length === 0 && (
                    <tr>
                        <td colSpan="7" style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>
                            Nu există înscrieri înregistrate.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default InscrieriPage;