import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error(await response.text());

      alert('Înregistrare reușită! Te poți autentifica.');
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="login-form">
      <h2>Înregistrare</h2>
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
      <button type="submit">Înregistrează-te</button>
    </form>
  );
};

export default SignUpForm;
