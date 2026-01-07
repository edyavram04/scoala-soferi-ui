import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // STARE NOUĂ: false = ascuns (default), true = vizibil
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });

            setTimeout(() => {
                setLoading(false);
                navigate('/meniu');
            }, 500);

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Date incorecte.');
            } else {
                setError('Eroare de conexiune cu serverul.');
            }
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">

                <div className="login-header">
                    <i className="fa-solid fa-car-side"></i>
                    <h2>Ready2Drive</h2>
                    <p>Panou Administrare</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* INPUT USERNAME */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Utilizator"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {/* Iconița din Stânga (User) */}
                        <i className="fa-solid fa-user input-icon"></i>
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="input-group">
                        <input
                            // AICI E TRUCUL: Dacă showPassword e true, e 'text', altfel e 'password'
                            type={showPassword ? "text" : "password"}
                            placeholder="Parolă"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Iconița din Stânga (Lacăt) */}
                        <i className="fa-solid fa-lock input-icon"></i>

                        {/* Iconița din Dreapta (Ochiul) - Butonul de Toggle */}
                        <i
                            className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                            onClick={() => setShowPassword(!showPassword)}
                            title={showPassword ? "Ascunde parola" : "Arată parola"}
                        ></i>
                    </div>

                    {error && (
                        <div className="error-message" style={{justifyContent: 'center'}}>
                            <i className="fa-solid fa-circle-exclamation"></i> {error}
                        </div>
                    )}

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin"></i> Se verifică...</span>
                        ) : (
                            <span>Intră în Cont <i className="fa-solid fa-arrow-right" style={{marginLeft:'5px'}}></i></span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;