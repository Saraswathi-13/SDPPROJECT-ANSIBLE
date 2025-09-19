import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Dashboard = () => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const [s, t] = await Promise.all([
          fetch(`${config.url}/analytics/summary?month=${encodeURIComponent(month)}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }).then(res => res.ok ? res.json() : { income: 0, expenses: 0 }),
          fetch(`${config.url}/analytics/trends?months=6`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }).then(res => res.ok ? res.json() : [])
        ])
        if (mounted) {
          setSummary(s)
          setTrends(t)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [month, user.id])

  const savingsPercent = useMemo(() => {
    if (!summary) return 0
    const income = summary.income || 0
    const expenses = summary.expenses || 0
    if (income <= 0) return 0
    return Math.round(((income - expenses) / income) * 100)
  }, [summary])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Dashboard</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Month: </label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'black' }}>{error}</div>}
        {summary && (
          <div className="cards-grid">
            {[
              { label: 'Income', value: summary.income?.toFixed?.(2) ?? summary.income },
              { label: 'Expenses', value: summary.expenses?.toFixed?.(2) ?? summary.expenses },
              { label: 'Saved', value: (summary.income - summary.expenses)?.toFixed?.(2) },
              { label: 'Saved %', value: `${savingsPercent}%` }
            ].map((c) => (
              <button key={c.label} className="card" style={{ cursor: 'pointer', transition: 'filter 0.2s ease' }} onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>
                <div className="card-title">{c.label}</div>
                <div className="card-value">{c.value}</div>
              </button>
            ))}
          </div>
        )}

        {trends && (
          <div style={{ marginTop: 24 }}>
            <h3>Month-over-Month</h3>
            <ul>
              {trends?.map?.((m) => (
                <li key={m.month}>{m.month}: Income {m.income} | Expenses {m.expenses}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
