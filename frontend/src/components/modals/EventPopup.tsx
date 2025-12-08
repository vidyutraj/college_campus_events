import type { Dispatch, SetStateAction } from "react";
import type { Event } from "../../types";
import { Link } from "react-router-dom";
import {
    LuChevronsRight,
    LuDoorOpen,
    LuLaptop,
    LuMapPin,
    LuUsers,
    LuX,
} from "react-icons/lu";
import { formatDate, formatModality, formatTime, isSameDate } from "../../utils/events";

interface EventPopupProps {
    event: Event;
    setSelectedEvent: Dispatch<SetStateAction<Event | null>>;
}

export default function EventPopup({
    event,
    setSelectedEvent,
}: EventPopupProps) {
    return (
        <div
            className="z-100 fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
        >
            <div
                className="bg-white rounded-xl w-full max-w-2xl p-0.5 border-foreground/20 border-2 shadow"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative p-5 sm:p-6">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold mb-1">
                            {event.title}
                        </h3>
                        <button
                            onClick={() => setSelectedEvent(null)}
                            className="p-1 sm:p-1.5 -mt-1 -mr-1 text-lg rounded-lg border border-foreground/30 text-foreground/70 hover:bg-gray-100 btn"
                        >
                            <LuX />
                        </button>
                    </div>
                    <div className="space-y-2 text-sm text-foreground/80 mb-4">
                        <p>
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
                        </p>
                        <div>
                        <p className="flex items-center gap-x-2 flex-wrap">
                            <LuMapPin /> {event.location}
                            {event.room && (
                                <>
                                    &nbsp;&nbsp;⋅&nbsp;
                                    <LuDoorOpen />
                                    {formatModality(event.room)}
                                </>
                            )}
                        </p>
                        <p className="flex items-center gap-2 flex-wrap">
                            {event.modality !== "in-person" ? (
                                <LuLaptop />
                            ) : (
                                <LuUsers />
                            )}{" "}
                            {formatModality(event.modality)}
                        </p>
                        </div>
                        {event.host_organization && (
                            <p>
                                <strong>Host:</strong>{" "}
                                {event.host_organization.name}
                            </p>
                        )}
                        <div className="flex gap-2 flex-wrap mt-2">
                            {event.category && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {event.category.name}
                                </span>
                            )}
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
                    </div>
                    <div className="mb-2 font-bold">Event Details</div>
                    <p className="border border-dashed border-foreground/20 rounded p-3 text-gray-700 max-h-50 overflow-y-auto whitespace-pre-line">
                        {event.description}
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                        <Link to={"/events/" + event.id}>
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 rounded-lg btn-secondary flex items-center gap-2 font-medium"
                            >
                                View Event Page <LuChevronsRight />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
