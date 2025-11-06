import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import type { Event } from '../types';

const API_BASE_URL = '/api/events/';

function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${API_BASE_URL}${id}/`);
      setEvent(response.data);
      setError(null);
    } catch (err: any) {
      setError('Failed to load event details. Please try again later.');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
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

  const formatTime = (dateString: string) => {
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
      
      await fetchEvent();
      alert(response.data.message || 'RSVP successful!');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setRsvpError('Please login to RSVP to events.');
      } else if (err.response?.status === 403) {
        setRsvpError('You do not have permission to RSVP.');
      } else {
        setRsvpError(err.response?.data?.error || err.response?.data?.message || 'Failed to RSVP. Please try again.');
      }
      console.error('Error RSVPing:', err);
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancelRSVP = async () => {
    try {
      setRsvpLoading(true);
      setRsvpError(null);
      const response = await axiosInstance.delete(`${API_BASE_URL}${id}/cancel_rsvp/`);
      
      await fetchEvent();
      alert(response.data.message || 'RSVP cancelled successfully!');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setRsvpError('Please login to manage your RSVPs.');
      } else if (err.response?.status === 404) {
        setRsvpError('No RSVP found to cancel.');
      } else {
        setRsvpError(err.response?.data?.error || err.response?.data?.message || 'Failed to cancel RSVP. Please try again.');
      }
      console.error('Error cancelling RSVP:', err);
    } finally {
      setRsvpLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20 text-xl text-gray-600">Loading event details...</div>;
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {error || 'Event not found'}
        </div>
        <Link to="/events" className="text-primary hover:text-primary-dark">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <Link to="/events" className="text-primary hover:text-primary-dark mb-6 inline-block">← Back to Events</Link>
      
      <div className="mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-gray-800">{event.title}</h1>
          {event.category && (
            <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
              {event.category.name}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Event Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">📅 Date & Time</span>
                <div className="text-gray-800">
                  <strong>{formatDate(event.start_datetime)}</strong>
                  {event.end_datetime && (
                    <span className="block text-sm"> to {formatTime(event.end_datetime)}</span>
                  )}
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">📍 Location</span>
                <div className="text-gray-800">{event.location}</div>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">💻 Modality</span>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                  event.modality === 'in-person' ? 'bg-green-100 text-green-800' :
                  event.modality === 'online' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {event.modality === 'in-person' ? 'In-Person' : 
                   event.modality === 'online' ? 'Online' : 'Hybrid'}
                </span>
              </div>

              {event.host_organization && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">🏢 Host Organization</span>
                  <div className="text-gray-800">{event.host_organization.name}</div>
                </div>
              )}

              {event.host_user && (
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-1">👤 Host</span>
                  <div className="text-gray-800">{event.host_user}</div>
                </div>
              )}

              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">👥 RSVPs</span>
                <div className="text-gray-800 font-medium">{event.rsvp_count || 0} people RSVPed</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Employers in Attendance */}
          {event.employers_in_attendance && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Employers in Attendance</h2>
              <p className="text-gray-700">{event.employers_in_attendance}</p>
            </div>
          )}

          {/* Perks & Benefits */}
          {(event.has_free_food || event.has_free_swag || event.other_perks) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Perks & Benefits</h2>
              <div className="space-y-3">
                {event.has_free_food && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍕</span>
                    <span className="text-gray-700">Free Food</span>
                  </div>
                )}
                {event.has_free_swag && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎁</span>
                    <span className="text-gray-700">Free Swag</span>
                  </div>
                )}
                {event.other_perks && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <span className="text-gray-700">{event.other_perks}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* RSVP Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">RSVP</h2>
            <p className="text-gray-600 mb-4">{event.rsvp_count || 0} people have RSVPed to this event</p>
            
            {rsvpError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                {rsvpError}
              </div>
            )}
            
            {event.user_has_rsvp ? (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded font-medium">
                  ✓ You have RSVPed
                </span>
                <button 
                  onClick={handleCancelRSVP} 
                  disabled={rsvpLoading}
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rsvpLoading ? 'Cancelling...' : 'Cancel RSVP'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-gray-500">Not RSVPed yet</span>
                <button 
                  onClick={handleRSVP} 
                  disabled={rsvpLoading}
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rsvpLoading ? 'RSVPing...' : 'RSVP to Event'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <strong className="block text-gray-600">Date:</strong>
                <span className="text-gray-800">{formatDate(event.start_datetime)}</span>
              </div>
              <div>
                <strong className="block text-gray-600">Time:</strong>
                <span className="text-gray-800">
                  {formatTime(event.start_datetime)}
                  {event.end_datetime && ` - ${formatTime(event.end_datetime)}`}
                </span>
              </div>
              <div>
                <strong className="block text-gray-600">Location:</strong>
                <span className="text-gray-800">{event.location}</span>
              </div>
              <div>
                <strong className="block text-gray-600">Modality:</strong>
                <span className="text-gray-800">
                  {event.modality === 'in-person' ? 'In-Person' : 
                   event.modality === 'online' ? 'Online' : 'Hybrid'}
                </span>
              </div>
              {event.host_organization && (
                <div>
                  <strong className="block text-gray-600">Host:</strong>
                  <span className="text-gray-800">{event.host_organization.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
