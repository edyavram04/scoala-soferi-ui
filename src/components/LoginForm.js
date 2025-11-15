import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. Importă useNavigate

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate(); // 2. Inițializează "unealta" de navigare

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: username,
                password: password
            });

            setLoading(false);

            // 3. AICI E SCHIMBAREA
            // În loc de alertă, navigăm la pagina /meniu
            navigate('/meniu');

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'A apărut o eroare');
            } else {
                setError('Eroare de conexiune. Backend-ul este pornit?');
            }
        }
    };

    return (
        // ... restul formularului (JSX-ul) rămâne neschimbat ...
        <div className="login-container">
            <h2>Autentificare Admin</h2>
            <form onSubmit={handleSubmit}>
                {/* ... câmpul username ... */}
                <div className="form-group">
                    <label htmlFor="username">Utilizator:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                {/* ... câmpul password ... */}
                <div className="form-group">
                    <label htmlFor="password">Parolă:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Se încarcă...' : 'Intră în cont'}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;