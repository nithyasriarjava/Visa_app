import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { calculateDaysRemaining, formatDate } from '../lib/utils'
import { Calendar, Clock, AlertTriangle, User, MapPin, Building, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'

const Profile = () => {
  const { user } = useAuth()
  const [visaData, setVisaData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVisaData()
  }, [])

  const fetchVisaData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visa/profile')
      setVisaData(response.data)
    } catch (error) {
      console.error('Error fetching visa data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  const daysRemaining = visaData?.h1bDetails?.endDate 
    ? calculateDaysRemaining(visaData.h1bDetails.endDate)
    : null

  const getExpiryStatus = (days) => {
    if (days <= 2) return { 
      color: '#dc2626', 
      bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
      border: '#f87171',
      icon: AlertTriangle,
      status: 'Critical'
    }
    if (days <= 10) return { 
      color: '#d97706', 
      bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
      border: '#f59e0b',
      icon: Clock,
      status: 'Warning'
    }
    return { 
      color: '#059669', 
      bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
      border: '#10b981',
      icon: CheckCircle,
      status: 'Active'
    }
  }

  const expiryStatus = daysRemaining ? getExpiryStatus(daysRemaining) : null

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    marginBottom: '24px'
  }

  const headerCardStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    textAlign: 'center'
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>

      {/* Welcome Section */}
      <div style={headerCardStyle} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}>
            <User style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '800',
              margin: 0,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Welcome back, {user?.firstName}!
            </h1>
            <p style={{ fontSize: '18px', margin: '8px 0 0 0', opacity: 0.9 }}>
              Here's your visa status overview
            </p>
          </div>
        </div>
      </div>
      
      {/* Visa Expiry Alert */}
      {daysRemaining !== null && (
        <div style={{
          ...cardStyle,
          background: expiryStatus.bg,
          border: `2px solid ${expiryStatus.border}`,
          animation: 'fadeIn 0.6s ease-out 0.2s both'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)'
              }}>
                <expiryStatus.icon style={{ width: '30px', height: '30px', color: expiryStatus.color }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: expiryStatus.color,
                  margin: 0
                }}>
                  {daysRemaining} days remaining
                </h3>
                <p style={{ fontSize: '16px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Expires on {formatDate(visaData.h1bDetails.endDate)}
                </p>
              </div>
            </div>
            <div style={{
              padding: '12px 20px',
              borderRadius: '25px',
              fontSize: '14px',
              fontWeight: '700',
              color: expiryStatus.color,
              background: 'rgba(255, 255, 255, 0.8)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {expiryStatus.status}
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Personal Details */}
        <div style={{
          ...cardStyle,
          animation: 'fadeIn 0.6s ease-out 0.3s both'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Personal Information
            </h3>
          </div>
          
          {visaData?.personalDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  padding: '12px 0',
                  borderBottom: index < 5 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <XCircle style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>No personal details found</p>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
                Complete your visa application to see details
              </p>
            </div>
          )}
        </div>

        {/* Address Details */}
        <div style={{
          ...cardStyle,
          animation: 'fadeIn 0.6s ease-out 0.4s both'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f1f5f9'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin style={{ width: '24px', height: '24px', color: 'white' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Address Information
            </h3>
          </div>
          
          {visaData?.addressDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Street Address', value: visaData.addressDetails.streetName },
                { label: 'City', value: visaData.addressDetails.city },
                { label: 'State', value: visaData.addressDetails.state },
                { label: 'ZIP Code', value: visaData.addressDetails.zip },
                { label: 'Residence Start', value: formatDate(visaData.addressDetails.startDate) }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    {item.label}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#1e293b'
                  }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <XCircle style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>No address details found</p>
            </div>
          )}
        </div>
      </div>

      {/* H1B Details */}
      <div style={{
        ...cardStyle,
        animation: 'fadeIn 0.6s ease-out 0.5s both'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '32px',
          paddingBottom: '20px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1e293b',
            margin: 0
          }}>
            H1B Visa Details
          </h3>
        </div>
        
        {visaData?.h1bDetails ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {[
              { label: 'Client Company', value: visaData.h1bDetails.clientName },
              { label: 'Job Title', value: visaData.h1bDetails.lcaTitle },
              { label: 'Annual Salary', value: `$${visaData.h1bDetails.lcaSalary?.toLocaleString()}` },
              { label: 'LCA Code', value: visaData.h1bDetails.lcaCode },
              { label: 'Receipt Number', value: visaData.h1bDetails.receiptNumber },
              { label: 'Start Date', value: formatDate(visaData.h1bDetails.startDate) },
              { label: 'End Date', value: formatDate(visaData.h1bDetails.endDate) },
              { label: 'Client Location', value: `${visaData.h1bDetails.clientCity}, ${visaData.h1bDetails.clientState}` }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease'
              }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <XCircle style={{ width: '64px', height: '64px', color: '#94a3b8', margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#64748b', margin: '0 0 8px 0' }}>
              No H1B Details Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '16px', margin: 0 }}>
              Complete your visa application to view H1B information
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile