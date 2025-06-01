import React, { useState } from 'react';

const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const token = localStorage.getItem('token');

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

  const handleEditSubmit = async () => {
    if (editTitle.trim() === '') return;

    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
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

    onEdit(task.id, editTitle);
    setIsEditing(false);
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggle}
      />
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={handleEditSubmit}>Salvează</button>
          <button onClick={() => { setIsEditing(false); setEditTitle(task.title); }}>Anulează</button>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          <button onClick={() => setIsEditing(true)}>Editează</button>
          <button onClick={handleDelete}>Șterge</button>
        </>
      )}
    </li>
  );
};

export default TaskItem;
