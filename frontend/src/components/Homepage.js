import React from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage">
      <div className="homepage-hero">
        <h1>Welcome to College Campus Events</h1>
        <p className="hero-subtitle">Discover, RSVP, and manage campus events all in one place</p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Sign In
          </Link>
        </div>
      </div>

      <div className="homepage-features">
        <div className="feature-card">
          <div className="feature-icon">🎓</div>
          <h3>For Students</h3>
          <p>Browse events, filter by category, RSVP to events you're interested in, and manage your calendar.</p>
          <Link to="/register/student" className="feature-link">
            Sign up as Student →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏢</div>
          <h3>For Event Leaders</h3>
          <p>Register your organization and create events. View RSVPs and track attendance.</p>
          <Link to="/register/organization" className="feature-link">
            Register Organization →
          </Link>
          <br />
          <Link to="/login" className="feature-link">
            Sign In as Leader →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Event Discovery</h3>
          <p>Find events by category, date, organization, modality, and perks. Never miss an event again!</p>
          <Link to="/events" className="feature-link">
            Explore Events →
          </Link>
        </div>
      </div>

      <div className="homepage-cta">
        <h2>Ready to get started?</h2>
        <p>Join thousands of students discovering amazing campus events</p>
        <div className="cta-buttons">
          <Link to="/register/student" className="btn btn-primary btn-large">
            Create Student Account
          </Link>
          <Link to="/events" className="btn btn-outline btn-large">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

