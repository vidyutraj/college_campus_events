import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import type { Organization } from "../types";
import OrganizationCard from "../components/cards/OrganizationCard";

export default function Organizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/api/organizations/");
            setOrganizations(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError("Error fetching organizations. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && organizations.length === 0) {
        return (
            <div className="flex justify-center items-center py-20 text-xl text-gray-600">
                Loading organizations...
            </div>
        );
    }

    if (error && organizations.length === 0) {
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
                    Organizations
                </h2>
            </div>

            {organizations.length === 0 ? (
                <div className="text-center py-20 text-foreground/80 text-xl">
                    No organizations found.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {organizations
                        .map((org) => (
                            <OrganizationCard key={org.id} org={org} />
                        ))}
                </div>
            )}
        </div>
    );
}
