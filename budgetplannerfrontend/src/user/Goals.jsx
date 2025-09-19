import React, { useEffect, useMemo, useState } from 'react'
import UserNavBar from './UserNavBar'
import { useNavigate } from 'react-router-dom'
import config from '../config'

const Goals = () => {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [monthlyGoal, setMonthlyGoal] = useState(null)
  const [categoryGoals, setCategoryGoals] = useState([])
  const [error, setError] = useState('')
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setError('')
        const [mg, cg] = await Promise.all([
          fetch(`${config.url}/goals/monthly?month=${encodeURIComponent(month)}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }).then(res => res.ok ? res.json() : null),
          fetch(`${config.url}/goals/category?month=${encodeURIComponent(month)}`, {
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json'
            }
          }).then(res => res.ok ? res.json() : [])
        ])
        if (mounted) {
          setMonthlyGoal(mg)
          setCategoryGoals(cg)
        }
      } catch (e) {
        if (mounted) setError(String(e.message || e))
      }
    }
    load()
    return () => { mounted = false }
  }, [month, user.id])

  const spentTotal = useMemo(() => categoryGoals.reduce((s, g) => s + Number(g.spent || 0), 0), [categoryGoals])

  const saveMonthlyGoal = async () => {
    try {
      const response = await fetch(`${config.url}/goals/monthly`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ month, limit: Number(monthlyGoal?.limit || 0) })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const saved = await response.json()
      setMonthlyGoal(saved)
    } catch (e) { setError(String(e.message || e)) }
  }

  const addCategoryGoal = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.url}/goals/category`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ month, category, limit: Number(limit) })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const saved = await response.json()
      setCategoryGoals(prev => [saved, ...prev])
      setCategory('')
      setLimit('')
    } catch (e) { setError(String(e.message || e)) }
  }

  const updateCategoryLimit = async (id, newLimit) => {
    try {
      setCategoryGoals(prev => prev.map(g => g.id === id ? { ...g, limit: newLimit } : g))
      const response = await fetch(`${config.url}/goals/category/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.id}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ limit: Number(newLimit) })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
    } catch (e) { setError(String(e.message || e)) }
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
        <h2>Goals</h2>
        <div style={{ marginBottom: 12 }}>
          <label>Month: </label>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>

        <div className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Monthly Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
            <input type="number" step="0.01" value={monthlyGoal?.limit || ''} placeholder="Monthly Limit" onChange={(e) => setMonthlyGoal({ ...(monthlyGoal || {}), limit: e.target.value })} />
            <button onClick={saveMonthlyGoal}>Save</button>
          </div>
          <div style={{ marginTop: 8 }}>Spent: {spentTotal.toFixed(2)} {monthlyGoal?.limit ? `(${Math.round((spentTotal / monthlyGoal.limit) * 100)}%)` : ''}</div>
          {monthlyGoal?.limit && spentTotal > monthlyGoal.limit && (
            <div style={{ color: 'black', marginTop: 4 }}>Monthly goal exceeded</div>
          )}
        </div>

        <form onSubmit={addCategoryGoal} className="card" style={{ padding: 12, marginBottom: 12 }}>
          <h3>Add Category Goal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
            <input placeholder="Category" required value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="number" step="0.01" placeholder="Limit" required value={limit} onChange={(e) => setLimit(e.target.value)} />
            <button type="submit">Add</button>
          </div>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Limit</th>
              <th>Spent</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {categoryGoals.map(g => (
              <tr key={g.id}>
                <td>{g.category}</td>
                <td><input type="number" step="0.01" value={g.limit} onChange={(e) => updateCategoryLimit(g.id, e.target.value)} onFocus={(e) => (e.currentTarget.style.outline = '2px solid #2563eb')} onBlur={(e) => (e.currentTarget.style.outline = 'none')} /></td>
                <td>{Number(g.spent || 0).toFixed(2)}</td>
                <td>
                  {monthlyGoal?.limit && g.spent > g.limit ? 'Exceeded: reduce spend' : (monthlyGoal?.limit ? `Use remaining of monthly limit for other categories` : '')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <div style={{ color: 'black' }}>{error}</div>}
      </div>
    </div>
  )
}

export default Goals
