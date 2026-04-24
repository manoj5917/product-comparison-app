import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    searches: 0,
    favorites: 0,
    comparisons: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name || 'User'}! 👋</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h3>📊 Searches</h3>
          <p className="stat-number">{stats.searches}</p>
        </div>
        <div className="stat-card">
          <h3>❤️ Favorites</h3>
          <p className="stat-number">{stats.favorites}</p>
        </div>
        <div className="stat-card">
          <h3>🔄 Comparisons</h3>
          <p className="stat-number">{stats.comparisons}</p>
        </div>
      </div>
      <div className="dashboard-info">
        <h2>Account Information</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default Dashboard;