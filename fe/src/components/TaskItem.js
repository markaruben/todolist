import React, { useState } from "react";

import "./TaskItem.css";
const TaskItem = ({ task, onDelete, onToggle, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    onDelete(task.id);
  };

  const handleToggle = async () => {
    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: task.id,
        title: task.title,
        isCompleted: !task.isCompleted,
      }),
    });
    onToggle(task.id);
  };

  const handleSave = async () => {
    if (editTitle.trim() === "") return;

    await fetch(`http://localhost:5198/api/TodoItems/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    <li className={`task-item ${task.isCompleted ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={handleToggle}
      />

      {isEditing ? (
        <>
          <input
            className="edit-input"
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button className="btn btn-save" onClick={handleSave}>
            Salvează
          </button>
          <button
            className="btn btn-cancel"
            onClick={() => setIsEditing(false)}
          >
            Anulează
          </button>
        </>
      ) : (
        <>
          <span className="task-title">{task.title}</span>
          <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
            Editează
          </button>
          <button className="btn btn-delete" onClick={handleDelete}>
            Șterge
          </button>
        </>
      )}
    </li>
  );
};

export default TaskItem;
