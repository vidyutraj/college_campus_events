import { useState, useEffect } from "react";
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
    use_existing_account?: boolean;
}

function RegisterOrganization() {
    const navigate = useNavigate();
    const { isAuthenticated, userType } = useAuth();

    const [useExistingAccount, setUseExistingAccount] = useState(false);

    const [formData, setFormData] = useState<OrganizationFormData>({
        organization_name: "",
        organization_description: "",
        user_username: "",
        user_email: "",
        user_password: "",
        user_password_confirm: "",
        user_first_name: "",
        user_last_name: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated && userType === "organization_leader") {
            navigate("/leader/dashboard");
        }
    }, [isAuthenticated, userType, navigate]);

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

    const toggleExistingAccount = () => {
        setUseExistingAccount((prev) => {
            const newState = !prev;
            if (newState) {
                setFormData((prevData) => ({
                    ...prevData,
                    user_password: "",
                    user_password_confirm: "",
                    user_first_name: "",
                    user_last_name: "",
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    user_password: "",
                    user_password_confirm: "",
                }));
            }
            return newState;
        });
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

        // ✅ If user is authenticated and using existing account, skip user validation
        if (!isAuthenticated) {
            if (!formData.user_username?.trim()) {
                setError("Username is required.");
                setLoading(false);
                return;
            }
            if (!formData.user_password || formData.user_password.length < 8) {
                setError("Password is required.");
                setLoading(false);
                return;
            }
            if (!useExistingAccount) {
                // New account creation
                if (!formData.user_email?.trim()) {
                    setError("Email is required.");
                    setLoading(false);
                    return;
                }

                if (formData.user_password !== formData.user_password_confirm) {
                    setError("Passwords do not match.");
                    setLoading(false);
                    return;
                }
            }
        }
        // --- End Validation ---

        try {
            const payload: OrganizationFormData = {
                ...formData,
                use_existing_account: useExistingAccount,
            };

            if (isAuthenticated && useExistingAccount) {
                delete payload.user_username;
                delete payload.user_password;
                delete payload.user_password_confirm;
                delete payload.user_first_name;
                delete payload.user_last_name;
                delete payload.user_email;
            }

            const response = await axiosInstance.post(
                `/api/organizations/register/`,
                payload
            );

            if (!isAuthenticated) {
                alert(
                    `${
                        response.data.message ||
                        "Organization registered successfully!"
                    }\n\n` + `Please sign in with your user credentials.`
                );
                navigate("/login");
            } else {
                alert(
                    `${
                        response.data.message ||
                        "Organization registered successfully!"
                    }`
                );
                navigate("/events");
            }
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    if (userType === "organization_leader") {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-12 bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Register Your Organization
                </h2>
                <p className="text-gray-600 mb-4">
                    Register your student organization or club to start posting
                    events
                </p>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm mb-6 text-sm text-blue-800">
                    <p className="mb-2">
                        Register your student organization to start posting
                        events.
                    </p>
                    {useExistingAccount ? (
                        <p>
                            {isAuthenticated
                                ? "You are signed in. Your current account will be linked to this organization."
                                : "Enter your existing student account credentials to link it with this organization."}
                        </p>
                    ) : (
                        <p>
                            Create a new account for this organization’s
                            management.
                        </p>
                    )}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-sm mb-4">
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
                            className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
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
                            className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Account Details Section */}
                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Your Account
                        </h3>

                        {!isAuthenticated && (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-sm border border-gray-200 mb-4">
                                <span className="text-sm font-medium text-gray-700">
                                    I want to link my existing account
                                </span>
                                <label
                                    htmlFor="toggle-existing"
                                    className="relative inline-flex items-center cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        id="toggle-existing"
                                        checked={useExistingAccount}
                                        onChange={toggleExistingAccount}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        )}

                        {/* ✅ Conditional UI Logic */}

                        {/* If linking existing and authenticated → no fields */}
                        {isAuthenticated && (
                            <p className="text-sm text-gray-700 mb-4">
                                You are already logged in. This organization
                                will be linked to your account.
                            </p>
                        )}
                        {!isAuthenticated && (
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="user_username"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Username *
                                    </label>
                                    <input
                                        type="text"
                                        id="user_username"
                                        name="user_username"
                                        value={formData.user_username || ""}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                {!useExistingAccount && (
                                    // Otherwise → new account creation
                                    <>
                                        <div>
                                            <label
                                                htmlFor="user_email"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="user_email"
                                                name="user_email"
                                                value={
                                                    formData.user_email || ""
                                                }
                                                onChange={handleChange}
                                                required
                                                className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="user_first_name"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    First Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="user_first_name"
                                                    value={
                                                        formData.user_first_name ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-sm px-4 py-2 w-full"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="user_last_name"
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Last Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="user_last_name"
                                                    value={
                                                        formData.user_last_name ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                    className="border border-gray-300 rounded-sm px-4 py-2 w-full"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label
                                        htmlFor="user_password"
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        name="user_password"
                                        value={formData.user_password || ""}
                                        onChange={handleChange}
                                        required
                                        minLength={8}
                                        className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                {!useExistingAccount && (
                                    <div>
                                        <label
                                            htmlFor="user_password_confirm"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            Confirm Password *
                                        </label>
                                        <input
                                            type="password"
                                            name="user_password_confirm"
                                            value={
                                                formData.user_password_confirm ||
                                                ""
                                            }
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                            className="w-full border border-gray-300 rounded-sm px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default RegisterOrganization;
