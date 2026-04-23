import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    favoriteCount: 0,
    comparisonCount: 0,
    searchCount: 0
  });

  useEffect(() => {
    // Load stats from localStorage
    const favoriteCount = localStorage.getItem('favoriteCount') || '0';
    const comparisonCount = localStorage.getItem('comparisonCount') || '0';
    const searchCount = localStorage.getItem('searchCount') || '0';

    setStats({
      favoriteCount: parseInt(favoriteCount),
      comparisonCount: parseInt(comparisonCount),
      searchCount: parseInt(searchCount)
    });
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}! 👋</h1>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>❤️ Favorites</h3>
          <p className="stat-value">{stats.favoriteCount}</p>
        </div>
        <div className="stat-card">
          <h3>📊 Comparisons</h3>
          <p className="stat-value">{stats.comparisonCount}</p>
        </div>
        <div className="stat-card">
          <h3>🔍 Searches</h3>
          <p className="stat-value">{stats.searchCount}</p>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Account Information</h2>
        <div className="info-card">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Member Since:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;