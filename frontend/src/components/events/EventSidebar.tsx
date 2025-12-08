import type { Event } from "../../types";
import {
    formatModality,
    formatDate,
    formatTime,
    getGoogleCalendarUrl,
    getOutlookCalendarIcs,
    isSameDate,
} from "../../utils/events";
import { LuCalendar, LuFolder } from "react-icons/lu";

export default function EventSidebar({ event }: { event: Event }) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs sticky top-6">
            <h3 className="text-xl font-bold mb-4">Quick Info</h3>
            <div className="space-y-3 text-sm">
                <div>
                    <strong className="block text-gray-600">Date & Time:</strong>
                    <span className="text-gray-800">
                        {formatDate(event.start_datetime)}
                        {event.end_datetime && (
                            <>
                                {" "}
                                -{" "}
                                {isSameDate(
                                    event.start_datetime,
                                    event.end_datetime
                                )
                                    ? formatTime(event.end_datetime)
                                    : formatDate(event.end_datetime)}
                            </>
                        )}
                    </span>
                </div>
                <div>
                    <strong className="block text-gray-600">Location:</strong>
                    <span className="text-gray-800">{event.location}</span>
                </div>
                {event.room && 
                <div>
                    <strong className="block text-gray-600">Room:</strong>
                    <span className="text-gray-800">{event.room}</span>
                </div>}
                <div>
                    <strong className="block text-gray-600">Modality:</strong>
                    <span className="text-gray-800">
                        {formatModality(event.modality)}
                    </span>
                </div>
                {event.host_organization && (
                    <div>
                        <strong className="block text-gray-600">Host:</strong>
                        <span className="text-gray-800">
                            {event.host_organization.name}
                        </span>
                    </div>
                )}
                <div className="flex flex-col gap-3 mt-4">
                    {/* Google Calendar Button */}
                    <a
                        href={getGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 font-medium btn-outline-primary px-5 py-2 rounded"
                    >
                        <LuCalendar /> Add to Google Calendar
                    </a>

                    {/* Outlook ICS Download Button */}
                    <a
                        href={getOutlookCalendarIcs(event)}
                        download={`${event?.title || "event"}.ics`}
                        className="inline-flex items-center justify-center gap-2 font-medium btn-outline-secondary px-5 py-2 rounded"
                    >
                        <LuFolder />
                        Add to Outlook Calendar
                    </a>
                </div>
            </div>
        </div>
    );
}
