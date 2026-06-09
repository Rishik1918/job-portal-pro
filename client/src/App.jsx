import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import CreateJob from './pages/CreateJob';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        
        <Route path="/recruiter-dashboard" element={
          <ProtectedRoute allowedRoles={['Recruiter']}><RecruiterDashboard /></ProtectedRoute>
        } />
        <Route path="/create-job" element={
          <ProtectedRoute allowedRoles={['Recruiter']}><CreateJob /></ProtectedRoute>
        } />
        <Route path="/candidate-dashboard" element={
          <ProtectedRoute allowedRoles={['Candidate']}><CandidateDashboard /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
