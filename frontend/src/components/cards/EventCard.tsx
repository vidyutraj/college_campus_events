import { useNavigate } from "react-router-dom";
import type { Event } from "../../types";
import { formatModality } from "../../utils/events";

interface EventCardProps {
    event: Event;
    hideDetail?: boolean;
}

export default function EventCard({ event, hideDetail = false }: EventCardProps) {
    const navigate = useNavigate();

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

    const handleEventClick = (eventId: number) => {
        navigate(`/events/${eventId}`);
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => handleEventClick(event.id)}
        >
            <h3 className="text-xl font-bold mb-3">{event.title}</h3>
            <div className="space-y-2 text-sm text-foreground/80 mb-4">
                <p>
                    <strong>Date & Time:</strong>{" "}
                    {formatDate(event.start_datetime)}
                </p>
                {!hideDetail && <><p>
                    <strong>Location:</strong> {event.location}
                </p>
                <p>
                    <strong>Modality:</strong> {formatModality(event.modality)}
                </p>
                {event.host_organization && (
                    <p>
                        <strong>Host:</strong> {event.host_organization.name}
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
                </p></>}
            </div>
            <p className="text-gray-700 line-clamp-3">{event.description}</p>
        </div>
    );
}
