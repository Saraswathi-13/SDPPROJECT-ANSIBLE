import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminNavBar from './AdminNavBar'
import ViewUsers from './ViewUsers'

const AdminHome = () => {
  const [admin, setAdmin] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigate = useNavigate()

  useEffect(() => {
    const adminData = localStorage.getItem('admin')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin')
    localStorage.removeItem('userType')
    navigate('/admin/login')
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <ViewUsers />
      case 'dashboard':
      default:
        return (
          <div>
            <div className="cards-grid">
              <div className="card">
                <div className="card-title">Total Users</div>
                <div className="card-value">0</div>
              </div>
              <div className="card">
                <div className="card-title">Active Users</div>
                <div className="card-value">0</div>
              </div>
              <div className="card">
                <div className="card-title">Total Budgets</div>
                <div className="card-value">0</div>
              </div>
              <div className="card">
                <div className="card-title">System Health</div>
                <div className="card-value">OK</div>
              </div>
            </div>
            <div className="card">
              <h3>Admin Dashboard</h3>
              <p>Welcome to the admin panel. Use the tabs above to manage different aspects of the system.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div>
      <AdminNavBar onLogout={handleLogout} />
      <div className="container">
        <div className="card">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {admin.username}!</p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: activeTab === 'dashboard' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'dashboard' ? 'white' : '#666'
              }}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
                background: activeTab === 'users' ? '#007bff' : '#f8f9fa',
                color: activeTab === 'users' ? 'white' : '#666'
              }}
              onClick={() => setActiveTab('users')}
            >
              Manage Users
            </button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminHome
