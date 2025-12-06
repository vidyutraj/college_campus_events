import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event, Category, Organization } from "../types";
import EventCard from "../components/events/EventCard";

interface Filters {
    category: string;
    organization: string;
    modality: string;
    hasFreeFood: boolean;
    hasFreeSwag: boolean;
    startDate: string;
    endDate: string;
    search: string;
}

export default function Events() {
    const navigate = useNavigate();
    const location = useLocation();

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
        search: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initialize filters from URL query params
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        setFilters({
            category: searchParams.get("category") || "",
            organization: searchParams.get("organization") || "",
            modality: searchParams.get("modality") || "",
            hasFreeFood: searchParams.get("has_free_food") === "true",
            hasFreeSwag: searchParams.get("has_free_swag") === "true",
            startDate: searchParams.get("start_date") || "",
            endDate: searchParams.get("end_date") || "",
            search: searchParams.get("search") || "",
        });
    }, [location.search]);

    useEffect(() => {
        fetchCategories();
        fetchOrganizations();
    }, []);

    useEffect(() => {
        fetchEventsFromURL();
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/api/categories/");
            setCategories(response.data.results || response.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const response = await axiosInstance.get("/api/organizations/");
            setOrganizations(response.data.results || response.data);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };

    const fetchEventsFromURL = async () => {
        try {
            setLoading(true);
            const searchParams = new URLSearchParams(location.search);
            const params: Record<string, string> = {
                is_approved: "true",
                status: "published",
            };

            searchParams.forEach((value, key) => {
                params[key] = value;
            });

            const response = await axiosInstance.get("/api/events/", {
                params,
            });
            setEvents(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError("Failed to load events. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (
        filterName: keyof Filters,
        value: string | boolean
    ) => {
        const newFilters = { ...filters, [filterName]: value };
        setFilters(newFilters);

        const params = new URLSearchParams();

        if (newFilters.category) params.set("category", newFilters.category);
        if (newFilters.organization)
            params.set("organization", newFilters.organization);
        if (newFilters.modality) params.set("modality", newFilters.modality);
        if (newFilters.hasFreeFood) params.set("has_free_food", "true");
        if (newFilters.hasFreeSwag) params.set("has_free_swag", "true");
        if (newFilters.startDate)
            params.set("start_date", newFilters.startDate);
        if (newFilters.endDate) params.set("end_date", newFilters.endDate);
        if (newFilters.search) params.set("end_date", newFilters.search);

        navigate({ search: params.toString() }, { replace: true });
    };

    const clearFilters = () => {
        navigate({ search: "" }, { replace: true });
    };

    const hasActiveFilters = () => {
        return (
            filters.category ||
            filters.organization ||
            filters.modality ||
            filters.hasFreeFood ||
            filters.hasFreeSwag ||
            filters.startDate ||
            filters.endDate ||
            filters.search
        );
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
                    className="btn-primary px-6 py-2 rounded-full relative"
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
                    {events
                        .filter(
                            (event) =>
                                event.is_approved &&
                                event.status === "published"
                        )
                        .map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                </div>
            )}
        </div>
    );
}
