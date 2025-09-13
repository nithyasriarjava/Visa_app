import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { calculateDaysRemaining, formatDate } from '../lib/utils'
import { Users, AlertTriangle, Clock, Filter } from 'lucide-react'
import axios from 'axios'

const AdminDashboard = () => {
  const [applicants, setApplicants] = useState([])
  const [filteredApplicants, setFilteredApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    expiringSoon: 0,
    critical: 0
  })

  useEffect(() => {
    fetchApplicants()
  }, [])

  useEffect(() => {
    applyFilter()
    calculateStats()
  }, [applicants, filter])

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/applicants')
      setApplicants(response.data)
    } catch (error) {
      console.error('Error fetching applicants:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = [...applicants]
    
    switch (filter) {
      case 'expiring30':
        filtered = applicants.filter(app => {
          if (!app.h1bDetails?.endDate) return false
          const days = calculateDaysRemaining(app.h1bDetails.endDate)
          return days <= 30 && days > 0
        })
        break
      case 'expiring10':
        filtered = applicants.filter(app => {
          if (!app.h1bDetails?.endDate) return false
          const days = calculateDaysRemaining(app.h1bDetails.endDate)
          return days <= 10 && days > 0
        })
        break
      case 'critical':
        filtered = applicants.filter(app => {
          if (!app.h1bDetails?.endDate) return false
          const days = calculateDaysRemaining(app.h1bDetails.endDate)
          return days <= 2 && days >= 0
        })
        break
      default:
        filtered = applicants
    }
    
    setFilteredApplicants(filtered)
  }

  const calculateStats = () => {
    const total = applicants.length
    const expiringSoon = applicants.filter(app => {
      if (!app.h1bDetails?.endDate) return false
      const days = calculateDaysRemaining(app.h1bDetails.endDate)
      return days <= 30 && days > 0
    }).length
    const critical = applicants.filter(app => {
      if (!app.h1bDetails?.endDate) return false
      const days = calculateDaysRemaining(app.h1bDetails.endDate)
      return days <= 2 && days >= 0
    }).length

    setStats({ total, expiringSoon, critical })
  }

  const sendReminder = async (userId, type) => {
    try {
      await axios.post('http://localhost:5000/api/admin/send-reminder', {
        userId,
        type
      })
      alert(`${type} reminder sent successfully!`)
    } catch (error) {
      alert('Error sending reminder')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-gray-600">Total Applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
                <p className="text-gray-600">Expiring Soon (≤30 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.critical}</p>
                <p className="text-gray-600">Critical (≤2 days)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Applicants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Applicants
            </Button>
            <Button
              variant={filter === 'expiring30' ? 'default' : 'outline'}
              onClick={() => setFilter('expiring30')}
            >
              Expiring in 30 days
            </Button>
            <Button
              variant={filter === 'expiring10' ? 'default' : 'outline'}
              onClick={() => setFilter('expiring10')}
            >
              Expiring in 10 days
            </Button>
            <Button
              variant={filter === 'critical' ? 'destructive' : 'outline'}
              onClick={() => setFilter('critical')}
            >
              Critical (≤2 days)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applicants List */}
      <Card>
        <CardHeader>
          <CardTitle>Applicants ({filteredApplicants.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => {
              const daysRemaining = applicant.h1bDetails?.endDate 
                ? calculateDaysRemaining(applicant.h1bDetails.endDate)
                : null

              const getStatusColor = (days) => {
                if (days <= 2) return 'text-red-600 bg-red-50'
                if (days <= 10) return 'text-orange-600 bg-orange-50'
                if (days <= 30) return 'text-yellow-600 bg-yellow-50'
                return 'text-green-600 bg-green-50'
              }

              return (
                <div key={applicant._id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {applicant.personalDetails?.firstName} {applicant.personalDetails?.lastName}
                      </h3>
                      <p className="text-gray-600">{applicant.personalDetails?.email}</p>
                      <p className="text-gray-600">{applicant.personalDetails?.phone}</p>
                    </div>
                    
                    {daysRemaining !== null && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(daysRemaining)}`}>
                        {daysRemaining} days remaining
                      </div>
                    )}
                  </div>

                  {applicant.h1bDetails && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Client:</span> {applicant.h1bDetails.clientName}
                      </div>
                      <div>
                        <span className="font-medium">LCA Title:</span> {applicant.h1bDetails.lcaTitle}
                      </div>
                      <div>
                        <span className="font-medium">Receipt #:</span> {applicant.h1bDetails.receiptNumber}
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span> {formatDate(applicant.h1bDetails.endDate)}
                      </div>
                    </div>
                  )}

                  {daysRemaining !== null && daysRemaining <= 10 && (
                    <div className="flex space-x-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendReminder(applicant.userId, 'email')}
                      >
                        Send Email
                      </Button>
                      {daysRemaining <= 2 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => sendReminder(applicant.userId, 'call')}
                        >
                          Send Call Reminder
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            
            {filteredApplicants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No applicants found for the selected filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard