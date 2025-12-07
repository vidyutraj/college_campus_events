import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import type { Event } from "../types";
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Link } from "react-router-dom";

export default function EventsMap() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {
                is_approved: "true",
                status: "published",
            };

            const response = await axiosInstance.get("/api/events/", {
                params,
            });
            setEvents(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError("Error fetching events. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading && events.length === 0) {
        return (
            <div className="flex justify-center items-center py-20 text-xl text-gray-600">
                Loading events...
            </div>
        );
    }

    if (error && events.length === 0) {
        return (
            <div className="flex justify-center items-center py-20 text-xl text-red-600">
                {error}
            </div>
        );
    }

    const defaultCenter = { lat: 33.7765, lng: -84.398 };

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}>
            <Map
                defaultCenter={defaultCenter}
                defaultZoom={16}
                style={{ width: "100%", height: "calc(100vh - 64px)" }}
            >
                {events.map(event => {
                    if (!event.latitude || !event.longitude) return null;

                    const position = {
                        lat: Number(event.latitude),
                        lng: Number(event.longitude),
                    };

                    return (
                        <Marker
                            key={event.id}
                            position={position}
                            title={event.title}
                            onClick={() => setSelectedEvent(event)}
                        />
                    );
                })}

                {selectedEvent && selectedEvent.latitude && selectedEvent.longitude && (
                    <InfoWindow
                        position={{
                            lat: Number(selectedEvent.latitude),
                            lng: Number(selectedEvent.longitude),
                        }}
                        onCloseClick={() => setSelectedEvent(null)}
                        className="w-80 font-inter"
                        headerContent={<h3 className="text-xl font-bold">{selectedEvent.title}</h3>}

                    >
                        <p className="mb-2">Date/Time: {formatDate(selectedEvent.start_datetime)}</p>
                        <p className="text-gray-700 line-clamp-3 text-base">{selectedEvent.description}</p>
                        <div className="text-primary font-medium text-sm mt-3"><Link to={"/events/" + selectedEvent.id} >View Event Page {'>>'}</Link></div>
                    </InfoWindow>
                )}
            </Map>
        </APIProvider>
    );
}