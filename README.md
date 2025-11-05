# College Campus Events

A platform for managing and discovering college campus events.

**Team Bruce 2** - Vidyut Rajagopal, Ira Pathak, Evelyn Chen, Ross Klaiber, Zechariah Frierson

## Overview

An online announcement board for campus events with:
- Dashboard, calendar, and map view of events
- Students can view and RSVP to events
- Student organization and club leaders can post and manage events
- Google Maps API integration
- Student profiles and Student Organization Leader profiles

## Tech Stack

- **Backend**: Django 5.2.6 + Django REST Framework
- **Frontend**: React
- **Database**: SQLite (development)

## Admin Panel - Verifying Organizations

To verify organizations (so they appear in the public listings):

1. **Start Django server:**
   ```bash
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Access Django Admin:**
   - Go to: `http://localhost:8000/admin/`
   - Login with your superuser credentials (create one if needed: `python manage.py createsuperuser`)

3. **Verify Organizations:**
   - Navigate to **Organizations** → **Organizations**
   - You'll see a list of all organizations with an `is_verified` checkbox
   - **Quick method:** Check the `is_verified` checkbox directly in the list view and save
   - **Bulk method:** Select multiple organizations, choose "Verify selected organizations" from the Actions dropdown, and click "Go"
   - **Individual method:** Click on an organization name to edit, check the `is_verified` checkbox, and save

Once verified, organizations will appear in the public API endpoints and can be used for events.

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Activate virtual environment:
```bash
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create sample data:
```bash
python manage.py create_sample_data
```

5. Create superuser (optional):
```bash
python manage.py createsuperuser
```

6. Start Django server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start React development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Events
- `GET /api/events/events/` - List all events
- `GET /api/events/events/{id}/` - Get event details
- `POST /api/events/events/{id}/rsvp/` - RSVP to an event (requires authentication)
- `DELETE /api/events/events/{id}/cancel_rsvp/` - Cancel RSVP (requires authentication)
- `GET /api/events/categories/` - List event categories

### Authentication
- `POST /api/auth/register/student/` - Student registration
- `POST /api/auth/login/` - User login (students or leaders)
- `POST /api/auth/logout/` - User logout (requires authentication)
- `GET /api/auth/check/` - Check if user is authenticated
- `GET /api/auth/current-user/` - Get current authenticated user (requires authentication)

### Organizations
- `GET /api/organizations/organizations/` - List organizations
- `POST /api/organizations/register/` - Register a new organization (public - no authentication required)
- `POST /api/organizations/login/` - Login using organization credentials
- `POST /api/organizations/logout/` - Logout from organization account
- `GET /api/organizations/check-auth/` - Check if logged in as an organization
- `GET /api/organizations/my-organizations/` - Get organizations created by current user (requires authentication)
- `GET /api/organizations/my-memberships/` - Get organization memberships for current user (requires authentication)

## User Stories Implementation Status

### ✅ User Story 1: Student Dashboard with Event List
- Implemented: Students can browse a list of upcoming events on a dashboard
- Features: Event cards showing title, date, location, modality, host, category, and perks
- Status: **COMPLETE** - Ready for testing

### ✅ User Story 2: Filter Events by Category
- Implemented: Students can filter events by category (e.g., social, academic, professional)
- Features: Dropdown filter with all available categories, clear filter button, filter indicator
- Status: **COMPLETE** - Ready for testing

### ✅ User Story 3: Filter Events by Date, Organization, Modality, and Perks
- Implemented: Students can filter events by multiple criteria
- Features: 
  - Filter by host organization
  - Filter by modality (in-person, online, hybrid)
  - Filter by date range (start date, end date)
  - Filter by perks (free food, free swag checkboxes)
  - Collapsible filter panel with "Show/Hide Filters" button
  - Active filter indicator badge
  - Clear all filters button
- Status: **COMPLETE** - Ready for testing

### ✅ User Story 4: Event Detail Page
- Implemented: Students can view a dedicated event page with all details
- Features:
  - Full event information display (title, date, location, modality, host, category)
  - Detailed description
  - Perks section (free food, free swag, other perks)
  - Employers in attendance (if applicable)
  - RSVP count and status
  - Quick info sidebar
  - Responsive design with two-column layout
  - Clickable event cards on dashboard that navigate to detail page
- Status: **COMPLETE** - Ready for testing

### ✅ User Story 5: RSVP Functionality
- Implemented: Students can RSVP to events from the event detail page
- Features:
  - "RSVP to Event" button on event detail page
  - "Cancel RSVP" button if already RSVPed
  - Real-time RSVP count updates
  - User RSVP status display (whether user has RSVPed)
  - Error handling for authentication and permission issues
  - Loading states during RSVP operations
  - Success/error messages
  - Automatic refresh of event data after RSVP actions
- Status: **COMPLETE** - Ready for testing (requires user authentication)

### ✅ User Story 7: Student Account Creation and Login
- Implemented: Student registration and login system
- Features:
  - Homepage that anyone can access
  - Student registration form (username, email, password, name, description)
  - Student login page
  - Organization leader login page (separate from student login)
  - Authentication context for managing user state
  - Session-based authentication with Django
  - User type detection (student, organization_leader, site_admin)
  - Header navigation with user info and logout
  - Protected routes based on user type
- Status: **COMPLETE** - Ready for testing

### ✅ User Story 8: Organization Registration
- Implemented: Separate organization registration system (independent from student accounts)
- Features:
  - Organization registration form (name, description, username, password)
  - Public registration (no authentication required)
  - Organizations have their own login credentials (completely separate from student accounts)
  - Organization admins can sign in using organization username/password
  - Organizations are independent entities (created_by is optional)
  - Organization verification status (needs site admin approval)
  - Login page supports both student and organization login
  - Clear distinction between student login and organization login
  - Registration available from homepage and login page
- Status: **COMPLETE** - Ready for testing

### 📋 Remaining User Stories
- User Story 9: Create events
- User Story 10: Edit events
- User Story 11: View RSVP list for organizers
- User Story 12-13: Site admin moderation and user management

## Project Structure

```
college_campus_events/
├── accounts/          # User accounts and profiles
├── events/            # Event models, views, serializers
├── organizations/     # Organization models and management
├── campus_events/     # Django project settings
├── frontend/          # React frontend application
└── manage.py         # Django management script
```

## License

MIT

