import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/employee.css'
import '../styles/contractForm.css'

// Define read-only fields OUTSIDE component to prevent recreation on every render
// Only keep truly non-editable company information
const READ_ONLY_FIELDS = new Set([
  'employerName',
  'employerAddress'
])

// FormField component - OUTSIDE main component to prevent recreation
const FormField = ({ label, name, type = 'text', placeholder = '', required = false, hint = '', fullWidth = false, value, onChange, readOnly = false, loading = false }) => (
  <div className={`form-group ${fullWidth ? 'full-width' : ''} ${readOnly ? 'read-only-field' : ''}`}>
    <label>
      {label}
      {required && <span className="required-star">*</span>}
      {readOnly && <span className="read-only-badge">Pre-filled by HR</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        name={name}
        value={value}
        onChange={readOnly ? undefined : onChange}
        required={required}
        disabled={loading || readOnly}
        placeholder={placeholder}
        rows="4"
        className={readOnly ? 'read-only' : ''}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={readOnly ? undefined : onChange}
        required={required}
        disabled={loading || readOnly}
        placeholder={placeholder}
        className={readOnly ? 'read-only' : ''}
      />
    )}
    {hint && <p className="form-hint">{hint}</p>}
  </div>
)

// CollapsibleSection component - OUTSIDE main component to prevent recreation
const CollapsibleSection = ({ id, icon, title, subtitle, children, expandedSections, toggleSection }) => (
  <div className="form-section">
    <div className="section-header" onClick={() => toggleSection(id)}>
      <span className="section-icon">{icon}</span>
      <div className="section-title-group">
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>
      <span className={`toggle-icon ${expandedSections[id] ? 'expanded' : ''}`}>▼</span>
    </div>
    {expandedSections[id] && <div className="section-content">{children}</div>}
  </div>
)

