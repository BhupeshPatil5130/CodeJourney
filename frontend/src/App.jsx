import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import CodeGenerator from './pages/CodeGenerator.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import InterviewQuestions from './pages/InterviewQuestions.jsx';
import CodeReviewer from './pages/CodeReviewer.jsx';
import AlgorithmExplainer from './pages/AlgorithmExplainer.jsx';
import RoadmapGenerator from './pages/RoadmapGenerator.jsx';
import TimeComplexityAnalyzer from './pages/TimeComplexityAnalyzer.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
             
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/code-generator" element={
                <ProtectedRoute>
                  <CodeGenerator />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/resume-analyzer" element={
                <ProtectedRoute>
                  <ResumeAnalyzer />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/interview-questions" element={
                <ProtectedRoute>
                  <InterviewQuestions />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/code-reviewer" element={
                <ProtectedRoute>
                  <CodeReviewer />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/algorithm-explainer" element={
                <ProtectedRoute>
                  <AlgorithmExplainer />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/roadmap-generator" element={
                <ProtectedRoute>
                  <RoadmapGenerator />
                </ProtectedRoute>
              } />
              
              <Route path="/tools/complexity-analyzer" element={
                <ProtectedRoute>
                  <TimeComplexityAnalyzer />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 