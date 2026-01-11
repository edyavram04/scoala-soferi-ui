import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

function MasinaFormPage() {
    const { nr } = useParams();
    const isEditMode = Boolean(nr);
    const navigate = useNavigate();

    const [nrInmatriculare, setNr] = useState('');
    const [marca, setMarca] = useState('');
    const [model, setModel] = useState('');
    const [idCategorie, setIdCategorie] = useState('');

    useEffect(() => {
        if (isEditMode) {
            axios.get(`http://localhost:8080/api/masini/${nr}`)
                .then(res => {
                    setNr(res.data.nrInmatriculare);
                    setMarca(res.data.marca);
                    setModel(res.data.model);

                    // EXTRAGEM ID-ul DIN OBIECTUL CATEGORIE
                    if (res.data.categoriePermis) {
                        setIdCategorie(res.data.categoriePermis.id);
                    }
                })
                .catch(err => alert("Eroare la încărcarea datelor!"));
        }
    }, [nr, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { nrInmatriculare, marca, model, idCategorie };

        try {
            if (isEditMode) {
                await axios.put(`http://localhost:8080/api/masini/${nr}`, data);
            } else {
                await axios.post('http://localhost:8080/api/masini', data);
            }
            navigate('/masini');
        } catch (e) {
            console.error(e);
            alert("Eroare la salvare!");
        }
    };

    return (
        <div className="form-container">
            <h1>{isEditMode ? 'Editare Mașină' : 'Mașină Nouă'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nr. Înmatriculare:</label>
                    <input
                        value={nrInmatriculare}
                        onChange={e => setNr(e.target.value)}
                        required
                        disabled={isEditMode} // Nu poți schimba ID-ul la editare!
                    />
                </div>
                <div className="form-group">
                    <label>Marcă:</label>
                    <input value={marca} onChange={e => setMarca(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Model:</label>
                    <input value={model} onChange={e => setModel(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>ID Categorie (ex: 1, 3):</label>
                    <input type="number" value={idCategorie} onChange={e => setIdCategorie(e.target.value)} required />
                </div>

                <div className="form-buttons">
                    <button type="submit">Salvează</button>
                    <button type="button" onClick={() => navigate('/masini')} className="cancel-button">Anulează</button>
                </div>
            </form>
        </div>
    );
}
export default MasinaFormPage;