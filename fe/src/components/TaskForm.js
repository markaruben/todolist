import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5198/api/TodoItems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: input,
          isCompleted: false
        })
      });

      if (response.ok) {
        const newTask = await response.json();
        onAdd(newTask);
        setInput('');
      } else {
        console.error('Eroare la adăugare sarcină');
      }
    } catch (error) {
      console.error('Eroare de rețea:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Adaugă o sarcină..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Adaugă</button>
    </form>
  );
};

export default TaskForm;
