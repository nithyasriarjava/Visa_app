import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createCustomer } from '../services'

const VisaForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    maritalStatus: '',
    phone: '',
    email: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    employmentStartDate: '',
    // Address
    streetName: '',
    city: '',
    state: '',
    zip: '',
    // H1B Details
    clientName: '',
    clientStreetName: '',
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

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (loading || submitAttempted) {
      return
    }
    
    setLoading(true)
    setSubmitAttempted(true)
    setMessage('')

    // Set timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setSubmitAttempted(false)
        setMessage('❌ Request timeout. Please try again.')
      }
    }, 30000) // 30 second timeout

    try {
      if (!user?.email) {
        setMessage('❌ User not authenticated. Please login again.')
        return
      }

      // Convert camelCase to snake_case for API
      const apiPayload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        dob: formData.dateOfBirth,
        sex: formData.sex,
        marital_status: formData.maritalStatus,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        emergency_contact_name: formData.emergencyContactName.trim(),
        emergency_contact_phone: formData.emergencyContactPhone.trim(),
        employment_start_date: formData.employmentStartDate,
        street_name: formData.streetName.trim(),
        city: formData.city.trim(),
        state: formData.state,
        zip: formData.zip.trim(),
        client_name: formData.clientName.trim(),
        client_street_name: formData.clientStreetName.trim(),
        client_city: formData.clientCity.trim(),
        client_state: formData.clientState.trim(),
        client_zip: formData.clientZip.trim(),
        lca_title: formData.lcaTitle.trim(),
        lca_salary: parseFloat(formData.lcaSalary) || 0,
        lca_code: formData.lcaCode.trim(),
        receipt_number: formData.receiptNumber.trim(),
        h1b_start_date: formData.startDate,
        h1b_end_date: formData.endDate,
        login_email: user.email.trim()
      }
      
<<<<<<< HEAD
      const response = await axios.post('https://visa-app-production.onrender.com/h1b_customer/create', apiPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        }
      })
      setMessage('✅ Visa application submitted successfully!')
=======
      const response = await createCustomer(apiPayload)
      
      // Clear timeout on successful response
      clearTimeout(timeoutId)
      
      setMessage(`✅ Visa application submitted successfully! Receipt Number: ${formData.receiptNumber}. Redirecting to dashboard...`)
      
      // Trigger customer created event
      window.dispatchEvent(new CustomEvent('customerCreated'))
      
      // Clear form
>>>>>>> 6fa1407ff63b8db4c39d818e888c15a19589cd23
      setFormData({
        firstName: '', lastName: '', dateOfBirth: '', sex: '', maritalStatus: '',
        phone: '', email: '', emergencyContactName: '', emergencyContactPhone: '',
        employmentStartDate: '', streetName: '', city: '', state: '', zip: '',
        clientName: '', clientStreetName: '', clientCity: '', clientState: '',
        clientZip: '', lcaTitle: '', lcaSalary: '', lcaCode: '', receiptNumber: '',
        startDate: '', endDate: ''
      })
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/profile')
      }, 2000)
      
    } catch (error) {
      // Clear timeout on error
      clearTimeout(timeoutId)
      
      let errorMessage = '❌ Error submitting application. '
      if (error.response?.status === 422) {
        errorMessage += 'Validation failed. Please check all fields.'
      } else if (error.response?.status === 400) {
        errorMessage += 'Bad request. Please check your data.'
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-orange-300">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Visa Application Form</h1>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 text-center ${
          message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-orange-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="emergencyContactName"
              placeholder="Emergency Contact Name"
              value={formData.emergencyContactName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="tel"
              name="emergencyContactPhone"
              placeholder="Emergency Contact Phone"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="employmentStartDate"
              value={formData.employmentStartDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-orange-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="streetName"
              placeholder="Street Name"
              value={formData.streetName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              value={formData.zip}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* H1B Details Section */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-orange-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">H1B Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="clientName"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="clientStreetName"
              placeholder="Client Street Name"
              value={formData.clientStreetName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="clientCity"
              placeholder="Client City"
              value={formData.clientCity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="clientState"
              placeholder="Client State"
              value={formData.clientState}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="clientZip"
              placeholder="Client ZIP"
              value={formData.clientZip}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lcaTitle"
              placeholder="LCA Title"
              value={formData.lcaTitle}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              name="lcaSalary"
              placeholder="LCA Salary"
              value={formData.lcaSalary}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="lcaCode"
              placeholder="LCA Code"
              value={formData.lcaCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="receiptNumber"
              placeholder="Receipt Number"
              value={formData.receiptNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || submitAttempted}
          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Submitting...
            </div>
          ) : (
            'Submit Application'
          )}
        </button>
      </form>
    </div>
  )
}

export default VisaForm