import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
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

  return (
    <li>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggle}
      />
      <span className="task-title">{task.title}</span>
      <button onClick={handleDelete}>Șterge</button>
      <button onClick={() => onEdit(task.id)}>Editează</button>
    </li>
  );
  
};

export default TaskItem;
