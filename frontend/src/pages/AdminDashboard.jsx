import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/admin/dashboard/metrics')
        setMetrics(data)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo-container">
            <img src="/logo1.png" alt="Excellence Coaching Hub" style={{ height: '60px', width: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          </div>
          <div>
            <h1 className="header-title">🏢 Admin Dashboard</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 0, fontSize: '16px' }}>Welcome back, <strong>{user.name}</strong></p>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
          🚪 Logout
        </button>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>👋 Welcome to Your Admin Portal</h2>
              <p>Monitor your organization's performance and manage employees efficiently</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-number">{metrics?.totalEmployees || 0}</span>
                <span className="stat-label">Total Employees</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{metrics?.activeEmployees || 0}</span>
                <span className="stat-label">Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{metrics?.approvedContracts || 0}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <Link to="/admin/employees" className="nav-link">
            <div className="nav-icon">👥</div>
            <div className="nav-content">
              <span className="nav-title">Manage Employees</span>
              <span className="nav-desc">View and manage all employees</span>
            </div>
          </Link>
          <Link to="/admin/contracts" className="nav-link">
            <div className="nav-icon">📄</div>
            <div className="nav-content">
              <span className="nav-title">Review Contracts</span>
              <span className="nav-desc">Approve or reject contracts</span>
            </div>
          </Link>
        </nav>

        <div className="section-header">
          <h2>📊 System Overview</h2>
          <p>Real-time metrics and insights</p>
        </div>

        {loading ? (
          <div className="card loading-card">
            <div className="loading-content">
              <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
              <h3>Loading dashboard metrics...</h3>
              <p>Please wait while we fetch your data</p>
            </div>
          </div>
        ) : metrics ? (
          <>
            <div className="metrics-grid">
              <div className="metric-card primary">
                <div className="metric-icon">👥</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.totalEmployees}</div>
                  <div className="metric-label">Total Employees</div>
                  <div className="metric-desc">All registered users</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card success">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.activeEmployees}</div>
                  <div className="metric-label">Active Employees</div>
                  <div className="metric-desc">Currently active</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card warning">
                <div className="metric-icon">⚠️</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.inactiveEmployees}</div>
                  <div className="metric-label">Inactive Employees</div>
                  <div className="metric-desc">Need attention</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card info">
                <div className="metric-icon">📄</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.totalContracts}</div>
                  <div className="metric-label">Total Contracts</div>
                  <div className="metric-desc">All contracts</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card pending">
                <div className="metric-icon">⏳</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.pendingContracts}</div>
                  <div className="metric-label">Pending Review</div>
                  <div className="metric-desc">Awaiting action</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card approved">
                <div className="metric-icon">🎉</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.approvedContracts}</div>
                  <div className="metric-label">Approved</div>
                  <div className="metric-desc">Finalized</div>
                </div>
                <div className="metric-accent"></div>
              </div>
              <div className="metric-card rejected">
                <div className="metric-icon">❌</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.rejectedContracts}</div>
                  <div className="metric-label">Rejected</div>
                  <div className="metric-desc">Need updates</div>
                </div>
                <div className="metric-accent"></div>
              </div>
            </div>

            <div className="quick-actions-section">
              <div className="section-header">
                <h3>⚡ Quick Actions</h3>
                <p>Common tasks and shortcuts</p>
              </div>
              <div className="quick-actions-grid">
                <Link to="/admin/contracts" className="action-card">
                  <div className="action-icon">📋</div>
                  <div className="action-content">
                    <h4>Review Contracts</h4>
                    <p>Check pending contract submissions</p>
                    {metrics?.pendingContracts > 0 && (
                      <span className="action-badge">{metrics.pendingContracts} pending</span>
                    )}
                  </div>
                  <div className="action-arrow">→</div>
                </Link>
                <Link to="/admin/employees" className="action-card">
                  <div className="action-icon">👥</div>
                  <div className="action-content">
                    <h4>Manage Employees</h4>
                    <p>View and update employee status</p>
                    <span className="action-badge">{metrics?.totalEmployees || 0} total</span>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>
                <Link to="/admin/employees?status=active" className="action-card">
                  <div className="action-icon">✅</div>
                  <div className="action-content">
                    <h4>Active Employees</h4>
                    <p>View all approved employees</p>
                    <span className="action-badge success">{metrics?.activeEmployees || 0} active</span>
                  </div>
                  <div className="action-arrow">→</div>
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
