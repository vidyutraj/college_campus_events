import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { AxiosError } from "axios";

interface OrganizationFormData {
    organization_name: string;
    organization_description: string;
    user_username?: string;
    user_email?: string;
    user_password?: string;
    user_password_confirm?: string;
    user_first_name?: string;
    user_last_name?: string;
}

export default function RegisterOrganization() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<OrganizationFormData>({
        organization_name: "",
        organization_description: "",
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
        if (!formData.organization_name?.trim()) {
            setError("Organization name is required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/api/organizations/register/`,
                formData
            );

            alert(
                `${
                    response.data.message ||
                    "Organization registered successfully!"
                }`
            );
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
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <p>You must be logged in to create an organization.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-xs text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Login
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-2xl">
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
                            htmlFor="organization_name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Organization Name *
                        </label>
                        <input
                            type="text"
                            id="organization_name"
                            name="organization_name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Computer Science Club"
                            maxLength={200}
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="organization_description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="organization_description"
                            name="organization_description"
                            value={formData.organization_description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Tell us about your organization..."
                            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full bg-secondary text-white py-3 rounded-full font-medium hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Registering..." : "Register Organization"}
                    </button>
                </form>

                {!isAuthenticated && (
                    <div className="mt-6 text-center text-sm text-gray-600">
                        <p>
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary-dark font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
