import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    applications: 0,
    interviews: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/dashboard/stats')
      setStats(response.data.stats)
      setError('')
    } catch (err) {
      setError('Failed to fetch dashboard statistics')
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
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
        <Link to="/admin/jobs" className="btn btn-primary">
          Manage Jobs
        </Link>
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
          <div className="metric-title">Applications</div>
          <div className="metric-value">{stats.applications}</div>
          <div className="metric-trend">This month</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-title">Interviews</div>
          <div className="metric-value">{stats.interviews}</div>
          <div className="metric-trend">Scheduled</div>
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
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard