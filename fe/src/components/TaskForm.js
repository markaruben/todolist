import React, { useState } from 'react';

const TaskForm = ({ onAdd }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      onAdd(input);
      setInput('');
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
