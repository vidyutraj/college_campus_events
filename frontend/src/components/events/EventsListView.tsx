import EventCard from "../cards/EventCard";
import type { Event } from "../../types";

interface Props {
    events: Event[];
    hasActiveFilters: boolean;
    loading: boolean;
    error: string | null;
}

export default function EventsListView({
    events,
    hasActiveFilters,
    loading,
    error,
}: Props) {
    if (loading) return <div className="py-20 text-center">Loading...</div>;
    if (error)
        return <div className="py-20 text-center text-red-600">{error}</div>;

    if (events.length === 0) {
        return (
            <div className="text-center py-20 text-foreground/80 text-xl">
                {hasActiveFilters
                    ? "No events found matching your filters."
                    : "No upcoming events at this time."}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => (
                <EventCard key={e.id} event={e} />
            ))}
        </div>
    );
}
