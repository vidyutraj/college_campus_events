import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import type { Category } from "../types";
import { AxiosError } from "axios";
import FormField from "../components/ui/FormField";
import AddressAutocomplete from "../components/ui/AddressAutocomplete";
import { useAuth } from "../context/AuthContext";

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        room: "",
        address: "",
        latitude: null as number | null,
        longitude: null as number | null,
        startDatetime: "",
        endDatetime: "",
        modality: "in-person",
        hasFreeFood: false,
        hasFreeSwag: false,
        otherPerks: "",
        categoryId: "",
        subcategory: "",
        employersInAttendance: "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { isAuthenticated, loading, organization, isOrganizationLeader } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get("/api/categories/");
                setCategories(data.results);
            } catch {
                setError("Failed to load categories.");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, type, value } = e.target;
        const newValue =
            type === "checkbox" && e.target instanceof HTMLInputElement
                ? e.target.checked
                : value;

        setFormData((prev) => {
            let newState = { ...prev, [name]: newValue };

            if (name === "startDatetime") {
                const newEndDatetime = prev.endDatetime;

                if (!newEndDatetime) {
                    newState = { ...newState, endDatetime: value };
                }
            }

            return newState;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!organization) {
            setError(
                "Authentication error: User is not associated with an organization. Please refresh and try again."
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                room: formData.room,
                address: formData.address,
                latitude: formData.latitude,
                longitude: formData.longitude,
                start_datetime: formData.startDatetime,
                end_datetime: formData.endDatetime,
                modality: formData.modality,
                has_free_food: formData.hasFreeFood,
                has_free_swag: formData.hasFreeSwag,
                other_perks: formData.otherPerks,
                category_id: formData.categoryId,
                subcategory: formData.subcategory,
                employers_in_attendance: formData.employersInAttendance,
                host_organization: organization,
            };

            if (payload.start_datetime > payload.end_datetime) {
                setError(
                    "Start date and time must be before end date and time."
                );
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const { data } = await axios.post("/api/events/", payload);
            setSuccess("Event created successfully!");
            navigate(`/events/${data.id}`);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof AxiosError && err.response?.data) {
                setError(err.response.data.detail || "Failed to create event.");
            } else {
                setError("Failed to create event. Please try again.");
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (loading) {
        return <div className="container mx-auto p-4">Loading authentication status...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p>You must be logged in to create an event.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Login
                </button>
            </div>
        );
    }
    if (!isOrganizationLeader) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p>You must be logged in as a user associated with an organization to create an event.</p>
                <button
                    onClick={() => navigate("/events")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    View Events
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Event</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
                    {error}
                </div>
            )}
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    textarea
                    required
                />

                <AddressAutocomplete
                    value={{
                        location: formData.location,
                        address: formData.address,
                        lat: formData.latitude,
                        lng: formData.longitude,
                    }}
                    onSelect={({ location, address, lat, lng }) => {
                        setFormData((prev) => ({
                            ...prev,
                            location,
                            address,
                            latitude: lat,
                            longitude: lng,
                        }));
                    }}
                />

                <FormField
                    label="Room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                />

                <FormField
                    label="Start Date & Time"
                    name="startDatetime"
                    type="datetime-local"
                    value={formData.startDatetime}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="End Date & Time"
                    name="endDatetime"
                    type="datetime-local"
                    value={formData.endDatetime}
                    onChange={handleChange}
                    required
                />

                <FormField
                    label="Modality"
                    name="modality"
                    value={formData.modality}
                    onChange={handleChange}
                    options={[
                        { value: "in-person", label: "In-Person" },
                        { value: "online", label: "Online" },
                        { value: "hybrid", label: "Hybrid" },
                    ]}
                    required
                />

                <FormField
                    label="Has Free Food"
                    name="hasFreeFood"
                    type="checkbox"
                    value={formData.hasFreeFood}
                    onChange={handleChange}
                />
                <FormField
                    label="Has Free Swag"
                    name="hasFreeSwag"
                    type="checkbox"
                    value={formData.hasFreeSwag}
                    onChange={handleChange}
                />

                <FormField
                    label="Other Perks"
                    name="otherPerks"
                    value={formData.otherPerks}
                    onChange={handleChange}
                />
                <FormField
                    label="Category"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                    options={categories.map((c) => ({
                        value: c.id.toString(),
                        label: c.name,
                    }))}
                />
                <FormField
                    label="Subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                />
                <FormField
                    label="Employers in Attendance"
                    name="employersInAttendance"
                    value={formData.employersInAttendance}
                    onChange={handleChange}
                />

                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Create Event
                </button>
            </form>
        </div>
    );
}
