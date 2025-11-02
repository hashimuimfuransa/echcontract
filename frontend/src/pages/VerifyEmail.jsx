import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify/${token}`)
        setStatus('success')
        setMessage(data.message)
        setTimeout(() => navigate('/login'), 3000)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed')
      }
    }

    if (token) {
      verify()
    }
  }, [token, navigate])

  return (
    <div className="container" style={{ marginTop: '50px' }}>
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <img src="/logo1.png" alt="Excellence Coaching Hub" style={{ height: '80px', width: 'auto', marginBottom: '20px' }} />
        <h1>Email Verification</h1>
        <p>{message}</p>
        {status === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Redirecting to login...</p>}
        {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Please try again or contact support.</p>}
      </div>
    </div>
  )
}
