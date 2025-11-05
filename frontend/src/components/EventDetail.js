import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './EventDetail.css';

const API_BASE_URL = '/api/events/';

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
      setEvent(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load event details. Please try again later.');
      console.error('Error fetching event:', err);
      console.error('Full error:', err.response?.data || err.message);
      console.error('URL attempted:', `${API_BASE_URL}${id}/`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRSVP = async () => {
    try {
      setRsvpLoading(true);
      setRsvpError(null);
      const response = await axiosInstance.post(`${API_BASE_URL}${id}/rsvp/`, {});
      
      // Refresh event data to get updated RSVP status
      await fetchEvent();
      
      // Show success message (you could add a toast notification here)
      alert(response.data.message || 'RSVP successful!');
    } catch (err) {
      if (err.response?.status === 401) {
        setRsvpError('Please login to RSVP to events.');
      } else if (err.response?.status === 403) {
        setRsvpError('You do not have permission to RSVP.');
      } else {
        setRsvpError(err.response?.data?.error || err.response?.data?.message || 'Failed to RSVP. Please try again.');
      }
      console.error('Error RSVPing:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      setRsvpLoading(true);
      setRsvpError(null);
      const response = await axiosInstance.delete(`${API_BASE_URL}${id}/cancel_rsvp/`);
      
      // Refresh event data to get updated RSVP status
      await fetchEvent();
      
      // Show success message
      alert(response.data.message || 'RSVP cancelled successfully!');
    } catch (err) {
      if (err.response?.status === 401) {
        setRsvpError('Please login to manage your RSVPs.');
      } else if (err.response?.status === 404) {
        setRsvpError('No RSVP found to cancel.');
      } else {
        setRsvpError(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel RSVP. Please try again.');
      }
      console.error('Error cancelling RSVP:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return (
      <div className="event-detail">
        <div className="error">{error}</div>
        <Link to="/" className="back-link">← Back to Events</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail">
        <div className="error">Event not found</div>
        <Link to="/" className="back-link">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <Link to="/" className="back-link">← Back to Events</Link>
      
      <div className="event-detail-header">
        <h1>{event.title}</h1>
        {event.category && (
          <span className="event-category-badge">{event.category.name}</span>
        )}
      </div>

      <div className="event-detail-content">
        <div className="event-detail-main">
          <div className="event-info-section">
            <h2>Event Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">📅 Date & Time</span>
                <div className="info-value">
                  <strong>{formatDate(event.start_datetime)}</strong>
                  {event.end_datetime && (
                    <span> to {formatTime(event.end_datetime)}</span>
                  )}
                </div>
              </div>

              <div className="info-item">
                <span className="info-label">📍 Location</span>
                <div className="info-value">{event.location}</div>
              </div>

              <div className="info-item">
                <span className="info-label">💻 Modality</span>
                <div className="info-value">
                  <span className={`modality-badge modality-${event.modality}`}>
                    {event.modality === 'in-person' ? 'In-Person' : 
                     event.modality === 'online' ? 'Online' : 'Hybrid'}
                  </span>
                </div>
              </div>

              {event.host_organization && (
                <div className="info-item">
                  <span className="info-label">🏢 Host Organization</span>
                  <div className="info-value">{event.host_organization.name}</div>
                </div>
              )}

              {event.host_user && (
                <div className="info-item">
                  <span className="info-label">👤 Host</span>
                  <div className="info-value">{event.host_user}</div>
                </div>
              )}

              {event.category && (
                <div className="info-item">
                  <span className="info-label">📂 Category</span>
                  <div className="info-value">{event.category.name}</div>
                  {event.subcategory && (
                    <div className="subcategory">Subcategory: {event.subcategory}</div>
                  )}
                </div>
              )}

              <div className="info-item">
                <span className="info-label">👥 RSVPs</span>
                <div className="info-value">{event.rsvp_count || 0} people RSVPed</div>
              </div>
            </div>
          </div>

          <div className="event-description-section">
            <h2>Description</h2>
            <p className="description-text">{event.description}</p>
          </div>

          {event.employers_in_attendance && (
            <div className="event-employers-section">
              <h2>Employers in Attendance</h2>
              <p className="employers-text">{event.employers_in_attendance}</p>
            </div>
          )}

          {(event.has_free_food || event.has_free_swag || event.other_perks) && (
            <div className="event-perks-section">
              <h2>Perks & Benefits</h2>
              <div className="perks-list">
                {event.has_free_food && (
                  <div className="perk-item">
                    <span className="perk-icon">🍕</span>
                    <span>Free Food</span>
                  </div>
                )}
                {event.has_free_swag && (
                  <div className="perk-item">
                    <span className="perk-icon">🎁</span>
                    <span>Free Swag</span>
                  </div>
                )}
                {event.other_perks && (
                  <div className="perk-item">
                    <span className="perk-icon">✨</span>
                    <span>{event.other_perks}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="event-rsvp-section">
            <h2>RSVP</h2>
            <div className="rsvp-info">
              <p className="rsvp-count-display">{event.rsvp_count || 0} people have RSVPed to this event</p>
              
              {rsvpError && (
                <div className="rsvp-error-message">{rsvpError}</div>
              )}
              
              {event.user_has_rsvp ? (
                <div className="rsvp-status">
                  <span className="rsvp-badge rsvped">✓ You have RSVPed</span>
                  <button 
                    onClick={handleCancelRSVP} 
                    disabled={rsvpLoading}
                    className="rsvp-button cancel-rsvp-button"
                  >
                    {rsvpLoading ? 'Cancelling...' : 'Cancel RSVP'}
                  </button>
                </div>
              ) : (
                <div className="rsvp-status">
                  <span className="rsvp-badge not-rsvped">Not RSVPed yet</span>
                  <button 
                    onClick={handleRSVP} 
                    disabled={rsvpLoading}
                    className="rsvp-button rsvp-button-primary"
                  >
                    {rsvpLoading ? 'RSVPing...' : 'RSVP to Event'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="event-detail-sidebar">
          <div className="event-summary-card">
            <h3>Quick Info</h3>
            <div className="summary-item">
              <strong>Date:</strong> {formatDate(event.start_datetime)}
            </div>
            <div className="summary-item">
              <strong>Time:</strong> {formatTime(event.start_datetime)}
              {event.end_datetime && ` - ${formatTime(event.end_datetime)}`}
            </div>
            <div className="summary-item">
              <strong>Location:</strong> {event.location}
            </div>
            <div className="summary-item">
              <strong>Modality:</strong> {event.modality === 'in-person' ? 'In-Person' : 
                                           event.modality === 'online' ? 'Online' : 'Hybrid'}
            </div>
            {event.host_organization && (
              <div className="summary-item">
                <strong>Host:</strong> {event.host_organization.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;

