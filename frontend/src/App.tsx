import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RegisterOrganization from "./pages/RegisterOrganization";
import CreateEvent from "./pages/CreateEvent";
import AdminEventRequests from "./pages/AdminEventRequests";
import MainLayout from "./components/layouts/MainLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";
import AdminEvents from "./pages/AdminEvents";
import UserProfile from "./pages/UserProfile";
import OrganizationPage from "./pages/Organization";
import Organizations from "./pages/Organizations";
import EventsMap from "./pages/EventsMap";

function App() {
    return (
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
        >
            <Router>
                <div className="min-h-screen">
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<SignUp />} />
                        </Route>
                        <Route element={<DashboardLayout />}>
                            <Route path="/events" element={<Events />} />
                            <Route
                                path="/my-upcoming-events"
                                element={<Events myEventsOnly={true} />}
                            />
                            <Route
                                path="/organizations"
                                element={<Organizations />}
                            />
                            <Route path="/event-map" element={<EventsMap />} />
                            <Route
                                path="/events/:id"
                                element={<EventDetail />}
                            />
                            <Route
                                path="/events/create"
                                element={<CreateEvent />}
                            />
                            <Route
                                path="/admin/events"
                                element={<AdminEvents />}
                            />
                            <Route
                                path="/admin/event-requests"
                                element={<AdminEventRequests />}
                            />
                            <Route
                                path="/organizations/create"
                                element={<RegisterOrganization />}
                            />
                            <Route
                                path="/user/:username"
                                element={<UserProfile />}
                            />
                            <Route
                                path="/organization/:org"
                                element={<OrganizationPage />}
                            />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </LoadScript>
    );
}

export default App;
