import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const VisaApply = () => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [existingData, setExistingData] = useState(null)

  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    maritalStatus: '',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    employmentStartDate: ''
  })

  const [addressDetails, setAddressDetails] = useState({
    streetName: '',
    city: '',
    state: '',
    zip: '',
    startDate: '',
    endDate: ''
  })

  const [h1bDetails, setH1bDetails] = useState({
    clientName: '',
    clientStreet: '',
    clientCity: '',
    clientState: '',
    clientZip: '',
    lcaTitle: '',
    lcaSalary: '',
    lcaCode: '',
    receiptNumber: '',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    // Pre-fill email from user account
    if (user?.email) {
      setPersonalDetails(prev => ({ ...prev, email: user.email }))
    }
    
    // Check if user has existing visa data
    fetchExistingData()
  }, [user])

  const fetchExistingData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visa/profile')
      if (response.data) {
        setExistingData(response.data)
        setPersonalDetails(response.data.personalDetails || personalDetails)
        setAddressDetails(response.data.addressDetails || addressDetails)
        setH1bDetails(response.data.h1bDetails || h1bDetails)
      }
    } catch (error) {
      console.log('No existing data found')
    }
  }

  const handlePersonalSubmit = (e) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    setCurrentStep(3)
  }

  const handleH1bSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      await axios.post('http://localhost:5000/api/visa/apply', {
        personalDetails,
        addressDetails,
        h1bDetails
      })
      setMessage('Visa application submitted successfully!')
      
      // Update user profile completion status
      const updatedUser = { ...user, hasCompletedProfile: true }
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
    } catch (error) {
      setMessage('Error submitting application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '24px'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    background: 'white',
    transition: 'all 0.3s ease',
    outline: 'none'
  }

  const buttonStyle = {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={cardStyle}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          Visa Application
        </h1>
        <p style={{ textAlign: 'center', color: '#64748b', margin: '0 0 32px 0' }}>
          Complete all sections to submit your H1B application
        </p>

        {message && (
          <div style={{
            background: message.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: currentStep >= step 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                  : '#e2e8f0',
                color: currentStep >= step ? 'white' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: '18px'
              }}>
                {step}
              </div>
              <span style={{
                marginLeft: '12px',
                fontWeight: '600',
                color: currentStep >= step ? '#3b82f6' : '#64748b'
              }}>
                {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'H1B Details'}
              </span>
              {step < 3 && <div style={{ width: '60px', height: '2px', background: '#e2e8f0', margin: '0 20px' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <form onSubmit={handlePersonalSubmit}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
              Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  First Name
                </label>
                <input
                  style={inputStyle}
                  value={personalDetails.firstName}
                  onChange={(e) => setPersonalDetails({...personalDetails, firstName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Last Name
                </label>
                <input
                  style={inputStyle}
                  value={personalDetails.lastName}
                  onChange={(e) => setPersonalDetails({...personalDetails, lastName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={personalDetails.dateOfBirth}
                  onChange={(e) => setPersonalDetails({...personalDetails, dateOfBirth: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Sex
                </label>
                <select
                  style={inputStyle}
                  value={personalDetails.sex}
                  onChange={(e) => setPersonalDetails({...personalDetails, sex: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Marital Status
                </label>
                <select
                  style={inputStyle}
                  value={personalDetails.maritalStatus}
                  onChange={(e) => setPersonalDetails({...personalDetails, maritalStatus: e.target.value})}
                  required
                >
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({...personalDetails, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  style={{...inputStyle, background: '#f8fafc', cursor: 'not-allowed'}}
                  value={personalDetails.email}
                  readOnly
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Emergency Contact Name
                </label>
                <input
                  style={inputStyle}
                  value={personalDetails.emergencyContactName}
                  onChange={(e) => setPersonalDetails({...personalDetails, emergencyContactName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  style={inputStyle}
                  value={personalDetails.emergencyContactPhone}
                  onChange={(e) => setPersonalDetails({...personalDetails, emergencyContactPhone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Employment Start Date
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={personalDetails.employmentStartDate}
                  onChange={(e) => setPersonalDetails({...personalDetails, employmentStartDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <button type="submit" style={buttonStyle}>
                Next: Address Details
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Address Details */}
        {currentStep === 2 && (
          <form onSubmit={handleAddressSubmit}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
              Address Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Street Name
                </label>
                <input
                  style={inputStyle}
                  value={addressDetails.streetName}
                  onChange={(e) => setAddressDetails({...addressDetails, streetName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  City
                </label>
                <input
                  style={inputStyle}
                  value={addressDetails.city}
                  onChange={(e) => setAddressDetails({...addressDetails, city: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  State
                </label>
                <input
                  style={inputStyle}
                  value={addressDetails.state}
                  onChange={(e) => setAddressDetails({...addressDetails, state: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  ZIP Code
                </label>
                <input
                  style={inputStyle}
                  value={addressDetails.zip}
                  onChange={(e) => setAddressDetails({...addressDetails, zip: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={addressDetails.startDate}
                  onChange={(e) => setAddressDetails({...addressDetails, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={addressDetails.endDate}
                  onChange={(e) => setAddressDetails({...addressDetails, endDate: e.target.value})}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(1)}
                style={{...buttonStyle, background: '#6b7280'}}
              >
                Back
              </button>
              <button type="submit" style={buttonStyle}>
                Next: H1B Details
              </button>
            </div>
          </form>
        )}

        {/* Step 3: H1B Details */}
        {currentStep === 3 && (
          <form onSubmit={handleH1bSubmit}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
              H1B Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client Name
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.clientName}
                  onChange={(e) => setH1bDetails({...h1bDetails, clientName: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client Street Name
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.clientStreet}
                  onChange={(e) => setH1bDetails({...h1bDetails, clientStreet: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client City
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.clientCity}
                  onChange={(e) => setH1bDetails({...h1bDetails, clientCity: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client State
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.clientState}
                  onChange={(e) => setH1bDetails({...h1bDetails, clientState: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client ZIP
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.clientZip}
                  onChange={(e) => setH1bDetails({...h1bDetails, clientZip: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Title
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.lcaTitle}
                  onChange={(e) => setH1bDetails({...h1bDetails, lcaTitle: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Salary
                </label>
                <input
                  type="number"
                  style={inputStyle}
                  value={h1bDetails.lcaSalary}
                  onChange={(e) => setH1bDetails({...h1bDetails, lcaSalary: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Code
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.lcaCode}
                  onChange={(e) => setH1bDetails({...h1bDetails, lcaCode: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Receipt Number
                </label>
                <input
                  style={inputStyle}
                  value={h1bDetails.receiptNumber}
                  onChange={(e) => setH1bDetails({...h1bDetails, receiptNumber: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={h1bDetails.startDate}
                  onChange={(e) => setH1bDetails({...h1bDetails, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={h1bDetails.endDate}
                  onChange={(e) => setH1bDetails({...h1bDetails, endDate: e.target.value})}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              <button 
                type="button" 
                onClick={() => setCurrentStep(2)}
                style={{...buttonStyle, background: '#6b7280'}}
              >
                Back
              </button>
              <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default VisaApply