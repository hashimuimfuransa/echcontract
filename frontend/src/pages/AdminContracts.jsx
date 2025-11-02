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
      <div className="header">
        <h1 className="header-title">Review Contracts</h1>
        <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="card">
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All</option>
              <option value="Draft">Draft</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

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
        <div className="modal active">
          <div className="modal-content" style={{ maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h2>Review Contract - {contractDetails.employee?.name}</h2>
              <span className={`badge badge-${contractDetails.status === 'Approved' ? 'success' : contractDetails.status === 'Rejected' ? 'danger' : 'warning'}`}>
                {contractDetails.status}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 2 }}>
                <h3>Contract Details</h3>
                <div className="contract-details-grid">
                  {contractDetails.formData && Object.entries(contractDetails.formData).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <label className="detail-label">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</label>
                      <div className="detail-value">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h3>Uploaded Documents</h3>
                <div className="documents-section">
                  {contractDetails.employee?.documents && contractDetails.employee.documents.length > 0 ? (
                    contractDetails.employee.documents.map((doc, index) => (
                      <div key={index} className="document-item">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="document-link">
                          📄 {doc.label}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="no-documents">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer" style={{ borderTop: '1px solid #ddd', paddingTop: '15px', marginTop: '20px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowReviewModal(false)
                  setContractDetails(null)
                  setReviewNotes('')
                  setRejectReason('')
                }}
              >
                Close
              </button>
              <button className="btn btn-info" onClick={handleEditContract}>
                Edit Contract
              </button>
              {contractDetails.status === 'Under Review' && (
                <>
                  <button className="btn btn-danger" onClick={handleReject}>
                    Reject
                  </button>
                  <button className="btn btn-success" onClick={handleApprove}>
                    Approve
                  </button>
                </>
              )}
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
