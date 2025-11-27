import { useCallback, useEffect, useState, type FormEvent } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import type { Event, Category, Organization } from "../types";
import { AxiosError } from "axios";

interface EventFormValues {
    title: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    startDatetime: string;
    endDatetime: string;
    modality: "in-person" | "online" | "hybrid";
    categoryId: string;
    subcategory: string;
    hostOrganizationId: string;
    hasFreeFood: boolean;
    hasFreeSwag: boolean;
    otherPerks: string;
    employersInAttendance: string;
    status: "draft" | "published" | "cancelled";
    isApproved: boolean;
}

const MODALITY_OPTIONS: Array<{
    value: EventFormValues["modality"];
    label: string;
}> = [
    { value: "in-person", label: "In-Person" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
];

const STATUS_OPTIONS: Array<{
    value: EventFormValues["status"];
    label: string;
}> = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "cancelled", label: "Cancelled" },
];

const EMPTY_FORM: EventFormValues = {
    title: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    startDatetime: "",
    endDatetime: "",
    modality: "in-person",
    categoryId: "",
    subcategory: "",
    hostOrganizationId: "",
    hasFreeFood: false,
    hasFreeSwag: false,
    otherPerks: "",
    employersInAttendance: "",
    status: "draft",
    isApproved: false,
};

function toDateTimeLocal(value?: string | null): string {
    if (!value) {
        return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }
    const offsetMinutes = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offsetMinutes * 60000);
    return localDate.toISOString().slice(0, 16);
}

function toISODateTime(value: string): string | null {
    if (!value) {
        return null;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }
    return date.toISOString();
}

