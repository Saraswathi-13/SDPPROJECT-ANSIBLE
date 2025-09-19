import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const AdminNavBar = ({ onLogout }) => {
  const navigate = useNavigate()

  const styles = {
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'black', color: 'white' },
    brand: { fontWeight: 700 },
    links: { display: 'flex', gap: 12, listStyle: 'none', margin: 0, padding: 0 },
    link: ({ isActive }) => ({ color: 'white', padding: '6px 8px', borderRadius: 6, background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent' }),
    right: { display: 'flex', alignItems: 'center', gap: 8 }
  }
  
  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Admin Panel</div>
      <ul style={styles.links}>
        <li><NavLink to="/admin/dashboard" style={styles.link}>Dashboard</NavLink></li>
      </ul>
      <div style={styles.right}>
        <button onClick={() => { onLogout(); navigate('/') }} style={{ color: '#fff', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 10px', cursor: 'pointer', transition: 'filter 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>Logout</button>
      </div>
    </nav>
  )
}

export default AdminNavBar
