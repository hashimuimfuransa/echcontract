import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/admin.css'

const AdminJobsManagement = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stats, setStats] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Auto-save timer reference
  const autoSaveTimer = useRef(null)
  // Track if form has unsaved changes
  const hasUnsavedChanges = useRef(false)

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
      'Business Development Executive',
      'Accounting and Related Fields',
      'Engineering and Technical Roles',
      'Healthcare and Medical Positions',
      'Legal and Compliance Roles',
      'Supply Chain and Logistics',
      'Research and Development',
      'Teaching and Education',
      'Digital Marketing and SEO',
      'Cybersecurity Specialist'
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
    salaryPaymentFrequency: 'Per Month',
    amountPerSession: '',
    modeOfPayment: '',
    paymentTerms: '',
    rateAdjustment: '',
    benefits: '',
    contractType: 'Indefinite',
    contractDurationMonths: '',
    workingHoursPerWeek: 40,
    workingHoursStart: '',
    workingHoursEnd: '',
    workingHoursByDay: {},
    remoteWorkPolicy: 'Flexible',
    location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
    startDate: '',
    status: 'Draft'
  })

  // Clear subcategories when category changes
  useEffect(() => {
    if (formData.category === '') {
      setFormData(prev => ({ ...prev, subcategories: [] }));
    }
  }, [formData.category]);

  const fetchJobs = async (pageNum, status, category) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: pageNum, limit: 20 })
      if (status) params.append('status', status)
      if (category) params.append('category', category)

      const { data } = await api.get(`/admin/jobs?${params}`)
      setJobs(data.jobs)
      setTotalPages(data.pagination.pages)
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

  // Auto-save function
  const autoSaveJob = async () => {
    // Only auto-save if form is open and has changes
    if (!showForm || !hasUnsavedChanges.current) return;
    
    // Don't auto-save if title is empty for new jobs (unless it's explicitly a draft)
    if (!editingJob && !formData.title && formData.status !== 'Draft') return;

    try {
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
      
      // Ensure status is set to Draft for auto-saved jobs
      if (!editingJob) {
        dataToSubmit.status = 'Draft';
      }
      
      // Log the data being sent for debugging
      console.log('Auto-saving job data:', dataToSubmit);
      
      let response;
      if (editingJob) {
        response = await api.put(`/admin/jobs/${editingJob._id}`, dataToSubmit)
        console.log('Job updated successfully', response.data)
      } else {
        // For new jobs, we'll save as draft
        response = await api.post('/admin/jobs', dataToSubmit)
        // Set the editing job to the newly created job
        setEditingJob(response.data.job)
        console.log('Job created successfully', response.data)
      }
      
      setError('')
      hasUnsavedChanges.current = false; // Reset the unsaved changes flag
      
      // Update the form data with the response to ensure consistency
      if (response && response.data && response.data.job) {
        setFormData(prev => ({
          ...prev,
          ...response.data.job,
          requirements: Array.isArray(response.data.job.requirements) ? response.data.job.requirements.join(', ') : prev.requirements,
          qualifications: Array.isArray(response.data.job.qualifications) ? response.data.job.qualifications.join(', ') : prev.qualifications,
          responsibilities: Array.isArray(response.data.job.responsibilities) ? response.data.job.responsibilities.join(', ') : prev.responsibilities,
          requiredDocuments: Array.isArray(response.data.job.requiredDocuments) ? response.data.job.requiredDocuments.join(', ') : prev.requiredDocuments,
          benefits: Array.isArray(response.data.job.benefits) ? response.data.job.benefits.join(', ') : prev.benefits
        }));
      }
    } catch (err) {
      console.error('Auto-save failed:', err)
      console.error('Request data:', formData)
      
      // Log detailed error information
      if (err.response) {
        console.error('Error response:', err.response.data)
        console.error('Error status:', err.response.status)
        console.error('Error headers:', err.response.headers)
      }
      
      // Only show error if it's not a network error or if it has a response
      if (err.response) {
        const errorMessage = err.response.data?.message || 'Auto-save failed. Please check your connection and try again.'
        setError(errorMessage)
      } else {
        setError('Auto-save failed. Please check your connection and try again.')
      }
    }
  }

  // Set up auto-save effect
  useEffect(() => {
    if (showForm) {
      // Clear any existing timer
      if (autoSaveTimer.current) {
        clearInterval(autoSaveTimer.current)
      }
      
      // Set up new auto-save timer (every 60 seconds)
      autoSaveTimer.current = setInterval(() => {
        autoSaveJob()
      }, 60000)
      
      // Also set up beforeunload listener to save on page exit
      const handleBeforeUnload = (e) => {
        if (hasUnsavedChanges.current) {
          autoSaveJob(); // Try to save before leaving
          e.preventDefault();
          e.returnValue = ''; // Required for Chrome
        }
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Clean up
      return () => {
        if (autoSaveTimer.current) {
          clearInterval(autoSaveTimer.current)
        }
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    }
  }, [showForm, formData, editingJob, formData.category])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    hasUnsavedChanges.current = true; // Mark as having unsaved changes
  }

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, [field]: value }))
    hasUnsavedChanges.current = true; // Mark as having unsaved changes
  }

  const handleSubcategoryChange = (subcategory) => {
    setFormData(prev => {
      const subs = prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
      return { ...prev, subcategories: subs }
    })
    hasUnsavedChanges.current = true; // Mark as having unsaved changes
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
      
      let response;
      if (editingJob) {
        response = await api.put(`/admin/jobs/${editingJob._id}`, dataToSubmit)
        setError('')
        setEditingJob(null)
      } else {
        response = await api.post('/admin/jobs', dataToSubmit)
      }
      
      // Reset form and refresh job list
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
        workingHoursStart: '',
        workingHoursEnd: '',
        workingHoursByDay: {},
        remoteWorkPolicy: 'Flexible',
        location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
        startDate: '',
        status: 'Draft'
      })
      
      setShowForm(false)
      hasUnsavedChanges.current = false; // Reset the unsaved changes flag
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
      salaryPaymentFrequency: job.salaryPaymentFrequency || 'Per Month',
      amountPerSession: job.amountPerSession || '',
      modeOfPayment: job.modeOfPayment || '',
      paymentTerms: job.paymentTerms || '',
      rateAdjustment: job.rateAdjustment || '',
      benefits: Array.isArray(job.benefits) ? job.benefits.join(', ') : '',
      contractType: job.contractType,
      contractDurationMonths: job.contractDurationMonths || '',
      workingHoursPerWeek: job.workingHoursPerWeek,
      workingHoursStart: job.workingHoursStart || '',
      workingHoursEnd: job.workingHoursEnd || '',
      workingHoursByDay: job.workingHoursByDay || {},
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
    // Try to save before canceling if there are unsaved changes
    if (hasUnsavedChanges.current) {
      autoSaveJob();
    }
    
    setShowForm(false)
    setEditingJob(null)
    // Clear auto-save timer
    if (autoSaveTimer.current) {
      clearInterval(autoSaveTimer.current)
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
      salaryPaymentFrequency: 'Per Month',
      amountPerSession: '',
      modeOfPayment: '',
      paymentTerms: '',
      rateAdjustment: '',
      benefits: '',
      contractType: 'Indefinite',
      contractDurationMonths: '',
      workingHoursPerWeek: 40,
      workingHoursStart: '',
      workingHoursEnd: '',
      workingHoursByDay: {},
      remoteWorkPolicy: 'Flexible',
      location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
      startDate: '',
      status: 'Draft'
    })
    hasUnsavedChanges.current = false; // Reset the unsaved changes flag
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Job Management</h1>
        <button 
          onClick={() => {
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
              workingHoursStart: '',
              workingHoursEnd: '',
              workingHoursByDay: {},
              remoteWorkPolicy: 'Flexible',
              location: 'Excellence Coaching Hub Office, Kigali, Rwanda',
              startDate: '',
              status: 'Draft'
            })
            setShowForm(true)
          }}
          className="btn btn-primary"
        >
          Create New Job
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      {!showForm ? (
        <>
          <div className="jobs-section">
            <div className="section-header">
              <h2 className="section-title">Jobs List</h2>
              <div className="search-controls">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                  style={{ padding: '10px 15px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', minWidth: '250px' }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '10px 15px', borderRadius: '8px', border: '2px solid #e2e8f0', fontSize: '15px', marginLeft: '10px', minWidth: '150px' }}
                >
                  <option value="">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id}>
                      <td>{job.title}</td>
                      <td>{job.department}</td>
                      <td>{job.category}</td>
                      <td>
                        <span className={`status-badge status-${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(job)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '14px', marginRight: '5px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '14px' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="job-form">
          <div className="form-header">
            <h2 className="form-title">{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
            <div className="form-actions">
              <button 
                onClick={autoSaveJob}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                💾 Save Draft
              </button>
              <button 
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Basic Information */}
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>

              {/* Subcategories */}
              <div className="form-group full-width">
                <label>Subcategories</label>
                <div className="subcategory-grid">
                  {formData.category && categorySubcategories[formData.category] ? (
                    categorySubcategories[formData.category].map(sub => (
                      <div 
                        key={sub}
                        className={`subcategory-item ${formData.subcategories.includes(sub) ? 'selected' : ''}`}
                        onClick={() => handleSubcategoryChange(sub)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.subcategories.includes(sub)}
                          onChange={() => {}}
                          style={{ margin: 0 }}
                        />
                        <span>{sub}</span>
                      </div>
                    ))
                  ) : (
                    <p>Please select a category first to see available subcategories</p>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="form-group full-width">
                <label htmlFor="requirements">Requirements (comma separated)</label>
                <input
                  type="text"
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleArrayInputChange(e, 'requirements')}
                  placeholder="e.g., Bachelor's degree, 3+ years experience, Strong communication skills"
                />
              </div>

              {/* Qualifications */}
              <div className="form-group full-width">
                <label htmlFor="qualifications">Qualifications (comma separated)</label>
                <input
                  type="text"
                  id="qualifications"
                  value={formData.qualifications}
                  onChange={(e) => handleArrayInputChange(e, 'qualifications')}
                  placeholder="e.g., Master's degree, Teaching certification, Industry expertise"
                />
              </div>

              {/* Responsibilities */}
              <div className="form-group full-width">
                <label htmlFor="responsibilities">Responsibilities (comma separated)</label>
                <input
                  type="text"
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => handleArrayInputChange(e, 'responsibilities')}
                  placeholder="e.g., Develop curriculum, Conduct classes, Mentor students"
                />
              </div>

              {/* Required Documents */}
              <div className="form-group full-width">
                <label htmlFor="requiredDocuments">Required Documents (comma separated)</label>
                <input
                  type="text"
                  id="requiredDocuments"
                  value={formData.requiredDocuments}
                  onChange={(e) => handleArrayInputChange(e, 'requiredDocuments')}
                  placeholder="e.g., Resume, Cover letter, Certificates"
                />
              </div>

              {/* Benefits */}
              <div className="form-group full-width">
                <label htmlFor="benefits">Benefits (comma separated)</label>
                <input
                  type="text"
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => handleArrayInputChange(e, 'benefits')}
                  placeholder="e.g., Health insurance, Flexible hours, Professional development"
                />
              </div>

              {/* Compensation */}
              <div className="form-group">
                <label htmlFor="salaryPaymentFrequency">Salary Payment Frequency</label>
                <select
                  id="salaryPaymentFrequency"
                  name="salaryPaymentFrequency"
                  value={formData.salaryPaymentFrequency}
                  onChange={handleInputChange}
                >
                  <option value="Per Month">Per Month</option>
                  <option value="Per Year">Per Year</option>
                  <option value="Per Hour">Per Hour</option>
                  <option value="Per Session">Per Session</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amountPerSession">Amount Per Session</label>
                <input
                  type="text"
                  id="amountPerSession"
                  name="amountPerSession"
                  value={formData.amountPerSession}
                  onChange={handleInputChange}
                  placeholder="e.g., 15,000 RWF per hour"
                />
              </div>

              {/* Contract Details */}
              <div className="form-group">
                <label htmlFor="contractType">Contract Type</label>
                <select
                  id="contractType"
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleInputChange}
                >
                  <option value="Indefinite">Indefinite</option>
                  <option value="Fixed Term">Fixed Term</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contractDurationMonths">Contract Duration (Months)</label>
                <input
                  type="number"
                  id="contractDurationMonths"
                  name="contractDurationMonths"
                  value={formData.contractDurationMonths}
                  onChange={handleInputChange}
                  placeholder="e.g., 12"
                />
              </div>

              {/* Working Hours */}
              <div className="form-group">
                <label htmlFor="workingHoursPerWeek">Working Hours Per Week</label>
                <input
                  type="number"
                  id="workingHoursPerWeek"
                  name="workingHoursPerWeek"
                  value={formData.workingHoursPerWeek}
                  onChange={handleInputChange}
                  placeholder="e.g., 40"
                />
              </div>

              <div className="form-group">
                <label htmlFor="workingHoursStart">Working Hours Start</label>
                <input
                  type="time"
                  id="workingHoursStart"
                  name="workingHoursStart"
                  value={formData.workingHoursStart}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="workingHoursEnd">Working Hours End</label>
                <input
                  type="time"
                  id="workingHoursEnd"
                  name="workingHoursEnd"
                  value={formData.workingHoursEnd}
                  onChange={handleInputChange}
                />
              </div>

              {/* Day-specific working hours */}
              <div className="form-group full-width">
                <label>Working Hours by Day</label>
                <div className="working-hours-container">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <div key={day} className="day-hours-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <input 
                          type="checkbox" 
                          id={`workingDay-${day}`}
                          checked={formData.workingHoursByDay && formData.workingHoursByDay[day]}
                          onChange={(e) => {
                            const newWorkingHoursByDay = { ...formData.workingHoursByDay };
                            if (e.target.checked) {
                              newWorkingHoursByDay[day] = { start: '', end: '', payment: '' };
                            } else {
                              delete newWorkingHoursByDay[day];
                            }
                            setFormData(prev => ({ ...prev, workingHoursByDay: newWorkingHoursByDay }));
                            hasUnsavedChanges.current = true; // Mark as having unsaved changes
                          }}
                        />
                        <label htmlFor={`workingDay-${day}`} className="day-label">{day}</label>
                      </div>
                      {formData.workingHoursByDay && formData.workingHoursByDay[day] && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2d3748' }}>Start Time</label>
                              <input 
                                type="time" 
                                value={formData.workingHoursByDay[day].start}
                                onChange={(e) => {
                                  const newWorkingHoursByDay = { ...formData.workingHoursByDay };
                                  newWorkingHoursByDay[day].start = e.target.value;
                                  setFormData(prev => ({ ...prev, workingHoursByDay: newWorkingHoursByDay }));
                                  hasUnsavedChanges.current = true; // Mark as having unsaved changes
                                }}
                                style={{ width: '100%', minHeight: '45px', fontSize: '16px', padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2d3748' }}>End Time</label>
                              <input 
                                type="time" 
                                value={formData.workingHoursByDay[day].end}
                                onChange={(e) => {
                                  const newWorkingHoursByDay = { ...formData.workingHoursByDay };
                                  newWorkingHoursByDay[day].end = e.target.value;
                                  setFormData(prev => ({ ...prev, workingHoursByDay: newWorkingHoursByDay }));
                                  hasUnsavedChanges.current = true; // Mark as having unsaved changes
                                }}
                                style={{ width: '100%', minHeight: '45px', fontSize: '16px', padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                          <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#2d3748' }}>Payment Details</label>
                            <input 
                              type="text" 
                              value={formData.workingHoursByDay[day].payment || ''}
                              onChange={(e) => {
                                const newWorkingHoursByDay = { ...formData.workingHoursByDay };
                                newWorkingHoursByDay[day].payment = e.target.value;
                                setFormData(prev => ({ ...prev, workingHoursByDay: newWorkingHoursByDay }));
                                hasUnsavedChanges.current = true; // Mark as having unsaved changes
                              }}
                              placeholder="Payment details (e.g., 15,000 RWF per hour)"
                              style={{ width: '100%', minHeight: '45px', fontSize: '16px', padding: '10px 15px', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Details */}
              <div className="form-group">
                <label htmlFor="remoteWorkPolicy">Remote Work Policy</label>
                <select
                  id="remoteWorkPolicy"
                  name="remoteWorkPolicy"
                  value={formData.remoteWorkPolicy}
                  onChange={handleInputChange}
                >
                  <option value="Flexible">Flexible</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Remote">Remote</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Excellence Coaching Hub Office, Kigali, Rwanda"
                />
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={autoSaveJob}
                className="btn btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                💾 Save Draft
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default AdminJobsManagement
