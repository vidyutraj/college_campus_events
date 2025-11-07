import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import { useAuth } from "./context/AuthContext";
import Homepage from "./components/Homepage";
import Dashboard from "./components/Dashboard";
import EventDetail from "./components/EventDetail";
import Login from "./components/Login";
import RegisterStudent from "./components/RegisterStudent";
import RegisterOrganization from "./components/RegisterOrganization";
import CreateEvent from "./components/CreateEvent";
import AdminEventRequests from "./components/AdminEventRequests";
function AppHeader() {
    const { user, userType, organization, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <header className="bg-primary text-white shadow-md">
            <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center flex-wrap gap-5">
                <Link to="/" className="no-underline text-white">
                    <h1 className="text-3xl font-bold m-0">
                        College Campus Events
                    </h1>
                </Link>
                <nav className="flex items-center gap-5 flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <span className="text-white/90 text-sm">
                                {organization ? (
                                    <>
                                        Welcome, {organization.name}{" "}
                                        (Organization)
                                    </>
                                ) : (
                                    <>
                                        Welcome, {user?.username} (
                                        {userType === "student"
                                            ? "Student"
                                            : userType === "organization_leader"
                                            ? "Leader"
                                            : "Admin"}
                                        )
                                    </>
                                )}
                            </span>
                            {userType === "student" && (
                                <Link
                                    to="/events"
                                    className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                >
                                    Events
                                </Link>
                            )}
                            {userType === "organization_leader" && (
                                <>
                                    <Link
                                        to="/events"
                                        className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        to="/leader/dashboard"
                                        className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/events/create"
                                        className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                    >
                                        Create Event
                                    </Link>
                                </>
                            )}
                            {userType === "site_admin" && (
                                <>
                                    <Link
                                        to="/events"
                                        className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        to="/admin/event-requests"
                                        className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                                    >
                                        Event Requests
                                    </Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-white bg-white/20 hover:bg-white/30 border-0 cursor-pointer font-medium px-4 py-2 rounded-sm transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/events"
                                className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                            >
                                Browse Events
                            </Link>
                            <Link
                                to="/login"
                                className="text-white no-underline font-medium px-4 py-2 rounded-sm transition-colors hover:bg-white/10"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

function App() {
    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
        >
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <AppHeader />
                    <Routes>
                        <Route path="/" element={<Homepage />} />
                        <Route path="/events" element={<Dashboard />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route
                            path="/events/create"
                            element={<CreateEvent />}
                        />
                        <Route
                            path="/admin/event-requests"
                            element={<AdminEventRequests />}
                        />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/register/student"
                            element={<RegisterStudent />}
                        />
                        <Route
                            path="/register/organization"
                            element={<RegisterOrganization />}
                        />
                    </Routes>
                </div>
            </Router>
        </LoadScript>
    );
}

export default App;
