import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Event } from "../../types";

interface Props {
    events: Event[];
    setSelectedEvent: (e: Event) => void;
}

export default function EventsCalendarView({
    events,
    setSelectedEvent,
}: Props) {
    const calendarEvents = events.map((e) => ({
        id: e.id.toString(),
        title: e.title,
        start: e.start_datetime,
        end: e.end_datetime,
        extendedProps: e,
    }));

    return (
        <div className="bg-white rounded-lg p-4 shadow">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek",
                }}
                eventColor="#9657e8"
                eventClick={(info) =>
                    setSelectedEvent(info.event.extendedProps as Event)
                }
            />
        </div>
    );
}
