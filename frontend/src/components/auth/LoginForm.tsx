import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { isAxiosError } from "axios";

interface LoginErrorResponse {
    non_field_errors?: string[];
}

export default function LoginForm() {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post(
                `/api/auth/login/`,
                formData
            );

            authLogin(
                response.data.user,
                response.data.organizations
            );

            navigate("/events");

        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const data = err.response?.data as LoginErrorResponse;
                setError(
                    data?.non_field_errors?.[0] ||
                        "Invalid username or password."
                );
            } else {
                setError("An unexpected error occurred. Please try again.")
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg w-full">
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="opacity-70 mb-6">Sign in with your user account</p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="username"
                        className="block text-sm font-medium mb-2"
                    >
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        placeholder="Enter your username"
                        className="bg-white w-full border border-gray-300 rounded-lg px-5 py-3 focus:outline-hidden focus:border-secondary focus:ring-3 focus:ring-secondary/20"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        className="bg-white w-full border border-gray-300 rounded-lg px-5 py-3 focus:outline-hidden focus:border-secondary focus:ring-3 focus:ring-secondary/20"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-3 cursor-pointer w-full bg-secondary text-white py-3 rounded-full font-medium      hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="mt-6 text-center space-y-2 text-sm">
                <p className="text-foreground/85">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary hover:text-primary-dark font-medium"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
