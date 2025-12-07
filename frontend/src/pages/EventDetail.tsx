import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event } from "../types";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import EventRSVPList from "../components/modals/EventRSVPList";
import EventDetailsHeader from "../components/events/EventDetailsHeader";
import EventAdminControls from "../components/events/EventAdminControls";
import EventInformation from "../components/events/EventInformation";
import EventRSVPBox from "../components/events/EventRSVPBox";
import EventSidebar from "../components/events/EventSidebar";

export default function EventDetail() {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const fromAdmin = location.state?.fromAdmin === true;
    const { user, boardMemberOrgs } = useAuth();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpError, setRsvpError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<Partial<Event>>({});
    const [showRSVPList, setShowRSVPList] = useState(false);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/api/events/${id}/`);
            setEvent(response.data);
            setForm(response.data);
            setError(null);
        } catch (err: unknown) {
            setError("Failed to load event details. Please try again later.");
            console.error("Error fetching event:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        try {
            setSaving(true);
            const payload = {
                title: form.title,
                description: form.description,
                location: form.location,
                room: form.room,
                start_datetime: form.start_datetime,
                end_datetime: form.end_datetime,
                modality: form.modality,
            };
            await axiosInstance.put(`/api/events/${id}/`, payload);
            await fetchEvent();
            setEditing(false);
        } catch (err) {
            console.error("Error saving event:", err);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleRSVP = async () => {
        try {
            setRsvpLoading(true);
            setRsvpError(null);
            const response = await axiosInstance.post(
                `/api/events/${id}/rsvp/`,
                {}
            );

            await fetchEvent();
            alert(response.data.message || "RSVP successful!");
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    setRsvpError("Please login to RSVP to events.");
                } else if (err.response?.status === 403) {
                    setRsvpError("You do not have permission to RSVP.");
                } else {
                    setRsvpError(
                        err.response?.data?.error ||
                            err.response?.data?.message ||
                            "Failed to RSVP. Please try again."
                    );
                }
            } else {
                setRsvpError("Failed to RSVP. Please try again.");
            }
            console.error("Error RSVPing:", err);
        } finally {
            setRsvpLoading(false);
        }
    };

    const handleCancelRSVP = async () => {
        try {
            setRsvpLoading(true);
            setRsvpError(null);
            const response = await axiosInstance.delete(
                `/api/events/${id}/cancel_rsvp/`
            );

            await fetchEvent();
            alert(response.data.message || "RSVP cancelled successfully!");
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    setRsvpError("Please login to manage your RSVPs.");
                } else if (err.response?.status === 404) {
                    setRsvpError("No RSVP found to cancel.");
                } else {
                    setRsvpError(
                        err.response?.data?.error ||
                            err.response?.data?.message ||
                            "Failed to cancel RSVP. Please try again."
                    );
                }
            } else {
                setRsvpError("Failed to cancel RSVP. Please try again.");
            }
            console.error("Error cancelling RSVP:", err);
        } finally {
            setRsvpLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 text-xl text-gray-600">
                Loading event details...
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
                    {error || "Event not found"}
                </div>
                <Link
                    to="/events"
                    className="text-primary hover:text-primary-dark"
                >
                    ← Back to Events
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-8">
            <EventDetailsHeader event={event} fromAdmin={fromAdmin} />

            {(user?.is_staff ||
                boardMemberOrgs.some(
                    (org) => org.name === event.host_organization?.name
                )) && (
                <EventAdminControls
                    event={event}
                    editing={editing}
                    saving={saving}
                    form={form}
                    setForm={setForm}
                    showRSVPList={showRSVPList}
                    setShowRSVPList={setShowRSVPList}
                    onEditToggle={() => setEditing((prev) => !prev)}
                    onSave={handleSave}
                />
            )}

            <div className="mb-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <h1 className="text-4xl font-bold text-gray-800">
                        {event.title}
                    </h1>
                    {event.category && (
                        <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                            {event.category.name}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <EventInformation event={event} />

                    {/* RSVP Section */}
                    <EventRSVPBox
                        event={event}
                        rsvpError={rsvpError}
                        rsvpLoading={rsvpLoading}
                        handleRSVP={handleRSVP}
                        handleCancelRSVP={handleCancelRSVP}
                    />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <EventSidebar event={event} />
                </div>
            </div>
            {showRSVPList && (
                <EventRSVPList
                    userRSVPs={event.rsvp_users}
                    setShowRSVPList={setShowRSVPList}
                />
            )}
        </div>
    );
}
