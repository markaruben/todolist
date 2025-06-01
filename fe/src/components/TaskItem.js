import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
  const token = localStorage.getItem('token');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleDelete = async () => {
    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    onDelete(task.id);
  };

  const handleToggle = async () => {
    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        isCompleted: !task.isCompleted,
      })
    });
    onToggle(task.id);
  };

  const handleEditSave = async () => {
    // Trimite update la backend cu titlul editat
    const response = await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: task.id,
        title: editTitle,
        isCompleted: task.isCompleted,
      }),
    });

    if (response.ok) {
      onEdit(task.id, editTitle);
      setIsEditing(false);
    } else {
      alert('Eroare la salvarea task-ului.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggle}
      />

      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEditSave}
          autoFocus
        />
      ) : (
        <span className="task-title">{task.title}</span>
      )}

      <button onClick={handleDelete}>Șterge</button>
      {!isEditing && <button onClick={() => setIsEditing(true)}>Editează</button>}
    </li>
  );
};

export default TaskItem;
