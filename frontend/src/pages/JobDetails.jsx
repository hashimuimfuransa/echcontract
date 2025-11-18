import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import '../styles/employee.css'

export default function JobDetails() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${jobId}`)
        setJob(data.job)
        setError('')
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div>
        <div className="header">
          <h1 className="header-title">Loading...</h1>
        </div>
        <div className="container">
          <div className="card loading-card">
            <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div>
        <div className="header">
          <h1 className="header-title">❌ Error</h1>
          <Link to="/jobs" className="btn btn-secondary">Back to Jobs</Link>
        </div>
        <div className="container">
          <div className="alert alert-error">{error || 'Job not found'}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="logo-container">
            <img src="/logo1.png" alt="Excellence Coaching Hub" style={{ height: '60px', width: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          </div>
          <div>
            <h1 className="header-title">📋 Job Details</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 0, fontSize: '16px' }}>{job.title}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/jobs" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            ← Back
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card" style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>{job.title}</h2>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <span style={{ padding: '6px 12px', backgroundColor: '#e8f4f8', borderRadius: '20px', fontSize: '13px', color: '#2c3e50' }}>
                  📁 {job.department}
                </span>
                <span style={{ padding: '6px 12px', backgroundColor: '#f0e6ff', borderRadius: '20px', fontSize: '13px', color: '#2c3e50' }}>
                  🏷️ {job.category}
                </span>
                <span style={{ padding: '6px 12px', backgroundColor: '#d4edda', borderRadius: '20px', fontSize: '13px', color: '#155724', fontWeight: 'bold' }}>
                  ✅ Active
                </span>
              </div>
            </div>
          </div>

          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e0e0e0' }} />

          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>📝 Position Overview</h3>
          <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '30px' }}>{job.description}</p>

          {job.subcategories && job.subcategories.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>🎯 Sub-categories</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '30px' }}>
                {job.subcategories.map(sub => (
                  <span key={sub} style={{
                    padding: '8px 14px',
                    backgroundColor: '#e8f4f8',
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: '#2c3e50',
                    fontWeight: '500'
                  }}>
                    {sub}
                  </span>
                ))}
              </div>
            </>
          )}

          <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>💼 Job Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>📍 LOCATION</p>
              <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{job.location}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>⏰ WORKING HOURS</p>
              <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{job.workingHoursPerWeek} hours per week</p>
              {job.workingHoursStart && job.workingHoursEnd && (
                <p style={{ margin: '5px 0 0 0', color: '#2c3e50', fontSize: '14px' }}>
                  {job.workingHoursStart} - {job.workingHoursEnd}
                </p>
              )}
              {job.workingHoursByDay && Object.keys(job.workingHoursByDay).length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>Working Hours by Day:</p>
                  {Object.entries(job.workingHoursByDay).map(([day, hours]) => (
                    hours.start && hours.end ? (
                      <p key={day} style={{ margin: '0 0 3px 0', color: '#2c3e50', fontSize: '13px' }}>
                        {day}: {hours.start} - {hours.end}
                        {hours.payment > 0 && ` (Payment: ${hours.payment.toLocaleString()} RWF)`}
                      </p>
                    ) : null
                  ))}
                </div>
              )}
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>🏢 CONTRACT TYPE</p>
              <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{job.contractType}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>🌐 REMOTE WORK</p>
              <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{job.remoteWorkPolicy}</p>
            </div>
            {job.startDate && (
              <div>
                <p style={{ margin: '0 0 5px 0', color: '#7f8c8d', fontSize: '12px', fontWeight: 'bold' }}>📅 START DATE</p>
                <p style={{ margin: 0, color: '#2c3e50', fontWeight: '500' }}>{new Date(job.startDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {(job.baseSalaryMin || job.baseSalaryMax) && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>💰 Compensation</h3>
              <div style={{ padding: '20px', backgroundColor: '#f0fff4', borderLeft: '4px solid #27ae60', marginBottom: '30px', borderRadius: '4px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#2c3e50', fontWeight: '500', fontSize: '16px' }}>
                  {job.baseSalaryMin?.toLocaleString()} - {job.baseSalaryMax?.toLocaleString() || 'Negotiable'} RWF
                </p>
                {job.salaryPaymentFrequency && (
                  <p style={{ margin: 0, color: '#555', fontSize: '14px' }}>
                    💵 Payment Frequency: <strong>{job.salaryPaymentFrequency}</strong>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Additional Payment Information */}
          {(job.amountPerSession || job.modeOfPayment || job.paymentTerms || job.rateAdjustment) && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>💳 Payment Details</h3>
              <div style={{ padding: '20px', backgroundColor: '#e8f4f8', borderLeft: '4px solid #3498db', marginBottom: '30px', borderRadius: '4px' }}>
                {job.amountPerSession && (
                  <p style={{ margin: '0 0 10px 0', color: '#2c3e50', fontWeight: '500' }}>
                    💵 Amount per Session: <strong>{job.amountPerSession.toLocaleString()} RWF</strong>
                  </p>
                )}
                {job.modeOfPayment && (
                  <p style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>
                    💳 Mode of Payment: <strong>{job.modeOfPayment}</strong>
                  </p>
                )}
                {job.paymentTerms && (
                  <div style={{ margin: '15px 0' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#2c3e50', fontWeight: 'bold' }}>
                      📋 Payment Terms & Conditions:
                    </p>
                    <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>{job.paymentTerms}</p>
                  </div>
                )}
                {job.rateAdjustment && (
                  <div style={{ margin: '15px 0 0 0' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#2c3e50', fontWeight: 'bold' }}>
                      📈 Rate Adjustment for Renewal:
                    </p>
                    <p style={{ margin: 0, color: '#555', lineHeight: '1.6' }}>{job.rateAdjustment}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>⚙️ Requirements</h3>
              <ul style={{ marginBottom: '30px', color: '#555', lineHeight: '1.8' }}>
                {job.requirements.map((req, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>{req}</li>
                ))}
              </ul>
            </>
          )}

          {job.qualifications && job.qualifications.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>🎓 Qualifications</h3>
              <ul style={{ marginBottom: '30px', color: '#555', lineHeight: '1.8' }}>
                {job.qualifications.map((qual, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>{qual}</li>
                ))}
              </ul>
            </>
          )}

          {job.responsibilities && job.responsibilities.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>📋 Responsibilities</h3>
              <ul style={{ marginBottom: '30px', color: '#555', lineHeight: '1.8' }}>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>{resp}</li>
                ))}
              </ul>
            </>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>🎁 Benefits</h3>
              <ul style={{ marginBottom: '30px', color: '#555', lineHeight: '1.8' }}>
                {job.benefits.map((benefit, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>{benefit}</li>
                ))}
              </ul>
            </>
          )}

          {job.requiredDocuments && job.requiredDocuments.length > 0 && (
            <>
              <h3 style={{ marginBottom: '15px', color: '#2c3e50' }}>📄 Required Documents</h3>
              <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107', borderRadius: '4px', marginBottom: '30px' }}>
                <p style={{ margin: '0 0 10px 0', color: '#856404', fontWeight: 'bold' }}>Please prepare the following documents:</p>
                <ul style={{ margin: 0, color: '#856404', paddingLeft: '20px' }}>
                  {job.requiredDocuments.map((doc, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>{doc}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <Link
            to={`/employee/contract-from-job?jobId=${jobId}`}
            className="btn btn-primary"
            style={{ flex: 1, textAlign: 'center', padding: '15px' }}
          >
            📝 Create Contract for This Position
          </Link>
          <Link
            to="/jobs"
            className="btn btn-secondary"
            style={{ flex: 1, textAlign: 'center', padding: '15px' }}
          >
            ← Back to All Jobs
          </Link>
        </div>
      </div>
    </div>
  )
}