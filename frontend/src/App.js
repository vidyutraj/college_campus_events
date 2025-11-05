import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './App.css';
import Homepage from './components/Homepage';
import Dashboard from './components/Dashboard';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import RegisterStudent from './components/RegisterStudent';
import RegisterOrganization from './components/RegisterOrganization';

function AppHeader() {
  const { user, userType, organization, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="App-header">
      <div className="header-content">
        <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>College Campus Events</h1>
        </Link>
        <nav className="header-nav">
          {isAuthenticated ? (
            <>
              <span className="user-info">
                {organization ? (
                  <>Welcome, {organization.name} (Organization)</>
                ) : (
                  <>Welcome, {user?.username} ({userType === 'student' ? 'Student' : 
                    userType === 'organization_leader' ? 'Leader' : 'Admin'})</>
                )}
              </span>
              {userType === 'student' && (
                <Link to="/events" className="nav-link">Events</Link>
              )}
              {userType === 'organization_leader' && (
                <>
                  <Link to="/events" className="nav-link">Events</Link>
                  <Link to="/leader/dashboard" className="nav-link">Dashboard</Link>
                </>
              )}
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/events" className="nav-link">Browse Events</Link>
              <Link to="/login" className="nav-link">Sign In</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events" element={<Dashboard />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/organization" element={<RegisterOrganization />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
