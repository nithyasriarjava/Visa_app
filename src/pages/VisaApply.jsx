import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../components/supabaseClient'

const VisaApply = () => {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [existingData, setExistingData] = useState(null)
  const [errors, setErrors] = useState({})

  const validatePersonalDetails = () => {
    const newErrors = {}
    if (!personalDetails.firstName.trim()) newErrors.firstName = 'First name is required'
    else if (!/^[a-zA-Z\s]+$/.test(personalDetails.firstName)) newErrors.firstName = 'First name should contain only letters'
    if (!personalDetails.lastName.trim()) newErrors.lastName = 'Last name is required'
    else if (!/^[a-zA-Z\s]+$/.test(personalDetails.lastName)) newErrors.lastName = 'Last name should contain only letters'
    if (!personalDetails.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!personalDetails.sex) newErrors.sex = 'Sex is required'
    if (!personalDetails.maritalStatus) newErrors.maritalStatus = 'Marital status is required'
    if (!personalDetails.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email)) newErrors.email = 'Invalid email format'
    if (!personalDetails.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!/^[\+]?[1-9]\d{7,14}$/.test(personalDetails.phone.replace(/[\s\-\(\)]/g, ''))) newErrors.phone = 'Enter valid international phone number (e.g., +1234567890)'
    if (!personalDetails.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required'
    else if (!/^[a-zA-Z\s]+$/.test(personalDetails.emergencyContactName)) newErrors.emergencyContactName = 'Name should contain only letters'
    if (!personalDetails.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required'
    else if (!/^[\+]?[1-9]\d{7,14}$/.test(personalDetails.emergencyContactPhone.replace(/[\s\-\(\)]/g, ''))) newErrors.emergencyContactPhone = 'Enter valid international phone number (e.g., +1234567890)'
    if (!personalDetails.employmentStartDate) newErrors.employmentStartDate = 'Employment start date is required'
    return newErrors
  }

  const validateAddressDetails = () => {
    const newErrors = {}
    if (!addressDetails.streetName.trim()) newErrors.streetName = 'Street name is required'
    if (!addressDetails.city.trim()) newErrors.city = 'City is required'
    else if (!/^[a-zA-Z\s]+$/.test(addressDetails.city)) newErrors.city = 'City should contain only letters'
    if (!addressDetails.state.trim()) newErrors.state = 'State is required'
    if (!addressDetails.zip.trim()) newErrors.zip = 'ZIP/Postal code is required'
    else {
      const isUSState = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'US Virgin Islands', 'American Samoa', 'Guam', 'Northern Mariana Islands'].includes(addressDetails.state)
      
      if (isUSState) {
        // US ZIP code: 5 digits or 5+4 format
        if (!/^\d{5}(-\d{4})?$/.test(addressDetails.zip)) {
          newErrors.zip = 'US ZIP code must be 5 digits (12345) or 9 digits (12345-6789)'
        }
      } else {
        // Indian PIN code: 6 digits
        if (!/^\d{6}$/.test(addressDetails.zip)) {
          newErrors.zip = 'Indian PIN code must be 6 digits (123456)'
        }
      }
    }

    return newErrors
  }

  const validateH1bDetails = () => {
    const newErrors = {}
    if (!h1bDetails.clientName.trim()) newErrors.clientName = 'Client name is required'
    else if (!/^[a-zA-Z\s&.,'-]+$/.test(h1bDetails.clientName)) newErrors.clientName = 'Client name should contain only letters'
    if (!h1bDetails.clientStreet.trim()) newErrors.clientStreet = 'Client street is required'
    if (!h1bDetails.clientCity.trim()) newErrors.clientCity = 'Client city is required'
    else if (!/^[a-zA-Z\s]+$/.test(h1bDetails.clientCity)) newErrors.clientCity = 'Client city should contain only letters'
    if (!h1bDetails.clientState.trim()) newErrors.clientState = 'Client state is required'
    else if (!/^[a-zA-Z\s]+$/.test(h1bDetails.clientState)) newErrors.clientState = 'Client state should contain only letters'
    if (!h1bDetails.clientZip.trim()) newErrors.clientZip = 'Client ZIP is required'
    else if (!/^\d{5}(-\d{4})?$/.test(h1bDetails.clientZip)) newErrors.clientZip = 'Invalid ZIP code format'
    if (!h1bDetails.lcaTitle.trim()) newErrors.lcaTitle = 'LCA title is required'
    if (!h1bDetails.lcaSalary) newErrors.lcaSalary = 'LCA salary is required'
    else if (h1bDetails.lcaSalary < 0) newErrors.lcaSalary = 'Salary must be positive'
    if (!h1bDetails.lcaCode.trim()) newErrors.lcaCode = 'LCA code is required'
    else if (!/^\d+$/.test(h1bDetails.lcaCode)) newErrors.lcaCode = 'LCA code should contain only numbers'
    if (!h1bDetails.receiptNumber.trim()) newErrors.receiptNumber = 'Receipt number is required'
    else if (!/^\d+$/.test(h1bDetails.receiptNumber)) newErrors.receiptNumber = 'Receipt number should contain only numbers'
    if (!h1bDetails.startDate) newErrors.startDate = 'Start date is required'
    if (!h1bDetails.endDate) newErrors.endDate = 'End date is required'
    if (h1bDetails.startDate && h1bDetails.endDate && new Date(h1bDetails.endDate) <= new Date(h1bDetails.startDate)) {
      newErrors.endDate = 'End date must be after start date'
    }
    return newErrors
  }

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
    zip: ''
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
    // Check if we're in editing mode
    const editingData = localStorage.getItem('editingPersonData')
    if (editingData) {
      const personData = JSON.parse(editingData)
      setPersonalDetails(personData.personalDetails || personalDetails)
      setAddressDetails(personData.addressDetails || addressDetails)
      setH1bDetails(personData.h1bDetails || h1bDetails)
      setExistingData({ isEditing: true })
    } else {
      // Clear any leftover editing data and ensure fresh form
      localStorage.removeItem('editingPersonData')
      localStorage.removeItem('editingPersonIndex')
      fetchExistingData()
    }
  }, [user])

  const fetchExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('visa_applications')
        .select('*')
        .eq('user_id', user?.id)
        .single()
      
      if (data && !error) {
        setExistingData(data)
        setPersonalDetails(data.personal_details || personalDetails)
        setAddressDetails(data.address_details || addressDetails)
        setH1bDetails(data.h1b_details || h1bDetails)
      }
    } catch (error) {
      console.log('No existing data found')
    }
  }

  const handlePersonalSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validatePersonalDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setCurrentStep(2)
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateAddressDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setCurrentStep(3)
  }

  const handleH1bSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateH1bDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    setMessage('')

    // Use user-entered H1B details
    const completeH1bDetails = h1bDetails

    // Store all form data in localStorage with unique key
    const visaApplicationData = {
      personalDetails,
      addressDetails,
      h1bDetails: completeH1bDetails,
      submittedAt: new Date().toISOString()
    }
    
    // Get existing applications or create new array
    const existingApplications = JSON.parse(localStorage.getItem('allVisaApplications') || '[]')
    
    // Check if we're editing an existing person
    const editingIndex = localStorage.getItem('editingPersonIndex')
    if (editingIndex !== null) {
      // Update existing application
      existingApplications[parseInt(editingIndex)] = visaApplicationData
      localStorage.removeItem('editingPersonData')
      localStorage.removeItem('editingPersonIndex')
      setMessage('✅ Application updated successfully! Receipt Number: ' + h1bDetails.receiptNumber + '. Redirecting to profile...')
    } else {
      // Add new application
      existingApplications.push(visaApplicationData)
      setMessage('✅ Visa application submitted successfully! Receipt Number: ' + h1bDetails.receiptNumber + '. Redirecting to dashboard...')
    }
    
    localStorage.setItem('allVisaApplications', JSON.stringify(existingApplications))
    
    // Also store current user's latest application
    localStorage.setItem('visaApplicationData', JSON.stringify(visaApplicationData))
    
    setH1bDetails(completeH1bDetails)
    setMessage('✅ Visa application submitted successfully! Receipt Number: ' + h1bDetails.receiptNumber + '. Redirecting to dashboard...')
    
    // Update user profile completion status
    const updatedUser = { ...user, hasCompletedProfile: true }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    setLoading(false)
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(40px)',
    borderRadius: '24px',
    padding: window.innerWidth <= 768 ? '12px' : '24px',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    marginBottom: '16px',
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    width: '100%',
    boxSizing: 'border-box'
  }

  const inputStyle = (hasError = false) => ({
    width: '100%',
    padding: '10px 12px',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  })

  const errorStyle = {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '500'
  }

  const buttonStyle = {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
    fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      width: '100%', 
      padding: window.innerWidth <= 768 ? '8px' : '16px',
      boxSizing: 'border-box'
    }}>
      <div style={cardStyle}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 8px 0',
          textAlign: 'center',
          fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Visa Application
        </h1>
        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 32px 0', fontSize: '14px', fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          Complete all sections to submit your H1B application
        </p>

        {message && (
          <div style={{
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: window.innerWidth <= 768 ? '20px' : '32px',
          flexWrap: 'wrap',
          gap: window.innerWidth <= 768 ? '8px' : '0'
        }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{ 
              display: 'flex', 
              alignItems: 'center',
              flexDirection: window.innerWidth <= 480 ? 'column' : 'row'
            }}>
              <div style={{
                width: window.innerWidth <= 768 ? '32px' : '40px',
                height: window.innerWidth <= 768 ? '32px' : '40px',
                borderRadius: '50%',
                background: currentStep >= step
                  ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                  : '#858d98ff',
                color: currentStep >= step ? 'white' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: window.innerWidth <= 768 ? '14px' : '18px'
              }}>
                {step}
              </div>
              <span style={{
                marginLeft: window.innerWidth <= 480 ? '0' : '12px',
                marginTop: window.innerWidth <= 480 ? '4px' : '0',
                fontWeight: '600',
                color: currentStep >= step ? '#3b82f6' : '#64748b',
                fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                textAlign: 'center'
              }}>
                {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'H1B Details'}
              </span>
              {step < 3 && window.innerWidth > 480 && <div style={{ width: window.innerWidth <= 768 ? '30px' : '60px', height: '2px', background: '#e2e8f0', margin: window.innerWidth <= 768 ? '0 10px' : '0 20px' }} />}
            </div>
          ))}
        </div>

        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <form onSubmit={handlePersonalSubmit}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '20px', fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
              Personal Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  First Name
                </label>
                <input
                  style={inputStyle(errors.firstName)}
                  value={personalDetails.firstName}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                  required
                />
                {errors.firstName && <div style={errorStyle}>{errors.firstName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Last Name
                </label>
                <input
                  style={inputStyle(errors.lastName)}
                  value={personalDetails.lastName}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                  required
                />
                {errors.lastName && <div style={errorStyle}>{errors.lastName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  style={inputStyle(errors.dateOfBirth)}
                  value={personalDetails.dateOfBirth}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value })}
                  required
                />
                {errors.dateOfBirth && <div style={errorStyle}>{errors.dateOfBirth}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Sex
                </label>
                <select
                  style={inputStyle(errors.sex)}
                  value={personalDetails.sex}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, sex: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.sex && <div style={errorStyle}>{errors.sex}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Marital Status
                </label>
                <select
                  style={inputStyle(errors.maritalStatus)}
                  value={personalDetails.maritalStatus}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, maritalStatus: e.target.value })}
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select>
                {errors.maritalStatus && <div style={errorStyle}>{errors.maritalStatus}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Phone
                </label>
                <input
                  type="tel"
                  style={inputStyle(errors.phone)}
                  value={personalDetails.phone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                  placeholder="+1234567890"
                  required
                />
                {errors.phone && <div style={errorStyle}>{errors.phone}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  style={inputStyle(errors.email)}
                  value={personalDetails.email}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                  required
                />
                {errors.email && <div style={errorStyle}>{errors.email}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Emergency Contact Name
                </label>
                <input
                  style={inputStyle(errors.emergencyContactName)}
                  value={personalDetails.emergencyContactName}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, emergencyContactName: e.target.value })}
                  required
                />
                {errors.emergencyContactName && <div style={errorStyle}>{errors.emergencyContactName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  style={inputStyle(errors.emergencyContactPhone)}
                  value={personalDetails.emergencyContactPhone}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, emergencyContactPhone: e.target.value })}
                  placeholder="+1234567890"
                  required
                />
                {errors.emergencyContactPhone && <div style={errorStyle}>{errors.emergencyContactPhone}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Employment Start Date
                </label>
                <input
                  type="date"
                  style={inputStyle(errors.employmentStartDate)}
                  value={personalDetails.employmentStartDate}
                  onChange={(e) => setPersonalDetails({ ...personalDetails, employmentStartDate: e.target.value })}
                  required
                />
                {errors.employmentStartDate && <div style={errorStyle}>{errors.employmentStartDate}</div>}
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
                  style={inputStyle(errors.streetName)}
                  value={addressDetails.streetName}
                  onChange={(e) => setAddressDetails({ ...addressDetails, streetName: e.target.value })}
                  required
                />
                {errors.streetName && <div style={errorStyle}>{errors.streetName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  City
                </label>
                <input
                  style={inputStyle(errors.city)}
                  value={addressDetails.city}
                  onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                  required
                />
                {errors.city && <div style={errorStyle}>{errors.city}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                  State
                </label>
                <select
                  style={inputStyle(errors.state)}
                  value={addressDetails.state}
                  onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Washington">Washington</option>
                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
                  <option value="District of Columbia">District of Columbia</option>
                  <option value="Puerto Rico">Puerto Rico</option>
                  <option value="US Virgin Islands">US Virgin Islands</option>
                  <option value="American Samoa">American Samoa</option>
                  <option value="Guam">Guam</option>
                  <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                  <option value="Ladakh">Ladakh</option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
                {errors.state && <div style={errorStyle}>{errors.state}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  ZIP Code
                </label>
                <input
                  style={inputStyle(errors.zip)}
                  value={addressDetails.zip}
                  onChange={(e) => setAddressDetails({ ...addressDetails, zip: e.target.value })}
                  placeholder={addressDetails.state && ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia', 'Puerto Rico', 'US Virgin Islands', 'American Samoa', 'Guam', 'Northern Mariana Islands'].includes(addressDetails.state) ? '12345 or 12345-6789' : '123456'}
                  required
                />
                {errors.zip && <div style={errorStyle}>{errors.zip}</div>}
              </div>

            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                style={{ ...buttonStyle, background: '#6b7280' }}
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
                  style={inputStyle(errors.clientName)}
                  value={h1bDetails.clientName}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, clientName: e.target.value })}
                  required
                />
                {errors.clientName && <div style={errorStyle}>{errors.clientName}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client Street Name
                </label>
                <input
                  style={inputStyle(errors.clientStreet)}
                  value={h1bDetails.clientStreet}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, clientStreet: e.target.value })}
                  required
                />
                {errors.clientStreet && <div style={errorStyle}>{errors.clientStreet}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client City
                </label>
                <input
                  style={inputStyle(errors.clientCity)}
                  value={h1bDetails.clientCity}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, clientCity: e.target.value })}
                  required
                />
                {errors.clientCity && <div style={errorStyle}>{errors.clientCity}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client State
                </label>
                <input
                  style={inputStyle(errors.clientState)}
                  value={h1bDetails.clientState}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, clientState: e.target.value })}
                  required
                />
                {errors.clientState && <div style={errorStyle}>{errors.clientState}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Client ZIP
                </label>
                <input
                  style={inputStyle(errors.clientZip)}
                  value={h1bDetails.clientZip}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, clientZip: e.target.value })}
                  required
                />
                {errors.clientZip && <div style={errorStyle}>{errors.clientZip}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Title
                </label>
                <input
                  style={inputStyle(errors.lcaTitle)}
                  value={h1bDetails.lcaTitle}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, lcaTitle: e.target.value })}
                  required
                />
                {errors.lcaTitle && <div style={errorStyle}>{errors.lcaTitle}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Salary
                </label>
                <input
                  type="number"
                  style={inputStyle(errors.lcaSalary)}
                  value={h1bDetails.lcaSalary}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, lcaSalary: e.target.value })}
                  min="0"
                  placeholder="Annual salary in USD"
                  required
                />
                {errors.lcaSalary && <div style={errorStyle}>{errors.lcaSalary}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  LCA Code
                </label>
                <input
                  style={inputStyle(errors.lcaCode)}
                  value={h1bDetails.lcaCode}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, lcaCode: e.target.value })}
                  required
                />
                {errors.lcaCode && <div style={errorStyle}>{errors.lcaCode}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Receipt Number
                </label>
                <input
                  style={inputStyle(errors.receiptNumber)}
                  value={h1bDetails.receiptNumber}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, receiptNumber: e.target.value })}
                  required
                />
                {errors.receiptNumber && <div style={errorStyle}>{errors.receiptNumber}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Start Date
                </label>
                <input
                  type="date"
                  style={inputStyle(errors.startDate)}
                  value={h1bDetails.startDate}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, startDate: e.target.value })}
                  required
                />
                {errors.startDate && <div style={errorStyle}>{errors.startDate}</div>}
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  End Date
                </label>
                <input
                  type="date"
                  style={inputStyle(errors.endDate)}
                  value={h1bDetails.endDate}
                  onChange={(e) => setH1bDetails({ ...h1bDetails, endDate: e.target.value })}
                  required
                />
                {errors.endDate && <div style={errorStyle}>{errors.endDate}</div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                style={{ ...buttonStyle, background: '#6b7280' }}
              >
                Back
              </button>
              <button 
                type="submit" 
                style={buttonStyle} 
                disabled={loading}
                onClick={handleH1bSubmit}
              >
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