import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { calculateDaysRemaining, formatDate } from '../lib/utils'
import { User, XCircle, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [customerData, setCustomerData] = useState([])
  const [expandedUserId, setExpandedUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.email) {
      fetchCustomerData()
    }
  }, [user?.email])

  // Add effect to refresh data when component mounts or user returns to page
  useEffect(() => {
    const handleFocus = () => {
      if (user?.email) {
        fetchCustomerData()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [user?.email])

  const fetchCustomerData = async () => {
    try {
      console.log('Fetching customer data for email:', user?.email)
      if (!user?.email) {
        setCustomerData([])
        setLoading(false)
        return
      }

      const response = await axios.get(`https://visa-app-1-q9ex.onrender.com/h1b_customer/by_login_email/${user.email}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 second timeout for faster loading
      })

      console.log('API Response received:', response.data)

      let customerArray = []
       console.log('Total customers fetched:', customerArray.length)
      if (response.data) {
        if (Array.isArray(response.data)) {
          customerArray = response.data
        } else {
          customerArray = [response.data]
        }
      }
     

      const activeCustomers = customerArray.filter(c => {
        const status = (c.h1b_status || c.H1B_status || c.status || '').toString().toLowerCase()
        return status === 'active' || status === '' || !status
      })

      // Debugging check
      console.log('Active customers after filter:', activeCustomers)

      setCustomerData(activeCustomers)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customer data:', error)
      if (error.code === 'ECONNABORTED') {
        setMessage('⚠️ Dashboard is taking longer to load. Please refresh the page.')
      }
      setCustomerData([])
      setLoading(false)
    }
  }

  const handleEdit = (customer, e) => {
    e.stopPropagation()
    const editData = {
      personalDetails: {
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        dateOfBirth: customer.dob || '',
        sex: customer.sex || '',
        maritalStatus: customer.marital_status || '',
        phone: customer.phone || '',
        email: customer.email || '',
        emergencyContactName: customer.emergency_contact_name || '',
        emergencyContactPhone: customer.emergency_contact_phone || '',
        employmentStartDate: customer.employment_start_date || ''
      },
      addressDetails: {
        streetName: customer.street_name || '',
        city: customer.city || '',
        state: customer.state || '',
        zip: customer.zip || ''
      },
      h1bDetails: {
        clientName: customer.client_name || '',
        clientStreet: customer.client_street_name || '',
        clientCity: customer.client_city || '',
        clientState: customer.client_state || '',
        clientZip: customer.client_zip || '',
        lcaTitle: customer.lca_title || '',
        lcaSalary: customer.lca_salary || '',
        lcaCode: customer.lca_code || '',
        receiptNumber: customer.receipt_number || '',
        startDate: customer.h1b_start_date || '',
        endDate: customer.h1b_end_date || ''
      },
      customerId: customer.customer_id || customer.id
    }
    localStorage.setItem('editingPersonData', JSON.stringify(editData))
    navigate('/visa-apply')
  }

  const handleDelete = (customer, e) => {
    e.stopPropagation()
    setCustomerToDelete(customer)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!customerToDelete) return

    try {
      const customerId = customerToDelete.customer_id || customerToDelete.id
      await axios.patch(`https://visa-app-1-q9ex.onrender.com/soft_delete_customer_via_id/${customerId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // Refetch data from server to ensure UI is properly updated
      await fetchCustomerData()

      setMessage('✅ Customer deleted successfully!')
      setShowDeleteModal(false)
      setCustomerToDelete(null)

      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error deleting customer:', error)
      setMessage('❌ Error deleting customer. Please try again.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setCustomerToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
          <p className="text-slate-700 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-7xl mx-auto">
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-xs text-slate-300">
                {user?.email}
              </p>
              <p className="text-xs text-slate-300">
                Manage your H1B visa applications
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 mb-4 rounded-lg text-center text-sm font-medium ${message.includes('✅')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message}
          </div>
        )}

        {/* Customer Cards Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Customer Records
            </h2>
            <div className="bg-slate-800 text-white px-3 py-1 rounded-md text-xs font-medium">
              {customerData.length} Total
            </div>
          </div>

          {customerData.length > 0 ? (
            <div className="space-y-4">
              {customerData.map((customer, index) => {
                const isExpanded = expandedUserId === (customer.customer_id || index)

                return (
                  <div key={customer.customer_id || index} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    {/* Main Card */}
                    <div
                      onClick={() => setExpandedUserId(isExpanded ? null : (customer.customer_id || index))}
                      className="p-4 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              {(customer.first_name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-slate-800">
                                {customer.first_name || 'N/A'} {customer.last_name || ''}
                              </h3>
                              <p className="text-xs text-slate-600">
                                {customer.email || customer.login_email || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 flex-wrap">
                            <span className="bg-slate-800 text-white px-2 py-1 text-xs font-medium rounded">
                              {customer.h1b_status || 'Active'}
                            </span>
                            <span className="bg-slate-700 text-white px-2 py-1 text-xs font-medium rounded">
                              {customer.lca_title || 'Software Engineer'}
                            </span>
                            <span className="bg-slate-600 text-white px-2 py-1 text-xs font-medium rounded">
                              {customer.phone || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleEdit(customer, e)}
                            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                            title="Edit Customer"
                          >
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>

                          <button
                            onClick={(e) => handleDelete(customer, e)}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>

                          <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'
                            }`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="bg-slate-50 p-4 border-t border-slate-200" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Personal Details */}
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <h4 className="text-slate-700 font-semibold mb-3 flex items-center text-xs">
                              <span className="mr-2">👤</span> Personal Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Name:</span>
                                <span className="text-slate-800 text-xs">{customer.first_name || 'N/A'} {customer.last_name || ''}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">DOB:</span>
                                <span className="text-slate-800 text-xs">{customer.dob || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Sex:</span>
                                <span className="text-slate-800 text-xs">{customer.sex || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Marital Status:</span>
                                <span className="text-slate-800 text-xs">{customer.marital_status || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="font-medium text-slate-500 text-xs">Emergency Contact:</span>
                                <span className="text-slate-800 text-xs">{customer.emergency_contact_name || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Address Details */}
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <h4 className="text-slate-700 font-semibold mb-3 flex items-center text-xs">
                              <span className="mr-2">🏠</span> Address
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Street:</span>
                                <span className="text-slate-800 text-xs">{customer.street_name || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">City:</span>
                                <span className="text-slate-800 text-xs">{customer.city || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">State:</span>
                                <span className="text-slate-800 text-xs">{customer.state || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="font-medium text-slate-500 text-xs">ZIP:</span>
                                <span className="text-slate-800 text-xs">{customer.zip || 'N/A'}</span>
                              </div>
                            </div>
                          </div>

                          {/* H1B Details */}
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <h4 className="text-slate-700 font-semibold mb-3 flex items-center text-xs">
                              <span className="mr-2">📋</span> H1B Details
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Client:</span>
                                <span className="text-slate-800 text-xs">{customer.client_name || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Title:</span>
                                <span className="text-slate-800 text-xs">{customer.lca_title || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Salary:</span>
                                <span className="text-slate-800 font-semibold text-xs">${parseFloat(customer.lca_salary || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Receipt:</span>
                                <span className="text-slate-800 text-xs">{customer.receipt_number || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="font-medium text-slate-500 text-xs">Start Date:</span>
                                <span className="text-slate-800 text-xs">{customer.h1b_start_date || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between py-1">
                                <span className="font-medium text-slate-500 text-xs">End Date:</span>
                                <span className="text-slate-800 text-xs">{customer.h1b_end_date || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">
                No Customer Records Found
              </h3>
              <p className="text-sm text-slate-600">
                Start by creating your first H1B customer record.
              </p>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>

              <h3 className="text-base font-semibold text-slate-800 mb-2 text-center">
                Confirm Deletion
              </h3>

              <p className="text-sm text-slate-600 mb-6 text-center">
                Are you sure you want to delete <strong>{customerToDelete?.first_name} {customerToDelete?.last_name}</strong>? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Profile