import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Main components
import Home from './main/Home';
import About from './main/About';
import Contact from './main/Contact';
import NotFound from './main/NotFound';

// User components
import UserLogin from './user/UserLogin';
import UserRegistration from './user/UserRegistration';
import Dashboard from './user/Dashboard';
import Budgets from './user/Budgets';
import Goals from './user/Goals';
import Reports from './user/Reports';
import Notifications from './user/Notifications';

// Admin components
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import ViewUsers from './admin/ViewUsers';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const storedUserType = localStorage.getItem('userType');
  const isAuthenticated = localStorage.getItem(userType);
  
  if (!isAuthenticated || storedUserType !== userType) {
    return <Navigate to={`/${userType}/login`} replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* User routes */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegistration />} />
          
          {/* Protected user routes */}
          <Route 
            path="/user/dashboard" 
            element={
              <ProtectedRoute userType="user">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/budgets" 
            element={
              <ProtectedRoute userType="user">
                <Budgets />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/goals" 
            element={
              <ProtectedRoute userType="user">
                <Goals />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/reports" 
            element={
              <ProtectedRoute userType="user">
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user/notifications" 
            element={
              <ProtectedRoute userType="user">
                <Notifications />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute userType="admin">
                <AdminHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute userType="admin">
                <ViewUsers />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;