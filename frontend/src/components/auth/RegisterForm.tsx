import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { isAxiosError } from "axios";

export default function RegisterForm() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        password_confirm: "",
        first_name: "",
        last_name: "",
        name: "",
        description: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const scrollToTop = () => {
        const container = document.getElementById("left-scroll-container");
        container?.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.password_confirm) {
            setError("Passwords do not match.");
            setLoading(false);
            scrollToTop();
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long.");
            setLoading(false);
            scrollToTop();
            return;
        }

        try {
            const response = await axiosInstance.post(
                "/api/auth/register/",
                formData
            );
            authLogin(response.data.user);
            navigate("/events");
        } catch (err: unknown) {
            if (isAxiosError(err) && err.response?.data) {
                const errorData = err.response?.data;

                const errorMessages: string[] = [];
                Object.keys(errorData).forEach((key) => {
                    if (Array.isArray(errorData[key])) {
                        errorMessages.push(`${errorData[key][0]}`);
                    } else {
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
            scrollToTop();
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full input-gray rounded-lg px-4 py-2 input-focus-primary";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-2"

    return (
        <div className="max-w-lg w-full">
            <h2 className="text-3xl font-bold mb-2">Create Student Account</h2>
            <p className="text-foreground/80 mb-6">
                Sign up to browse and RSVP to campus events
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label
                            htmlFor="username"
                            className={labelStyle}
                        >
                            Username *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className={labelStyle}
                        >
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className={inputStyle}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="first_name"
                            className={labelStyle}
                        >
                            First Name *
                        </label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            autoComplete="given-name"
                            required
                            className={inputStyle}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="last_name"
                            className={labelStyle}
                        >
                            Last Name *
                        </label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            autoComplete="family-name"
                            required
                            className={inputStyle}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="password"
                            className={labelStyle}
                        >
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className={inputStyle}
                        />
                        <small className="text-gray-500 text-xs mt-1 block">
                            Must be at least 8 characters
                        </small>
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirm"
                            className={labelStyle}
                        >
                            Confirm Password *
                        </label>
                        <input
                            type="password"
                            id="password_confirm"
                            name="password_confirm"
                            value={formData.password_confirm}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className={inputStyle}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full btn-secondary py-3 rounded-full font-medium"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>
            </form>

            <div className="mt-6 text-center space-y-2 text-sm">
                <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
