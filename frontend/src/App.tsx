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
import CreateMeeting from "./pages/CreateMeeting";
import MeetingsList from "./pages/MeetingsList";

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
                                path="/events/:id"
                                element={<EventDetail />}
                            />
                            <Route
                                path="/events/create"
                                element={<CreateEvent />}
                            />
                            <Route
                                path="/create-meeting"
                                element={<CreateMeeting />}
                            />
                            <Route path="/meetings" element={<MeetingsList />} />
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
                        </Route>
                    </Routes>
                </div>
            </Router>
        </LoadScript>
    );
}

export default App;
