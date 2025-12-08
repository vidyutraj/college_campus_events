import { Link } from "react-router-dom";
import type { Event } from "../../types";
import { formatModality, formatDate, formatTime, isSameDate } from "../../utils/events";
import {
    LuBookUser,
    LuBuilding,
    LuCalendar,
    LuDoorOpen,
    LuLaptop,
    LuMapPin,
    LuUser,
} from "react-icons/lu";

interface EventInformationProps {
    event: Event;
}

export default function EventInformation({ event }: EventInformationProps) {
    console.log(event);
    return (
        <>
            {/* Event Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs">
                <h2 className="text-2xl font-bold mb-4">Event Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                            <LuCalendar /> Date & Time
                        </span>
                        <div className="text-gray-800">
                            <strong>
                                {formatDate(event.start_datetime)}
                                {event.end_datetime && (
                                    <>
                                        {" "}
                                        to{" "}
                                        {isSameDate(
                                            event.start_datetime,
                                            event.end_datetime
                                        )
                                            ? formatTime(event.end_datetime)
                                            : formatDate(event.end_datetime)}
                                    </>
                                )}
                            </strong>
                        </div>
                    </div>

                    <div>
                        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                            <LuMapPin /> Location
                        </span>
                        <div className="text-gray-800">{event.location}</div>
                    </div>

                    {event.room && (
                        <div>
                            <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                                <LuDoorOpen /> Room
                            </span>
                            <div className="text-gray-800">{event.room}</div>
                        </div>
                    )}

                    <div>
                        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                            <LuLaptop /> Modality
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
                            {formatModality(event.modality)}
                        </span>
                    </div>

                    {event.host_organization && (
                        <div>
                            <span className="flex items-center gap-1 font-medium text-gray-500 mb-1">
                                <LuBuilding /> Host Organization
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
                            <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                                <LuUser /> Host
                            </span>
                            <div className="text-gray-800">
                                {event.host_user}
                            </div>
                        </div>
                    )}

                    <div>
                        <span className="flex items-center gap-1 text-sm font-medium text-gray-500 mb-1">
                            <LuBookUser /> RSVPs
                        </span>
                        <div className="font-medium">
                            {event.rsvp_users.length || 0}{" "}
                            {event.rsvp_users.length == 1 ? "person" : "people"}{" "}
                            RSVPed
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
                                <span className="text-gray-700">Free Food</span>
                            </div>
                        )}
                        {event.has_free_swag && (
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🎁</span>
                                <span className="text-gray-700">Free Swag</span>
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
        </>
    );
}
