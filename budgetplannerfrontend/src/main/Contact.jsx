import React from 'react';
import MainNavBar from './MainNavBar';

const Contact = () => {
  const wrap = { maxWidth: 900, margin: '0 auto', padding: 16 }
  const card = { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 8, padding: 16 }
  return (
    <div>
      <MainNavBar />
      <div style={wrap}>
        <div style={card}>
          <h2 style={{ margin: 0, marginBottom: 8 }}>Contact Us</h2>
          <p style={{ margin: 0 }}>Have questions? Reach out to us at <a href="mailto:support@budgetplanner.com">support@budgetplanner.com</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
