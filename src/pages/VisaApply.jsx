import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllCustomers, createCustomer, updateCustomer } from '../services'
<<<<<<< HEAD
=======
import { VALIDATION, STATES, FORM_OPTIONS, MESSAGES, TIME_CONSTANTS } from '../lib/constants'
>>>>>>> 6fa1407ff63b8db4c39d818e888c15a19589cd23

const VisaApply = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [message, setMessage] = useState('')
  const [existingData, setExistingData] = useState(null)
  const [errors, setErrors] = useState({})

  const validatePersonalDetails = () => {
    const newErrors = {}
    if (!personalDetails.firstName.trim()) newErrors.firstName = 'First name is required'
    else if (!VALIDATION.letters.test(personalDetails.firstName)) newErrors.firstName = 'First name should contain only letters'
    if (!personalDetails.lastName.trim()) newErrors.lastName = 'Last name is required'
    else if (!VALIDATION.letters.test(personalDetails.lastName)) newErrors.lastName = 'Last name should contain only letters'
    if (!personalDetails.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!personalDetails.sex) newErrors.sex = 'Sex is required'
    if (!personalDetails.maritalStatus) newErrors.maritalStatus = 'Marital status is required'
    if (!personalDetails.email.trim()) newErrors.email = 'Email is required'
    else if (!VALIDATION.email.test(personalDetails.email)) newErrors.email = 'Invalid email format'
    if (!personalDetails.phone.trim()) newErrors.phone = 'Phone is required'
    else if (!VALIDATION.phone.test(personalDetails.phone.replace(/[\s\-\(\)]/g, ''))) newErrors.phone = 'Enter valid international phone number (e.g., +1234567890)'
    if (!personalDetails.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required'
    else if (!VALIDATION.letters.test(personalDetails.emergencyContactName)) newErrors.emergencyContactName = 'Name should contain only letters'
    if (!personalDetails.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required'
    else if (!VALIDATION.phone.test(personalDetails.emergencyContactPhone.replace(/[\s\-\(\)]/g, ''))) newErrors.emergencyContactPhone = 'Enter valid international phone number (e.g., +1234567890)'
    if (!personalDetails.employmentStartDate) newErrors.employmentStartDate = 'Employment start date is required'
    return newErrors
  }

  const validateAddressDetails = () => {
    const newErrors = {}
    if (!addressDetails.streetName.trim()) newErrors.streetName = 'Street name is required'
    if (!addressDetails.city.trim()) newErrors.city = 'City is required'
    else if (!VALIDATION.letters.test(addressDetails.city)) newErrors.city = 'City should contain only letters'
    if (!addressDetails.state.trim()) newErrors.state = 'State is required'
    if (!addressDetails.zip.trim()) newErrors.zip = 'ZIP/Postal code is required'
    else {
      const usStates = STATES.slice(0, 55) // First 55 are US states
      const isUSState = usStates.includes(addressDetails.state)
      
      if (isUSState) {
        // US ZIP code: 5 digits or 5+4 format
        if (!VALIDATION.usZip.test(addressDetails.zip)) {
          newErrors.zip = 'US ZIP code must be 5 digits (12345) or 9 digits (12345-6789)'
        }
      } else {
        // Indian PIN code: 6 digits
        if (!VALIDATION.indianPin.test(addressDetails.zip)) {
          newErrors.zip = 'Indian PIN code must be 6 digits (123456)'
        }
      }
    }

    return newErrors
  }

  const validateH1bDetails = () => {
    const newErrors = {}
    if (!h1bDetails.clientName.trim()) newErrors.clientName = 'Client name is required'
    else if (!VALIDATION.lettersExtended.test(h1bDetails.clientName)) newErrors.clientName = 'Client name should contain only letters'
    if (!h1bDetails.clientStreet.trim()) newErrors.clientStreet = 'Client street is required'
    if (!h1bDetails.clientCity.trim()) newErrors.clientCity = 'Client city is required'
    else if (!VALIDATION.letters.test(h1bDetails.clientCity)) newErrors.clientCity = 'Client city should contain only letters'
    if (!h1bDetails.clientState.trim()) newErrors.clientState = 'Client state is required'
    else if (!VALIDATION.letters.test(h1bDetails.clientState)) newErrors.clientState = 'Client state should contain only letters'
    if (!h1bDetails.clientZip.trim()) newErrors.clientZip = 'Client ZIP is required'
    else if (!VALIDATION.usZip.test(h1bDetails.clientZip)) newErrors.clientZip = 'Invalid ZIP code format'
    if (!h1bDetails.lcaTitle.trim()) newErrors.lcaTitle = 'LCA title is required'
    if (!h1bDetails.lcaSalary) newErrors.lcaSalary = 'LCA salary is required'
    else if (h1bDetails.lcaSalary < 0) newErrors.lcaSalary = 'Salary must be positive'
    if (!h1bDetails.lcaCode.trim()) newErrors.lcaCode = 'LCA code is required'
    else if (!VALIDATION.numbers.test(h1bDetails.lcaCode)) newErrors.lcaCode = 'LCA code should contain only numbers'
    if (!h1bDetails.receiptNumber.trim()) newErrors.receiptNumber = 'Receipt number is required'
    else if (!VALIDATION.numbers.test(h1bDetails.receiptNumber)) newErrors.receiptNumber = 'Receipt number should contain only numbers'
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
      setExistingData({ isEditing: true, customerId: personData.customerId })
    } else {
      // Clear any leftover editing data and ensure fresh form
      localStorage.removeItem('editingPersonData')
      localStorage.removeItem('editingPersonIndex')
      if (user?.email) {
        fetchExistingData()
      }
    }
  }, [])

  const fetchExistingData = async () => {
    if (!user?.email) {
      return
    }

    try {
      const response = await getAllCustomers()

      if (response.data && response.data.length > 0) {
        // Find user's data by email since we don't have user_id in the new API
        const userData = response.data.find(customer => customer.email === user?.email)
        if (userData) {
          setExistingData(userData)
          setPersonalDetails({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            dateOfBirth: userData.dateOfBirth || '',
            sex: userData.sex || '',
            maritalStatus: userData.maritalStatus || '',
            phone: userData.phone || '',
            email: userData.email || '',
            emergencyContactName: userData.emergencyContactName || '',
            emergencyContactPhone: userData.emergencyContactPhone || '',
            employmentStartDate: userData.employmentStartDate || ''
          })
          setAddressDetails({
            streetName: userData.streetName || '',
            city: userData.city || '',
            state: userData.state || '',
            zip: userData.zip || ''
          })
          setH1bDetails({
            clientName: userData.clientName || '',
            clientStreet: userData.clientStreetName || '',
            clientCity: userData.clientCity || '',
            clientState: userData.clientState || '',
            clientZip: userData.clientZip || '',
            lcaTitle: userData.lcaTitle || '',
            lcaSalary: userData.lcaSalary || '',
            lcaCode: userData.lcaCode || '',
            receiptNumber: userData.receiptNumber || '',
            startDate: userData.startDate || '',
            endDate: userData.endDate || ''
          })
        }
      }
    } catch (error) {
      // No existing data found
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

    // Prevent multiple submissions
    if (loading || submitAttempted) {
      return
    }
    
    const validationErrors = validateH1bDetails()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setLoading(true)
    setSubmitAttempted(true)
    setMessage('')

    // Set timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setSubmitAttempted(false)
        setMessage('Request timeout. Please try again.')
      }
    }, 30000) // 30 second timeout

    try {
      // Validate required user email
      if (!user?.email) {
        setMessage(MESSAGES.error.notAuthenticated)
        return
      }

      // Prepare form data for API submission - ensure all fields are strings and not empty
      const formData = {
        // Personal Details
        first_name: personalDetails.firstName.trim(),
        last_name: personalDetails.lastName.trim(),
        dob: personalDetails.dateOfBirth,
        sex: personalDetails.sex,
        marital_status: personalDetails.maritalStatus,
        phone: personalDetails.phone.trim(),
        email: personalDetails.email.trim(),
        emergency_contact_name: personalDetails.emergencyContactName.trim(),
        emergency_contact_phone: personalDetails.emergencyContactPhone.trim(),
        employment_start_date: personalDetails.employmentStartDate,
        // Address
        street_name: addressDetails.streetName.trim(),
        city: addressDetails.city.trim(),
        state: addressDetails.state,
        zip: addressDetails.zip.trim(),
        // H1B Details
        client_name: h1bDetails.clientName.trim(),
        client_street_name: h1bDetails.clientStreet.trim(),
        client_city: h1bDetails.clientCity.trim(),
        client_state: h1bDetails.clientState.trim(),
        client_zip: h1bDetails.clientZip.trim(),
        lca_title: h1bDetails.lcaTitle.trim(),
        lca_salary: parseFloat(h1bDetails.lcaSalary) || 0,
        lca_code: h1bDetails.lcaCode.trim(),
        receipt_number: h1bDetails.receiptNumber.trim(),
        h1b_start_date: h1bDetails.startDate,
        h1b_end_date: h1bDetails.endDate,
        // Login email from authenticated user
        login_email: user.email.trim()
      }

      // Check if we're in editing mode
      const isEditing = existingData?.isEditing && existingData?.customerId

<<<<<<< HEAD
      console.log('=== FINAL API PAYLOAD ===')
      console.log('Mode:', isEditing ? 'EDIT' : 'CREATE')
      console.log('Payload:', JSON.stringify(formData, null, 2))

      const response = isEditing
        ? await updateCustomer(existingData.customerId, formData)
        : await createCustomer(formData)

      console.log('=== API SUCCESS ===')
      console.log('Response status:', response.status)
      console.log('Response data:', response.data)

      const successMessage = isEditing
        ? 'Customer updated successfully! Redirecting to dashboard...'
        : 'Visa application submitted successfully! Receipt Number: ' + h1bDetails.receiptNumber + '. Redirecting to dashboard...'
=======
      const response = isEditing
        ? await updateCustomer(existingData.customerId, formData)
        : await createCustomer(formData)

      // Clear timeout on successful response
      clearTimeout(timeoutId)

      const successMessage = isEditing
        ? MESSAGES.success.customerUpdated
        : `${MESSAGES.success.applicationSubmitted} Receipt Number: ${h1bDetails.receiptNumber}. Redirecting to dashboard...`
>>>>>>> 6fa1407ff63b8db4c39d818e888c15a19589cd23
      
      setMessage(successMessage)
      
      // Clear editing state if it exists
      localStorage.removeItem('editingPersonData')
      localStorage.removeItem('editingPersonIndex')
      
      // Trigger notification refresh for updated customer data
      const eventName = isEditing ? 'customerUpdated' : 'customerCreated'
      window.dispatchEvent(new CustomEvent(eventName))
      
      // Redirect to dashboard after delay
      setTimeout(() => {
        navigate('/profile')
      }, TIME_CONSTANTS.redirectDelay)
      
    } catch (error) {
      // Clear timeout on error
      clearTimeout(timeoutId)
      
<<<<<<< HEAD
      let errorMessage = 'Error submitting application. '
=======
      let errorMessage = MESSAGES.error.applicationError + ' '
>>>>>>> 6fa1407ff63b8db4c39d818e888c15a19589cd23
      
      if (error.response?.status === 422) {
        errorMessage += 'Validation failed. Please check all fields are filled correctly.'
      } else if (error.response?.status === 400) {
        errorMessage += 'Bad request. Please check your data.'
      } else if (error.response?.status === 500) {
        errorMessage += 'Server error. Please try again later.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += 'Request timeout. Please try again.'
      } else {
        errorMessage += 'Please try again.'
      }
      
      setMessage(errorMessage)
    } finally {
      // Always reset loading and submit states
      setLoading(false)
      setSubmitAttempted(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-slate-800 mb-2">
              {existingData?.isEditing ? 'Edit Customer' : 'Visa Application'}
            </h1>
            <p className="text-slate-600 text-sm">
              {existingData?.isEditing ? 'Update customer information' : 'Complete all sections to submit your H1B application'}
            </p>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-lg text-center text-sm font-medium ${
              message.includes('Error') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Step Indicator */}
          <div className="flex justify-center mb-8 flex-wrap gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-xs font-medium ${
                  currentStep >= step ? 'text-slate-800' : 'text-slate-500'
                }`}>
                  {step === 1 ? 'Personal' : step === 2 ? 'Address' : 'H1B Details'}
                </span>
                {step < 3 && <div className="w-8 h-0.5 bg-slate-200 mx-4" />}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <form onSubmit={handlePersonalSubmit}>
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.firstName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.firstName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, firstName: e.target.value })}
                    required
                  />
                  {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.lastName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.lastName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, lastName: e.target.value })}
                    required
                  />
                  {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.dateOfBirth ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.dateOfBirth}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, dateOfBirth: e.target.value })}
                    required
                  />
                  {errors.dateOfBirth && <p className="text-red-600 text-xs mt-1">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sex
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.sex ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.sex}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, sex: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    {FORM_OPTIONS.sex.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.sex && <p className="text-red-600 text-xs mt-1">{errors.sex}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.maritalStatus ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.maritalStatus}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, maritalStatus: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    {FORM_OPTIONS.maritalStatus.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors.maritalStatus && <p className="text-red-600 text-xs mt-1">{errors.maritalStatus}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.phone ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.phone}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.email ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.email}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                    required
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.emergencyContactName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.emergencyContactName}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, emergencyContactName: e.target.value })}
                    required
                  />
                  {errors.emergencyContactName && <p className="text-red-600 text-xs mt-1">{errors.emergencyContactName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.emergencyContactPhone ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.emergencyContactPhone}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, emergencyContactPhone: e.target.value })}
                    placeholder="+1234567890"
                    required
                  />
                  {errors.emergencyContactPhone && <p className="text-red-600 text-xs mt-1">{errors.emergencyContactPhone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Employment Start Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.employmentStartDate ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={personalDetails.employmentStartDate}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, employmentStartDate: e.target.value })}
                    required
                  />
                  {errors.employmentStartDate && <p className="text-red-600 text-xs mt-1">{errors.employmentStartDate}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  type="submit" 
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Next: Address Details
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Address Details */}
          {currentStep === 2 && (
            <form onSubmit={handleAddressSubmit}>
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                Address Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Street Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.streetName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={addressDetails.streetName}
                    onChange={(e) => setAddressDetails({ ...addressDetails, streetName: e.target.value })}
                    required
                  />
                  {errors.streetName && <p className="text-red-600 text-xs mt-1">{errors.streetName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.city ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={addressDetails.city}
                    onChange={(e) => setAddressDetails({ ...addressDetails, city: e.target.value })}
                    required
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    State
                  </label>
                  <select
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.state ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={addressDetails.state}
                    onChange={(e) => setAddressDetails({ ...addressDetails, state: e.target.value })}
                    required
                  >
                    <option value="">Select State</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-600 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.zip ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={addressDetails.zip}
                    onChange={(e) => setAddressDetails({ ...addressDetails, zip: e.target.value })}
                    placeholder="12345 or 12345-6789"
                    required
                  />
                  {errors.zip && <p className="text-red-600 text-xs mt-1">{errors.zip}</p>}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Next: H1B Details
                </button>
              </div>
            </form>
          )}

          {/* Step 3: H1B Details */}
          {currentStep === 3 && (
            <form onSubmit={handleH1bSubmit}>
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                H1B Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.clientName ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.clientName}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, clientName: e.target.value })}
                    required
                  />
                  {errors.clientName && <p className="text-red-600 text-xs mt-1">{errors.clientName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client Street Name
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.clientStreet ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.clientStreet}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, clientStreet: e.target.value })}
                    required
                  />
                  {errors.clientStreet && <p className="text-red-600 text-xs mt-1">{errors.clientStreet}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client City
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.clientCity ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.clientCity}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, clientCity: e.target.value })}
                    required
                  />
                  {errors.clientCity && <p className="text-red-600 text-xs mt-1">{errors.clientCity}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client State
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.clientState ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.clientState}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, clientState: e.target.value })}
                    required
                  />
                  {errors.clientState && <p className="text-red-600 text-xs mt-1">{errors.clientState}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Client ZIP
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.clientZip ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.clientZip}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, clientZip: e.target.value })}
                    required
                  />
                  {errors.clientZip && <p className="text-red-600 text-xs mt-1">{errors.clientZip}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LCA Title
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.lcaTitle ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.lcaTitle}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, lcaTitle: e.target.value })}
                    required
                  />
                  {errors.lcaTitle && <p className="text-red-600 text-xs mt-1">{errors.lcaTitle}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LCA Salary
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.lcaSalary ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.lcaSalary}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, lcaSalary: e.target.value })}
                    min="0"
                    placeholder="Annual salary in USD"
                    required
                  />
                  {errors.lcaSalary && <p className="text-red-600 text-xs mt-1">{errors.lcaSalary}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    LCA Code
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.lcaCode ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.lcaCode}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, lcaCode: e.target.value })}
                    required
                  />
                  {errors.lcaCode && <p className="text-red-600 text-xs mt-1">{errors.lcaCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.receiptNumber ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.receiptNumber}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, receiptNumber: e.target.value })}
                    required
                  />
                  {errors.receiptNumber && <p className="text-red-600 text-xs mt-1">{errors.receiptNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.startDate ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.startDate}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, startDate: e.target.value })}
                    required
                  />
                  {errors.startDate && <p className="text-red-600 text-xs mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 ${
                      errors.endDate ? 'border-red-300' : 'border-slate-300'
                    }`}
                    value={h1bDetails.endDate}
                    onChange={(e) => setH1bDetails({ ...h1bDetails, endDate: e.target.value })}
                    required
                  />
                  {errors.endDate && <p className="text-red-600 text-xs mt-1">{errors.endDate}</p>}
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                  disabled={loading || submitAttempted}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {existingData?.isEditing ? 'Updating...' : 'Submitting...'}
                    </div>
                  ) : (
                    existingData?.isEditing ? 'Update Customer' : 'Submit Application'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default VisaApply