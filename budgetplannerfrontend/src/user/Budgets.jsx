import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Budgets = () => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await fetch(`${config.url}/budgets?month=${encodeURIComponent(month)}`, {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (mounted) setBudgets(data)
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [month, user.id])

  const totalLimit = useMemo(() => budgets.reduce((s, b) => s + Number(b.limit || 0), 0), [budgets])

  const addBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.url}/budgets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ month, category, limit: Number(limit) })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const created = await response.json()
      setBudgets(prev => [created, ...prev])
      setCategory('')
      setLimit('')
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const updateLimit = async (id, newLimit) => {
    try {
      setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: newLimit } : b))
      const response = await fetch(`${config.url}/budgets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: Number(newLimit) })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
    } catch (e) {
      setError(String(e.message || e))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    navigate('/user/login')
  }

  return (
    <div>
      <UserNavBar onLogout={handleLogout} />
      <div className="container">
        <h2>Budgets</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Month: </label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>
        <form onSubmit={addBudget} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Category Budget</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <input placeholder="Category" required value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="number" step="0.01" placeholder="Limit" required value={limit} onChange={(e) => setLimit(e.target.value)} />
            <button type="submit">Add</button>
          </div>
        </form>

        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'black' }}>{error}</div>}

        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Limit</th>
              <th>Spent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(b => (
              <tr key={b.id}>
                <td>{b.category}</td>
                <td>
                  <input type="number" step="0.01" value={b.limit} onChange={(e) => updateLimit(b.id, e.target.value)} onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} onBlur={(e) => (e.currentTarget.style.outline = 'none')} />
                </td>
                <td>{Number(b.spent || 0).toFixed(2)}</td>
                <td>{Number(b.spent || 0) >= Number(b.limit || 0) ? 'Exceeded' : (Number(b.spent || 0) / Number(b.limit || 1) > 0.8 ? 'Approaching' : 'OK')}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 12 }}>Total Monthly Limit: {totalLimit.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default Budgets
