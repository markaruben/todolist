import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Date incorecte');

      const data = await response.json();
      localStorage.setItem('token', data.Token);
      setIsAuthenticated(true);
      navigate('/todo');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Autentificare</h2>
      <input
        type="text"
        placeholder="Utilizator"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Parolă"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
