import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // <--- FIX: Importăm funcția explicit
import '../App.css';

function StatisticiPage() {
    // =====================================================================
    // 1. STATE-URI PENTRU DATE
    // =====================================================================
    const [statInstructori, setStatInstructori] = useState([]);
    const [statBani, setStatBani] = useState([]);
    const [statMasini, setStatMasini] = useState([]);
    const [eleviPremium, setEleviPremium] = useState([]);
    const [masiniLibere, setMasiniLibere] = useState([]);
    const [instrAglomerati, setInstrAglomerati] = useState([]);
    const [topCurs, setTopCurs] = useState([]);
    const [rapElevInstr, setRapElevInstr] = useState([]);
    const [rapElevMasina, setRapElevMasina] = useState([]);
    const [rapElevCurs, setRapElevCurs] = useState([]);

    const [loading, setLoading] = useState(true);

    // =====================================================================
    // 2. FETCH DATA
    // =====================================================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10] = await Promise.all([
                    axios.get('http://localhost:8080/api/statistici/instructori'),
                    axios.get('http://localhost:8080/api/statistici/bani'),
                    axios.get('http://localhost:8080/api/statistici/masini'),
                    axios.get('http://localhost:8080/api/statistici/elevi-premium'),
                    axios.get('http://localhost:8080/api/statistici/masini-neutilizate'),
                    axios.get('http://localhost:8080/api/statistici/instructori-top'),
                    axios.get('http://localhost:8080/api/statistici/top-curs'),
                    axios.get('http://localhost:8080/api/statistici/raport-elev-instructor'),
                    axios.get('http://localhost:8080/api/statistici/raport-elev-masina'),
                    axios.get('http://localhost:8080/api/statistici/raport-elev-curs')
                ]);

                setStatInstructori(r1.data);
                setStatBani(r2.data);
                setStatMasini(r3.data);
                setEleviPremium(r4.data);
                setMasiniLibere(r5.data);
                setInstrAglomerati(r6.data);
                setTopCurs(r7.data);
                setRapElevInstr(r8.data);
                setRapElevMasina(r9.data);
                setRapElevCurs(r10.data);

            } catch (err) {
                console.error("Eroare la incarcare statistici:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // =====================================================================
    // 3. FUNCȚIE EXPORT PDF (REPARATĂ)
    // =====================================================================
    const exportPDF = () => {
        const doc = new jsPDF();

        // Titlu Principal
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("Raport Activitate - Ready2Drive", 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generat la: ${new Date().toLocaleString()}`, 14, 28);

        let finalY = 35; // Cursorul vertical

        // Helper pentru adăugare tabel în PDF
        const addSection = (title, headers, data) => {
            // Verificăm dacă mai e loc pe pagină
            if (finalY > 250) {
                doc.addPage();
                finalY = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text(title, 14, finalY);

            // --- FIX: Folosim autoTable(doc, { options }) ---
            autoTable(doc, {
                startY: finalY + 5,
                head: [headers],
                body: data.map(item => [item.eticheta, item.valoare || "-"]),
                theme: 'grid',
                headStyles: { fillColor: [78, 84, 200] },
                didDrawPage: (data) => {
                    // Update cursor after table draw
                    finalY = data.cursor.y + 15;
                }
            });

            // Alternativa pentru a actualiza finalY daca didDrawPage nu e triggeruit corect pe o singura pagina
            if (doc.lastAutoTable) {
                finalY = doc.lastAutoTable.finalY + 15;
            }
        };

        // Adăugăm tabelele
        addSection("1. Performanță Instructori", ["Instructor", "Nr. Elevi"], statInstructori);
        addSection("2. Încasări Financiare", ["Tip Curs", "Total RON"], statBani);
        addSection("3. Grad Utilizare Parc Auto", ["Mașina", "Nr. Curse"], statMasini);
        addSection("4. Elevi Premium", ["Elev", "Preț Achitat"], eleviPremium);

        doc.save('Raport_Ready2Drive.pdf');
    };

    // =====================================================================
    // 4. RENDERING
    // =====================================================================
    const renderListCard = (titlu, iconClass, colorClass, date, descriereValoare = "") => (
        <div className={`nav-card ${colorClass}`} style={{ cursor: 'default', minHeight: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <i className={`fa-solid ${iconClass}`} style={{ fontSize: '1.5rem', opacity: 0.8 }}></i>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{titlu}</h3>
            </div>

            {date.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', marginTop: '50px' }}>
                    <i className="fa-regular fa-folder-open" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                    <p>Nu există date.</p>
                </div>
            ) : (
                <div style={{ overflowY: 'auto', maxHeight: '220px' }}>
                    <table className="mini-table">
                        <thead>
                        <tr>
                            <th style={{textAlign: 'left', paddingLeft: '5px'}}>Nume / Entitate</th>
                            {descriereValoare && <th style={{textAlign: 'right'}}>{descriereValoare}</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {date.map((item, idx) => (
                            <tr key={idx}>
                                <td style={{padding: '10px 5px', borderBottom: '1px solid #f3f4f6'}}>
                                    {item.eticheta}
                                </td>
                                {descriereValoare && (
                                    <td style={{textAlign: 'right', fontWeight: 'bold', color: '#374151'}}>
                                        {item.valoare ? item.valoare : '-'}
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    if (loading) return <div className="App">Se generează rapoartele...</div>;

    return (
        <div className="elevi-page-container" style={{maxWidth: '1200px'}}>

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
                <Link to="/meniu" className="back-button">
                    <i className="fa-solid fa-arrow-left"></i> Meniu Principal
                </Link>

                <button
                    onClick={exportPDF}
                    className="add-button"
                    style={{ background: '#e74c3c', boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4)' }}
                >
                    <i className="fa-solid fa-file-pdf"></i> Descarcă Raport PDF
                </button>
            </div>

            <div style={{textAlign: 'right', marginBottom: '30px'}}>
                <h1 style={{margin: 0, display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end'}}>
                    <i className="fa-solid fa-chart-line" style={{ color: '#8e44ad' }}></i> Dashboard Analitic
                </h1>
                <p style={{color: '#6b7280', margin: '5px 0 0 0', fontSize: '0.9rem'}}>
                    Raportare în timp real din baza de date SQL Server.
                </p>
            </div>

            <div className="dashboard-section-title">
                <i className="fa-solid fa-coins" style={{marginRight: '8px'}}></i> Performanță & Operațiuni
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {renderListCard("Top Instructori (Nr. Elevi)", "fa-user-tie", "card-blue", statInstructori, "Elevi")}
                {renderListCard("Încasări per Curs", "fa-sack-dollar", "card-green", statBani, "RON")}
                {renderListCard("Grad Utilizare Mașini", "fa-car", "card-orange", statMasini, "Curse")}
            </div>

            <div className="dashboard-section-title" style={{ marginTop: '50px' }}>
                <i className="fa-solid fa-brain" style={{marginRight: '8px'}}></i> Business Intelligence
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {renderListCard("Elevi Premium (Peste Medie)", "fa-gem", "card-purple", eleviPremium, "Preț")}
                {renderListCard("Mașini Neutilizate", "fa-ban", "card-orange", masiniLibere, "")}
                {renderListCard("Instructori Aglomerați", "fa-fire", "card-blue", instrAglomerati, "")}
            </div>

            <div style={{ marginTop: '30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '15px', padding: '30px', color: 'white', boxShadow: '0 10px 20px rgba(118, 75, 162, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}><i className="fa-solid fa-trophy"></i> Cel Mai Popular Curs</h3>
                        <p style={{ opacity: 0.8, margin: '5px 0 0 0' }}>Cursul cu cele mai multe înscrieri active.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        {topCurs.length > 0 ? (
                            <>
                                <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'white' }}>{topCurs[0].eticheta}</h2>
                                <span style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                    {topCurs[0].valoare} Înscrieri Totale
                                </span>
                            </>
                        ) : (
                            <span>Date indisponibile</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard-section-title" style={{ marginTop: '50px' }}>
                <i className="fa-solid fa-list-check" style={{marginRight: '8px'}}></i> Rapoarte Detaliate
            </div>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {renderListCard("Alocare Elevi - Instructori", "fa-chalkboard-user", "card-blue", rapElevInstr, "")}
                {renderListCard("Alocare Elevi - Mașini", "fa-car-side", "card-orange", rapElevMasina, "")}
                {renderListCard("Înscrieri pe Tip Curs", "fa-book-open", "card-green", rapElevCurs, "")}
            </div>

            <div style={{height: '50px'}}></div>
        </div>
    );
}

export default StatisticiPage;