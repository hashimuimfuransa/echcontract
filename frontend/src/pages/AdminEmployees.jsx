import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/admin.css'

export default function AdminEmployees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const token = localStorage.getItem('token')

  const fetchEmployees = async (pageNum, status) => {
    try {
      const params = new URLSearchParams({ page: pageNum, limit: 20 })
      if (status) params.append('status', status)

      const { data } = await api.get(`/admin/employees?${params}`)
      setEmployees(data.employees)
      setPagination(data.pagination)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees(page, statusFilter)
  }, [page, statusFilter, token])

  const [updatingId, setUpdatingId] = useState(null)
  const [updateError, setUpdateError] = useState('')

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      setUpdatingId(employeeId)
      setUpdateError('')
      await api.patch(`/admin/employees/${employeeId}/status`, { status: newStatus })
      fetchEmployees(page, statusFilter)
      setUpdatingId(null)
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'Failed to update status')
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <div className="header">
        <h1 className="header-title">Manage Employees</h1>
        <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {updateError && <div className="alert alert-error">{updateError}</div>}

        <div className="card">
          <div className="filter-section">
            <div className="filter-header">
              <h3>👥 Employee Management</h3>
              <p>View and manage all employees in your organization</p>
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Filter by Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="active">✅ Active</option>
                  <option value="inactive">⚠️ Inactive</option>
                  <option value="terminated">❌ Terminated</option>
                </select>
              </div>
              {pagination && (
                <div className="filter-stats">
                  <span className="stats-count">Total: {pagination.total} employees</span>
                  {statusFilter && (
                    <span className="stats-filtered">
                      Filtered: {employees.length} {statusFilter} employees
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
              <h3>Loading employees...</h3>
              <p>Please wait while we fetch employee data</p>
            </div>
          ) : employees.length > 0 ? (
            <>
              <div className="employees-grid">
                {employees.map((emp) => (
                  <div key={emp._id} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-avatar">
                        <span>{emp.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="employee-info">
                        <h4>{emp.name}</h4>
                        <p>{emp.position || 'No position specified'}</p>
                      </div>
                      <div className="employee-status">
                        <span className={`status-badge badge-${emp.status === 'active' ? 'success' : emp.status === 'inactive' ? 'warning' : 'danger'}`}>
                          {emp.status === 'active' && '✅'} {emp.status === 'inactive' && '⚠️'} {emp.status === 'terminated' && '❌'} {emp.status}
                        </span>
                      </div>
                    </div>

                    <div className="employee-details">
                      <div className="detail-item">
                        <span className="detail-icon">📧</span>
                        <span className="detail-text">{emp.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>
                        <span className="detail-text">Joined {new Date(emp.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-icon">{emp.verified ? '✅' : '❌'}</span>
                        <span className="detail-text">{emp.verified ? 'Verified' : 'Not verified'}</span>
                      </div>
                    </div>

                    <div className="employee-actions">
                      <select
                        value={emp.status}
                        onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                        disabled={updatingId === emp._id}
                        className="status-select"
                      >
                        <option value="active">Set Active</option>
                        <option value="inactive">Set Inactive</option>
                        <option value="terminated">Terminate</option>
                      </select>
                      {updatingId === emp._id && (
                        <div className="updating-indicator">
                          <div className="mini-spinner"></div>
                          <span>Updating...</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <div className="pagination-info">
                    <span className="page-current">Page {pagination.page}</span>
                    <span className="page-total">of {pagination.pages}</span>
                  </div>
                  <button
                    className="pagination-btn"
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>No employees found</h3>
              <p>
                {statusFilter
                  ? `No employees found with status "${statusFilter}". Try selecting a different filter.`
                  : 'There are no employees registered in the system yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
