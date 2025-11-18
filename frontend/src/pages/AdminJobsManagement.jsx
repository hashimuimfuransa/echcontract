import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/admin.css'

export default function AdminJobsManagement() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const categories = [
    'Professional Coaching',
    'Business & Entrepreneurship Coaching',
    'Academic Coaching',
    'Language Coaching',
    'Technical & Digital Coaching',
    'Job Seeker Coaching',
    'Personal & Corporate Development'
  ]

  const departments = [
    'Coaching',
    'Technical',
    'HR & Administration',
    'Finance & Operations',
    'Marketing & Business Development',
    'Sales & Client Relations',
    'Customer Support',
    'Product & Development',
    'Legal & Compliance',
    'Research & Development',
    'Quality Assurance',
    'Logistics & Supply Chain',
    'Strategy & Planning',
    'Business Development',
    'Operations',
    'Communications',
    'Data Analytics',
    'Information Technology',
    'Recruitment',
    'Training & Development'
  ]

  const categorySubcategories = {
    'Professional Coaching': [
      'Leadership',
      'Executive',
      'Project Management',
      'CPA/CAT/ACCA'
    ],
    'Business & Entrepreneurship Coaching': [
      'Startup',
      'Strategy',
      'Finance',
      'Marketing',
      'Innovation'
    ],
    'Academic Coaching': [
      'Primary',
      'Secondary',
      'University',
      'Nursery',
      'Exams',
      'Research'
    ],
    'Language Coaching': [
      'English',
      'French',
      'Kinyarwanda',
      'Business Communication'
    ],
    'Technical & Digital Coaching': [
      'AI',
      'Data',
      'Cybersecurity',
      'Cloud',
      'Dev',
      'Digital Marketing'
    ],
    'Job Seeker Coaching': [
      'Software Developer',
      'Data Analyst',
      'Project Manager',
      'Marketing Manager',
      'Sales Representative',
      'Business Analyst',
      'Financial Analyst',
      'HR Specialist',
      'Operations Manager',
      'Quality Assurance Engineer',
      'UX/UI Designer',
      'DevOps Engineer',
      'Content Writer',
      'Graphic Designer',
      'System Administrator',
      'Customer Service Manager',
      'Product Manager',
      'Business Development Executive'
    ],
    'Personal & Corporate Development': [
      'Communication',
      'EI',
      'Time',
      'Team',
      'HR',
      'Ethics'
    ]
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    category: '',
    subcategories: [],
    requirements: '',
    qualifications: '',
    responsibilities: '',
    requiredDocuments: '',
    baseSalaryMin: '',
    baseSalaryMax: '',
    salaryPaymentFrequency: 'Per Month',
    amountPerSession: '',
    modeOfPayment: '',
    paymentTerms: '',
    rateAdjustment: '',
    benefits: '',
    contractType: 'Indefinite',
    contractDurationMonths: '',
    workingHoursPerWeek: 40,
    remoteWorkPolicy: 'Flexible',
    location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
    startDate: '',
    status: 'Draft'
  })

  const fetchJobs = async (pageNum, status, category) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: pageNum, limit: 20 })
      if (status) params.append('status', status)
      if (category) params.append('category', category)

      const { data } = await api.get(`/admin/jobs?${params}`)
      setJobs(data.jobs)
      setPagination(data.pagination)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/jobs/stats')
      setStats(data)
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }

  useEffect(() => {
    fetchJobs(page, statusFilter, categoryFilter)
    if (page === 1) fetchStats()
  }, [page, statusFilter, categoryFilter])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubcategoryChange = (subcategory) => {
    setFormData(prev => {
      const subs = prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
      return { ...prev, subcategories: subs }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      
      // Convert string fields to arrays for backend
      const dataToSubmit = {
        ...formData,
        requirements: formData.requirements
          .split(',')
          .map(item => item.trim())
          .filter(item => item),
        qualifications: formData.qualifications
          .split(',')
          .map(item => item.trim())
          .filter(item => item),
        responsibilities: formData.responsibilities
          .split(',')
          .map(item => item.trim())
          .filter(item => item),
        requiredDocuments: formData.requiredDocuments
          .split(',')
          .map(item => item.trim())
          .filter(item => item),
        benefits: formData.benefits
          .split(',')
          .map(item => item.trim())
          .filter(item => item)
      }
      
      if (editingJob) {
        await api.put(`/admin/jobs/${editingJob._id}`, dataToSubmit)
        setError('')
        setEditingJob(null)
      } else {
        await api.post('/admin/jobs', dataToSubmit)
      }
      setFormData({
        title: '',
        description: '',
        department: '',
        category: '',
        subcategories: [],
        requirements: '',
        qualifications: '',
        responsibilities: '',
        requiredDocuments: '',
        baseSalaryMin: '',
        baseSalaryMax: '',
        salaryPaymentFrequency: 'Per Month',
        amountPerSession: '',
        modeOfPayment: '',
        paymentTerms: '',
        rateAdjustment: '',
        benefits: '',
        contractType: 'Indefinite',
        contractDurationMonths: '',
        workingHoursPerWeek: 40,
        remoteWorkPolicy: 'Flexible',
        location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
        startDate: '',
        status: 'Draft'
      })
      setShowForm(false)
      fetchJobs(1, '', '')
      setPage(1)
      fetchStats()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job')
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title,
      description: job.description,
      department: job.department,
      category: job.category,
      subcategories: job.subcategories || [],
      requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
      qualifications: Array.isArray(job.qualifications) ? job.qualifications.join(', ') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : '',
      requiredDocuments: Array.isArray(job.requiredDocuments) ? job.requiredDocuments.join(', ') : '',
      baseSalaryMin: job.baseSalaryMin || '',
      baseSalaryMax: job.baseSalaryMax || '',
      salaryPaymentFrequency: job.salaryPaymentFrequency || 'Per Month',
      amountPerSession: job.amountPerSession || '',
      modeOfPayment: job.modeOfPayment || '',
      paymentTerms: job.paymentTerms || '',
      rateAdjustment: job.rateAdjustment || '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join(', ') : '',
      contractType: job.contractType,
      contractDurationMonths: job.contractDurationMonths || '',
      workingHoursPerWeek: job.workingHoursPerWeek,
      remoteWorkPolicy: job.remoteWorkPolicy,
      location: job.location,
      startDate: job.startDate ? job.startDate.split('T')[0] : '',
      status: job.status
    })
    setShowForm(true)
  }

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/admin/jobs/${jobId}`)
        fetchJobs(page, statusFilter, categoryFilter)
        fetchStats()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete job')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingJob(null)
    setFormData({
      title: '',
      description: '',
      department: '',
      category: '',
      subcategories: [],
      requirements: '',
      qualifications: '',
      responsibilities: '',
      requiredDocuments: '',
      baseSalaryMin: '',
      baseSalaryMax: '',
      salaryPaymentFrequency: 'Per Month',
      amountPerSession: '',
      modeOfPayment: '',
      paymentTerms: '',
      rateAdjustment: '',
      benefits: '',
      contractType: 'Indefinite',
      contractDurationMonths: '',
      workingHoursPerWeek: 40,
      remoteWorkPolicy: 'Flexible',
      location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
      startDate: '',
      status: 'Draft'
    })
  }

  return (
    <div>
      <div className="header">
        <h1 className="header-title">📋 Manage Job Postings</h1>
        <Link to="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        {stats && (
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-value">{stats.totalJobs}</div>
                <div className="metric-label">Total Jobs</div>
              </div>
            </div>
            <div className="metric-card success">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-value">{stats.activeJobs}</div>
                <div className="metric-label">Active</div>
              </div>
            </div>
            <div className="metric-card info">
              <div className="metric-icon">📝</div>
              <div className="metric-content">
                <div className="metric-value">{stats.draftJobs}</div>
                <div className="metric-label">Draft</div>
              </div>
            </div>
            <div className="metric-card warning">
              <div className="metric-icon">🔒</div>
              <div className="metric-content">
                <div className="metric-value">{stats.closedJobs}</div>
                <div className="metric-label">Closed</div>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Job Postings</h3>
            {!showForm && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                ➕ Post New Job
              </button>
            )}
          </div>

          {showForm && (
            <div className="form-container" style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <h4>{editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Job Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>

                <div className="form-group full-width">
                  <label>Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Department *</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} required>
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {formData.category && categorySubcategories[formData.category] && (
                  <div className="form-group">
                    <label>Sub-categories (Select all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {categorySubcategories[formData.category].map(sub => (
                        <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input
                            type="checkbox"
                            checked={formData.subcategories.includes(sub)}
                            onChange={() => handleSubcategoryChange(sub)}
                          />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-group full-width">
                  <label>Requirements (comma-separated)</label>
                  <textarea 
                    value={formData.requirements} 
                    onChange={(e) => handleArrayInputChange(e, 'requirements')} 
                    rows="3"
                    placeholder="e.g., 5 years experience, Bachelor's degree, certification"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Qualifications (comma-separated)</label>
                  <textarea 
                    value={formData.qualifications} 
                    onChange={(e) => handleArrayInputChange(e, 'qualifications')} 
                    rows="3"
                    placeholder="e.g., Advanced Excel, Project Management, Leadership"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Responsibilities (comma-separated)</label>
                  <textarea 
                    value={formData.responsibilities} 
                    onChange={(e) => handleArrayInputChange(e, 'responsibilities')} 
                    rows="3"
                    placeholder="e.g., Team management, Client relations, Report generation"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Required Documents (comma-separated)</label>
                  <textarea 
                    value={formData.requiredDocuments} 
                    onChange={(e) => handleArrayInputChange(e, 'requiredDocuments')} 
                    rows="2"
                    placeholder="e.g., CV, Cover Letter, Certificates, Passport Copy"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Base Salary Min</label>
                    <input type="number" name="baseSalaryMin" value={formData.baseSalaryMin} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Base Salary Max</label>
                    <input type="number" name="baseSalaryMax" value={formData.baseSalaryMax} onChange={handleInputChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Amount to be Paid Per Session</label>
                    <input 
                      type="number" 
                      name="amountPerSession" 
                      value={formData.amountPerSession} 
                      onChange={handleInputChange} 
                      placeholder="Enter amount in RWF"
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      💵 The fixed amount that will be paid for each session conducted.
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Mode of Payment</label>
                    <input 
                      type="text" 
                      name="modeOfPayment" 
                      value={formData.modeOfPayment} 
                      onChange={handleInputChange} 
                      placeholder="e.g., Bank Transfer, Mobile Money, Cash"
                    />
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      💳 How payments will be made (Bank Transfer, Mobile Money, Cash, etc.)
                    </div>
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Terms and Conditions for Payment</label>
                  <textarea 
                    name="paymentTerms" 
                    value={formData.paymentTerms} 
                    onChange={handleInputChange} 
                    rows="3"
                    placeholder="Enter payment terms and conditions..."
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    📋 Conditions that apply to payments (e.g., payment deadlines, late payment penalties, etc.)
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Rate Adjustment for Contract Renewal</label>
                  <textarea 
                    name="rateAdjustment" 
                    value={formData.rateAdjustment} 
                    onChange={handleInputChange} 
                    rows="2"
                    placeholder="Enter rate adjustment terms..."
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    📈 Terms for adjusting payment rates during contract renewal
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>Benefits (comma-separated)</label>
                  <textarea 
                    value={formData.benefits} 
                    onChange={(e) => handleArrayInputChange(e, 'benefits')} 
                    rows="2"
                    placeholder="e.g., Health insurance, Dental coverage, Annual training budget"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Contract Type</label>
                    <select name="contractType" value={formData.contractType} onChange={handleInputChange}>
                      <option value="Indefinite">Indefinite</option>
                      <option value="Fixed Term">Fixed Term</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>

                  {formData.contractType === 'Fixed Term' && (
                    <div className="form-group">
                      <label>Duration (months)</label>
                      <input type="number" name="contractDurationMonths" value={formData.contractDurationMonths} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Working Hours/Week</label>
                    <input type="number" name="workingHoursPerWeek" value={formData.workingHoursPerWeek} onChange={handleInputChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Salary Payment Frequency</label>
                    <select name="salaryPaymentFrequency" value={formData.salaryPaymentFrequency} onChange={handleInputChange}>
                      <option value="Per Course">Per Course</option>
                      <option value="Per Month">Per Month</option>
                      <option value="Per Week">Per Week</option>
                      <option value="Per Lesson">Per Lesson</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label>Remote Work Policy</label>
                    <select name="remoteWorkPolicy" value={formData.remoteWorkPolicy} onChange={handleInputChange}>
                      <option value="Flexible">Flexible</option>
                      <option value="On-site">On-site</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Full Remote">Full Remote</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button type="submit" className="btn btn-primary">
                    {editingJob ? 'Update Job' : 'Create Job'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="filter-controls" style={{ marginBottom: '20px' }}>
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
                <option value="Active">✅ Active</option>
                <option value="Draft">📝 Draft</option>
                <option value="Closed">🔒 Closed</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by Category:</label>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value)
                  setPage(1)
                }}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
              <p>Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>No jobs found</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job._id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '12px' }}>{job.title}</td>
                        <td style={{ padding: '12px' }}>{job.department}</td>
                        <td style={{ padding: '12px' }}>{job.category}</td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: job.status === 'Active' ? '#d4edda' : job.status === 'Draft' ? '#fff3cd' : '#f8d7da',
                            color: job.status === 'Active' ? '#155724' : job.status === 'Draft' ? '#856404' : '#721c24'
                          }}>
                            {job.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            className="btn btn-small"
                            onClick={() => handleEdit(job)}
                            style={{ marginRight: '5px' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-small btn-danger"
                            onClick={() => handleDelete(job._id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination && pagination.pages > 1 && (
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                    className="btn btn-small"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    ← Previous
                  </button>
                  <span style={{ padding: '8px 12px' }}>
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    className="btn btn-small"
                    disabled={page === pagination.pages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}