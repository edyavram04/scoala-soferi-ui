import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

function StatisticiPage() {
    // =====================================================================
    // 1. STATE-URI PENTRU DATE (Aici stocăm ce vine de la Java)
    // =====================================================================

    // --- A. Statistici de Bază (Group By & Join) ---
    const [statInstructori, setStatInstructori] = useState([]);
    const [statBani, setStatBani] = useState([]);
    const [statMasini, setStatMasini] = useState([]);

    // --- B. Statistici Complexe (Cu Subcereri SQL) ---
    const [eleviPremium, setEleviPremium] = useState([]);
    const [masiniLibere, setMasiniLibere] = useState([]);
    const [instrAglomerati, setInstrAglomerati] = useState([]);
    const [topCurs, setTopCurs] = useState([]);

    // --- C. Rapoarte de Legătură (Simple Joins - pt. cerința de 6 join-uri) ---
    const [rapElevInstr, setRapElevInstr] = useState([]);
    const [rapElevMasina, setRapElevMasina] = useState([]);
    const [rapElevCurs, setRapElevCurs] = useState([]);

    // =====================================================================
    // 2. FETCH DATA (Cererile către Backend)
    // =====================================================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                // --- A. Cereri Statistici Bază ---
                const r1 = await axios.get('http://localhost:8080/api/statistici/instructori');
                setStatInstructori(r1.data);

                const r2 = await axios.get('http://localhost:8080/api/statistici/bani');
                setStatBani(r2.data);

                const r3 = await axios.get('http://localhost:8080/api/statistici/masini');
                setStatMasini(r3.data);

                // --- B. Cereri Statistici Complexe ---
                const r4 = await axios.get('http://localhost:8080/api/statistici/elevi-premium');
                setEleviPremium(r4.data);

                const r5 = await axios.get('http://localhost:8080/api/statistici/masini-neutilizate');
                setMasiniLibere(r5.data);

                const r6 = await axios.get('http://localhost:8080/api/statistici/instructori-top');
                setInstrAglomerati(r6.data);

                const r7 = await axios.get('http://localhost:8080/api/statistici/top-curs');
                setTopCurs(r7.data);

                // --- C. Cereri Rapoarte Simple ---
                const r8 = await axios.get('http://localhost:8080/api/statistici/raport-elev-instructor');
                setRapElevInstr(r8.data);

                const r9 = await axios.get('http://localhost:8080/api/statistici/raport-elev-masina');
                setRapElevMasina(r9.data);

                const r10 = await axios.get('http://localhost:8080/api/statistici/raport-elev-curs');
                setRapElevCurs(r10.data);

            } catch (err) {
                console.error("Eroare la incarcare statistici (Verifică Java!):", err);
            }
        };
        fetchData();
    }, []);

    // =====================================================================
    // 3. HELPER VIZUAL (Funcție care desenează un tabel/card)
    // =====================================================================
    const renderTable = (titlu, date, descriereValoare = "Valoare") => (
        <div className="stat-card">
            <h3>{titlu}</h3>
            {date.length === 0 ? <p style={{color: '#888', fontStyle: 'italic'}}>Nu sunt date disponibile...</p> : (
                <table className="mini-table">
                    <thead>
                    <tr>
                        <th>Descriere / Nume</th>
                        <th>{descriereValoare}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {date.map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.eticheta}</td>
                            <td style={{fontWeight: 'bold', color: '#333'}}>
                                {item.valoare !== 0 ? item.valoare : ''}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    // =====================================================================
    // 4. RANDAREA PAGINII (HTML-ul final)
    // =====================================================================
    return (
        <div className="elevi-page-container">
            {/* Header și Buton Înapoi */}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px'}}>
                <Link to="/meniu" className="back-button" style={{textDecoration: 'none'}}>⬅ Înapoi la Meniu</Link>
                <h1 style={{margin: 0}}>📊 Dashboard Analitic</h1>
                <div style={{width: '100px'}}></div> {/* Spacer pt centrare */}
            </div>

            <p style={{textAlign: 'center', color: '#666', marginBottom: '40px'}}>
                Vizualizare în timp real a datelor din baza de date SQL Server.
            </p>

            {/* --- SECTIUNEA 1 --- */}
            <div className="section-header">
                <h2>📈 Statistici Generale (Agregări)</h2>
                <p>Rapoarte bazate pe funcții de grupare (GROUP BY) și sume.</p>
            </div>
            <div className="stats-grid">
                {renderTable("👨‍🏫 Top Instructori", statInstructori, "Nr. Elevi")}
                {renderTable("💰 Încasări Totale per Curs", statBani, "RON")}
                {renderTable("🚗 Grad de Utilizare Mașini", statMasini, "Nr. Curse")}
            </div>

            {/* --- SECTIUNEA 2 --- */}
            <div className="section-header" style={{marginTop: '50px'}}>
                <h2>🧠 Statistici Complexe (Subcereri SQL)</h2>
                <p>Interogări avansate care folosesc Subqueries, Nested Selects, NOT IN, HAVING.</p>
            </div>
            <div className="stats-grid">
                {renderTable("💎 Elevi Premium (Preț > Medie)", eleviPremium, "Preț Curs")}
                {renderTable("💤 Mașini Neutilizate (NOT IN)", masiniLibere, "-")}
                {renderTable("🔥 Instructori Aglomerați (>2 elevi)", instrAglomerati, "-")}
                {renderTable("🏆 Cel mai popular curs (MAX)", topCurs, "Total Înscrieri")}
            </div>

            {/* --- SECTIUNEA 3 --- */}
            <div className="section-header" style={{marginTop: '50px'}}>
                <h2>🔗 Rapoarte de Legătură (Join-uri Simple)</h2>
                <p>Liste complete generate prin unirea tabelelor principale.</p>
            </div>
            <div className="stats-grid">
                {renderTable("Elevi alocați la Instructori", rapElevInstr, "-")}
                {renderTable("Elevi alocați la Mașini", rapElevMasina, "-")}
                {renderTable("Elevi înscriși la Cursuri", rapElevCurs, "-")}
            </div>

            <div style={{height: '80px'}}></div> {/* Spațiu jos */}
        </div>
    );
}

export default StatisticiPage;