// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectDashboard from './pages/ProjectDashboard';
import WorkspaceView from './pages/WorkspaceView';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectDashboard />} />
        <Route path="/workspace/:projectId" element={<WorkspaceView />} />
      </Routes>
    </Router>
  );
}

export default App;