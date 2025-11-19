import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/employee.css'

export default function JobListings() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')

  const categories = [
    'Professional Coaching',
    'Business & Entrepreneurship Coaching',
    'Academic Coaching',
    'Language Coaching',
    'Technical & Digital Coaching',
    'Job Seeker Coaching',
    'Personal & Corporate Development'
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
      'Spanish',
      'Chinese'
    ],
    'Technical & Digital Coaching': [
      'Programming',
      'Web Development',
      'Mobile App Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
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

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const fetchJobs = async (pageNum, category, searchTerm) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: pageNum, limit: 20 })
      if (category) params.append('category', category)
      if (searchTerm) params.append('search', searchTerm)

      const { data } = await api.get(`/jobs?${params}`)
      setJobs(data.jobs)
      setPagination(data.pagination)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchJobs(1, categoryFilter, search)
    }, 500)
    return () => clearTimeout(timer)
  }, [categoryFilter, search])

  useEffect(() => {
    fetchJobs(page, categoryFilter, search)
  }, [page])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="jobs-page">
      <div className="header">
        <div className="header-content">
          <div className="logo-container">
            <img src="/logo1.png" alt="Excellence Coaching Hub" className="logo" />
          </div>
          <div className="header-text">
            <h1 className="header-title">💼 Available Job Positions</h1>
            <p>Find your next opportunity</p>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/employee" className="btn btn-secondary">
            Back
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="filter-section">
          <div className="filter-header">
            <h2>🔍 Search & Filter Jobs</h2>
            <p>Browse available positions matching your interests</p>
          </div>
          <div className="filter-controls">
            <div className="filter-group">
              <label htmlFor="search">Search:</label>
              <input
                type="text"
                id="search"
                placeholder="Search by job title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <h3>Loading job positions...</h3>
            <p>Please wait while we fetch available positions</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No Jobs Found</h3>
            <p>There are currently no available positions matching your criteria. Please check back later or try different filters.</p>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>Found {pagination?.total || 0} available position(s)</p>
            </div>

            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job._id} className="job-card">
                  <div className="job-header">
                    <h3 className="job-title">{job.title}</h3>
                    <span className="job-status">✅ Active</span>
                  </div>

                  <div className="job-meta">
                    <span className="job-meta-item">📁 {job.department}</span>
                    <span className="job-meta-item">🏷️ {job.category}</span>
                    <span className="job-meta-item">📍 {job.location}</span>
                  </div>

                  <p className="job-description">
                    {job.description.length > 200 ? job.description.substring(0, 200) + '...' : job.description}
                  </p>

                  {job.subcategories && job.subcategories.length > 0 && (
                    <div className="job-subcategories">
                      <p className="subcategories-label">Sub-categories:</p>
                      <div className="subcategories-list">
                        {job.subcategories.map(sub => (
                          <span key={sub} className="subcategory-tag">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="job-details">
                    {job.baseSalaryMin && (
                      <div className="job-detail-item">
                        <span className="detail-label">💰 Salary Range:</span>
                        <p className="detail-value">{job.baseSalaryMin.toLocaleString()} - {job.baseSalaryMax?.toLocaleString() || 'Negotiable'}</p>
                      </div>
                    )}
                    <div className="job-detail-item">
                      <span className="detail-label">⏰ Working Hours:</span>
                      <p className="detail-value">{job.workingHoursPerWeek} hours/week</p>
                    </div>
                    <div className="job-detail-item">
                      <span className="detail-label">🏢 Contract:</span>
                      <p className="detail-value">{job.contractType}</p>
                    </div>
                  </div>

                  <div className="job-actions">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn btn-primary job-action-btn"
                    >
                      👁️ View Details
                    </Link>
                    <Link
                      to={`/employee/contract-from-job?jobId=${job._id}`}
                      className="btn btn-success job-action-btn"
                    >
                      📝 Apply Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary pagination-btn"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page {page} of {pagination.pages}
                </span>
                <button
                  className="btn btn-secondary pagination-btn"
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
  )
}