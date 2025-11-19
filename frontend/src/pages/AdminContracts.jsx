import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import '../styles/admin.css'
import '../styles/contractForm.css'

export default function AdminContracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedContract, setSelectedContract] = useState(null)
  const [contractDetails, setContractDetails] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingFormData, setEditingFormData] = useState({})
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const token = localStorage.getItem('token')

  const fetchContracts = async (pageNum, status) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: pageNum, limit: 20 })
      if (status) params.append('status', status)

      const { data } = await api.get(`/admin/contracts?${params}`)
      setContracts(data.contracts)
      setPagination(data.pagination)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contracts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContracts(page, statusFilter)
  }, [page, statusFilter, token])

  const handleApprove = async () => {
    if (!selectedContract) return
    try {
      await api.post(`/admin/contracts/${selectedContract._id}/approve`, { notes: reviewNotes })
      setSuccess('Contract approved successfully!')
      setShowReviewModal(false)
      setReviewNotes('')
      setTimeout(() => {
        setSuccess('')
        fetchContracts(page, statusFilter)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve contract')
    }
  }

  const handleReject = async () => {
    if (!selectedContract || !rejectReason.trim()) {
      setError('Please provide a reason for rejection')
      return
    }
    try {
      await api.post(`/admin/contracts/${selectedContract._id}/reject`, { reason: rejectReason })
      setSuccess('Contract rejected successfully!')
      setShowReviewModal(false)
      setRejectReason('')
      setTimeout(() => {
        setSuccess('')
        fetchContracts(page, statusFilter)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject contract')
    }
  }

  const handleReviewContract = async (contract) => {
    try {
      const { data } = await api.get(`/admin/contracts/${contract._id}`)
      setContractDetails(data.contract)
      setSelectedContract(contract)
      setShowReviewModal(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contract details')
    }
  }

  const handleEditContract = () => {
    setEditingFormData({ ...contractDetails.formData })
    setShowEditModal(true)
    setShowReviewModal(false)
  }

  const handleSaveEdit = async () => {
    try {
      await api.put(`/admin/contracts/${contractDetails._id}`, {
        formData: editingFormData,
        notes: editNotes || 'Contract details edited by admin'
      })
      setSuccess('Contract updated successfully!')
      setShowEditModal(false)
      setEditNotes('')
      // Refresh the contract details
      const { data } = await api.get(`/admin/contracts/${contractDetails._id}`)
      setContractDetails(data.contract)
      setShowReviewModal(true)
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update contract')
    }
  }

  const handleFormDataChange = (field, value) => {
    setEditingFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div>
      <div className="header" style={{
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '0 0 20px 20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 className="header-title" style={{
            margin: '0',
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #63b3ed, #4299e1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Contract Management
          </h1>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '16px',
            opacity: '0.9'
          }}>
            Review and manage employee contracts
          </p>
        </div>
        <Link to="/admin" className="btn btn-secondary" style={{
          padding: '12px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '15px',
          backgroundColor: '#e2e8f0',
          color: '#2d3748',
          border: 'none',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card" style={{
          padding: '25px',
          marginBottom: '30px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
          <div className="filter-section" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <h2 style={{
              margin: '0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Contract List
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <label style={{
                fontWeight: '600',
                color: '#374151',
                fontSize: '15px'
              }}>
                Filter by Status:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  fontSize: '15px',
                  fontWeight: '500',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '180px'
                }}
              >
                <option value="">All Contracts</option>
                <option value="Draft">Draft</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="spinner"></div>
              <p>Loading contracts...</p>
            </div>
          ) : contracts.length > 0 ? (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Email</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract._id}>
                        <td>{contract.employee?.name}</td>
                        <td>{contract.employee?.email}</td>
                        <td>{contract.employee?.position || 'N/A'}</td>
                        <td>
                          <span className={`badge badge-${contract.status === 'Approved' ? 'success' : contract.status === 'Rejected' ? 'danger' : 'warning'}`}>
                            {contract.status}
                          </span>
                        </td>
                        <td>{new Date(contract.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleReviewContract(contract)}
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No contracts found.</p>
          )}
        </div>
      </div>

      {showReviewModal && contractDetails && (
        <div className="modal active" style={{ zIndex: 1000 }}>
          <div className="modal-content" style={{ 
            maxWidth: '1200px', 
            maxHeight: '90vh', 
            overflowY: 'auto',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}>
            <div className="modal-header" style={{
              padding: '25px 30px',
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <h2 style={{
                  margin: '0 0 8px 0',
                  fontSize: '26px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  Review Contract
                </h2>
                <p style={{
                  margin: '0',
                  color: '#64748b',
                  fontSize: '15px'
                }}>
                  {contractDetails.employee?.name || 'Employee'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className={`badge badge-${contractDetails.status === 'Approved' ? 'success' : contractDetails.status === 'Rejected' ? 'danger' : 'warning'}`} style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {contractDetails.status}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReviewModal(false)
                    setContractDetails(null)
                    setReviewNotes('')
                    setRejectReason('')
                  }}
                  style={{
                    padding: '10px 16px',
                    minWidth: 'auto'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div style={{ flex: 2, minWidth: '300px' }}>
                <div className="card" style={{ marginBottom: '25px' }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    📋 Contract Information
                  </h3>
                  <div className="contract-details-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '20px' 
                  }}>
                    {contractDetails.formData && Object.entries(contractDetails.formData).map(([key, value]) => (
                      <div key={key} className="detail-item" style={{
                        padding: '15px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease'
                      }}>
                        <label className="detail-label" style={{
                          display: 'block',
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#475569',
                          marginBottom: '6px',
                          textTransform: 'capitalize'
                        }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </label>
                        <div className="detail-value" style={{
                          fontSize: '15px',
                          color: '#1e293b',
                          lineHeight: '1.5',
                          wordBreak: 'break-word'
                        }}>
                          {String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card">
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    📝 Additional Notes
                  </h3>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '10px',
                    border: '1px solid #bae6fd'
                  }}>
                    <p style={{
                      margin: '0',
                      color: '#0c4a6e',
                      fontSize: '14px',
                      lineHeight: '1.6'
                    }}>
                      {contractDetails.comments || 'No additional notes provided.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div className="card" style={{ marginBottom: '25px' }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    👤 Employee Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#475569',
                        marginBottom: '4px'
                      }}>
                        Name
                      </label>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#1e293b'
                      }}>
                        {contractDetails.employee?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#475569',
                        marginBottom: '4px'
                      }}>
                        Email
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#1e293b'
                      }}>
                        {contractDetails.employee?.email || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontWeight: '600',
                        fontSize: '14px',
                        color: '#475569',
                        marginBottom: '4px'
                      }}>
                        Position
                      </label>
                      <div style={{
                        fontSize: '15px',
                        color: '#1e293b'
                      }}>
                        {contractDetails.employee?.position || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    📎 Uploaded Documents
                  </h3>
                  <div className="documents-section" style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }}>
                    {contractDetails.employee?.documents && contractDetails.employee.documents.length > 0 ? (
                      contractDetails.employee.documents.map((doc, index) => (
                        <div key={index} className="document-item" style={{
                          marginBottom: '12px',
                          padding: '12px',
                          backgroundColor: '#f0fdf4',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          transition: 'all 0.2s ease'
                        }}>
                          <a 
                            href={doc.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="document-link" 
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              textDecoration: 'none',
                              color: '#166534',
                              fontWeight: '500',
                              fontSize: '14px'
                            }}
                          >
                            <span style={{ fontSize: '18px' }}>📄</span>
                            <span style={{ flex: 1 }}>{doc.label}</span>
                            <span style={{ fontSize: '16px' }}>↗️</span>
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="no-documents" style={{
                        textAlign: 'center',
                        color: '#64748b',
                        fontStyle: 'italic',
                        margin: '20px 0',
                        padding: '20px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px dashed #e2e8f0'
                      }}>
                        No documents uploaded
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="card" style={{ marginTop: '25px' }}>
                  <h3 style={{ 
                    margin: '0 0 20px 0', 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    color: '#1e293b',
                    paddingBottom: '15px',
                    borderBottom: '2px solid #e2e8f0'
                  }}>
                    📅 Contract History
                  </h3>
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '10px'
                  }}>
                    {contractDetails.history && contractDetails.history.length > 0 ? (
                      contractDetails.history.map((entry, index) => (
                        <div key={index} style={{
                          marginBottom: '15px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          fontSize: '13px'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                            flexWrap: 'wrap',
                            gap: '8px'
                          }}>
                            <span style={{
                              fontWeight: '600',
                              color: '#1e293b'
                            }}>
                              {entry.status}
                            </span>
                            <span style={{
                              color: '#64748b',
                              fontSize: '12px'
                            }}>
                              {new Date(entry.changedAt).toLocaleString()}
                            </span>
                          </div>
                          <div style={{
                            color: '#475569',
                            marginBottom: '4px'
                          }}>
                            By: {entry.changedBy || 'System'}
                          </div>
                          <div style={{
                            color: '#64748b',
                            fontStyle: 'italic'
                          }}>
                            {entry.note || 'No notes provided'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{
                        textAlign: 'center',
                        color: '#64748b',
                        fontStyle: 'italic',
                        margin: '10px 0'
                      }}>
                        No history available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ 
              borderTop: '2px solid #e2e8f0', 
              padding: '25px 30px', 
              backgroundColor: '#f8fafc',
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowReviewModal(false)
                    setContractDetails(null)
                    setReviewNotes('')
                    setRejectReason('')
                  }}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  ← Back to List
                </button>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-info" 
                  onClick={handleEditContract}
                  style={{
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600'
                  }}
                >
                  ✏️ Edit Contract
                </button>
                {contractDetails.status === 'Under Review' && (
                  <>
                    <button 
                      className="btn btn-danger" 
                      onClick={handleReject}
                      style={{
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}
                    >
                      ❌ Reject
                    </button>
                    <button 
                      className="btn btn-success" 
                      onClick={handleApprove}
                      style={{
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: '600'
                      }}
                    >
                      ✅ Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Edit Contract - {contractDetails?.employee?.name}</h2>
            </div>

            <div className="edit-form">
              {editingFormData && Object.entries(editingFormData).map(([key, value]) => (
                <div key={key} className="form-group">
                  <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                  {key.toLowerCase().includes('description') || key.toLowerCase().includes('notes') ? (
                    <textarea
                      value={value || ''}
                      onChange={(e) => handleFormDataChange(key, e.target.value)}
                      rows="3"
                    />
                  ) : (
                    <input
                      type={key.toLowerCase().includes('date') ? 'date' : key.toLowerCase().includes('salary') || key.toLowerCase().includes('number') ? 'number' : 'text'}
                      value={value || ''}
                      onChange={(e) => handleFormDataChange(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Edit Notes:</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Describe the changes made..."
                rows="2"
              />
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowEditModal(false)
                  setShowReviewModal(true)
                  setEditNotes('')
                }}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}