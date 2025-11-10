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
  })

  useEffect(() => {
    applyFilter()
    calculateStats()
  }, [applicants, filter])

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('https://visa-app-1-q9ex.onrender.com/customers', {
        headers: {
          'Content-Type': 'application/json',
        }
      })
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
      // Note: This endpoint may need to be implemented on the backend
      await axios.post('https://visa-app-1-q9ex.onrender.com/send-reminder', {
        userId,
        type
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      alert(`${type} reminder sent successfully!`)
    } catch (error) {
      console.error('Error sending reminder:', error)
      alert('Error sending reminder - endpoint may not be implemented yet')
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
            { key: 'all', label: 'All Applicants', color: filter === 'all' ? '#ff6b35' : 'transparent' },
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
            const [expanded, setExpanded] = useState(false)
            const daysRemaining = applicant.h1b_end_date
              ? calculateDaysRemaining(applicant.h1b_end_date)
              : null

            const getStatusStyle = (days) => {
              if (days <= 2) return { color: '#ef4444', text: 'Critical (≤2 days)' }
              if (days <= 10) return { color: '#f59e0b', text: 'Expiring soon (≤10 days)' }
              if (days <= 30) return { color: '#eab308', text: 'Expiring (≤30 days)' }
              return { color: '#10b981', text: 'Active' }
            }

            const status = daysRemaining !== null ? getStatusStyle(daysRemaining) : null

            return (
              <div
                key={applicant.customer_id}
                onClick={() => setExpanded(!expanded)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${status ? status.color : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', margin: 0 }}>
                      {applicant.first_name} {applicant.last_name}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0 0' }}>
                      {applicant.email}
                    </p>
                  </div>
                  <div>
                    {status && (
                      <span
                        style={{
                          color: status.color,
                          fontSize: '13px',
                          fontWeight: '600',
                          background: `${status.color}20`,
                          borderRadius: '20px',
                          padding: '4px 12px',
                        }}
                      >
                        {status.text} — {daysRemaining} days
                      </span>
                    )}
                  </div>
                </div>

                {/* Expanded Section */}
                {expanded && (
                  <div
                    style={{
                      marginTop: '16px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {/* Box 1 - Personal Info */}
                    <div
                      style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <h4 style={{ color: '#070707ff', fontSize: '14px', marginBottom: '8px' }}>Personal Info</h4>
                      <p style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                        <b>Phone:</b> {applicant.phone}<br />
                        <b>DOB:</b> {formatDate(applicant.dob)}<br />
                        <b>City:</b> {applicant.city}, {applicant.state}<br />
                        <b>Marital Status:</b> {applicant.marital_status}
                      </p>
                    </div>

                    {/* Box 2 - H1B Info */}
                    <div
                      style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <h4 style={{ color: '#fcd34d', fontSize: '14px', marginBottom: '8px' }}>H1B Info</h4>
                      <p style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                        <b>Status:</b> {applicant.h1b_status}<br />
                        <b>Start:</b> {formatDate(applicant.h1b_start_date)}<br />
                        <b>End:</b> {formatDate(applicant.h1b_end_date)}<br />
                        <b>Receipt #:</b> {applicant.receipt_number}
                      </p>
                    </div>

                    {/* Box 3 - Client Info */}
                    <div
                      style={{
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        background: 'rgba(255,255,255,0.05)',
                      }}
                    >
                      <h4 style={{ color: '#34d399', fontSize: '14px', marginBottom: '8px' }}>Client Info</h4>
                      <p style={{ color: 'white', fontSize: '13px', margin: 0 }}>
                        <b>Client Name:</b> {applicant.client_name}<br />
                        <b>Client City:</b> {applicant.client_city}<br />
                        <b>Title:</b> {applicant.lca_title}<br />
                        <b>LCA Salary:</b> ${applicant.lca_salary}
                      </p>
                    </div>
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