export default function AdminEvents() {
    const { user, loading: authLoading } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<EventFormValues>({
        ...EMPTY_FORM,
    });
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchEvents = useCallback(async () => {
        const response = await axiosInstance.get("/api/events/");
        setEvents(response.data.results || response.data);
    }, []);

    const fetchLookups = useCallback(async () => {
        const [categoriesResponse, organizationsResponse] = await Promise.all([
            axiosInstance.get("/api/categories/"),
            axiosInstance.get("/api/organizations/"),
        ]);
        setCategories(
            categoriesResponse.data.results || categoriesResponse.data
        );
        setOrganizations(
            organizationsResponse.data.results || organizationsResponse.data
        );
    }, []);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        if (!user?.is_staff) {
            setPageLoading(false);
            setPageError("You do not have permission to view this page.");
            return;
        }

        const load = async () => {
            setPageLoading(true);
            setPageError(null);
            try {
                await Promise.all([fetchEvents(), fetchLookups()]);
            } catch (err) {
                console.error("Error loading admin event data:", err);
                setPageError(
                    "Failed to load admin data. Please try again later."
                );
            } finally {
                setPageLoading(false);
            }
        };

        load();
    }, [authLoading, user?.is_staff, fetchEvents, fetchLookups]);

    const resetForm = () => {
        setEditingEventId(null);
        setFormValues({ ...EMPTY_FORM });
        setFormError(null);
    };

    const handleEdit = (event: Event) => {
        setEditingEventId(event.id);
        setFormValues({
            title: event.title || "",
            description: event.description || "",
            location: event.location || "",
            latitude: event.latitude || "",
            longitude: event.longitude || "",
            startDatetime: toDateTimeLocal(event.start_datetime),
            endDatetime: toDateTimeLocal(event.end_datetime),
            modality: event.modality,
            categoryId: event.category ? String(event.category.id) : "",
            subcategory: event.subcategory || "",
            hostOrganizationId: event.host_organization
                ? String(event.host_organization.id)
                : "",
            hasFreeFood: !!event.has_free_food,
            hasFreeSwag: !!event.has_free_swag,
            otherPerks: event.other_perks || "",
            employersInAttendance: event.employers_in_attendance || "",
            status: event.status || "draft",
            isApproved: !!event.is_approved,
        });
        setFormError(null);
        setStatusMessage(null);
    };

    const handleChange = (
        field: keyof EventFormValues,
        value: string | boolean
    ) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setStatusMessage(null);

        if (!formValues.title.trim()) {
            setFormError("Title is required.");
            return;
        }
        if (!formValues.description.trim()) {
            setFormError("Description is required.");
            return;
        }
        if (!formValues.location.trim()) {
            setFormError("Location is required.");
            return;
        }
        if (!formValues.startDatetime) {
            setFormError("Start date and time are required.");
            return;
        }
        if (formValues.endDatetime) {
            const start = new Date(formValues.startDatetime);
            const end = new Date(formValues.endDatetime);
            if (end < start) {
                setFormError("End time must be after the start time.");
                return;
            }
        }

        const payload = {
            title: formValues.title,
            description: formValues.description,
            location: formValues.location,
            latitude: formValues.latitude ? formValues.latitude : null,
            longitude: formValues.longitude ? formValues.longitude : null,
            start_datetime: toISODateTime(formValues.startDatetime),
            end_datetime: formValues.endDatetime
                ? toISODateTime(formValues.endDatetime)
                : null,
            modality: formValues.modality,
            has_free_food: formValues.hasFreeFood,
            has_free_swag: formValues.hasFreeSwag,
            other_perks: formValues.otherPerks,
            category_id: formValues.categoryId
                ? Number(formValues.categoryId)
                : null,
            subcategory: formValues.subcategory,
            host_organization_id: formValues.hostOrganizationId
                ? Number(formValues.hostOrganizationId)
                : null,
            employers_in_attendance: formValues.employersInAttendance,
            status: formValues.status,
            is_approved: formValues.isApproved,
        };

        if (!payload.start_datetime) {
            setFormError(
                "Start date could not be parsed. Please use the selector to choose a date."
            );
            return;
        }

        setSaving(true);
        try {
            if (editingEventId) {
                await axiosInstance.put(
                    `/api/events/${editingEventId}/`,
                    payload
                );
                setStatusMessage("Event updated successfully.");
            } else {
                await axiosInstance.post("/api/events/", payload);
                setStatusMessage("Event created successfully.");
                resetForm();
            }
            await fetchEvents();
        } catch (err: unknown) {
            console.error("Error saving event:", err);
            let apiError = null;

            if (err instanceof AxiosError) {
                apiError =
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.response?.data?.non_field_errors?.[0];
            }
            setFormError(
                apiError ||
                    "Unable to save the event. Please review the details and try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (eventToDelete: Event) => {
        if (
            !window.confirm(
                `Delete "${eventToDelete.title}"? This cannot be undone.`
            )
        ) {
            return;
        }

        setDeletingId(eventToDelete.id);
        setStatusMessage(null);
        setFormError(null);
        try {
            await axiosInstance.delete(`/api/events/${eventToDelete.id}/`);
            setStatusMessage("Event deleted successfully.");
            if (editingEventId === eventToDelete.id) {
                resetForm();
            }
            await fetchEvents();
        } catch (err: unknown) {
            console.error("Error deleting event:", err);
            let apiError = null;

            if (err instanceof AxiosError) {
                apiError =
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    err.response?.data?.non_field_errors?.[0];
            }
            setFormError(
                apiError || "Failed to delete the event. Please try again."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatDateTime = (value?: string | null) => {
        if (!value) {
            return "—";
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleString();
    };

    if (authLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-lg text-gray-600">
                Checking permissions...
            </div>
        );
    }

    if (!user?.is_staff) {
        return (
            <div className="max-w-3xl mx-auto px-5 py-12">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded">
                    You do not have permission to view this page.
                </div>
            </div>
        );
    }

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center py-20 text-lg text-gray-600">
                Loading admin event data...
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Event Administration
                    </h1>
                    <p className="text-gray-600">
                        Manage all events, including drafts and unpublished
                        items.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={resetForm}
                    className="bg-primary text-white px-5 py-2 rounded hover:bg-primary-dark transition-colors"
                >
                    Add New Event
                </button>
            </div>

            {pageError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
                    {pageError}
                </div>
            )}

            {statusMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded">
                    {statusMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Approved
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Starts
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Host
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No events found. Use the form to create
                                        the first event.
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr
                                        key={event.id}
                                        className={
                                            editingEventId === event.id
                                                ? "bg-blue-50/50"
                                                : undefined
                                        }
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {event.title}
                                            {event.category && (
                                                <div className="text-xs text-gray-500">
                                                    {event.category.name}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                                            {event.status || "draft"}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {event.is_approved ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {formatDateTime(
                                                event.start_datetime
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {event.host_organization?.name ||
                                                "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(event)
                                                }
                                                className="text-primary hover:text-primary-dark font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(event)
                                                }
                                                className="text-red-600 hover:text-red-700 font-medium"
                                                disabled={
                                                    deletingId === event.id
                                                }
                                            >
                                                {deletingId === event.id
                                                    ? "Deleting…"
                                                    : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                            {editingEventId ? "Edit Event" : "Create Event"}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {editingEventId
                                ? "Update the event details and save your changes."
                                : "Fill in the details below to create a new event."}
                        </p>
                    </div>

                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                            {formError}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="title"
                            >
                                Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={formValues.title}
                                onChange={(e) =>
                                    handleChange("title", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="description"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={formValues.description}
                                onChange={(e) =>
                                    handleChange("description", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={4}
                                required
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="startDatetime"
                                >
                                    Start Date & Time
                                </label>
                                <input
                                    id="startDatetime"
                                    type="datetime-local"
                                    value={formValues.startDatetime}
                                    onChange={(e) =>
                                        handleChange(
                                            "startDatetime",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="endDatetime"
                                >
                                    End Date & Time
                                </label>
                                <input
                                    id="endDatetime"
                                    type="datetime-local"
                                    value={formValues.endDatetime}
                                    onChange={(e) =>
                                        handleChange(
                                            "endDatetime",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="location"
                                >
                                    Location
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    value={formValues.location}
                                    onChange={(e) =>
                                        handleChange("location", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="modality"
                                >
                                    Modality
                                </label>
                                <select
                                    id="modality"
                                    value={formValues.modality}
                                    onChange={(e) =>
                                        handleChange("modality", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {MODALITY_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="categoryId"
                                >
                                    Category
                                </label>
                                <select
                                    id="categoryId"
                                    value={formValues.categoryId}
                                    onChange={(e) =>
                                        handleChange(
                                            "categoryId",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Uncategorized</option>
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
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="hostOrganizationId"
                                >
                                    Host Organization
                                </label>
                                <select
                                    id="hostOrganizationId"
                                    value={formValues.hostOrganizationId}
                                    onChange={(e) =>
                                        handleChange(
                                            "hostOrganizationId",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Unassigned</option>
                                    {organizations.map((org) => (
                                        <option key={org.id} value={org.id}>
                                            {org.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="subcategory"
                            >
                                Subcategory
                            </label>
                            <input
                                id="subcategory"
                                type="text"
                                value={formValues.subcategory}
                                onChange={(e) =>
                                    handleChange("subcategory", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="latitude"
                                >
                                    Latitude
                                </label>
                                <input
                                    id="latitude"
                                    type="text"
                                    value={formValues.latitude}
                                    onChange={(e) =>
                                        handleChange("latitude", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Optional"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="longitude"
                                >
                                    Longitude
                                </label>
                                <input
                                    id="longitude"
                                    type="text"
                                    value={formValues.longitude}
                                    onChange={(e) =>
                                        handleChange(
                                            "longitude",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="employersInAttendance"
                            >
                                Employers / Companies in Attendance
                            </label>
                            <textarea
                                id="employersInAttendance"
                                value={formValues.employersInAttendance}
                                onChange={(e) =>
                                    handleChange(
                                        "employersInAttendance",
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={2}
                                placeholder="Optional"
                            ></textarea>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-medium text-gray-700 mb-1"
                                htmlFor="otherPerks"
                            >
                                Other Perks
                            </label>
                            <textarea
                                id="otherPerks"
                                value={formValues.otherPerks}
                                onChange={(e) =>
                                    handleChange("otherPerks", e.target.value)
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                rows={2}
                                placeholder="Optional"
                            ></textarea>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={formValues.hasFreeFood}
                                    onChange={(e) =>
                                        handleChange(
                                            "hasFreeFood",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                Free Food
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={formValues.hasFreeSwag}
                                    onChange={(e) =>
                                        handleChange(
                                            "hasFreeSwag",
                                            e.target.checked
                                        )
                                    }
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                Free Swag
                            </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                    htmlFor="status"
                                >
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={formValues.status}
                                    onChange={(e) =>
                                        handleChange("status", e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 mb-1">
                                    <input
                                        type="checkbox"
                                        checked={formValues.isApproved}
                                        onChange={(e) =>
                                            handleChange(
                                                "isApproved",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    Approved
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            {editingEventId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel Edit
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-5 py-2 rounded bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {saving
                                    ? "Saving…"
                                    : editingEventId
                                    ? "Update Event"
                                    : "Create Event"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
