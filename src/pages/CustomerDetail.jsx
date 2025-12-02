import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, User, MapPin, FileText } from 'lucide-react'
import axios from 'axios'

const CustomerDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomerDetail()
  }, [id, user?.email])

  const fetchCustomerDetail = async () => {
    try {
      if (!user?.email) {
        setLoading(false)
        return
      }

      const response = await axios.get(
        `https://visa-app-1-q9ex.onrender.com/h1b_customer/by_login_email/${user.email}`,
        { headers: { 'Content-Type': 'application/json' } }
      )

      let customerArray = []
      if (response.data) {
        customerArray = Array.isArray(response.data) ? response.data : [response.data]
      }

      const foundCustomer = customerArray.find(c => 
        (c.customer_id && c.customer_id.toString() === id) || 
        customerArray.indexOf(c).toString() === id
      )

      setCustomer(foundCustomer || null)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customer detail:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
          <p className="text-slate-700 text-sm font-medium">Loading Customer Details...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
            <p className="text-slate-600">Customer not found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {customer.first_name} {customer.last_name}
              </h1>
              <p className="text-slate-300 text-sm">{customer.email || customer.login_email}</p>
            </div>
          </div>
        </div>

        {/* Three Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Personal Details */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Personal Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Full Name</p>
                <p className="text-sm text-slate-800">{customer.first_name} {customer.last_name}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</p>
                <p className="text-sm text-slate-800">{customer.dob || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sex</p>
                <p className="text-sm text-slate-800">{customer.sex || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Marital Status</p>
                <p className="text-sm text-slate-800">{customer.marital_status || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Phone</p>
                <p className="text-sm text-slate-800">{customer.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
                <p className="text-sm text-slate-800">{customer.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Emergency Contact</p>
                <p className="text-sm text-slate-800">{customer.emergency_contact_name || 'N/A'}</p>
                <p className="text-xs text-slate-600">{customer.emergency_contact_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Address Details */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Address Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Street Address</p>
                <p className="text-sm text-slate-800">{customer.street_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">City</p>
                <p className="text-sm text-slate-800">{customer.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">State</p>
                <p className="text-sm text-slate-800">{customer.state || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">ZIP Code</p>
                <p className="text-sm text-slate-800">{customer.zip || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Employment Start Date</p>
                <p className="text-sm text-slate-800">{customer.employment_start_date || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Card 3: H1B / Visa Details */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">H1B / Visa Details</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">H1B Status</p>
                <p className="text-sm text-slate-800">{customer.h1b_status || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Client Name</p>
                <p className="text-sm text-slate-800">{customer.client_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Client Address</p>
                <p className="text-sm text-slate-800">{customer.client_street_name || 'N/A'}</p>
                <p className="text-xs text-slate-600">{customer.client_city}, {customer.client_state} {customer.client_zip}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">LCA Title</p>
                <p className="text-sm text-slate-800">{customer.lca_title || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">LCA Salary</p>
                <p className="text-sm text-slate-800">${customer.lca_salary || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Receipt Number</p>
                <p className="text-sm text-slate-800">{customer.receipt_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">H1B Period</p>
                <p className="text-sm text-slate-800">{customer.h1b_start_date || 'N/A'} - {customer.h1b_end_date || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail