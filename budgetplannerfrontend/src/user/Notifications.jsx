import React from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'

const Notifications = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  const wrap = { maxWidth: 900, margin: '0 auto', padding: 16 }
  const card = { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: 16 }
  const items = []

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div style={wrap}>
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>Notifications</h2>
          {items.length === 0 ? <div>No new notifications.</div> : (
            <ul>
              {items.map((n, i) => <li key={i}>{n}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications
