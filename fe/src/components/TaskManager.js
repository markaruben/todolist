import React, { useEffect, useState } from 'react';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

export const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5198/api/TodoItems', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Eroare la încărcare');

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Eroare la fetch:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleAdd = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const handleEdit = (id) => {
    console.log(`Editare task cu ID: ${id}`);
  };

  return (
    <div>
      <h2>Lista ta de sarcini</h2>
      <TaskForm onAdd={handleAdd} />
      <TaskList
        tasks={tasks}
        onDelete={handleDelete}
        onToggle={handleToggle}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default TaskManager;
