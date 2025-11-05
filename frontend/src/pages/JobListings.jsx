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
    <div>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo-container">
            <img src="/logo1.png" alt="Excellence Coaching Hub" style={{ height: '60px', width: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          </div>
          <div>
            <h1 className="header-title">💼 Available Job Positions</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 0, fontSize: '16px' }}>Find your next opportunity</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/employee" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            Back
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="card" style={{ marginBottom: '30px' }}>
          <div className="filter-section">
            <div className="filter-header">
              <h3>🔍 Search & Filter Jobs</h3>
              <p>Browse available positions matching your interests</p>
            </div>
            <div className="filter-controls">
              <div className="filter-group">
                <label>Search:</label>
                <input
                  type="text"
                  placeholder="Search by job title or keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Category:</label>
                <select
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
        </div>

        {loading ? (
          <div className="card loading-card">
            <div className="loading-content">
              <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
              <h3>Loading job positions...</h3>
              <p>Please wait while we fetch available positions</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3>No Jobs Found</h3>
            <p>There are currently no available positions matching your criteria. Please check back later or try different filters.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px', color: '#666' }}>
              <p>Found {pagination?.total || 0} available position(s)</p>
            </div>

            {jobs.map(job => (
              <div key={job._id} className="card" style={{ marginBottom: '20px', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50' }}>{job.title}</h3>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#7f8c8d', marginBottom: '10px' }}>
                      <span>📁 {job.department}</span>
                      <span>🏷️ {job.category}</span>
                      <span>📍 {job.location}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: '#d4edda',
                    color: '#155724'
                  }}>
                    ✅ Active
                  </span>
                </div>

                <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.6' }}>
                  {job.description.length > 200 ? job.description.substring(0, 200) + '...' : job.description}
                </p>

                {job.subcategories && job.subcategories.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '12px', color: '#7f8c8d' }}>Sub-categories:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {job.subcategories.map(sub => (
                        <span key={sub} style={{
                          padding: '4px 10px',
                          backgroundColor: '#e8f4f8',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#2c3e50'
                        }}>
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px', fontSize: '13px' }}>
                  {job.baseSalaryMin && (
                    <div>
                      <span style={{ color: '#7f8c8d' }}>💰 Salary Range:</span>
                      <p style={{ margin: '5px 0 0 0' }}>{job.baseSalaryMin.toLocaleString()} - {job.baseSalaryMax?.toLocaleString() || 'Negotiable'}</p>
                    </div>
                  )}
                  <div>
                    <span style={{ color: '#7f8c8d' }}>⏰ Working Hours:</span>
                    <p style={{ margin: '5px 0 0 0' }}>{job.workingHoursPerWeek} hours/week</p>
                  </div>
                  <div>
                    <span style={{ color: '#7f8c8d' }}>🏢 Contract:</span>
                    <p style={{ margin: '5px 0 0 0' }}>{job.contractType}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="btn btn-primary"
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    👁️ View Details
                  </Link>
                  <Link
                    to={`/employee/contract-from-job?jobId=${job._id}`}
                    className="btn btn-success"
                    style={{ flex: 1, textAlign: 'center', backgroundColor: '#27ae60', border: 'none' }}
                  >
                    📝 Apply Now
                  </Link>
                </div>
              </div>
            ))}

            {pagination && pagination.pages > 1 && (
              <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
  )
}