export default function ContractForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Identification of Parties (Pre-filled by HR - Read Only)
    employerName: 'Excellence Coaching Hub',
    employerAddress: 'Kigali, Rwanda',
    employeeFullName: '',
    employeeAddress: '',
    
    // Job Information (Pre-filled by HR - Job Title/Dept editable)
    jobTitle: '',
    teachingCategory: '',
    coachingSubcategories: [],
    department: '',
    reportsTo: '',
    jobDescription: 'To be defined by department manager in collaboration with the employee.',
    
    // Place of Work (Pre-filled by HR)
    primaryWorkLocation: 'Excellence Coaching Hub Office, Kigali, Rwanda',
    relocationConditions: '',
    remoteWorkPolicy: 'Flexible',
    remoteWorkDescription: 'Up to 2 days per week remote work is allowed with manager approval. Remote work must align with organizational needs.',
    
    // Start Date and Duration
    startDate: '',
    contractType: 'Indefinite',
    endDate: '',
    
    // Compensation and Benefits (Editable by employee)
    baseSalary: '',
    paymentFrequency: 'Monthly',
    // New payment fields
    amountPerSession: '',
    modeOfPayment: '',
    paymentTerms: '',
    rateAdjustment: '',
    // End of new payment fields
    bonusesCommissions: 'Performance bonus eligible based on organizational performance and individual KPIs.',
    benefits: 'Health insurance, dental coverage, lunch allowance, annual training budget, and mobile phone provision.',
    
    // Work Hours and Leave (Pre-filled by HR - Read Only)
    workingHoursPerWeek: '40',
    workingHoursStart: '',
    workingHoursEnd: '',
    workingHoursByDay: {},
    
    // Legal and Policy Clauses
    terminationConditions: '',
    employeeNoticePeriod: '',
    employerNoticePeriod: '',
    groundsForDismissal: '',
    severancePay: '',
    
    // Dispute Resolution
    disputeResolution: '',
    jurisdiction: ''
  })

  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showCustomDepartment, setShowCustomDepartment] = useState(false)
  const [customDepartment, setCustomDepartment] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    identification: true,
    jobInfo: true,
    workLocation: false,
    startDuration: false,
    compensation: false,
    workHours: false,
    legal: false,
    dispute: false,
    documents: false
  })

  // Coaching categories and subcategories
  const coachingCategories = [
    'Professional Coaching',
    'Business & Entrepreneurship Coaching',
    'Academic Coaching',
    'Language Coaching',
    'Technical & Digital Coaching',
    'Job Seeker Coaching',
    'Personal & Corporate Development'
  ]

  const coachingSubcategories = {
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

  // Department options
  const departmentOptions = [
    'HR & Administration',
    'Finance & Operations',
    'Marketing & Business Development',
    'Technical',
    'Operations',
    'Research & Development',
    'Quality Assurance',
    'Logistics & Supply Chain',
    'Strategy & Planning',
    'Business Development',
    'Communications',
    'Data Analytics',
    'Information Technology',
    'Recruitment',
    'Training & Development'
  ]

  const token = localStorage.getItem('token')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDepartmentChange = (value) => {
    if (value === 'add-custom') {
      setShowCustomDepartment(true)
      setCustomDepartment('')
    } else {
      setFormData(prev => ({ ...prev, department: value }))
      setShowCustomDepartment(false)
    }
  }

  const handleAddCustomDepartment = () => {
    if (customDepartment.trim()) {
      setFormData(prev => ({ ...prev, department: customDepartment.trim() }))
      setShowCustomDepartment(false)
      setCustomDepartment('')
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']

      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 10MB.`)
        return false
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format. Please use PDF, DOC, DOCX, JPG, or PNG.`)
        return false
      }

      return true
    })

    setDocuments(prev => [...prev, ...validFiles])
    setError('') // Clear any previous errors
  }

  const handleRemoveFile = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.currentTarget.classList.add('dragover')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.classList.remove('dragover')
    const files = Array.from(e.dataTransfer.files)

    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png']

      if (file.size > maxSize) {
        setError(`File "${file.name}" is too large. Maximum size is 10MB.`)
        return false
      }

      if (!allowedTypes.includes(file.type)) {
        setError(`File "${file.name}" has an unsupported format. Please use PDF, DOC, DOCX, JPG, or PNG.`)
        return false
      }

      return true
    })

    setDocuments(prev => [...prev, ...validFiles])
    setError('') // Clear any previous errors
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
    setLoading(true)

    try {
      const { data } = await api.post('/contracts', { formData })
      console.log('Contract submitted successfully')

      if (documents.length > 0) {
        try {
          setUploadProgress(0)
          const formDataWithFiles = new FormData()
          documents.forEach(file => {
            formDataWithFiles.append('files', file)
            console.log('Adding file:', file.name, file.type, file.size)
          })

          await api.post('/contracts/documents', formDataWithFiles, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            timeout: 120000, // 2 minutes
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              setUploadProgress(percentCompleted)
            }
          })
          console.log('Documents uploaded successfully')
          setUploadProgress(100)
        } catch (docError) {
          console.error('Document upload failed:', docError)
          setError(`Contract submitted but document upload failed: ${docError.response?.data?.message || docError.message}`)
          setLoading(false)
          return
        }
      }

      setSuccess('Contract submitted successfully for review!')
      setTimeout(() => navigate('/employee'), 2500)
    } catch (err) {
      console.error('Contract submission failed:', err)
      setError(err.response?.data?.message || 'Failed to submit contract')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div>
      <div className="contract-header">
        <div className="contract-header-content">
          <h1>📄 Employment Contract Form</h1>
          <p>Complete all sections of this employment contract. All information will be reviewed by HR.</p>
        </div>
      </div>

      <div className="contract-container">
        <button className="back-button" onClick={() => navigate('/employee')}>← Back to Dashboard</button>

        {error && <div className="alert alert-error"><span>❌</span><div>{error}</div></div>}
        {success && <div className="alert alert-success"><span>✓</span><div>{success}</div></div>}

        <form onSubmit={handleSubmit} className={loading ? 'form-loading' : ''}>
          <div className="form-sections">
            
            {/* IDENTIFICATION OF PARTIES */}
            <CollapsibleSection 
              id="identification"
              icon="🧍"
              title="Identification of Parties"
              subtitle="Employer and employee information (Company details are pre-filled by HR)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Employer Name" 
                  name="employerName"
                  value={formData.employerName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('employerName')}
                />
                <FormField 
                  label="Employer Address" 
                  name="employerAddress"
                  value={formData.employerAddress}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('employerAddress')}
                />
                <FormField 
                  label="Employee Full Name" 
                  name="employeeFullName"
                  value={formData.employeeFullName}
                  onChange={handleInputChange}
                  required
                  hint="📝 Your legal full name"
                />
                <FormField 
                  label="Employee Address" 
                  name="employeeAddress"
                  value={formData.employeeAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CollapsibleSection>

            {/* JOB INFORMATION */}
            <CollapsibleSection 
              id="jobInfo"
              icon="💼"
              title="Job Information"
              subtitle="Role and responsibilities (Job description pre-filled by HR)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Job Title" 
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  required
                  hint="💼 Your position title"
                />
                <div className="form-group">
                  <label>
                    Coaching Category
                    <span style={{ color: '#999', marginLeft: '5px' }}>(Optional)</span>
                  </label>
                  <select name="teachingCategory" value={formData.teachingCategory} onChange={handleInputChange}>
                    <option value="">-- Select a coaching category --</option>
                    {coachingCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {formData.teachingCategory && coachingSubcategories[formData.teachingCategory] && (
                  <div className="form-group">
                    <label>
                      Coaching Subcategories
                      <span style={{ color: '#999', marginLeft: '5px' }}>(Select all that apply)</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                      {coachingSubcategories[formData.teachingCategory].map(sub => (
                        <label key={sub} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#f1f5f9', padding: '5px 10px', borderRadius: '4px' }}>
                          <input
                            type="checkbox"
                            checked={formData.coachingSubcategories.includes(sub)}
                            onChange={(e) => {
                              const subs = e.target.checked
                                ? [...formData.coachingSubcategories, sub]
                                : formData.coachingSubcategories.filter(s => s !== sub);
                              setFormData(prev => ({ ...prev, coachingSubcategories: subs }));
                            }}
                          />
                          {sub}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label>
                    Department
                    <span className="required-star">*</span>
                  </label>
                  {!showCustomDepartment ? (
                    <select value={formData.department} onChange={(e) => handleDepartmentChange(e.target.value)} required>
                      <option value="">-- Select a department --</option>
                      {departmentOptions.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                      <option value="add-custom">+ Add Custom Department</option>
                    </select>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        placeholder="Enter custom department name"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button"
                        onClick={handleAddCustomDepartment}
                        style={{ 
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Add
                      </button>
                      <button 
                        type="button"
                        onClick={() => setShowCustomDepartment(false)}
                        style={{ 
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                <FormField 
                  label="Reports To (Supervisor)" 
                  name="reportsTo"
                  value={formData.reportsTo}
                  onChange={handleInputChange}
                  required={false}
                  hint="👨‍💼 Direct supervisor name (Optional)"
                />
                <div style={{ gridColumn: '1 / -1' }}></div>
                <FormField 
                  label="Detailed Job Description" 
                  name="jobDescription"
                  type="textarea"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your main duties and responsibilities..."
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('jobDescription')}
                />
              </div>
            </CollapsibleSection>

            {/* PLACE OF WORK */}
            <CollapsibleSection 
              id="workLocation"
              icon="🏢"
              title="Place of Work"
              subtitle="Work location and arrangement details (Pre-filled by HR)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Primary Work Location" 
                  name="primaryWorkLocation"
                  value={formData.primaryWorkLocation}
                  onChange={handleInputChange}
                  required
                  hint="📍 Main office or work site"
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('primaryWorkLocation')}
                />
                <div className="form-group">
                  <label>
                    Remote Work Policy
                    <span className="required-star">*</span>
                    {READ_ONLY_FIELDS.has('remoteWorkPolicy') && <span className="read-only-badge">Pre-filled by HR</span>}
                  </label>
                  <select name="remoteWorkPolicy" value={formData.remoteWorkPolicy} onChange={handleInputChange} disabled={READ_ONLY_FIELDS.has('remoteWorkPolicy')} required className={READ_ONLY_FIELDS.has('remoteWorkPolicy') ? 'read-only' : ''}>
                    <option value="Yes">Yes - Hybrid/Remote Allowed</option>
                    <option value="No">No - On-site Only</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <FormField 
                  label="Remote Work Description" 
                  name="remoteWorkDescription"
                  type="textarea"
                  value={formData.remoteWorkDescription}
                  onChange={handleInputChange}
                  placeholder="Days per week, conditions, expectations..."
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('remoteWorkDescription')}
                />
              </div>
            </CollapsibleSection>

            {/* RELOCATION CONDITIONS */}
            {formData.relocationConditions && (
              <CollapsibleSection 
                id="relocation"
                icon="🚚"
                title="Relocation Conditions"
                subtitle="Relocation terms and conditions"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="form-grid">
                  <FormField 
                    label="Relocation Conditions" 
                    name="relocationConditions"
                    type="textarea"
                    value={formData.relocationConditions}
                    onChange={handleInputChange}
                    placeholder="Conditions for relocation, if applicable"
                    fullWidth
                    readOnly={READ_ONLY_FIELDS.has('relocationConditions')}
                  />
                </div>
              </CollapsibleSection>
            )}

            {/* START DATE AND DURATION */}
            <CollapsibleSection 
              id="startDuration"
              icon="📅"
              title="Start Date and Duration"
              subtitle="Contract period and type"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Start Date" 
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  hint="📅 Your first day"
                />
                <div className="form-group">
                  <label>
                    Contract Type
                    <span className="required-star">*</span>
                  </label>
                  <select name="contractType" value={formData.contractType} onChange={handleInputChange} required>
                    <option value="Fixed-term">Fixed-term</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Indefinite">Indefinite</option>
                  </select>
                </div>
                {formData.contractType === 'Fixed-term' && (
                  <FormField 
                    label="End Date" 
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required={formData.contractType === 'Fixed-term'}
                  />
                )}
              </div>
            </CollapsibleSection>

            {/* COMPENSATION AND BENEFITS */}
            <CollapsibleSection 
              id="compensation"
              icon="💰"
              title="Compensation and Benefits"
              subtitle="Salary, bonuses, and benefits (Company packages pre-filled by HR)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Base Salary / Hourly Rate" 
                  name="baseSalary"
                  value={formData.baseSalary}
                  onChange={handleInputChange}
                  required
                  hint="💵 Annual salary or hourly rate - Employee may be paid according to courses taught, student sessions, or other revenue-generating activities. Negotiated amount to be agreed upon."
                />
                <div className="form-group">
                  <label>
                    Payment Frequency
                    <span className="required-star">*</span>
                    {READ_ONLY_FIELDS.has('paymentFrequency') && <span className="read-only-badge">Pre-filled by HR</span>}
                  </label>
                  <select name="paymentFrequency" value={formData.paymentFrequency} onChange={handleInputChange} disabled={READ_ONLY_FIELDS.has('paymentFrequency')} required className={READ_ONLY_FIELDS.has('paymentFrequency') ? 'read-only' : ''}>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Per Lesson">Per Lesson</option>
                    <option value="Per Session">Per Session</option>
                    <option value="Per Course">Per Course</option>
                    <option value="Commission-based">Commission-based</option>
                  </select>
                </div>
                
                {/* New Payment Fields */}
                <FormField 
                  label="Amount to be Paid Per Session" 
                  name="amountPerSession"
                  value={formData.amountPerSession}
                  onChange={handleInputChange}
                  placeholder="Enter the amount to be paid per session..."
                  hint="💵 The fixed amount that will be paid for each session conducted."
                />
                <FormField 
                  label="Mode of Payment" 
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleInputChange}
                  placeholder="e.g., Bank Transfer, Mobile Money, Cash..."
                  hint="💳 How payments will be made (Bank Transfer, Mobile Money, Cash, etc.)"
                />
                <FormField 
                  label="Terms and Conditions for Payment" 
                  name="paymentTerms"
                  type="textarea"
                  value={formData.paymentTerms}
                  onChange={handleInputChange}
                  placeholder="Enter payment terms and conditions..."
                  fullWidth
                  hint="📋 Conditions that apply to payments (e.g., payment deadlines, late payment penalties, etc.)"
                />
                <FormField 
                  label="Rate Adjustment for Contract Renewal" 
                  name="rateAdjustment"
                  type="textarea"
                  value={formData.rateAdjustment}
                  onChange={handleInputChange}
                  placeholder="Enter how rates will be adjusted for contract renewal..."
                  fullWidth
                  hint="📈 How the payment rate will be adjusted when the contract is renewed (e.g., annual cost of living adjustments, performance-based increases, etc.)"
                />
                {/* End of New Payment Fields */}
                
                <FormField 
                  label="Bonuses / Commissions" 
                  name="bonusesCommissions"
                  value={formData.bonusesCommissions}
                  onChange={handleInputChange}
                  placeholder="Details of any performance bonuses or commissions..."
                  readOnly={READ_ONLY_FIELDS.has('bonusesCommissions')}
                />
                <FormField 
                  label="Benefits" 
                  name="benefits"
                  type="textarea"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Health insurance, transport, allowances, etc."
                  fullWidth
                  readOnly={READ_ONLY_FIELDS.has('benefits')}
                />
              </div>
            </CollapsibleSection>

            {/* WORK HOURS AND LEAVE */}
            <CollapsibleSection 
              id="workHours"
              icon="⏰"
              title="Work Hours and Leave"
              subtitle="Working hours and time-off policies (Pre-filled by HR)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div className="form-grid">
                <FormField 
                  label="Standard Working Hours Per Week" 
                  name="workingHoursPerWeek"
                  type="number"
                  value={formData.workingHoursPerWeek}
                  onChange={handleInputChange}
                  required
                  hint="⏱️ Usually 40 hours"
                  readOnly={READ_ONLY_FIELDS.has('workingHoursPerWeek')}
                />
                <div className="form-group">
                  <label>Working Hours Start Time</label>
                  <input 
                    type="time" 
                    name="workingHoursStart" 
                    value={formData.workingHoursStart} 
                    onChange={handleInputChange} 
                    readOnly={READ_ONLY_FIELDS.has('workingHoursStart')} 
                    className={READ_ONLY_FIELDS.has('workingHoursStart') ? 'read-only' : ''}
                  />
                </div>
                <div className="form-group">
                  <label>Working Hours End Time</label>
                  <input 
                    type="time" 
                    name="workingHoursEnd" 
                    value={formData.workingHoursEnd} 
                    onChange={handleInputChange} 
                    readOnly={READ_ONLY_FIELDS.has('workingHoursEnd')} 
                    className={READ_ONLY_FIELDS.has('workingHoursEnd') ? 'read-only' : ''}
                  />
                </div>
                {formData.workingHoursByDay && Object.keys(formData.workingHoursByDay).length > 0 && (
                  <div className="form-group full-width">
                    <label>Working Hours by Day</label>
                    <div className="working-hours-display">
                      {Object.entries(formData.workingHoursByDay).map(([day, hours]) => (
                        hours.start && hours.end ? (
                          <div key={day} className="working-hours-day">
                            <span className="working-hours-day-label">{day}:</span>
                            <span>{hours.start} - {hours.end}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
                
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
              </div>
            </CollapsibleSection>

            {/* LEGAL AND POLICY CLAUSES */}
            {(formData.terminationConditions || formData.employeeNoticePeriod || formData.employerNoticePeriod || formData.groundsForDismissal || formData.severancePay) && (
              <CollapsibleSection 
                id="legal"
                icon="⚖️"
                title="Legal and Policy Clauses"
                subtitle="Termination and employment conditions"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="form-grid">
                  {formData.terminationConditions && (
                    <FormField 
                      label="Termination Conditions" 
                      name="terminationConditions"
                      type="textarea"
                      value={formData.terminationConditions}
                      onChange={handleInputChange}
                      placeholder="Conditions for employment termination"
                      fullWidth
                      readOnly={READ_ONLY_FIELDS.has('terminationConditions')}
                    />
                  )}
                  <div className="form-group">
                    {formData.employeeNoticePeriod && (
                      <FormField 
                        label="Employee Notice Period" 
                        name="employeeNoticePeriod"
                        value={formData.employeeNoticePeriod}
                        onChange={handleInputChange}
                        placeholder="e.g., 30 days written notice to employer"
                        readOnly={READ_ONLY_FIELDS.has('employeeNoticePeriod')}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    {formData.employerNoticePeriod && (
                      <FormField 
                        label="Employer Notice Period" 
                        name="employerNoticePeriod"
                        value={formData.employerNoticePeriod}
                        onChange={handleInputChange}
                        placeholder="e.g., 30 days written notice to employee"
                        readOnly={READ_ONLY_FIELDS.has('employerNoticePeriod')}
                      />
                    )}
                  </div>
                  {formData.groundsForDismissal && (
                    <FormField 
                      label="Grounds for Dismissal" 
                      name="groundsForDismissal"
                      type="textarea"
                      value={formData.groundsForDismissal}
                      onChange={handleInputChange}
                      placeholder="Grounds for employment dismissal"
                      fullWidth
                      readOnly={READ_ONLY_FIELDS.has('groundsForDismissal')}
                    />
                  )}
                  {formData.severancePay && (
                    <FormField 
                      label="Severance Pay" 
                      name="severancePay"
                      type="textarea"
                      value={formData.severancePay}
                      onChange={handleInputChange}
                      placeholder="Severance pay conditions"
                      fullWidth
                      readOnly={READ_ONLY_FIELDS.has('severancePay')}
                    />
                  )}
                </div>
              </CollapsibleSection>
            )}

            {/* DISPUTE RESOLUTION */}
            {(formData.disputeResolution || formData.jurisdiction) && (
              <CollapsibleSection 
                id="dispute"
                icon="🤝"
                title="Dispute Resolution"
                subtitle="Dispute resolution process"
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              >
                <div className="form-grid">
                  <div className="form-group">
                    {formData.disputeResolution && (
                      <FormField 
                        label="Dispute Resolution" 
                        name="disputeResolution"
                        value={formData.disputeResolution}
                        onChange={handleInputChange}
                        placeholder="Dispute resolution process"
                        readOnly={READ_ONLY_FIELDS.has('disputeResolution')}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    {formData.jurisdiction && (
                      <FormField 
                        label="Jurisdiction" 
                        name="jurisdiction"
                        value={formData.jurisdiction}
                        onChange={handleInputChange}
                        placeholder="Legal jurisdiction"
                        readOnly={READ_ONLY_FIELDS.has('jurisdiction')}
                      />
                    )}
                  </div>
                </div>
              </CollapsibleSection>
            )}

            {/* SUPPORTING DOCUMENTS */}
            <CollapsibleSection 
              id="documents"
              icon="📎"
              title="Supporting Documents"
              subtitle="Upload any required documentation (Optional)"
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            >
              <div 
                className="file-upload-area"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="file-upload-icon">📤</div>
                <p className="file-upload-text">Drag & drop your files here</p>
                <p className="file-upload-hint">or click to browse</p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  disabled={loading}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="file-input"
                />
                <label htmlFor="file-input" style={{ cursor: 'pointer', color: '#6366f1', fontWeight: '600', marginTop: '12px', display: 'block' }}>
                  Browse Files
                </label>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
                  Accepted: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                </p>
              </div>

              {documents.length > 0 && (
                <div className="files-list">
                  <div className="files-count">
                    ✓ {documents.length} file{documents.length !== 1 ? 's' : ''} selected
                  </div>
                  {documents.map((file, idx) => (
                    <div key={idx} className="file-item">
                      <div className="file-item-info">
                        <span className="file-item-icon">
                          {file.type.includes('pdf') ? '📄' : file.type.includes('word') ? '📝' : '🖼️'}
                        </span>
                        <span className="file-item-name">{file.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="file-item-remove"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CollapsibleSection>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                <span className="submit-button-content">
                  {loading ? '⏳ Submitting...' : '✓ Submit Contract for Review'}
                </span>
              </button>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => navigate('/employee')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                </div>
                <p>Uploading documents... {uploadProgress}%</p>
              </div>
            )}

            <div className="form-disclaimer">
              <strong>⚠️ Important:</strong> By submitting this contract, you confirm that all information provided is accurate, complete, and truthful. Please review all details carefully before submission. This contract will be reviewed by the HR department.
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
