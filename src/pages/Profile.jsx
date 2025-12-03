import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [customerData, setCustomerData] = useState([])

  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState(null)
  const [message, setMessage] = useState('')
  const [expandedUserId, setExpandedUserId] = useState(null)

  useEffect(() => {
    if (user?.email) fetchCustomerData()
  }, [user?.email])

  // Refresh when page refocuses
  useEffect(() => {
    const handleFocus = () => {
      if (user?.email) fetchCustomerData()
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

      const response = await axios.get(
        `https://visa-app-1-q9ex.onrender.com/h1b_customer/by_login_email/${user.email}`,
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      )

      console.log('API Response received:', response.data)

      let customerArray = []
      if (response.data) {
        customerArray = Array.isArray(response.data)
          ? response.data
          : [response.data]
      }

      // ✅ Only include customers whose h1b_status = Active (case-insensitive)
      const activeCustomers = customerArray.filter(c => {
        const status = (c.h1b_status || c.H1B_status || c.status || '')
          .toString()
          .toLowerCase()
        return status === 'active'
      })

      console.log('Filtered Active customers:', activeCustomers)
      setCustomerData(activeCustomers)
      
      // Send data to Layout for notifications
      console.log('📡 Dispatching profileDataUpdated event with', activeCustomers.length, 'users')
      window.dispatchEvent(new CustomEvent('profileDataUpdated', {
        detail: activeCustomers
      }))
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching customer data:', error)
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
      await axios.patch(
        `https://visa-app-1-q9ex.onrender.com/soft_delete_customer_via_id/${customerId}`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      )

      await fetchCustomerData()
      
      // Trigger notification refresh
      window.dispatchEvent(new CustomEvent('customerUpdated'))
      
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
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">
                Welcome back, {user?.firstName || 'User'}!
              </h1>
              <p className="text-xs text-slate-300">{user?.email}</p>
              <p className="text-xs text-slate-300">
                Manage your H1B visa applications
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div
            className={`p-3 mb-4 rounded-lg text-center text-sm font-medium ${
              message.includes('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* Apply Visa Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              localStorage.removeItem('editingPersonData')
              navigate('/visa-apply')
            }}
            className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 px-6 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-900 hover:to-slate-800 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Apply for New Visa
          </button>
        </div>

        {/* Customer Cards Section */}
        <div className="mb-6">
          {customerData.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Customer Records</h2>
                <div className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {customerData.length} Total
                </div>
              </div>

              <div className="space-y-4">
                {customerData.map((customer, index) => {
                  const isExpanded = expandedUserId === (customer.customer_id || index)
                  return (
                    <div
                      key={customer.customer_id || index}
                      className={`bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden ${
                        isExpanded 
                          ? 'border-2 border-blue-500 shadow-xl bg-blue-50/30' 
                          : 'border border-slate-200 hover:shadow-xl hover:border-slate-300'
                      }`}
                    >
                      {/* Main Card Header */}
                      <div
                        onClick={() => {
                          // Close other cards and open this one (true accordion behavior)
                          setExpandedUserId(isExpanded ? null : customer.customer_id || index)
                        }}
                        className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md">
                            {(customer.first_name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800">
                              {customer.first_name || ''} {customer.last_name || ''}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {customer.email || customer.login_email || ''}
                            </p>
                          </div>
                        </div>
                        
                        {/* Edit/Delete Icons - Always Visible */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={e => handleEdit(customer, e)}
                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group cursor-pointer"
                            title="Edit Customer"
                          >
                            <Edit className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
                          </button>
                          <button
                            onClick={e => handleDelete(customer, e)}
                            className="p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group cursor-pointer"
                            title="Delete Customer"
                          >
                            <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-700" />
                          </button>
                          
                          {/* Expand/Collapse Arrow */}
                          <div className="ml-2">
                            <svg 
                              className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="border-t border-slate-200 bg-slate-50/50 p-6 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            
                            {/* Personal Details Section */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wide">
                                Personal Details
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">First Name:</span>
                                  <span className="text-slate-800 font-semibold">{customer.first_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Last Name:</span>
                                  <span className="text-slate-800 font-semibold">{customer.last_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">DOB:</span>
                                  <span className="text-slate-800 font-semibold">{customer.dob || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Sex:</span>
                                  <span className="text-slate-800 font-semibold">{customer.sex || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Marital Status:</span>
                                  <span className="text-slate-800 font-semibold">{customer.marital_status || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Address Details Section */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wide">
                                Address
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Street:</span>
                                  <span className="text-slate-800 font-semibold">{customer.street_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">City:</span>
                                  <span className="text-slate-800 font-semibold">{customer.city || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">State:</span>
                                  <span className="text-slate-800 font-semibold">{customer.state || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Zip:</span>
                                  <span className="text-slate-800 font-semibold">{customer.zip || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* H1B / Client Details Section */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wide">
                                H1B / Client Details
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Client Name:</span>
                                  <span className="text-slate-800 font-semibold">{customer.client_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Client Street:</span>
                                  <span className="text-slate-800 font-semibold">{customer.client_street_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Client City:</span>
                                  <span className="text-slate-800 font-semibold">{customer.client_city || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Client State:</span>
                                  <span className="text-slate-800 font-semibold">{customer.client_state || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Client Zip:</span>
                                  <span className="text-slate-800 font-semibold">{customer.client_zip || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Emergency Contact Section */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wide">
                                Emergency Contact
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Name:</span>
                                  <span className="text-slate-800 font-semibold">{customer.emergency_contact_name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Phone:</span>
                                  <span className="text-slate-800 font-semibold">{customer.emergency_contact_phone || 'N/A'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Start & End Dates Section */}
                            <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
                              <h4 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-200 uppercase tracking-wide">
                                Start & End Dates
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">H1B Start:</span>
                                  <span className="text-slate-800 font-semibold">{customer.h1b_start_date || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">H1B End:</span>
                                  <span className="text-slate-800 font-semibold">{customer.h1b_end_date || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-medium">Employment Start:</span>
                                  <span className="text-slate-800 font-semibold">{customer.employment_start_date || 'N/A'}</span>
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
            </>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
              <p className="text-slate-600">No Active Customers Found</p>
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
                Are you sure you want to delete{' '}
                <strong>
                  {customerToDelete?.first_name} {customerToDelete?.last_name}
                </strong>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
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
