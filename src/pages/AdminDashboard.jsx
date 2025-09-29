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
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', fontWeight: '600', margin: 0 }}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'white', margin: 0 }}>Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{stats.total}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0' }}>Total Applicants</p>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{stats.expiringSoon}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0' }}>Expiring Soon (≤30 days)</p>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '800', color: 'white', margin: 0 }}>{stats.critical}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0' }}>Critical (≤2 days)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <Filter style={{ width: '20px', height: '20px', color: 'white' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: 0 }}>Filter Applicants</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {[
            { key: 'all', label: 'All Applicants', color: filter === 'all' ? '#6366f1' : 'transparent' },
            { key: 'expiring30', label: 'Expiring in 30 days', color: filter === 'expiring30' ? '#f59e0b' : 'transparent' },
            { key: 'expiring10', label: 'Expiring in 10 days', color: filter === 'expiring10' ? '#f59e0b' : 'transparent' },
            { key: 'critical', label: 'Critical (≤2 days)', color: filter === 'critical' ? '#ef4444' : 'transparent' }
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              style={{
                padding: '10px 16px',
                background: btn.color !== 'transparent' ? btn.color : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: `1px solid ${btn.color !== 'transparent' ? btn.color : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Applicants List */}
      <Card style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'white', margin: '0 0 20px 0' }}>
          Applicants ({filteredApplicants.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredApplicants.map((applicant) => {
              const daysRemaining = applicant.h1bDetails?.endDate 
                ? calculateDaysRemaining(applicant.h1bDetails.endDate)
                : null

              const getStatusStyle = (days) => {
                if (days <= 2) return { color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '#ef4444' }
                if (days <= 10) return { color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b' }
                if (days <= 30) return { color: '#eab308', background: 'rgba(234, 179, 8, 0.1)', border: '#eab308' }
                return { color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: '#10b981' }
              }

              const statusStyle = daysRemaining !== null ? getStatusStyle(daysRemaining) : null

              return (
                <div key={applicant._id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                        {applicant.personalDetails?.firstName} {applicant.personalDetails?.lastName}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 4px 0' }}>
                        {applicant.personalDetails?.email}
                      </p>
                      <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                        {applicant.personalDetails?.phone}
                      </p>
                    </div>
                    
                    {daysRemaining !== null && statusStyle && (
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: statusStyle.color,
                        background: statusStyle.background,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        {daysRemaining} days remaining
                      </div>
                    )}
                  </div>

                  {applicant.h1bDetails && (
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '12px',
                      fontSize: '13px'
                    }}>
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Client:</span> {applicant.h1bDetails.clientName}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>LCA Title:</span> {applicant.h1bDetails.lcaTitle}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>Receipt #:</span> {applicant.h1bDetails.receiptNumber}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span style={{ fontWeight: '600', color: 'rgba(255, 255, 255, 0.7)' }}>End Date:</span> {formatDate(applicant.h1bDetails.endDate)}
                      </div>
                    </div>
                  )}

                  {daysRemaining !== null && daysRemaining <= 10 && (
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                      <button
                        onClick={() => sendReminder(applicant.userId, 'email')}
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Send Email
                      </button>
                      {daysRemaining <= 2 && (
                        <button
                          onClick={() => sendReminder(applicant.userId, 'call')}
                          style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Send Call Reminder
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            
            {filteredApplicants.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                No applicants found for the selected filter.
              </div>
            )}
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboard