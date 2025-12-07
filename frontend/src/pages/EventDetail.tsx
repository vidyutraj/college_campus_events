import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event } from "../types";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";
import { LuCalendar, LuClipboardList, LuFolder, LuPencil } from "react-icons/lu";
import EventRSVPList from "../components/modals/EventRSVPList";

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

    const handleEditToggle = () => {
        if (!event) return;
        setForm(event);
        setEditing(!editing);
    };

    const handleFieldChange = (field: keyof Event, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
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

    // GOOGLE CALENDAR URL
    const getGoogleCalendarUrl = () => {
        if (!event) return "#";

        const start =
            new Date(event.start_datetime)
                .toISOString()
                .replace(/[-:]/g, "")
                .split(".")[0] + "Z";

        const end = event.end_datetime
            ? new Date(event.end_datetime)
                  .toISOString()
                  .replace(/[-:]/g, "")
                  .split(".")[0] + "Z"
            : "";

        const title = encodeURIComponent(event.title || "");
        const details = encodeURIComponent(event.description || "");
        const location = encodeURIComponent(event.location || "");

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
    };

    // OUTLOOK (.ICS FILE) DOWNLOAD
    const getOutlookCalendarIcs = () => {
        if (!event) return "#";

        const formatICSDate = (dateStr: string) => {
            return (
                new Date(dateStr)
                    .toISOString()
                    .replace(/[-:]/g, "")
                    .split(".")[0] + "Z"
            );
        };

        const start = formatICSDate(event.start_datetime);
        const end = event.end_datetime
            ? formatICSDate(event.end_datetime)
            : start;

        const icsContent = `
            BEGIN:VCALENDAR
            VERSION:2.0
            BEGIN:VEVENT
            DTSTAMP:${start}
            DTSTART:${start}
            DTEND:${end}
            SUMMARY:${event.title || ""}
            DESCRIPTION:${(event.description || "").replace(/\n/g, "\\n")}
            LOCATION:${event.location || ""}
            END:VEVENT
            END:VCALENDAR
        `.trim();

        const blob = new Blob([icsContent], {
            type: "text/calendar;charset=utf-8",
        });
        return URL.createObjectURL(blob);
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
            <Link
                to={fromAdmin ? "/admin/event-requests" : "/events"}
                className="text-primary hover:text-primary-dark mb-6 inline-block"
            >
                ← Back to {fromAdmin ? "Event Requests" : "Events"}
            </Link>
            {event.status === "cancelled" && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
                    This event has been cancelled.
                </div>
            )}

            {event.status === "draft" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded mb-4">
                    This event is currently a draft and not yet published.
                </div>
            )}

            {!event.is_approved && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded mb-4">
                    This event is awaiting approval.
                </div>
            )}

            {(user?.is_staff ||
                boardMemberOrgs.some(
                    (org) => org.name === event.host_organization?.name
                )) && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="text-gray-700 font-medium">
                            Event Admin Controls
                        </div>
                        <div className="flex items-center gap-3">
                            {!editing && <button
                                onClick={() => setShowRSVPList(!showRSVPList)}
                                className="px-4 py-2 rounded-md border border-foreground/50 hover:bg-gray-200 btn"
                            >
                                <LuClipboardList /> View RSVP List
                            </button>}
                            {!editing ? (
                                <button
                                    onClick={handleEditToggle}
                                    className="px-4 py-2 rounded-lg btn-secondary font-medium
                                               border border-secondary hover:border-secondary-dark"
                                >
                                    <LuPencil /> Edit
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-4 py-2 rounded-md btn-primary border border-primary hover:border-primary-dark"
                                    >
                                        {saving ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        disabled={saving}
                                        className="px-4 py-2 rounded-md border border-foreground/50 hover:bg-gray-200 disabled:opacity-50 btn"
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {editing && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    value={form.title || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    value={form.location || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Room
                                </label>
                                <input
                                    value={form.room || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "room",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Modality
                                </label>
                                <select
                                    value={form.modality || "in-person"}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "modality",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="in-person">In-Person</option>
                                    <option value="online">Online</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Start
                                </label>
                                <input
                                    type="datetime-local"
                                    value={
                                        form.start_datetime
                                            ? new Date(form.start_datetime)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "start_datetime",
                                            new Date(
                                                e.target.value
                                            ).toISOString()
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    End
                                </label>
                                <input
                                    type="datetime-local"
                                    value={
                                        form.end_datetime
                                            ? new Date(form.end_datetime)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "end_datetime",
                                            new Date(
                                                e.target.value
                                            ).toISOString()
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={form.description || ""}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    rows={5}
                                />
                            </div>
                        </div>
                    )}
                </div>
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
                    {/* Event Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                        <h2 className="text-2xl font-bold mb-4">
                            Event Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-1">
                                    📅 Date & Time
                                </span>
                                <div className="text-gray-800">
                                    <strong>
                                        {formatDate(event.start_datetime)}
                                    </strong>
                                    {event.end_datetime && (
                                        <span className="block text-sm">
                                            {" "}
                                            to {formatTime(event.end_datetime)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-1">
                                    📍 Location
                                </span>
                                <div className="text-gray-800">
                                    {event.location}
                                </div>
                            </div>

                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-1">
                                    💻 Modality
                                </span>
                                <span
                                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                                        event.modality === "in-person"
                                            ? "bg-green-100 text-green-800"
                                            : event.modality === "online"
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-purple-100 text-purple-800"
                                    }`}
                                >
                                    {event.modality === "in-person"
                                        ? "In-Person"
                                        : event.modality === "online"
                                        ? "Online"
                                        : "Hybrid"}
                                </span>
                            </div>

                            {event.host_organization && (
                                <div>
                                    <span className="block text-sm font-medium text-gray-500 mb-1">
                                        🏢 Host Organization
                                    </span>
                                    <Link
                                        to={
                                            "/organization/" +
                                            event.host_organization.slug
                                        }
                                        className="text-primary hover:text-primary-dark"
                                    >
                                        <div className="text-gray-800">
                                            {event.host_organization.name}
                                        </div>
                                    </Link>
                                </div>
                            )}

                            {event.host_user && (
                                <div>
                                    <span className="block text-sm font-medium text-gray-500 mb-1">
                                        👤 Host
                                    </span>
                                    <div className="text-gray-800">
                                        {event.host_user}
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="block text-sm font-medium text-gray-500 mb-1">
                                    👥 RSVPs
                                </span>
                                <div className="font-medium">
                                    {event.rsvp_count || 0} people RSVPed
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* Employers in Attendance */}
                    {event.employers_in_attendance && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                            <h2 className="text-2xl font-bold mb-4">
                                Employers in Attendance
                            </h2>
                            <p className="text-gray-700">
                                {event.employers_in_attendance}
                            </p>
                        </div>
                    )}

                    {/* Perks & Benefits */}
                    {(event.has_free_food ||
                        event.has_free_swag ||
                        event.other_perks) && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                            <h2 className="text-2xl font-bold mb-4">
                                Perks & Benefits
                            </h2>
                            <div className="space-y-3">
                                {event.has_free_food && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🍕</span>
                                        <span className="text-gray-700">
                                            Free Food
                                        </span>
                                    </div>
                                )}
                                {event.has_free_swag && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎁</span>
                                        <span className="text-gray-700">
                                            Free Swag
                                        </span>
                                    </div>
                                )}
                                {event.other_perks && (
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">✨</span>
                                        <span className="text-gray-700">
                                            {event.other_perks}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* RSVP Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                        <h2 className="text-2xl font-bold mb-4">RSVP</h2>
                        <p className="text-foreground/80 mb-4">
                            {event.rsvp_count || 0} people have RSVPed to this
                            event
                        </p>

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
                                    {rsvpLoading
                                        ? "Cancelling..."
                                        : "Cancel RSVP"}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-gray-500">
                                    Not RSVPed yet
                                </span>
                                <button
                                    onClick={handleRSVP}
                                    disabled={rsvpLoading}
                                    className="btn-primary px-6 py-2 rounded"
                                >
                                    {rsvpLoading
                                        ? "RSVPing..."
                                        : "RSVP to Event"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs sticky top-6">
                        <h3 className="text-xl font-bold mb-4">Quick Info</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <strong className="block text-gray-600">
                                    Date:
                                </strong>
                                <span className="text-gray-800">
                                    {formatDate(event.start_datetime)}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-gray-600">
                                    Time:
                                </strong>
                                <span className="text-gray-800">
                                    {formatTime(event.start_datetime)}
                                    {event.end_datetime &&
                                        ` - ${formatTime(event.end_datetime)}`}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-gray-600">
                                    Location:
                                </strong>
                                <span className="text-gray-800">
                                    {event.location}
                                </span>
                            </div>
                            <div>
                                <strong className="block text-gray-600">
                                    Modality:
                                </strong>
                                <span className="text-gray-800">
                                    {event.modality === "in-person"
                                        ? "In-Person"
                                        : event.modality === "online"
                                        ? "Online"
                                        : "Hybrid"}
                                </span>
                            </div>
                            {event.host_organization && (
                                <div>
                                    <strong className="block text-gray-600">
                                        Host:
                                    </strong>
                                    <span className="text-gray-800">
                                        {event.host_organization.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex flex-col gap-3 mt-4">
                                {/* Google Calendar Button */}
                                <a
                                    href={getGoogleCalendarUrl()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 font-medium btn-outline-primary px-5 py-2 rounded"
                                >
                                    <LuCalendar /> Add to Google Calendar
                                </a>

                                {/* Outlook ICS Download Button */}
                                <a
                                    href={getOutlookCalendarIcs()}
                                    download={`${event?.title || "event"}.ics`}
                                    className="inline-flex items-center justify-center gap-2 font-medium btn-outline-secondary px-5 py-2 rounded"
                                >
                                    <LuFolder />
                                    Add to Outlook Calendar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showRSVPList && <EventRSVPList userRSVPs={event.rsvp_users} setShowRSVPList={setShowRSVPList} />}
        </div>
    );
}
