import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './Dashboard.css';

const API_BASE_URL = '/api/events/';
const CATEGORIES_URL = '/api/events/categories/';
const ORGANIZATIONS_URL = '/api/organizations/';

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    organization: '',
    modality: '',
    hasFreeFood: false,
    hasFreeSwag: false,
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  useEffect(() => {
    fetchCategories();
    fetchOrganizations();
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(CATEGORIES_URL);
      setCategories(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axiosInstance.get(ORGANIZATIONS_URL);
      setOrganizations(response.data.results || response.data);
    } catch (err) {
      console.error('Error fetching organizations:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.category) {
        params.category = filters.category;
      }
      if (filters.organization) {
        params.host_organization = filters.organization;
      }
      if (filters.modality) {
        params.modality = filters.modality;
      }
      if (filters.hasFreeFood) {
        params.has_free_food = 'true';
      }
      if (filters.hasFreeSwag) {
        params.has_free_swag = 'true';
      }
      if (filters.startDate) {
        params.start_date = filters.startDate;
      }
      if (filters.endDate) {
        params.end_date = filters.endDate;
      }
      
      const response = await axiosInstance.get(API_BASE_URL, { params });
      setEvents(response.data.results || response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      organization: '',
      modality: '',
      hasFreeFood: false,
      hasFreeSwag: false,
      startDate: '',
      endDate: '',
    });
  };

  const hasActiveFilters = () => {
    return filters.category || filters.organization || filters.modality || 
           filters.hasFreeFood || filters.hasFreeSwag || filters.startDate || filters.endDate;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Upcoming Events</h2>
        <div className="filter-toggle">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="toggle-filters-btn"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters() && <span className="filter-badge">●</span>}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="category-filter" className="filter-label">
                Category:
              </label>
              <select
                id="category-filter"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="organization-filter" className="filter-label">
                Host Organization:
              </label>
              <select
                id="organization-filter"
                value={filters.organization}
                onChange={(e) => handleFilterChange('organization', e.target.value)}
                className="filter-select"
              >
                <option value="">All Organizations</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="modality-filter" className="filter-label">
                Modality:
              </label>
              <select
                id="modality-filter"
                value={filters.modality}
                onChange={(e) => handleFilterChange('modality', e.target.value)}
                className="filter-select"
              >
                <option value="">All Types</option>
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="start-date-filter" className="filter-label">
                Start Date:
              </label>
              <input
                type="date"
                id="start-date-filter"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="end-date-filter" className="filter-label">
                End Date:
              </label>
              <input
                type="date"
                id="end-date-filter"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="filter-input"
              />
            </div>

            <div className="filter-group perks-filter">
              <label className="filter-label">Perks:</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.hasFreeFood}
                    onChange={(e) => handleFilterChange('hasFreeFood', e.target.checked)}
                  />
                  🍕 Free Food
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.hasFreeSwag}
                    onChange={(e) => handleFilterChange('hasFreeSwag', e.target.checked)}
                  />
                  🎁 Free Swag
                </label>
              </div>
            </div>
          </div>

          {hasActiveFilters() && (
            <div className="filter-actions">
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {hasActiveFilters() && !showFilters && (
        <div className="filter-info">
          Filters active: {events.length} event{events.length !== 1 ? 's' : ''} found
        </div>
      )}

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : events.length === 0 ? (
        <div className="no-events">
          {hasActiveFilters() 
            ? 'No events found matching your filters.' 
            : 'No upcoming events at this time.'}
        </div>
      ) : (
        <div className="events-list">
          {events.map(event => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => handleEventClick(event.id)}
              style={{ cursor: 'pointer' }}
            >
              <h3>{event.title}</h3>
              <div className="event-details">
                <p><strong>Date & Time:</strong> {formatDate(event.start_datetime)}</p>
                <p><strong>Location:</strong> {event.location}</p>
                <p><strong>Modality:</strong> {event.modality}</p>
                {event.host_organization && (
                  <p><strong>Host:</strong> {event.host_organization.name}</p>
                )}
                {event.category && (
                  <p><strong>Category:</strong> {event.category.name}</p>
                )}
                <div className="perks">
                  {event.has_free_food && <span className="perk">🍕 Free Food</span>}
                  {event.has_free_swag && <span className="perk">🎁 Free Swag</span>}
                </div>
                <p className="rsvp-count">{event.rsvp_count || 0} RSVPs</p>
              </div>
              <p className="event-description">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

