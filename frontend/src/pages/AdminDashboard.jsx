import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pendingContracts: 0,
    totalContracts: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/jobs/stats')
      
      // Fetch contract stats
      const contractResponse = await api.get('/admin/contracts')
      const pendingContracts = contractResponse.data.contracts.filter(contract => contract.status === 'Under Review').length
      
      setStats({
        ...response.data,
        pendingContracts,
        totalContracts: contractResponse.data.contracts.length
      })
      setError('')
    } catch (err) {
      setError('Failed to fetch dashboard statistics')
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    // Redirect to login page
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <div className="loading-message">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="header-actions">
          <Link to="/admin/jobs" className="btn btn-primary">
            Manage Jobs
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-title">Total Jobs</div>
          <div className="metric-value">{stats.totalJobs}</div>
          <div className="metric-trend">All time</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Active Jobs</div>
          <div className="metric-value">{stats.activeJobs}</div>
          <div className="metric-trend">Currently open</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Pending Contracts</div>
          <div className="metric-value">{stats.pendingContracts}</div>
          <div className="metric-trend">Awaiting review</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Total Contracts</div>
          <div className="metric-value">{stats.totalContracts}</div>
          <div className="metric-trend">All time</div>
        </div>
      </div>

      <div className="jobs-section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        
        <div className="quick-actions-grid">
          <Link to="/admin/jobs" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            View All Jobs
          </Link>
          <Link to="/admin/jobs/new" className="btn btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Create New Job
          </Link>
          <Link to="/admin/contracts" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Manage Contracts
          </Link>
          <Link to="/admin/contracts?status=Under%20Review" className="btn btn-primary" style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
            Review Pending Contracts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard