import React from 'react'
import MainNavBar from './MainNavBar'

const About = () => {
  const wrap = { maxWidth: 900, margin: '0 auto', padding: 16 }
  const card = { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: 16 }
  return (
    <div>
      <MainNavBar />
      <div style={wrap}>
        <div style={card}>
          <h2 style={{ marginTop: 0 }}>About BudgetPlanner</h2>
          <p>Plan budgets, track expenses, set goals, and get insights to save more.</p>
        </div>
      </div>
    </div>
  )
}

export default About
