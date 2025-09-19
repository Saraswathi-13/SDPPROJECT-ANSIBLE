import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainNavBar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0,
    background: 'black',
    padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000
  }
  const linkStyle = { textDecoration: 'none', color: 'white', fontSize: '1rem', fontWeight: 500, position: 'relative' }

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontWeight: 700, fontSize: 18 }}>BudgetPlanner</Link>

        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={linkStyle} className="nav-link">Home</Link>
          <Link to="/about" style={linkStyle} className="nav-link">About</Link>
          <Link to="/contact" style={linkStyle} className="nav-link">Contact</Link>

          <Link to="/user/register" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'filter 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Register
            </button>
          </Link>

          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsLoginOpen(!isLoginOpen)} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: 'white', border: '2px solid white', borderRadius: 8, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'filter 0.2s ease', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Login
              <span style={{ display: 'inline-block' }}>▾</span>
            </button>
            <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: 'black', borderRadius: 12, padding: '0.5rem', marginTop: '0.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '0.25rem', width: 200, opacity: isLoginOpen ? 1 : 0, visibility: isLoginOpen ? 'visible' : 'hidden', transform: isLoginOpen ? 'translateY(0)' : 'translateY(-6px)', transition: 'all 0.2s ease' }}>
              <Link to="/user/login" onClick={() => setIsLoginOpen(false)} style={{ padding: '0.7rem 0.9rem', textDecoration: 'none', color: 'white', borderRadius: 8, backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>User Login</Link>
              <Link to="/admin/login" onClick={() => setIsLoginOpen(false)} style={{ padding: '0.7rem 0.9rem', textDecoration: 'none', color: 'white', borderRadius: 8, backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Admin Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: 64 }} />
    </div>
  );
};

export default MainNavBar;
