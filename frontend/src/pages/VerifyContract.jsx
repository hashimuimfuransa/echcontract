import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/VerifyContract.css'

export default function VerifyContract() {
  const { contractId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying contract authenticity...')
  const [contractData, setContractData] = useState(null)
  const [employeeData, setEmployeeData] = useState(null)

  useEffect(() => {
    const verifyContract = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/contracts/verify/${contractId}`
        )
        
        if (response.data.verified) {
          setStatus('success')
          setMessage('✓ Contract verified successfully!')
          setContractData(response.data.contract)
          setEmployeeData(response.data.employee)
        } else {
          setStatus('error')
          setMessage('Contract verification failed: Invalid or expired contract')
        }
      } catch (err) {
        setStatus('error')
        setMessage(
          err.response?.data?.message || 
          'Contract not found or verification expired'
        )
      }
    }

    if (contractId) {
      verifyContract()
    }
  }, [contractId])

  return (
    <div className="verify-container">
      <div className="verify-card">
        <img src="/logo1.png" alt="Excellence Coaching Hub" className="verify-logo" />
        
        <div className="verify-content">
          <h1>Contract Verification</h1>
          
          {status === 'verifying' && (
            <div className="status verifying">
              <div className="spinner"></div>
              <p>{message}</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="status success">
              <div className="success-icon">✓</div>
              <h2>{message}</h2>
              
              {contractData && employeeData && (
                <div className="contract-details">
                  <div className="detail-row">
                    <span className="label">Employee:</span>
                    <span className="value">{employeeData.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Position:</span>
                    <span className="value">{contractData.formData?.jobTitle || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Department:</span>
                    <span className="value">{contractData.formData?.department || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Contract Type:</span>
                    <span className="value">{contractData.formData?.contractType || 'N/A'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className="value status-badge approved">{contractData.status}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Document ID:</span>
                    <span className="value document-id">{contractData._id}</span>
                  </div>
                </div>
              )}
              
              <p className="verification-info">
                This contract is authentic and has been verified in the Excellence Coaching Hub system.
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="status error">
              <div className="error-icon">✗</div>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <p className="verification-info">
                If you believe this is an error, please contact the HR department at 
                <strong> info@excellencecoachinghub.com</strong>
              </p>
            </div>
          )}
        </div>
        
        <div className="verify-footer">
          <button className="back-btn" onClick={() => navigate('/')}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}