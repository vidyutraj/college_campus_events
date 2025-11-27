import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event } from "../types";
import { useAuth } from "../context/AuthContext";

export default function AdminEventRequests() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [rejecting, setRejecting] = useState(-1);
    const [approving, setApproving] = useState(-1);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const params = { is_approved: false };
            const { data } = await axiosInstance.get("/api/events/", {
                params: params,
            });
            setEvents(data.results || data);
            setError("");
        } catch (err) {
            console.error("Error fetching pending events:", err);
            setError("Failed to load pending events.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            setApproving(id);
            await axiosInstance.post(`/api/events/${id}/approve/`);
            alert("Event approved successfully.");
            await fetchPending();
        } catch (err) {
            console.error("Error approving event:", err);
            alert("Failed to approve event.");
        } finally {
            setApproving(-1);
        }
    };

    const handleReject = async (id: number) => {
        try {
            setRejecting(id);
            await axiosInstance.post(`/api/events/${id}/reject/`, {});
            await fetchPending();
        } catch (err) {
            console.error("Error rejecting event:", err);
            alert("Failed to reject event.");
        } finally {
            setRejecting(-1);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!user?.is_staff) {
        return (
            <div className="max-w-7xl mx-auto px-5 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                    Access denied.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Event Requests
                </h1>
            </div>

            {loading ? (
                <div className="text-center py-20 text-foreground/80 text-xl">
                    Loading pending events...
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-foreground/80 text-xl">
                    No pending event requests.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs"
                        >
                            <div
                                className="cursor-pointer"
                                onClick={() =>
                                    navigate(`/events/${event.id}`, {
                                        state: { fromAdmin: true },
                                    })
                                }
                            >
                                <h3 className="text-xl font-bold mb-2">
                                    {event.title}
                                </h3>
                                <div className="text-sm text-foreground/80 space-y-1 mb-3">
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {formatDate(event.start_datetime)}
                                    </p>
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {event.location}
                                    </p>
                                    {event.host_organization && (
                                        <p>
                                            <strong>Host:</strong>{" "}
                                            {event.host_organization.name}
                                        </p>
                                    )}
                                </div>
                                <p className="text-gray-700 line-clamp-3 mb-4">
                                    {event.description}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() =>
                                        navigate(`/events/${event.id}`, {
                                            state: { fromAdmin: true },
                                        })
                                    }
                                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleApprove(event.id)}
                                    disabled={approving === event.id}
                                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {approving === event.id
                                        ? "Approving..."
                                        : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleReject(event.id)}
                                    disabled={rejecting === event.id}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    {rejecting === event.id
                                        ? "Rejecting..."
                                        : "Reject"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
