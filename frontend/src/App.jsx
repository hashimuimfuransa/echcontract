import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import EmployeeDashboard from './pages/EmployeeDashboard'
// Removed ContractForm import
import AdminDashboard from './pages/AdminDashboard'
import AdminEmployees from './pages/AdminEmployees'
import AdminContracts from './pages/AdminContracts'
import AdminJobsManagement from './pages/AdminJobsManagement'
import JobListings from './pages/JobListings'
import JobDetails from './pages/JobDetails'
import ContractFromJob from './pages/ContractFromJob'
import VerifyEmail from './pages/VerifyEmail'
import VerifyContract from './pages/VerifyContract'
import './styles/App.css'

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      const userData = JSON.parse(user)
      setIsAuthenticated(true)
      setUserRole(userData.role)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/employee'} />
  }

  return children
}

export default function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/verify/contract/:contractId" element={<VerifyContract />} />
        
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        {/* Removed standalone contract form route */}
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contracts"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminContracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminJobsManagement />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/jobs"
          element={
            <ProtectedRoute requiredRole="employee">
              <JobListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute requiredRole="employee">
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/contract-from-job"
          element={
            <ProtectedRoute requiredRole="employee">
              <ContractFromJob />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}