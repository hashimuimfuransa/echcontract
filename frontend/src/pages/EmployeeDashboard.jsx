import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/employee.css'

export default function EmployeeDashboard() {
  const navigate = useNavigate()
  const [contract, setContract] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const { data } = await api.get('/contracts/me')
        setContract(data.contract)
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Failed to load contract')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchContract()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleDownloadPdf = async () => {
    if (!contract?._id) return
    try {
      setDownloading(true)
      const response = await api.get(`/contracts/${contract._id}/pdf`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `contract-${user.name}.pdf`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo-container">
            <img src="/logo1.png" alt="Excellence Coaching Hub" style={{ height: '60px', width: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          </div>
          <div>
            <h1 className="header-title">👤 Employee Portal</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 0, fontSize: '16px' }}>Welcome back, <strong>{user.name}</strong></p>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
          🚪 Logout
        </button>
      </div>

      <div className="container">
        {error && <div className="alert alert-error"><span>⚠️</span><div>{error}</div></div>}

        <div className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-content">
              <h2>👋 Welcome to Your Employee Portal</h2>
              <p>Manage your employment contract and track your progress</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-number">{contract ? (contract.status === 'Approved' ? '1' : '0') : '0'}</span>
                <span className="stat-label">Approved</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{contract ? (contract.status === 'Under Review' ? '1' : '0') : '0'}</span>
                <span className="stat-label">In Review</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{contract ? '1' : '0'}</span>
                <span className="stat-label">Contracts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="profile-card">
            <div className="card-header">
              <div className="card-icon">👤</div>
              <h2>My Profile</h2>
            </div>
            <div className="profile-grid">
              <div className="profile-item">
                <div className="profile-icon">👨‍💼</div>
                <div className="profile-content">
                  <p className="profile-label">Full Name</p>
                  <p className="profile-value">{user.name}</p>
                </div>
              </div>
              <div className="profile-item">
                <div className="profile-icon">📧</div>
                <div className="profile-content">
                  <p className="profile-label">Email Address</p>
                  <p className="profile-value">{user.email}</p>
                </div>
              </div>
              <div className="profile-item">
                <div className="profile-icon">💼</div>
                <div className="profile-content">
                  <p className="profile-label">Position</p>
                  <p className="profile-value">{user.position || 'Not specified'}</p>
                </div>
              </div>
              <div className="profile-item">
                <div className="profile-icon">🔑</div>
                <div className="profile-content">
                  <p className="profile-label">Role</p>
                  <p className="profile-value">{user.role}</p>
                </div>
              </div>
            </div>
          </div>

          {contract && (<div className="contract-card">
            <div className="card-header">
              <div className="card-icon">📄</div>
              <h2>My Employment Contract</h2>
            </div>

            <div className={`contract-status-card ${contract.status === 'Approved' ? 'approved' : contract.status === 'Rejected' ? 'rejected' : 'pending'}`}>
              <div className="status-content">
                <div className="status-main">
                  <span className="status-icon">
                    {contract.status === 'Approved' && '✓'} {contract.status === 'Rejected' && '✕'} {contract.status === 'Under Review' && '⏳'}
                  </span>
                  <div>
                    <h3>Contract Status</h3>
                    <span className={`status-badge badge-${contract.status === 'Approved' ? 'success' : contract.status === 'Rejected' ? 'danger' : 'warning'}`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
                <div className="status-meta">
                  <span className="meta-label">Submitted</span>
                  <span className="meta-value">{new Date(contract.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="contract-alerts">
              {contract.status === 'Rejected' && (
                <div className="alert-card error">
                  <div className="alert-icon">❌</div>
                  <div className="alert-content">
                    <h4>Action Required</h4>
                    <p>Please review the feedback and resubmit your contract with corrections.</p>
                  </div>
                </div>
              )}

              {contract.status === 'Under Review' && (
                <div className="alert-card info">
                  <div className="alert-icon">⏳</div>
                  <div className="alert-content">
                    <h4>Under Review</h4>
                    <p>Your contract is being reviewed by HR. You'll receive an email notification once it's processed.</p>
                  </div>
                </div>
              )}

              {contract.status === 'Approved' && (
                <div className="alert-card success">
                  <div className="alert-icon">✓</div>
                  <div className="alert-content">
                    <h4>Congratulations!</h4>
                    <p>Your employment contract has been approved. You can download your contract below.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="contract-actions">
              {contract.status === 'Approved' && (
                <button
                  className="action-btn primary"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                >
                  <span className="btn-icon">📥</span>
                  <span className="btn-text">{downloading ? 'Downloading...' : 'Download Contract PDF'}</span>
                </button>
              )}

              {(contract.status === 'Rejected' || contract.status === 'Draft') && (
                <Link to={`/employee/contract-from-job?jobId=${contract.job?._id || ''}`} className="action-btn primary">
                  <span className="btn-icon">✏️</span>
                  <span className="btn-text">Update & Resubmit Contract</span>
                </Link>
              )}

              {contract.status === 'Under Review' && (
                <Link to={`/employee/contract-from-job?jobId=${contract.job?._id || ''}`} className="action-btn secondary">
                  <span className="btn-icon">👁️</span>
                  <span className="btn-text">View Contract Details</span>
                </Link>
              )}
            </div>

            {contract.history && contract.history.length > 0 && (
              <div className="contract-history">
                <div className="history-header">
                  <div className="card-icon">📊</div>
                  <h3>Contract History</h3>
                </div>
                <div className="history-timeline">
                  {contract.history.map((entry, idx) => (
                    <div key={idx} className="history-entry">
                      <div className="history-marker">
                        <span className="history-icon">
                          {entry.status === 'Approved' && '✓'} {entry.status === 'Rejected' && '✕'} {entry.status === 'Under Review' && '⏳'}
                        </span>
                      </div>
                      <div className="history-content">
                        <div className="history-status">{entry.status}</div>
                        <div className="history-time">
                          🕐 {new Date(entry.changedAt).toLocaleString()}
                        </div>
                        {entry.note && <div className="history-note">{entry.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>)}
          {!contract && (<div className="empty-state-card">
            <div className="empty-state-content">
              <div className="empty-icon">📋</div>
              <h2>Get Started with Your Contract</h2>
              <p>You haven't submitted an employment contract yet. Browse available positions or create your contract now.</p>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <Link to="/jobs" className="action-btn primary" style={{ marginBottom: '10px' }}>
                  <span className="btn-icon">💼</span>
                  <span className="btn-text">Browse Available Jobs</span>
                </Link>
                <Link to="/jobs" className="action-btn primary">
                  <span className="btn-icon">✍️</span>
                  <span className="btn-text">Apply for a Job</span>
                </Link>
              </div>
            </div>
          </div>
          )}
        </div>

        <div style={{ marginTop: '40px' }}>
          <div className="section-header">
            <h2>💼 Quick Actions</h2>
            <p>Access key features</p>
          </div>
          <div className="quick-actions-grid">
            <Link to="/jobs" className="action-card">
              <div className="action-icon">💼</div>
              <div className="action-content">
                <h4>Browse Jobs</h4>
                <p>Explore available job positions and find opportunities that match your interests</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
            <Link to="/jobs" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h4>Apply for Jobs</h4>
                <p>Find and apply for available positions</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
