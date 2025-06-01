import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Navbar from './components/Navbar';

import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditingTask(taskToEdit);
    setTaskText(taskToEdit.text);
  };

  const saveEdit = () => {
    setTasks(tasks.map((task) =>
      task.id === editingTask.id ? { ...task, text: taskText } : task
    ));
    setEditingTask(null);
    setTaskText('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setTaskText('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setTasks([]);
  };

  const TaskPage = () => (
    <div className="App">
      <h1>To-Do List</h1>
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
      <Navbar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/todo" /> : <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/todo" /> : <SignUpForm />}
        />
        <Route
          path="/todo"
          element={isAuthenticated ? <TaskPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
