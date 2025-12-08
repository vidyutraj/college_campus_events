import type { Dispatch, SetStateAction } from "react";
import type { Event } from "../../types";
import { Link } from "react-router-dom";

interface EventPopupProps {
    event: Event;
    setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
}

export default function EventPopup({
    event,
    setSelectedEvent,
}: EventPopupProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    return (
        <div className="z-100 fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl p-0.5">
                <div className="relative p-8">
                    <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                    <div className="space-y-2 text-sm text-foreground/80 mb-4">
                        <p>
                            <strong>Date & Time:</strong>{" "}
                            {formatDate(event.start_datetime)}
                        </p>
                        <p>
                            <strong>Location:</strong> {event.location}
                        </p>
                        <p>
                            <strong>Modality:</strong> {event.modality}
                        </p>
                        {event.host_organization && (
                            <p>
                                <strong>Host:</strong>{" "}
                                {event.host_organization.name}
                            </p>
                        )}
                        {event.category && (
                            <p>
                                <strong>Category:</strong> {event.category.name}
                            </p>
                        )}
                        <div className="flex gap-2 flex-wrap mt-2">
                            {event.has_free_food && (
                                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                    🍕 Free Food
                                </span>
                            )}
                            {event.has_free_swag && (
                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                    🎁 Free Swag
                                </span>
                            )}
                        </div>
                        <p className="text-primary font-medium">
                            {event.rsvp_users.length || 0} RSVPs
                        </p>
                    </div>
                    <p className="text-gray-700 line-clamp-3">
                        {event.description}
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="px-4 py-2 rounded-lg border hover:bg-gray-100 btn"
                        >
                            Close
                        </button>
                        <Link to={"/events/" + event.id}>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="px-4 py-2 rounded-lg btn-secondary"
                        >
                            View Event Page
                        </button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
