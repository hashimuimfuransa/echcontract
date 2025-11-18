import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/employee.css'
import '../styles/contractForm.css'

// FormField and CollapsibleSection components are shared components (duplicated for performance optimization)

export default function ContractFromJob() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId')

  const [job, setJob] = useState(null)
  const [jobLoading, setJobLoading] = useState(true)
  const [jobError, setJobError] = useState('')

  const [formData, setFormData] = useState({
    employerName: 'Excellence Coaching Hub',
    employerAddress: 'Kigali, Rwanda',
    employeeFullName: '',
    employeeAddress: '',
    jobTitle: '',
    teachingCategory: '',
    coachingSubcategories: [],
    department: '',
    reportsTo: '',
    jobDescription: '',
    primaryWorkLocation: 'Excellence Coaching Hub Office, Kigali, Rwanda',
    relocationConditions: 'Relocation is possible with mutual agreement and advance notice of at least 30 days.',
    remoteWorkPolicy: 'Flexible',
    remoteWorkDescription: '',
    startDate: '',
    contractType: 'Indefinite',
    endDate: '',
    baseSalary: '',
    paymentFrequency: 'Per Month',
    amountPerSession: '',
    modeOfPayment: '',
    paymentTerms: '',
    rateAdjustment: '',
    bonusesCommissions: '',
    benefits: 'Health insurance, dental coverage, lunch allowance, annual training budget, and mobile phone provision.',
    workingHoursPerWeek: '40',
    overtimePolicy: 'Overtime compensation is determined by mutual agreement.',
    annualLeaveDays: '20',
    sickLeavePolicy: 'Maximum 10 sick leave days per year.',
    unpaidLeaveConditions: 'Unpaid leave may be granted for valid reasons with prior written request.',
    terminationConditions: 'Employment may be terminated by either party with written notice.',
    employeeNoticePeriod: '30 days written notice to employer',
    employerNoticePeriod: '30 days written notice to employee',
    groundsForDismissal: 'Gross misconduct, repeated poor performance, insubordination.',
    severancePay: 'Severance pay of one month salary per year of service.',
    confidentialityAgreement: 'Employee acknowledges and agrees to maintain strict confidentiality.',
    intellectualPropertyClause: 'All work, ideas, or content created for the company will belong only to Excellence Coaching Hub.',
    nonCompeteClause: 'During employment and for 12 months after termination, employee shall not engage in competitive business.',
    nonSolicitationClause: 'Employee shall not solicit clients or employees during and 12 months after employment.',
    disputeResolution: 'Mediation',
    jurisdiction: 'Rwanda',
    employeeHandbookRef: 'Employee Handbook Version 2.0 - Available in digital format.',
    workplaceConduct: 'Employee agrees to conduct themselves professionally.',
    technologySecurity: 'All company technology resources must be used for business purposes only.',
    healthSafetyAcknowledgment: 'Employee acknowledges receipt of health and safety policies.'
  })

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    identification: true,
    jobInfo: true,
    workLocation: false,
    startDuration: false,
    compensation: false,
    workHours: false,
    legal: false,
    confidentiality: false,
    covenants: false,
    dispute: false,
    policies: false,
    documents: false
  })

  // Coaching categories and subcategories are managed in AdminJobsManagement.jsx

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setJobError('No job selected')
        setJobLoading(false)
        return
      }

      try {
        const { data } = await api.get(`/jobs/${jobId}`)
        setJob(data.job)

        // Pre-fill form with job data
        setFormData(prev => ({
          ...prev,
          jobTitle: data.job.title,
          department: data.job.department,
          teachingCategory: data.job.category,
          coachingSubcategories: data.job.subcategories || [],
          jobDescription: data.job.description,
          remoteWorkPolicy: data.job.remoteWorkPolicy || 'Flexible',
          remoteWorkDescription: `${data.job.remoteWorkPolicy} remote work arrangement available.`,
          workingHoursPerWeek: data.job.workingHoursPerWeek?.toString() || '40',
          workingHoursStart: data.job.workingHoursStart || '',
          workingHoursEnd: data.job.workingHoursEnd || '',
          benefits: data.job.benefits?.join(', ') || 'Health insurance, dental coverage, lunch allowance, annual training budget, and mobile phone provision.',
          paymentFrequency: data.job.salaryPaymentFrequency || 'Per Month',
          amountPerSession: data.job.amountPerSession?.toString() || '',
          modeOfPayment: data.job.modeOfPayment || '',
          paymentTerms: data.job.paymentTerms || '',
          rateAdjustment: data.job.rateAdjustment || '',
          contractType: data.job.contractType,
          endDate: data.job.contractDurationMonths ? calculateEndDate(data.job.startDate, data.job.contractDurationMonths) : '',
          startDate: data.job.startDate ? data.job.startDate.split('T')[0] : '',
          baseSalary: data.job.baseSalaryMin ? `${data.job.baseSalaryMin} - ${data.job.baseSalaryMax}` : '',
          primaryWorkLocation: data.job.location || 'Excellence Coaching Hub Office, Kigali, Rwanda'
        }))

        setJobError('')
      } catch (err) {
        setJobError(err.response?.data?.message || 'Failed to load job details')
      } finally {
        setJobLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  const calculateEndDate = (startDate, durationMonths) => {
    if (!startDate || !durationMonths) return ''
    const start = new Date(startDate)
    const end = new Date(start.getFullYear(), start.getMonth() + parseInt(durationMonths), start.getDate())
    return end.toISOString().split('T')[0]
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']

      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 10MB.`)
        return false
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format.`)
        return false
      }

      return true
    })

    setDocuments(prev => [...prev, ...validFiles])
    setError('')
  }

  const handleRemoveFile = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    const files = Array.from(e.dataTransfer.files)

    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']

      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large.`)
        return false
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format.`)
        return false
      }

      return true
    })

    setDocuments(prev => [...prev, ...validFiles])
    setError('')
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate documents are uploaded
    if (documents.length === 0) {
      setError('⚠️ Please upload at least one supporting document before submitting the contract.')
      return
    }

    setLoading(true)

    try {
      const submitData = { formData, jobId: jobId || undefined }
      await api.post('/contracts', submitData)

      if (documents.length > 0) {
        try {
          setUploadProgress(0)
          const formDataWithFiles = new FormData()
          documents.forEach(file => {
            formDataWithFiles.append('files', file)
          })

          await api.post('/contracts/documents', formDataWithFiles, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 120000,
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress(percentCompleted)
            }
          })
          setUploadProgress(100)
        } catch (docError) {
          setError(`Contract submitted but document upload failed: ${docError.response?.data?.message || docError.message}`)
          setLoading(false)
          return
        }
      }

      setSuccess('Contract submitted successfully for review!')
      setTimeout(() => navigate('/employee'), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit contract')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  if (jobLoading) {
    return (
      <div>
        <div className="contract-header">
          <div className="contract-header-content">
            <h1>Loading...</h1>
          </div>
        </div>
        <div className="contract-container">
          <div className="card loading-card">
            <div className="spinner" style={{ width: '50px', height: '50px', margin: '0 auto 20px' }}></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (jobError || !job) {
    return (
      <div>
        <div className="contract-header">
          <div className="contract-header-content">
            <h1>Error</h1>
          </div>
        </div>
        <div className="contract-container">
          <div className="alert alert-error">{jobError || 'Job not found'}</div>
          <button className="back-button" onClick={() => navigate('/jobs')}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="contract-header">
        <div className="contract-header-content">
          <h1>📄 Employment Contract Form</h1>
          <p>For Position: <strong>{job.title}</strong> at {job.department}</p>
        </div>
      </div>

      <div className="contract-container">
        <button className="back-button" onClick={() => navigate(`/jobs/${jobId}`)}>← Back to Job Details</button>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Identification Section */}
          <CollapsibleSection
            id="identification"
            icon="👤"
            title="Identification of Parties"
            subtitle="Company and employee information"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Employer Name" name="employerName" value={formData.employerName} readOnly={true} />
              <FormField label="Employer Address" name="employerAddress" value={formData.employerAddress} readOnly={true} />
            </div>
            <FormField label="Your Full Name" name="employeeFullName" value={formData.employeeFullName} onChange={handleInputChange} required={true} />
            <FormField label="Your Address" name="employeeAddress" value={formData.employeeAddress} onChange={handleInputChange} required={true} />
          </CollapsibleSection>

          {/* Job Information */}
          <CollapsibleSection
            id="jobInfo"
            icon="💼"
            title="Job Information"
            subtitle="Position and role details"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Job Title" name="jobTitle" value={formData.jobTitle} readOnly={true} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Coaching Category" name="teachingCategory" value={formData.teachingCategory} readOnly={true} />
              <FormField label="Department" name="department" value={formData.department} readOnly={true} />
            </div>
            
            {formData.coachingSubcategories && formData.coachingSubcategories.length > 0 && (
              <div className="form-group">
                <label>Coaching Subcategories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                  {formData.coachingSubcategories.map(sub => (
                    <span key={sub} style={{ backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '4px' }}>
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <FormField label="Reports To (Manager)" name="reportsTo" value={formData.reportsTo} onChange={handleInputChange} placeholder="Enter manager name" />
            <FormField label="Job Description" name="jobDescription" type="textarea" value={formData.jobDescription} readOnly={true} />
          </CollapsibleSection>

          {/* Work Location */}
          <CollapsibleSection
            id="workLocation"
            icon="📍"
            title="Place of Work"
            subtitle="Work location details"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Primary Work Location" name="primaryWorkLocation" value={formData.primaryWorkLocation} readOnly={true} />
            <FormField label="Relocation Conditions" name="relocationConditions" type="textarea" value={formData.relocationConditions} readOnly={true} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Remote Work Policy <span className="read-only-badge">Pre-filled by HR</span></label>
                <select name="remoteWorkPolicy" value={formData.remoteWorkPolicy} disabled className="read-only">
                  <option value="Flexible">Flexible</option>
                  <option value="On-site">On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <FormField label="Remote Work Description" name="remoteWorkDescription" value={formData.remoteWorkDescription} readOnly={true} />
            </div>
          </CollapsibleSection>

          {/* Start Date and Duration */}
          <CollapsibleSection
            id="startDuration"
            icon="📅"
            title="Start Date and Contract Duration"
            subtitle="Employment timeline"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Start Date" name="startDate" type="date" value={formData.startDate} readOnly={true} />
              <div className="form-group">
                <label>Contract Type <span className="read-only-badge">Pre-filled by HR</span></label>
                <select name="contractType" value={formData.contractType} disabled className="read-only">
                  <option value="Indefinite">Indefinite</option>
                  <option value="Fixed Term">Fixed Term</option>
                </select>
              </div>
            </div>
            {formData.contractType === 'Fixed Term' && (
              <FormField label="End Date" name="endDate" type="date" value={formData.endDate} readOnly={true} />
            )}
          </CollapsibleSection>

          {/* Compensation */}
          <CollapsibleSection
            id="compensation"
            icon="💰"
            title="Compensation and Benefits"
            subtitle="Salary and benefits information"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Base Salary" name="baseSalary" type="text" value={formData.baseSalary} onChange={handleInputChange} required={true} placeholder="e.g., 1,000,000 - 1,500,000" />
              <div className="form-group">
                <label>Payment Frequency <span className="read-only-badge">Pre-filled by HR</span></label>
                <select name="paymentFrequency" value={formData.paymentFrequency} disabled className="read-only">
                  <option value="Per Month">Per Month</option>
                  <option value="Per Week">Per Week</option>
                  <option value="Per Course">Per Course</option>
                  <option value="Per Lesson">Per Lesson</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Amount to be Paid Per Session" name="amountPerSession" type="number" value={formData.amountPerSession} readOnly={true} />
              <FormField label="Mode of Payment" name="modeOfPayment" type="text" value={formData.modeOfPayment} readOnly={true} />
            </div>
            <FormField label="Terms and Conditions for Payment" name="paymentTerms" type="textarea" value={formData.paymentTerms} readOnly={true} />
            <FormField label="Rate Adjustment for Contract Renewal" name="rateAdjustment" type="textarea" value={formData.rateAdjustment} readOnly={true} />
            <FormField label="Bonuses/Commissions" name="bonusesCommissions" type="textarea" value={formData.bonusesCommissions} onChange={handleInputChange} placeholder="Enter bonus and commission details (if applicable)" />
            <FormField label="Benefits" name="benefits" type="textarea" value={formData.benefits} readOnly={true} />
          </CollapsibleSection>

          {/* Work Hours and Leave */}
          <CollapsibleSection
            id="workHours"
            icon="⏰"
            title="Work Hours and Leave"
            subtitle="Work schedule and leave policies"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Working Hours per Week" name="workingHoursPerWeek" type="number" value={formData.workingHoursPerWeek} readOnly={true} />
            {formData.workingHoursByDay && Object.keys(formData.workingHoursByDay).length > 0 && (
              <div className="form-group">
                <label>Working Hours by Day</label>
                <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '14px' }}>
                  {Object.entries(formData.workingHoursByDay).map(([day, hours]) => (
                    hours.start && hours.end ? (
                      <div key={day} style={{ marginBottom: '5px' }}>
                        <strong>{day}:</strong> {hours.start} - {hours.end}
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}
            <FormField label="Overtime Policy" name="overtimePolicy" type="textarea" value={formData.overtimePolicy} readOnly={true} />
            <FormField label="Annual Leave Days" name="annualLeaveDays" type="number" value={formData.annualLeaveDays} readOnly={true} />
            <FormField label="Sick Leave Policy" name="sickLeavePolicy" type="textarea" value={formData.sickLeavePolicy} readOnly={true} />
            <FormField label="Unpaid Leave Conditions" name="unpaidLeaveConditions" type="textarea" value={formData.unpaidLeaveConditions} readOnly={true} />
          </CollapsibleSection>

          {/* Legal and Policy Clauses */}
          <CollapsibleSection
            id="legal"
            icon="⚖️"
            title="Legal and Policy Clauses"
            subtitle="Termination and employment conditions"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Termination Conditions" name="terminationConditions" type="textarea" value={formData.terminationConditions} readOnly={true} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FormField label="Employee Notice Period" name="employeeNoticePeriod" value={formData.employeeNoticePeriod} readOnly={true} />
              <FormField label="Employer Notice Period" name="employerNoticePeriod" value={formData.employerNoticePeriod} readOnly={true} />
            </div>
            <FormField label="Grounds for Dismissal" name="groundsForDismissal" type="textarea" value={formData.groundsForDismissal} readOnly={true} />
            <FormField label="Severance Pay" name="severancePay" type="textarea" value={formData.severancePay} readOnly={true} />
          </CollapsibleSection>

          {/* Confidentiality & IP */}
          <CollapsibleSection
            id="confidentiality"
            icon="🔒"
            title="Confidentiality & Intellectual Property"
            subtitle="Confidentiality and IP ownership clauses"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Confidentiality Agreement" name="confidentialityAgreement" type="textarea" value={formData.confidentialityAgreement} readOnly={true} />
            <FormField label="Intellectual Property Clause" name="intellectualPropertyClause" type="textarea" value={formData.intellectualPropertyClause} readOnly={true} />
          </CollapsibleSection>

          {/* Restrictive Covenants */}
          <CollapsibleSection
            id="covenants"
            icon="🚫"
            title="Restrictive Covenants"
            subtitle="Non-compete and non-solicitation clauses"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Non-Compete Clause" name="nonCompeteClause" type="textarea" value={formData.nonCompeteClause} readOnly={true} />
            <FormField label="Non-Solicitation Clause" name="nonSolicitationClause" type="textarea" value={formData.nonSolicitationClause} readOnly={true} />
          </CollapsibleSection>

          {/* Dispute Resolution */}
          <CollapsibleSection
            id="dispute"
            icon="⚠️"
            title="Dispute Resolution"
            subtitle="Mediation and jurisdiction"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label>Dispute Resolution <span className="read-only-badge">Pre-filled by HR</span></label>
                <select name="disputeResolution" value={formData.disputeResolution} disabled className="read-only">
                  <option value="Mediation">Mediation</option>
                </select>
              </div>
              <div className="form-group">
                <label>Jurisdiction <span className="read-only-badge">Pre-filled by HR</span></label>
                <select name="jurisdiction" value={formData.jurisdiction} disabled className="read-only">
                  <option value="Rwanda">Rwanda</option>
                </select>
              </div>
            </div>
          </CollapsibleSection>

          {/* Company Policies */}
          <CollapsibleSection
            id="policies"
            icon="📋"
            title="Company Policies"
            subtitle="Workplace conduct and policies"
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <FormField label="Employee Handbook Reference" name="employeeHandbookRef" type="textarea" value={formData.employeeHandbookRef} readOnly={true} />
            <FormField label="Workplace Conduct" name="workplaceConduct" type="textarea" value={formData.workplaceConduct} readOnly={true} />
            <FormField label="Technology and Security" name="technologySecurity" type="textarea" value={formData.technologySecurity} readOnly={true} />
            <FormField label="Health and Safety Acknowledgment" name="healthSafetyAcknowledgment" type="textarea" value={formData.healthSafetyAcknowledgment} readOnly={true} />
          </CollapsibleSection>

          {/* Supporting Documents */}
          <CollapsibleSection
            id="documents"
            icon="📁"
            title="Supporting Documents"
            subtitle={`Required documents: ${job.requiredDocuments?.join(', ') || 'CV and supporting certificates'} *`}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
          >
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '10px' }}>
                ⚠️ At least one supporting document is required to submit this contract.
              </p>
            </div>
            <div
              className="drag-drop-area"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('dragover') }}
              onDragLeave={(e) => e.currentTarget.classList.remove('dragover')}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                <div>📎 Drag files here or click to select</div>
                <p>Max 10MB per file. Accepted: PDF, DOC, DOCX, JPG, PNG</p>
              </label>
            </div>

            {documents.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files: <span style={{ color: '#2ecc71' }}>{documents.length}</span> ✓</h4>
                {documents.map((file, idx) => (
                  <div key={idx} className="file-item">
                    <span>📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button type="button" onClick={() => handleRemoveFile(idx)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {documents.length === 0 && (
              <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px', border: '1px solid #ffb74d' }}>
                <p style={{ color: '#f57c00', margin: 0 }}>
                  No documents uploaded yet. Please upload required documents to proceed.
                </p>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>{uploadProgress}%</div>
              </div>
            )}
          </CollapsibleSection>

          <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading || documents.length === 0}
              title={documents.length === 0 ? 'Please upload at least one supporting document' : ''}
              style={{ flex: 1, opacity: documents.length === 0 ? 0.5 : 1, cursor: documents.length === 0 ? 'not-allowed' : 'pointer' }}
            >
              {loading ? '⏳ Submitting...' : documents.length === 0 ? '📎 Upload documents to submit' : '✅ Submit Contract'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/jobs/${jobId}`)} style={{ flex: 1 }}>
              ❌ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}