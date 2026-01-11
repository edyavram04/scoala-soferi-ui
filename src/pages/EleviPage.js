import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../App.css';

function EleviPage() {
    const [elevi, setElevi] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. State pentru textul de căutare
    const [searchTerm, setSearchTerm] = useState('');

    const fetchElevi = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/elevi');
            setElevi(response.data);
        } catch (err) {
            console.error("Eroare la preluarea elevilor:", err);
            toast.error("Nu s-au putut prelua datele elevilor. 🔴");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchElevi();
    }, []);

    const handleDelete = async (idElev) => {
        if (window.confirm('Ești sigur că vrei să ștergi acest elev?')) {
            try {
                await axios.delete(`http://localhost:8080/api/elevi/${idElev}`);
                toast.success("Elev șters cu succes! 🗑️"); // Notificare Verde
                fetchElevi();
            } catch (err) {
                console.error("Eroare la ștergerea elevului:", err);
                toast.error("Nu s-a putut șterge elevul. Poate are date asociate. ⚠️");
            }
        }
    };

    // 2. Logică de filtrare (Căutare)
    const eleviFiltrati = elevi.filter(elev => {
        if (searchTerm === "") return true; // Dacă nu e scris nimic, arată tot
        const text = searchTerm.toLowerCase();
        return (
            elev.nume.toLowerCase().includes(text) ||
            elev.prenume.toLowerCase().includes(text)
        );
    });

    if (loading) {
        return <div className="App">Se încarcă elevii...</div>;
    }

    return (
        <div className="elevi-page-container">
            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <Link to="/meniu" className="back-button">
                    <i className="fa-solid fa-arrow-left"></i> Meniu
                </Link>
                <Link to="/elevi/nou" className="add-button">
                    <i className="fa-solid fa-plus"></i> Adaugă Elev
                </Link>
            </div>

            <div style={{textAlign: 'center', marginBottom: '30px'}}>
                <h1><i className="fa-solid fa-user-graduate"></i> Gestiune Elevi</h1>
            </div>

            {/*3. BARA DE CĂUTARE MODERNĂ*/}
            <div style={{marginBottom: '25px', position: 'relative', maxWidth: '600px', margin: '0 auto 25px auto'}}>
                <i className="fa-solid fa-magnifying-glass" style={{
                    position: 'absolute',
                    left: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '1.1rem'
                }}></i>
                <input
                    type="text"
                    placeholder="Caută elev după nume sau prenume..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '15px 20px 15px 50px', // Loc pentru iconiță
                        borderRadius: '50px',
                        border: '2px solid #e5e7eb',
                        outline: 'none',
                        fontSize: '1rem',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
            </div>

            <table className="elevi-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nume</th>
                    <th>Prenume</th>
                    <th>Telefon</th>
                    <th>Instructor</th>
                    <th>Acțiuni</th>
                </tr>
                </thead>
                <tbody>
                {/* 4. Mapăm prin lista FILTRATĂ, nu cea completă */}
                {eleviFiltrati.length > 0 ? (
                    eleviFiltrati.map(elev => (
                        <tr key={elev.id}>
                            <td style={{fontWeight: 'bold', color: '#6b7280'}}>#{elev.id}</td>
                            <td style={{fontWeight: '500'}}>{elev.nume}</td>
                            <td style={{fontWeight: '500'}}>{elev.prenume}</td>
                            <td style={{fontFamily: 'monospace'}}>{elev.telefon}</td>
                            <td>
                                {elev.instructor ? (
                                    <span style={{display:'inline-flex', alignItems:'center', gap:'5px', background:'#f3f4f6', padding:'4px 10px', borderRadius:'15px', fontSize:'0.9rem'}}>
                                        <i className="fa-solid fa-user-tie" style={{color:'#4e54c8'}}></i>
                                        {elev.instructor.nume} {elev.instructor.prenume}
                                    </span>
                                ) : (
                                    <span style={{color: '#9ca3af', fontStyle:'italic'}}>N/A</span>
                                )}
                            </td>

                            <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link
                                    to={`/elevi/edit/${elev.id}`}
                                    className="edit-button"
                                    title="Modifică Elev"
                                >
                                    <i className="fa-solid fa-pen"></i>
                                </Link>

                                <button
                                    onClick={() => handleDelete(elev.id)}
                                    className="delete-button"
                                    title="Șterge Elev"
                                >
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{textAlign: 'center', padding: '30px', color: '#9ca3af'}}>
                            <i className="fa-solid fa-search" style={{fontSize: '2rem', marginBottom: '10px', display:'block'}}></i>
                            Nu am găsit niciun elev conform căutării "{searchTerm}".
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default EleviPage;