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
          <div className="card welcome-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white', marginBottom: '30px' }}>
            <div className="welcome-content">
              <h2>👋 Welcome to Your Admin Portal</h2>
              <p>Monitor your organization's performance and manage employees efficiently</p>
            </div>
            <div className="welcome-stats" style={{ display: 'flex', gap: '30px' }}>
              <div className="stat-item">
                <span className="stat-number" style={{ fontSize: '32px', fontWeight: '700', display: 'block' }}>{metrics?.totalEmployees || 0}</span>
                <span className="stat-label" style={{ fontSize: '14px', opacity: '0.9' }}>Total Employees</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ fontSize: '32px', fontWeight: '700', display: 'block' }}>{metrics?.activeEmployees || 0}</span>
                <span className="stat-label" style={{ fontSize: '14px', opacity: '0.9' }}>Active</span>
              </div>
              <div className="stat-item">
                <span className="stat-number" style={{ fontSize: '32px', fontWeight: '700', display: 'block' }}>{metrics?.approvedContracts || 0}</span>
                <span className="stat-label" style={{ fontSize: '14px', opacity: '0.9' }}>Approved</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="admin-nav" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <Link to="/admin/jobs" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', color: '#333', textDecoration: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease' }}>
            <div className="nav-icon" style={{ fontSize: '32px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>💼</div>
            <div className="nav-content">
              <span className="nav-title" style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Manage Job Postings</span>
              <span className="nav-desc" style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Create and manage job positions</span>
            </div>
          </Link>
          <Link to="/admin/employees" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', color: '#333', textDecoration: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease' }}>
            <div className="nav-icon" style={{ fontSize: '32px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>👥</div>
            <div className="nav-content">
              <span className="nav-title" style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Manage Employees</span>
              <span className="nav-desc" style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>View and manage all employees</span>
            </div>
          </Link>
          <Link to="/admin/contracts" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', color: '#333', textDecoration: 'none', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease' }}>
            <div className="nav-icon" style={{ fontSize: '32px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>📄</div>
            <div className="nav-content">
              <span className="nav-title" style={{ display: 'block', fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: '#1e293b' }}>Review Contracts</span>
              <span className="nav-desc" style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Approve or reject contracts</span>
            </div>
          </Link>
        </nav>

        <div className="section-header" style={{ marginBottom: '25px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>📊 System Overview</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>Real-time metrics and insights</p>
        </div>

        {loading ? (
          <div className="card loading-card" style={{ textAlign: 'center', padding: '60px 30px', background: 'linear-gradient(135deg, #f8f9fa 0%, #e2e8f0 100%)', border: '1px solid rgba(255,255,255,0.8)' }}>
            <div className="loading-content">
              <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '20px' }}>Loading dashboard metrics...</h3>
              <p style={{ margin: 0, color: '#64748b' }}>Please wait while we fetch your data</p>
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
              </div>
              <div className="metric-card success">
                <div className="metric-icon">✅</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.activeEmployees}</div>
                  <div className="metric-label">Active Employees</div>
                  <div className="metric-desc">Currently active</div>
                </div>
              </div>
              <div className="metric-card warning">
                <div className="metric-icon">⚠️</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.inactiveEmployees}</div>
                  <div className="metric-label">Inactive Employees</div>
                  <div className="metric-desc">Need attention</div>
                </div>
              </div>
              <div className="metric-card info">
                <div className="metric-icon">📄</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.totalContracts}</div>
                  <div className="metric-label">Total Contracts</div>
                  <div className="metric-desc">All contracts</div>
                </div>
              </div>
              <div className="metric-card pending">
                <div className="metric-icon">⏳</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.pendingContracts}</div>
                  <div className="metric-label">Pending Review</div>
                  <div className="metric-desc">Awaiting action</div>
                </div>
              </div>
              <div className="metric-card approved">
                <div className="metric-icon">🎉</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.approvedContracts}</div>
                  <div className="metric-label">Approved</div>
                  <div className="metric-desc">Finalized</div>
                </div>
              </div>
              <div className="metric-card rejected">
                <div className="metric-icon">❌</div>
                <div className="metric-content">
                  <div className="metric-value">{metrics.rejectedContracts}</div>
                  <div className="metric-label">Rejected</div>
                  <div className="metric-desc">Need updates</div>
                </div>
              </div>
            </div>

            <div className="quick-actions-section">
              <div className="section-header" style={{ marginBottom: '25px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>⚡ Quick Actions</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '16px' }}>Common tasks and shortcuts</p>
              </div>
              <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                <Link to="/admin/jobs" className="action-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', textDecoration: 'none', color: '#333', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease', position: 'relative' }}>
                  <div className="action-icon" style={{ fontSize: '28px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>💼</div>
                  <div className="action-content" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Post New Job</h4>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Create and manage job postings</p>
                  </div>
                  <div className="action-arrow" style={{ fontSize: '20px', color: '#94a3b8', transition: 'all 0.3s ease' }}>→</div>
                </Link>
                <Link to="/admin/contracts" className="action-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', textDecoration: 'none', color: '#333', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease', position: 'relative' }}>
                  <div className="action-icon" style={{ fontSize: '28px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>📋</div>
                  <div className="action-content" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Review Contracts</h4>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>Check pending contract submissions</p>
                    {metrics?.pendingContracts > 0 && (
                      <span className="action-badge" style={{ display: 'inline-block', padding: '4px 8px', background: '#e2e8f0', color: '#475569', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>{metrics.pendingContracts} pending</span>
                    )}
                  </div>
                  <div className="action-arrow" style={{ fontSize: '20px', color: '#94a3b8', transition: 'all 0.3s ease' }}>→</div>
                </Link>
                <Link to="/admin/employees" className="action-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px', background: 'white', textDecoration: 'none', color: '#333', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.8)', transition: 'all 0.3s ease', position: 'relative' }}>
                  <div className="action-icon" style={{ fontSize: '28px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', borderRadius: '12px', color: 'white' }}>👥</div>
                  <div className="action-content" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>Manage Employees</h4>
                    <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>View and update employee status</p>
                    <span className="action-badge" style={{ display: 'inline-block', padding: '4px 8px', background: '#e2e8f0', color: '#475569', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>{metrics?.totalEmployees || 0} total</span>
                  </div>
                  <div className="action-arrow" style={{ fontSize: '20px', color: '#94a3b8', transition: 'all 0.3s ease' }}>→</div>
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}