import React, { useEffect, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Reports = () => {
  const navigate = useNavigate()
  const [months, setMonths] = useState(12)
  const [trends, setTrends] = useState([])
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setError('')
        const response = await fetch(`${config.url}/analytics/trends?months=${months}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setTrends(data)
      } catch (e) { 
        if (mounted) setError(String(e.message || e)) 
      }
    }
    load()
    return () => { mounted = false }
  }, [months, user.id])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Reports</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Window (months): </label>
          <input type="number" min="1" max="24" value={months} onChange={(e) => setMonths(Number(e.target.value))} />
        </div>
        {error && <div style={{ color: 'black' }}>{error}</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Change vs Prev</th>
            </tr>
          </thead>
          <tbody>
            {trends.map((row, idx) => {
              const prev = idx > 0 ? trends[idx - 1] : null
              const change = prev ? (((row.expenses - prev.expenses) / (prev.expenses || 1)) * 100) : 0
              return (
                <tr key={row.month} style={{ transition: 'background 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td>{row.month}</td>
                  <td>{Number(row.income || 0).toFixed(2)}</td>
                  <td>{Number(row.expenses || 0).toFixed(2)}</td>
                  <td>{prev ? `${change.toFixed(1)}%` : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Reports
