import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event, Category, Organization } from "../types";

const API_BASE_URL = "/api/events/";
const CATEGORIES_URL = "/api/categories/";
const ORGANIZATIONS_URL = "/api/organizations/";

interface Filters {
    category: string;
    organization: string;
    modality: string;
    hasFreeFood: boolean;
    hasFreeSwag: boolean;
    startDate: string;
    endDate: string;
}

export default function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filters, setFilters] = useState<Filters>({
        category: "",
        organization: "",
        modality: "",
        hasFreeFood: false,
        hasFreeSwag: false,
        startDate: "",
        endDate: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleEventClick = (eventId: number) => {
        navigate(`/events/${eventId}`);
    };

    useEffect(() => {
        fetchCategories();
        fetchOrganizations();
        fetchEvents();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(CATEGORIES_URL);
            setCategories(response.data.results || response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const response = await axiosInstance.get(ORGANIZATIONS_URL);
            setOrganizations(response.data.results || response.data);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};

            if (filters.category) {
                params.category = filters.category;
            }
            if (filters.organization) {
                params.host_organization = filters.organization;
            }
            if (filters.modality) {
                params.modality = filters.modality;
            }
            if (filters.hasFreeFood) {
                params.has_free_food = "true";
            }
            if (filters.hasFreeSwag) {
                params.has_free_swag = "true";
            }
            if (filters.startDate) {
                params.start_date = filters.startDate;
            }
            if (filters.endDate) {
                params.end_date = filters.endDate;
            }

            const response = await axiosInstance.get(API_BASE_URL, { params });
            setEvents(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError("Failed to load events. Please try again later.");
            console.error("Error fetching events:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (
        filterName: keyof Filters,
        value: string | boolean
    ) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            organization: "",
            modality: "",
            hasFreeFood: false,
            hasFreeSwag: false,
            startDate: "",
            endDate: "",
        });
    };

    const hasActiveFilters = () => {
        return (
            filters.category ||
            filters.organization ||
            filters.modality ||
            filters.hasFreeFood ||
            filters.hasFreeSwag ||
            filters.startDate ||
            filters.endDate
        );
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

    return (
        <div className="max-w-7xl mx-auto px-5 py-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-gray-800">
                    Upcoming Events
                </h2>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="cursor-pointer bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition-colors relative"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                    {hasActiveFilters() && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label
                                htmlFor="category-filter"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Category:
                            </label>
                            <select
                                id="category-filter"
                                value={filters.category}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "category",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="organization-filter"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Host Organization:
                            </label>
                            <select
                                id="organization-filter"
                                value={filters.organization}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "organization",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Organizations</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="modality-filter"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Modality:
                            </label>
                            <select
                                id="modality-filter"
                                value={filters.modality}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "modality",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                            >
                                <option value="">All Types</option>
                                <option value="in-person">In-Person</option>
                                <option value="online">Online</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="start-date-filter"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Start Date:
                            </label>
                            <input
                                type="date"
                                id="start-date-filter"
                                value={filters.startDate}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "startDate",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="end-date-filter"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                End Date:
                            </label>
                            <input
                                type="date"
                                id="end-date-filter"
                                value={filters.endDate}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "endDate",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Perks:
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.hasFreeFood}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "hasFreeFood",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">
                                        🍕 Free Food
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.hasFreeSwag}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "hasFreeSwag",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">
                                        🎁 Free Swag
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {hasActiveFilters() && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                                onClick={clearFilters}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            )}

            {hasActiveFilters() && !showFilters && (
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6 text-blue-800">
                    Filters active: {events.length} event
                    {events.length !== 1 ? "s" : ""} found
                </div>
            )}

            {events.length === 0 ? (
                <div className="text-center py-20 text-foreground/80 text-xl">
                    {hasActiveFilters()
                        ? "No events found matching your filters."
                        : "No upcoming events at this time."}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
                            onClick={() => handleEventClick(event.id)}
                        >
                            <h3 className="text-xl font-bold mb-3">
                                {event.title}
                            </h3>
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
                                        <strong>Category:</strong>{" "}
                                        {event.category.name}
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
                                    {event.rsvp_count || 0} RSVPs
                                </p>
                            </div>
                            <p className="text-gray-700 line-clamp-3">
                                {event.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
