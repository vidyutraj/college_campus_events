# College Campus Events

A modern platform for managing and discovering college campus events.

**Team Bruce 2** - Vidyut Rajagopal, Ira Pathak, Evelyn Chen, Ross Klaiber, Zechariah Frierson

## Overview

An online announcement board for campus events with:
- Dashboard, calendar, and map view of events
- Students can view and RSVP to events
- Student organization and club leaders can post and manage events
- Google Maps API integration
- Student profiles and Student Organization Leader profiles

## Tech Stack

### Backend
- **Framework**: Django 5.2.6 + Django REST Framework
- **Database**: SQLite (development)
- **Authentication**: Session-based authentication with CSRF protection

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with CSRF token handling

## Features

- 🎓 Student registration and authentication
- 🏢 Organization registration and management
- 📅 Event browsing with advanced filters
- 🎯 RSVP functionality
- 📱 Responsive design with Tailwind CSS
- 🔐 CSRF token handling
- 🎨 Modern UI with Tailwind utilities
- ⚡ Fast development with Vite HMR
- 🔒 Type-safe codebase with TypeScript

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

## Frontend Routes

- `/` - Homepage with features and call-to-action
- `/events` - Event listing/dashboard with filters
- `/events/:id` - Event detail page with RSVP functionality
- `/login` - Login page (students and organization leaders)
- `/register` - Student registration
- `/create-organization` - Organization registration
- `/leader/dashboard` - Organization leader dashboard (future)

## Authentication Flow

1. Users can sign in as students or organization leaders
2. CSRF tokens are automatically handled by axios interceptors
3. Authentication state is managed through React Context
4. Session-based authentication with Django backend
5. Protected routes based on user type

## Development Notes

### TypeScript & Type Safety

All frontend components are written in TypeScript with proper type definitions for:
- Event data structures
- User and Organization types
- Form data and state
- API responses
- Route parameters

### Tailwind CSS

The project uses Tailwind CSS for styling. Key classes used:
- `bg-primary` / `text-primary` - Primary brand color (#1976d2)
- Responsive utilities: `md:`, `lg:` prefixes
- Layout: `flex`, `grid`, `max-w-7xl mx-auto`
- Spacing: `p-{n}`, `m-{n}`, `gap-{n}`
- Typography: `text-{size}`, `font-{weight}`

### Backend Integration

The frontend proxies API requests to the Django backend:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- Proxy configured in `frontend/vite.config.ts`

## Getting Started

### Prerequisites

- **Python 3.8+** (use `python3` command on macOS/Linux)
- **Node.js 16+** and npm
- **Git** (for cloning the repository)

### Quick Start

#### Backend Setup

```bash
# 1. Clone the repository (if not already done)
git clone <repository-url>

cd college_campus_events

# Run database migrations (macOS/Linux)
python3 manage.py migrate

# Run database migrations (Windows)
python manage.py migrate

# Start Django development server (macOS/Linux)
python3 manage.py runserver

# Start Django development server (Windows)
python manage.py runserver

# Backend now running at http://localhost:8000
```

#### Frontend Setup (Open a new terminal)

```bash
# Navigate to frontend directory
cd college_campus_events/frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend now running at http://localhost:5173
```

**That's it!** Open your browser to `http://localhost:5173` to view the app.

---

### Optional: Create Sample Data & Admin Access

```bash
# Create sample events and users (macOS/Linux)
python3 manage.py create_sample_data

# Create superuser for admin panel access (macOS/Linux)
python3 manage.py createsuperuser

# On Windows, use 'python' instead of 'python3'
```

Access admin panel at `http://localhost:8000/admin/` to verify organizations.

---

### Detailed Setup (First Time)

If you're setting up the project for the first time, you may need to set up a virtual environment:

```bash
# Create virtual environment (macOS/Linux)
python3 -m venv venv

# Create virtual environment (Windows)
python -m venv venv

# Activate virtual environment (macOS/Linux)
source venv/bin/activate

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Then follow the Quick Start steps above
```

---

### Common Commands Reference

#### Backend Commands

```bash
# Run migrations (macOS/Linux)
python3 manage.py migrate

# Run migrations (Windows)
python manage.py migrate

# Create superuser (macOS/Linux)
python3 manage.py createsuperuser

# Create superuser (Windows)
python manage.py createsuperuser

# Create sample data (macOS/Linux)
python3 manage.py create_sample_data

# Create sample data (Windows)
python manage.py create_sample_data

# Start development server (macOS/Linux)
python3 manage.py runserver

# Start development server (Windows)
python manage.py runserver
```

#### Frontend Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Frontend Project Structure

```
frontend/src/
├── components/          # React components
│   ├── Dashboard.tsx    # Event listing with filters
│   ├── EventDetail.tsx  # Individual event view
│   ├── Homepage.tsx     # Landing page
│   ├── Login.tsx        # Login for students/leaders
│   ├── RegisterStudent.tsx
│   └── RegisterOrganization.tsx
├── context/            # React context providers
│   └── AuthContext.tsx # Authentication state management
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── axiosConfig.ts  # Axios instance with CSRF
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## API Endpoints

### Events
- `GET /api/events/events/` - List all events
- `GET /api/events/events/{id}/` - Get event details
- `POST /api/events/events/{id}/rsvp/` - RSVP to an event (requires authentication)
- `DELETE /api/events/events/{id}/cancel_rsvp/` - Cancel RSVP (requires authentication)
- `GET /api/events/categories/` - List event categories

### Authentication
- `POST /api/auth/register/` - Student registration
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
├── backend/               # Django backend
│   ├── accounts/          # User accounts and profiles
│   ├── events/            # Event models, views, serializers
│   ├── organizations/     # Organization models and management
│   ├── campus_events/     # Django project settings (settings.py, urls.py, wsgi.py, etc.)
│   └── manage.py          # Django management script
│
└── frontend/              # React + TypeScript + Vite frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── context/       # React context (auth)
    │   ├── types/         # TypeScript types
    │   ├── utils/         # Utilities (axios config)
    │   ├── App.tsx        # Main app component
    │   └── main.tsx       # Entry point
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js

```

## Useful Commands (macOS/Linux)

### Backend Commands
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Make migrations (after model changes)
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create sample data
python manage.py create_sample_data

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Commands
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run build  # TypeScript checks happen during build
```

### Common Development Workflow
```bash
# Terminal 1: Backend
source venv/bin/activate
python manage.py runserver

# Terminal 2: Frontend (in a new terminal window)
cd frontend
npm run dev

# Open in browser:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# Django Admin: http://localhost:8000/admin
```

## Troubleshooting

### Port Already in Use
```bash
# Backend: Change port
python manage.py runserver 8001

# Frontend: Vite usually auto-increments if 5173 is busy
# Or you can specify a port in vite.config.ts
```

### CORS Issues
- The frontend proxy should handle CORS automatically
- Check `frontend/vite.config.ts` proxy configuration
- Ensure backend is running on port 8000

### Build Errors
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check TypeScript errors
cd frontend
npm run build  # This will show all TypeScript errors
```

### Database Issues
```bash
# Reset database (WARNING: This deletes all data)
rm db.sqlite3
python manage.py migrate
python manage.py create_sample_data
python manage.py createsuperuser
```

## License

MIT

