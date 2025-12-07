import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Event, Category, Organization } from "../types";

import EventsHeader from "../components/events/EventsHeader";
import EventsFilters from "../components/events/EventsFilters";
import EventsViewSwitcher from "../components/events/EventsViewSwitcher";
import EventsListView from "../components/events/EventsListView";
import EventsCalendarView from "../components/events/EventsCalendarView";

import EventPopup from "../components/modals/EventPopup";

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

interface EventsProps {
    myEventsOnly?: boolean;
}

export default function Events({ myEventsOnly = false }: EventsProps) {
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
    const [view, setView] = useState<"list" | "calendar">("list");
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // --- Load filters from URL ---
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

    // --- Fetch categories and orgs ---
    useEffect(() => {
        axiosInstance.get("/api/categories/").then((res) => {
            setCategories(res.data.results || res.data);
        });
        axiosInstance.get("/api/organizations/").then((res) => {
            setOrganizations(res.data.results || res.data);
        });
    }, []);

    // --- Fetch events ---
    useEffect(() => {
        fetchEventsFromURL();
    }, [location.search, myEventsOnly]);

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

            if (myEventsOnly) {
                params["rsvped_by_user"] = "true";
            }

            const response = await axiosInstance.get("/api/events/", {
                params,
            });
            setEvents(response.data.results || response.data);
            setError(null);
        } catch {
            setError("Failed to load events. Please try again later.");
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
        if (newFilters.search) params.set("search", newFilters.search);

        navigate({ search: params.toString() }, { replace: true });
    };

    const clearFilters = () => navigate({ search: "" }, { replace: true });

    const hasActiveFilters = () =>
        Object.values(filters).some((v) => v !== "" && v !== false);

    // --- Filter approved events ---
    const approvedEvents = events.filter(
        (e) => e.is_approved && e.status === "published"
    );

    return (
        <div className="max-w-7xl mx-auto px-5 py-8">
            <EventsHeader
                myEventsOnly={myEventsOnly}
                showFilters={showFilters}
                toggleFilters={() => setShowFilters(!showFilters)}
                hasActiveFilters={hasActiveFilters()}
            />

            {showFilters && (
                <EventsFilters
                    filters={filters}
                    categories={categories}
                    organizations={organizations}
                    clearFilters={clearFilters}
                    hasActiveFilters={hasActiveFilters()}
                    handleFilterChange={handleFilterChange}
                />
            )}

            <EventsViewSwitcher view={view} setView={setView} />

            {view === "list" ? (
                <EventsListView
                    events={approvedEvents}
                    hasActiveFilters={hasActiveFilters()}
                    loading={loading}
                    error={error}
                />
            ) : (
                <EventsCalendarView
                    events={approvedEvents}
                    setSelectedEvent={setSelectedEvent}
                />
            )}

            {selectedEvent && (
                <EventPopup
                    event={selectedEvent}
                    setSelectedEvent={setSelectedEvent}
                />
            )}
        </div>
    );
}
