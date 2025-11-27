import { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import FormField from "../components/ui/FormField";
import { useAuth } from "../context/AuthContext";

type Frequency = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";

export default function CreateMeeting() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        room: "",
        organizationId: "",
        frequency: "WEEKLY" as Frequency,
        interval: 1,
        byWeekday: [] as string[],
        firstDate: "", // first occurrence date
        lastDate: "", // last occurrence date
        startTime: "", // time of day for each occurrence
        endTime: "", // time of day for each occurrence
        exceptions: [] as string[], // yyyy-mm-dd
        overrides: [] as {
            original_date: string;
            overridden_date?: string;
            overridden_start_time?: string;
            overridden_end_time?: string;
            overridden_location?: string;
            overridden_room?: string;
        }[],
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [organizationOptions, setOrganizationOptions] = useState<
        { id: string; name: string }[]
    >([]);
    const navigate = useNavigate();
    const {
        isAuthenticated,
        loading,
        boardMemberOrgs: authOrganization,
    } = useAuth();

    const WEEKDAYS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

    useEffect(() => {
        if (authOrganization) {
            setOrganizationOptions(
                authOrganization.map((org) => ({
                    id: org.id.toString(),
                    name: org.name,
                }))
            );
        }
    }, [authOrganization]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value, type } = e.target;
        const newValue =
            type === "checkbox" && e.target instanceof HTMLInputElement
                ? e.target.checked
                : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleWeekdayToggle = (day: string) => {
        setFormData((prev) => {
            const byWeekday = prev.byWeekday.includes(day)
                ? prev.byWeekday.filter((d) => d !== day)
                : [...prev.byWeekday, day];
            return { ...prev, byWeekday };
        });
    };

    const handleAddException = () => {
        setFormData((prev) => ({
            ...prev,
            exceptions: [...prev.exceptions, ""],
        }));
    };

    const handleExceptionChange = (index: number, value: string) => {
        setFormData((prev) => {
            const exceptions = [...prev.exceptions];
            exceptions[index] = value;
            return { ...prev, exceptions };
        });
    };

    const handleRemoveException = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            exceptions: prev.exceptions.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.organizationId) {
            setError("Please select an organization.");
            return;
        }

        if (
            !formData.firstDate ||
            !formData.lastDate ||
            !formData.startTime ||
            !formData.endTime
        ) {
            setError("Please fill all date and time fields.");
            return;
        }

        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                room: formData.room,
                organization: formData.organizationId,
                frequency: formData.frequency,
                interval: formData.interval,
                byweekday: formData.byWeekday,
                start_date: formData.firstDate,
                until: formData.lastDate,
                start_time: formData.startTime,
                end_time: formData.endTime,
                exceptions: formData.exceptions.filter((d) => d),
                overrides: formData.overrides.filter((o) => o.original_date),
            };

            const { data } = await axios.post("/api/meetings/", payload);
            setSuccess("Meeting created successfully!");
            // navigate(
            //     `/organizations/${formData.organizationId}/meetings/${data.id}`
            // );
            navigate(
                "/meetings"
            );
        } catch (err: unknown) {
            setError("Failed to create meeting. Please try again.");
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated)
        return <div>You must be logged in to create a meeting.</div>;

    return (
        <div className="container mx-auto p-10">
            <h1 className="text-3xl font-bold mb-4">Create New Meeting</h1>

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
                    label="Organization"
                    name="organizationId"
                    value={formData.organizationId}
                    onChange={handleChange}
                    options={organizationOptions.map((o) => ({
                        value: o.id,
                        label: o.name,
                    }))}
                    required
                />

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
                />
                <FormField
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                <FormField
                    label="Room"
                    name="room"
                    value={formData.room}
                    onChange={handleChange}
                />

                <FormField
                    label="First Occurrence Date"
                    name="firstDate"
                    type="date"
                    value={formData.firstDate}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Last Occurrence Date"
                    name="lastDate"
                    type="date"
                    value={formData.lastDate}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="Start Time"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                />
                <FormField
                    label="End Time"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                />

                <FormField
                    label="Recurrence Frequency"
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    options={[
                        { value: "DAILY", label: "Daily" },
                        { value: "WEEKLY", label: "Weekly" },
                        { value: "MONTHLY", label: "Monthly" },
                        { value: "YEARLY", label: "Yearly" },
                    ]}
                />

                <FormField
                    label="Interval"
                    name="interval"
                    type="number"
                    value={formData.interval}
                    onChange={handleChange}
                />

                {formData.frequency === "WEEKLY" && (
                    <div>
                        <label className="block font-medium mb-1">
                            Select Weekdays:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {WEEKDAYS.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => handleWeekdayToggle(day)}
                                    className={`px-3 py-1 rounded border ${
                                        formData.byWeekday.includes(day)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100"
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Exceptions */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">
                        Exception Dates
                    </label>
                    {formData.exceptions.map((date, i) => (
                        <div key={i} className="flex gap-2 mb-2 items-center">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) =>
                                    handleExceptionChange(i, e.target.value)
                                }
                                className="border p-1 rounded"
                            />
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => handleRemoveException(i)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddException}
                        className="text-blue-500"
                    >
                        Add Exception
                    </button>
                </div>

                {/* Overrides */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Overrides</label>
                    {formData.overrides.map((override, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-2 border p-2 rounded mb-2"
                        >
                            <div className="flex gap-2 items-center">
                                <label className="w-32">Original Date:</label>
                                <input
                                    type="date"
                                    value={override.original_date}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].original_date =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    className="text-red-500"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: prev.overrides.filter(
                                                (_, idx) => idx !== i
                                            ),
                                        }))
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <label className="w-32">Overridden Date:</label>
                                <input
                                    type="date"
                                    value={override.overridden_date || ""}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].overridden_date =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="w-32">Start Time:</label>
                                <input
                                    type="time"
                                    value={override.overridden_start_time || ""}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].overridden_start_time =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                />
                                <label className="w-32">End Time:</label>
                                <input
                                    type="time"
                                    value={override.overridden_end_time || ""}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].overridden_end_time =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <label className="w-32">Location:</label>
                                <input
                                    className="input-gray"
                                    type="text"
                                    value={override.overridden_location || ""}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].overridden_location =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                />
                                <label className="w-32">Room:</label>
                                <input
                                    className="input-gray"
                                    type="text"
                                    value={override.overridden_room || ""}
                                    onChange={(e) => {
                                        const newOverrides = [
                                            ...formData.overrides,
                                        ];
                                        newOverrides[i].overridden_room =
                                            e.target.value;
                                        setFormData((prev) => ({
                                            ...prev,
                                            overrides: newOverrides,
                                        }));
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                overrides: [
                                    ...prev.overrides,
                                    {
                                        original_date: "",
                                        overridden_date: "",
                                        overridden_start_time: "",
                                        overridden_end_time: "",
                                        overridden_location: "",
                                        overridden_room: "",
                                    },
                                ],
                            }))
                        }
                        className="text-blue-500"
                    >
                        Add Override
                    </button>
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full py-2 px-4 font-medium rounded-md btn-secondary"
                >
                    Create Meeting
                </button>
            </form>
        </div>
    );
}
