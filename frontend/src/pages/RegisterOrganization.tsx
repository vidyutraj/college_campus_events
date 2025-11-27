import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

interface OrganizationFormData {
    name: string;
    description: string;
}

export default function RegisterOrganization() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<OrganizationFormData>({
        name: "",
        description: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // --- Validation ---
        if (!formData.name?.trim()) {
            setError("Organization name is required.");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post("/api/organizations/", formData);

            alert("Organization registered successfully and is now pending approval.");
            navigate("/events");
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof AxiosError && err.response?.data) {
                const errorData = err.response?.data;
                const errorMessages: string[] = [];
                Object.keys(errorData).forEach((key) => {
                    if (Array.isArray(errorData[key])) {
                        errorMessages.push(`${key}: ${errorData[key][0]}`);
                    } else if (typeof errorData[key] === "string") {
                        errorMessages.push(errorData[key]);
                    }
                });
                setError(
                    errorMessages.join(". ") ||
                        "Registration failed. Please try again."
                );
            } else {
                setError("Registration failed. Please try again.");
            }
            const container = document.getElementById("right-scroll-container");
            container?.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-10">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p>You must be logged in to create an organization.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 py-2 px-4 font-medium rounded-md btn-secondary"
                >
                    Login
                </button>
            </div>
        );
    }

    return (

            <div className="p-10">
                <h2 className="text-3xl font-bold mb-2">
                    Register Your Organization
                </h2>
                <p className="text-foreground/80 mb-4">
                    Register your student organization or club to start posting
                    events
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Organization Fields */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Organization Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Computer Science Club"
                            maxLength={200}
                            className="w-full input-gray rounded-md px-4 py-2 input-focus-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={8}
                            placeholder="Tell us about your organization..."
                            className="w-full input-gray rounded-md px-4 py-2 input-focus-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary px-4 py-2 rounded-md font-medium"
                    >
                        {loading ? "Registering..." : "Register Organization"}
                    </button>
                </form>
            </div>
    );
}
