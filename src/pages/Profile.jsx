import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { calculateDaysRemaining, formatDate } from '../lib/utils'
import { Calendar, Clock, AlertTriangle, User, MapPin, Building, CheckCircle, XCircle } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()
  const [visaData, setVisaData] = useState(null)
  const [allApplications, setAllApplications] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [personToDelete, setPersonToDelete] = useState(null)

  useEffect(() => {
    if (user) {
      fetchVisaData()
      checkExpiryAndSendEmails()
    }
  }, [user])

  const handleDelete = () => {
    if (personToDelete !== null) {
      const updatedApps = allApplications.filter((_, i) => i !== personToDelete)
      setAllApplications(updatedApps)
      localStorage.setItem('allVisaApplications', JSON.stringify(updatedApps))
      if (selectedPerson === personToDelete) {
        setSelectedPerson(null)
        setVisaData(null)
      }
      setShowDeleteModal(false)
      setPersonToDelete(null)
    }
  }

  const checkExpiryAndSendEmails = () => {
    const allAppsData = localStorage.getItem('allVisaApplications')
    if (allAppsData) {
      const parsedApps = JSON.parse(allAppsData)
      
      parsedApps.forEach((app, index) => {
        if (app.h1bDetails && app.h1bDetails.endDate) {
          const daysLeft = calculateDaysRemaining(app.h1bDetails.endDate)
          const email = app.personalDetails.email
          const name = `${app.personalDetails.firstName} ${app.personalDetails.lastName}`
          
          if (daysLeft === 10) {
            sendExpiryEmail(email, name, daysLeft, '10-day warning')
          } else if (daysLeft === 3) {
            sendExpiryEmail(email, name, daysLeft, 'Critical 3-day alert')
          } else if (daysLeft === 2) {
            sendExpiryEmail(email, name, daysLeft, 'Critical 2-day alert')
          } else if (daysLeft === 1) {
            sendExpiryEmail(email, name, daysLeft, 'Final 1-day alert')
          }
        }
      })
    }
  }

  const sendExpiryEmail = async (email, name, daysLeft, alertType) => {
    console.log(`🔄 Attempting to send email to: ${email}, For person: ${name}, Days left: ${daysLeft}`)
    
    try {
      const emailData = {
        email: email,
        name: name,
        subject: `Visa Expiry Alert - ${daysLeft} days remaining`,
        message: `Dear ${name}, This is a ${alertType} for your H1B visa. Your visa will expire in ${daysLeft} days. Please take necessary action to renew or extend your visa. Best regards, Visa Management System`,
        days_remaining: daysLeft,
        alert_type: alertType
      }
      
      console.log('📧 Sending email with data:', emailData)
      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_lxn4iei',
          template_id: 'template_qaxmqnn', 
          user_id: 'LEBiZ-gpuLn6UvJ5y',
          template_params: {
            to_email: email,
            to_name: name,
            days_remaining: daysLeft
          }
        })
      })
      
      if (response.ok) {
        const emailLog = {
          to_email: email,
          to_name: name,
          sentAt: new Date().toISOString(),
          status: 'sent',
          daysRemaining: daysLeft,
          service: 'emailjs_api'
        }
        
        const emailLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]')
        emailLogs.push(emailLog)
        localStorage.setItem('emailLogs', JSON.stringify(emailLogs))
        
        console.log(`✅ Email successfully sent to ${email}`)
      } else {
        throw new Error(`Failed to send email: ${response.status}`)
      }
      
    } catch (error) {
      console.error('❌ Email Error:', error)
      
      const emailLog = {
        to_email: email,
        to_name: name,
        sentAt: new Date().toISOString(),
        status: 'failed',
        error: error.message,
        daysRemaining: daysLeft,
        service: 'mailto'
      }
      
      const emailLogs = JSON.parse(localStorage.getItem('emailLogs') || '[]')
      emailLogs.push(emailLog)
      localStorage.setItem('emailLogs', JSON.stringify(emailLogs))
      
      console.log(`❌ Email failed for ${email}:`, error.message)
    }
  }

  const fetchVisaData = async () => {
    try {
      console.log('All localStorage keys:', Object.keys(localStorage))
      console.log('localStorage allVisaApplications:', localStorage.getItem('allVisaApplications'))
      
      const allAppsData = localStorage.getItem('allVisaApplications')
      if (allAppsData) {
        const parsedApps = JSON.parse(allAppsData)
        setAllApplications(parsedApps)
        console.log('✅ All applications loaded:', parsedApps)
        console.log('Current user email:', user?.email)
      } else {
        console.log('No applications found - this is normal for new users')
        setAllApplications([])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid rgba(255, 255, 255, 0.3)',
            borderTop: '6px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', fontWeight: '600', margin: 0 }}>
            Loading Visa Management System...
          </p>
        </div>
      </div>
    )
  }

  const daysRemaining = visaData?.h1bDetails?.endDate 
    ? calculateDaysRemaining(visaData.h1bDetails.endDate)
    : null

  const getExpiryStatus = (days) => {
    if (days <= 2) return { 
      color: '#dc2626', 
      bg: 'rgba(239, 68, 68, 0.1)', 
      border: '#ef4444',
      icon: AlertTriangle,
      status: 'Critical'
    }
    if (days <= 10) return { 
      color: '#d97706', 
      bg: 'rgba(245, 158, 11, 0.1)', 
      border: '#f59e0b',
      icon: Clock,
      status: 'Warning'
    }
    return { 
      color: '#059669', 
      bg: 'rgba(16, 185, 129, 0.1)', 
      border: '#10b981',
      icon: CheckCircle,
      status: 'Active'
    }
  }

  const expiryStatus = daysRemaining ? getExpiryStatus(daysRemaining) : null

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>

        {/* Welcome Section */}
        <div className="card" style={{ 
          padding: '32px', 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', position: 'relative', width: '100%' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
            }}>
              <User style={{ width: '30px', height: '30px', color: 'white' }} />
            </div>
            <div>
              <h1 className="gradient-text" style={{
                fontSize: '28px',
                fontWeight: '800',
                margin: 0,
                color: 'white'
              }}>
                Welcome back, {user?.firstName}!
              </h1>
              <p style={{ fontSize: '16px', margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.9)' }}>
                {selectedPerson !== null ? `Viewing ${visaData?.personalDetails?.firstName} ${visaData?.personalDetails?.lastName}'s details` : 'Select a person to view their visa details'}
              </p>
            </div>
            {selectedPerson !== null && (
              <button
                onClick={() => {
                  setPersonToDelete(selectedPerson)
                  setShowDeleteModal(true)
                }}
                style={{
                  position: 'absolute',
                  right: '20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                🗑️
              </button>
            )}
          </div>
        </div>

        {/* Person Selection Cards */}
        {allApplications.length > 0 && (
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px'
            }}>
              Select Person ({allApplications.length} applications)
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {allApplications.map((app, index) => (
                <div
                  key={index}
                  style={{
                    padding: '16px',
                    background: selectedPerson === index 
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    borderRadius: '12px',
                    border: `1px solid ${selectedPerson === index ? '#6366f1' : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setPersonToDelete(index)
                      setShowDeleteModal(true)
                    }}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                  <div
                    onClick={() => {
                      setSelectedPerson(index)
                      setVisaData(app)
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: selectedPerson === index ? 'rgba(255,255,255,0.2)' : '#6366f1',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px'
                    }}>
                      <User style={{ width: '20px', height: '20px', color: 'white' }} />
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600' }}>
                      {app.personalDetails.firstName} {app.personalDetails.lastName}
                    </h4>
                    <p style={{ margin: 0, fontSize: '11px', opacity: 0.8 }}>
                      {app.personalDetails.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Show details only when person is selected */}
        {selectedPerson !== null && visaData && (
          <>
        {/* Visa Expiry Alert */}
        {daysRemaining !== null && expiryStatus && (
          <div className="card" style={{
            padding: '24px',
            background: expiryStatus.bg,
            border: `1px solid ${expiryStatus.border}`,
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <expiryStatus.icon style={{ width: '24px', height: '24px', color: expiryStatus.color }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: expiryStatus.color,
                    margin: 0
                  }}>
                    {daysRemaining} days remaining
                  </h3>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0' }}>
                    Expires on {formatDate(visaData.h1bDetails.endDate)}
                  </p>
                </div>
              </div>
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                color: expiryStatus.color,
                background: 'rgba(255, 255, 255, 0.1)',
                textTransform: 'uppercase'
              }}>
                {expiryStatus.status}
              </div>
            </div>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Personal Details */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                margin: 0
              }}>
                Personal Information
              </h3>
            </div>
            
            {visaData?.personalDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Full Name', value: `${visaData.personalDetails.firstName} ${visaData.personalDetails.lastName}` },
                  { label: 'Date of Birth', value: formatDate(visaData.personalDetails.dateOfBirth) },
                  { label: 'Email', value: visaData.personalDetails.email },
                  { label: 'Phone', value: visaData.personalDetails.phone },
                  { label: 'Marital Status', value: visaData.personalDetails.maritalStatus },
                  { label: 'Employment Start', value: formatDate(visaData.personalDetails.employmentStartDate) }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < 5 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <XCircle style={{ width: '40px', height: '40px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>No personal details found</p>
              </div>
            )}
          </div>

          {/* Address Details */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'white',
                margin: 0
              }}>
                Address Information
              </h3>
            </div>
            
            {visaData?.addressDetails ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Street Address', value: visaData.addressDetails.streetName },
                  { label: 'City', value: visaData.addressDetails.city },
                  { label: 'State', value: visaData.addressDetails.state },
                  { label: 'ZIP Code', value: visaData.addressDetails.zip }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < 3 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {item.label}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white'
                    }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <XCircle style={{ width: '40px', height: '40px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 12px' }} />
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0 }}>No address details found</p>
              </div>
            )}
          </div>
        </div>

        {/* H1B Details */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              margin: 0
            }}>
              H1B Visa Details
            </h3>
          </div>
          
          {visaData?.h1bDetails ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px' 
            }}>
              {[
                { label: 'Client Company', value: visaData.h1bDetails.clientName },
                { label: 'Job Title', value: visaData.h1bDetails.lcaTitle },
                { label: 'Annual Salary', value: `$${visaData.h1bDetails.lcaSalary?.toLocaleString()}` },
                { label: 'LCA Code', value: visaData.h1bDetails.lcaCode },
                { label: 'Client Location', value: `${visaData.h1bDetails.clientCity}, ${visaData.h1bDetails.clientState}` }
              ].map((item, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '0 0 6px 0',
                    textTransform: 'uppercase'
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'white',
                    margin: 0
                  }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <XCircle style={{ width: '50px', height: '50px', color: 'rgba(255, 255, 255, 0.5)', margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.7)', margin: '0 0 6px 0' }}>
                No H1B Details Found
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px', margin: 0 }}>
                Complete your visa application to view H1B information
              </p>
            </div>
          )}
        </div>
          </>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}>
            <div className="card" style={{
              padding: '24px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
                margin: '0 0 12px 0'
              }}>
                Delete Application
              </h3>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '0 0 20px 0'
              }}>
                Are you sure you want to delete {personToDelete !== null ? `${allApplications[personToDelete]?.personalDetails?.firstName} ${allApplications[personToDelete]?.personalDetails?.lastName}'s` : 'this'} application?
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setPersonToDelete(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  No, Cancel
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '10px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Yes, Delete
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