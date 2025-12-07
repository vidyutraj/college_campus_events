import { Link } from "react-router-dom";
import type { Event } from "../../types";

export default function EventDetailsHeader({
    event,
    fromAdmin,
}: {
    event: Event;
    fromAdmin: boolean;
}) {
    return (
        <>
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
        </>
    );
}
