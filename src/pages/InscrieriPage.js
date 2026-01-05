import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function InscrieriPage() {
    const [inscrieri, setInscrieri] = useState([]);

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

    // Încărcăm datele
    const fetchData = async () => {
        try {
            const rInscrieri = await axios.get('http://localhost:8080/api/inscrieri');
            setInscrieri(rInscrieri.data);

            const rElevi = await axios.get('http://localhost:8080/api/elevi');
            setElevi(rElevi.data);

            const rCursuri = await axios.get('http://localhost:8080/api/cursuri');
            setCursuri(rCursuri.data);

            const rInstr = await axios.get('http://localhost:8080/api/instructori');
            console.log("DATE INSTRUCTORI PRIMITE:", rInstr.data); // <--- Verificăm în consolă
            setInstructori(rInstr.data);

            const rMasini = await axios.get('http://localhost:8080/api/masini');
            setMasini(rMasini.data);
        } catch (e) {
            console.error("Eroare server", e);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- LOGICA UI: Auto-selectare Instructor ---
    const handleSelectElev = (e) => {
        const idElevSelectat = parseInt(e.target.value);
        setSelElev(idElevSelectat);

        // Căutăm elevul în lista descărcată
        const elevGasit = elevi.find(el => el.id === idElevSelectat);

        // Dacă are instructor, îl punem automat în dropdown
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
            alert("Salvat cu succes! (Și elevul a fost actualizat)");
            fetchData();
            // Resetare parțială
            setSelElev(''); setSelCurs(''); setSelInstr(''); setSelMasina('');
        } catch (err) {
            alert("Eroare la salvare! Verifică toate câmpurile.");
        }
    };

    const handleDelete = async (idElev, idCurs) => {
        if(window.confirm("Ștergi înregistrarea?")) {
            await axios.delete(`http://localhost:8080/api/inscrieri?idElev=${idElev}&idCurs=${idCurs}`);
            fetchData();
        }
    };

    return (
        <div className="elevi-page-container" style={{maxWidth: '1200px'}}>
            <Link to="/meniu" className="back-button">⬅ Meniu</Link>
            <h1>Registru Înscrieri & Sincronizare</h1>

            <div className="form-container" style={{maxWidth: '100%', display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                <h3 style={{width: '100%'}}>Adaugă Înscriere Nouă</h3>

                {/* 1. ELEV */}
                <div style={{flex: '1 1 200px'}}>
                    <label>Elev:</label>
                    <select value={selElev} onChange={handleSelectElev} required style={{width:'100%', padding:'8px'}}>
                        <option value="">-- Alege Elev --</option>
                        {elevi.map(e => (
                            <option key={e.id} value={e.id}>{e.nume} {e.prenume}</option>
                        ))}
                    </select>
                </div>

                {/* 2. INSTRUCTOR */}
                <div style={{flex: '1 1 200px'}}>
                    <label>Instructor:</label>
                    <select value={selInstr} onChange={e=>setSelInstr(e.target.value)} required style={{width:'100%', padding:'8px', backgroundColor: '#f8f9fa'}}>
                        <option value="">-- Alege Instructor --</option>
                        {instructori.map(i => (
                            <option key={i.id} value={i.id}>{i.nume} {i.prenume}</option>
                        ))}
                    </select>
                </div>

                {/* 3. CURS */}
                <div style={{flex: '1 1 200px'}}>
                    <label>Tip Curs:</label>
                    <select value={selCurs} onChange={e=>setSelCurs(e.target.value)} required style={{width:'100%', padding:'8px'}}>
                        <option value="">-- Alege Curs --</option>
                        {cursuri.map(c => <option key={c.idCurs} value={c.idCurs}>{c.denumire}</option>)}
                    </select>
                </div>

                {/* 4. MASINA */}
                <div style={{flex: '1 1 200px'}}>
                    <label>Mașina:</label>
                    <select value={selMasina} onChange={e=>setSelMasina(e.target.value)} required style={{width:'100%', padding:'8px'}}>
                        <option value="">-- Alege Mașina --</option>
                        {masini.map(m => <option key={m.nrInmatriculare} value={m.nrInmatriculare}>{m.marca} - {m.nrInmatriculare}</option>)}
                    </select>
                </div>

                {/* 5. DATA */}
                <div style={{flex: '1 1 150px'}}>
                    <label>Data Start:</label>
                    <input type="date" value={dataStart} onChange={e=>setDataStart(e.target.value)} required style={{width:'100%', padding:'8px'}}/>
                </div>

                {/* 6. PLATA */}
                <div style={{flex: '1 1 150px'}}>
                    <label>Plată:</label>
                    <select value={starePlata} onChange={e=>setStarePlata(e.target.value)} style={{width:'100%', padding:'8px'}}>
                        <option value="Neplatit">Neplătit</option>
                        <option value="Avans">Avans</option>
                        <option value="Achitat">Achitat</option>
                    </select>
                </div>

                <button onClick={handleSave} style={{width: '100%', marginTop: '10px'}}>Salvează și Sincronizează</button>
            </div>

            <table className="elevi-table">
                <thead>
                <tr>
                    <th>Elev</th>
                    <th>Curs</th>
                    <th>Instructor</th>
                    <th>Mașina</th>
                    <th>Data</th>
                    <th>Plată</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {inscrieri.map((item, idx) => (
                    <tr key={idx}>
                        <td>{item.elev?.nume} {item.elev?.prenume}</td>
                        <td>{item.curs?.denumire}</td>
                        <td>{item.instructor ? `${item.instructor.nume} ${item.instructor.prenume}` : '-'}</td>
                        <td>{item.masina ? `${item.masina.marca} (${item.masina.nrInmatriculare})` : '-'}</td>
                        <td>{item.dataStart}</td>
                        <td style={{fontWeight: 'bold', color: item.starePlata==='Achitat'?'green':'red'}}>
                            {item.starePlata}
                        </td>
                        <td>
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(item.id.idElev, item.id.idCurs)}>
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

export default InscrieriPage;