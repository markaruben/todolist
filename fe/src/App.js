import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/LoginForm';
import SignUpForm from './components/SignUpForm';

import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditingTask(taskToEdit);
    setTaskText(taskToEdit.text);
  };

  const saveEdit = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editingTask.id ? { ...task, text: taskText } : task
    );
    setTasks(updatedTasks);
    setEditingTask(null);
    setTaskText('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTaskText('');
  };

  const TaskPage = () => (
  <div className="App">
    <h1>To-Do List</h1>
    <button
      style={{
        backgroundColor: '#ff4c4c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '10px 15px',
        cursor: 'pointer',
        marginBottom: '15px'
      }}
      onClick={handleLogout}
    >
      Logout
    </button>
    <TaskForm onAdd={addTask} />
    {editingTask && (
      <div className="edit-form">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={saveEdit}>Salvează</button>
        <button onClick={cancelEdit}>Anulează</button>
      </div>
    )}
    <TaskList
      tasks={tasks}
      onDelete={deleteTask}
      onToggle={toggleTask}
      onEdit={startEditing}
    />
  </div>
);


  return (
    <Router>
      <Routes>
      <Route path="/register" element={<SignUpForm />} />
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/todo" element={isAuthenticated ? <TaskPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
