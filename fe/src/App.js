import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import TaskManager from './components/TaskManager';
import Login from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import Navbar from './components/Navbar';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  const TaskPage = () => (
    <div className="App">
      <h1>To-Do List</h1>
      <TaskManager />
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
