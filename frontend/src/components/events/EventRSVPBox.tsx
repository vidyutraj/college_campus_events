import { useAuth } from "../../context/AuthContext";
import type { Event } from "../../types";

interface Props {
    event: Event;
    rsvpError: string | null;
    rsvpLoading: boolean;
    handleRSVP: () => void;
    handleCancelRSVP: () => void;
}

export default function EventRSVPBox({
    event,
    rsvpError,
    rsvpLoading,
    handleRSVP,
    handleCancelRSVP,
}: Props) {
    const { isAuthenticated } = useAuth();
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
            <h2 className="text-2xl font-bold mb-4">RSVP</h2>
            <p className="text-foreground/80 mb-4">
                {event.rsvp_users.length || 0} {event.rsvp_users.length != 1 ? "people have" : "person has"} RSVPed to this event
            </p>

            {rsvpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                    {rsvpError}
                </div>
            )}

            {!isAuthenticated ? (
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gray-500">You must be signed in to RSVP to this event</span>
                </div>
            ) : event.user_has_rsvp ? (
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded font-medium">
                        ✓ You have RSVPed
                    </span>
                    <button
                        onClick={handleCancelRSVP}
                        disabled={rsvpLoading}
                        className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {rsvpLoading ? "Cancelling..." : "Cancel RSVP"}
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gray-500">Not RSVPed yet</span>
                    <button
                        onClick={handleRSVP}
                        disabled={rsvpLoading}
                        className="btn-primary px-6 py-2 rounded"
                    >
                        {rsvpLoading ? "RSVPing..." : "RSVP to Event"}
                    </button>
                </div>
            )}
        </div>
    );
}
