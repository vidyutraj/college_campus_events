import { Link } from 'react-router-dom';

function Homepage() {
  return (
    <div className="min-h-[calc(100vh-80px)] w-full">
      {/* Hero Section */}
      <div 
        className="text-white text-center py-20 px-5 mb-16"
        style={{
          background: 'linear-gradient(to bottom right, #1976d2, #1565c0)'
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-5">Welcome to College Campus Events</h1>
        <p className="text-xl md:text-2xl mb-10 opacity-90">
          Discover, RSVP, and manage campus events all in one place
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <Link
            to="/events"
            className="bg-white text-primary px-8 py-3.5 rounded text-base font-medium transition-all duration-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Browse Events
          </Link>
          <Link
            to="/login"
            className="bg-transparent text-white border-2 border-white px-8 py-3.5 rounded text-base font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="text-6xl mb-5">🎓</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">For Students</h3>
            <p className="text-gray-600 leading-relaxed mb-5">
              Browse events, filter by category, RSVP to events you're interested in, and manage your calendar.
            </p>
            <Link to="/register/student" className="text-primary font-medium hover:text-primary-dark hover:underline">
              Sign up as Student →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="text-6xl mb-5">🏢</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">For Event Leaders</h3>
            <p className="text-gray-600 leading-relaxed mb-5">
              Register your organization and create events. View RSVPs and track attendance.
            </p>
            <div className="space-y-2">
              <Link to="/register/organization" className="block text-primary font-medium hover:text-primary-dark hover:underline">
                Register Organization →
              </Link>
              <Link to="/login" className="block text-primary font-medium hover:text-primary-dark hover:underline">
                Sign In as Leader →
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="text-6xl mb-5">📅</div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Event Discovery</h3>
            <p className="text-gray-600 leading-relaxed mb-5">
              Find events by category, date, organization, modality, and perks. Never miss an event again!
            </p>
            <Link to="/events" className="text-primary font-medium hover:text-primary-dark hover:underline">
              Explore Events →
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 text-center py-16 px-5 mt-16">
        <h2 className="text-4xl font-semibold mb-4 text-gray-800">Ready to get started?</h2>
        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
          Join thousands of students discovering amazing campus events
        </p>
        <div className="flex gap-5 justify-center flex-wrap">
          <Link
            to="/register/student"
            className="bg-white text-primary border-2 border-primary px-10 py-4 rounded text-lg font-medium transition-all duration-300 hover:bg-primary hover:text-white"
          >
            Create Student Account
          </Link>
          <Link
            to="/events"
            className="bg-transparent text-primary border-2 border-primary px-10 py-4 rounded text-lg font-medium transition-all duration-300 hover:bg-primary hover:text-white"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
