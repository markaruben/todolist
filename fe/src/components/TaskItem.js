import React from 'react';

const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
    return (
      <li>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        {task.text}
        <button onClick={() => onDelete(task.id)}>Șterge</button>
        <button onClick={() => onEdit(task.id)}>Editează</button>
      </li>
    );
  };
  
  
export default TaskItem;
