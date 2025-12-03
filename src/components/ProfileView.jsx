import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProfileView = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('https://visa-app-bu3x.onrender.com/customers', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      setCustomers(response.data)
    } catch (error) {
      setError('Failed to fetch customer data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Customer Profiles</h1>
      
      {customers.length === 0 ? (
        <div className="text-center text-gray-500">No customers found</div>
      ) : (
        <div className="grid gap-6">
          {customers.map((customer, index) => (
            <div key={customer._id || index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              {/* Personal Details */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-600 border-b pb-2">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-slate-600">Name:</span>
                    <p className="text-slate-800">{customer.firstName} {customer.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Date of Birth:</span>
                    <p className="text-gray-800">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Sex:</span>
                    <p className="text-gray-800">{customer.sex}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Marital Status:</span>
                    <p className="text-gray-800">{customer.maritalStatus}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-800">{customer.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-slate-600">Email:</span>
                    <p className="text-slate-800">{customer.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Emergency Contact:</span>
                    <p className="text-gray-800">{customer.emergencyContactName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Emergency Phone:</span>
                    <p className="text-gray-800">{customer.emergencyContactPhone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Employment Start:</span>
                    <p className="text-gray-800">{new Date(customer.employmentStartDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-orange-500 border-b pb-2">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Street:</span>
                    <p className="text-gray-800">{customer.streetName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">City:</span>
                    <p className="text-gray-800">{customer.city}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">State:</span>
                    <p className="text-gray-800">{customer.state}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">ZIP:</span>
                    <p className="text-gray-800">{customer.zip}</p>
                  </div>
                </div>
              </div>

              {/* H1B Details */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-orange-700 border-b pb-2">H1B Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Client Name:</span>
                    <p className="text-gray-800">{customer.clientName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Client Address:</span>
                    <p className="text-gray-800">{customer.clientStreetName}, {customer.clientCity}, {customer.clientState} {customer.clientZip}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">LCA Title:</span>
                    <p className="text-gray-800">{customer.lcaTitle}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">LCA Salary:</span>
                    <p className="text-gray-800">${customer.lcaSalary?.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">LCA Code:</span>
                    <p className="text-gray-800">{customer.lcaCode}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Receipt Number:</span>
                    <p className="text-gray-800">{customer.receiptNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Start Date:</span>
                    <p className="text-gray-800">{new Date(customer.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">End Date:</span>
                    <p className="text-gray-800">{new Date(customer.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Days Remaining:</span>
                    <p className={`font-semibold ${
                      Math.ceil((new Date(customer.endDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 30 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    }`}>
                      {Math.ceil((new Date(customer.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProfileView