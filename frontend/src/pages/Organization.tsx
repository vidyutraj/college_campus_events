import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import type { Organization } from "../types";
import EventCard from "../components/cards/EventCard";
import MemberCard from "../components/cards/MemberCard";

export default function Organization() {
    const { org } = useParams<{ org: string }>();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrganization = async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/organizations/${org}/`
                );
                setOrganization(response.data);
                console.log(response);
            } catch (err) {
                setError("Failed to fetch organization.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganization();
    }, [org]);

    if (loading) {
        return <div>Loading organization...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!organization) {
        return <div>Organization not found.</div>;
    }

    return (
        <div className="container mx-auto p-10">
            <div className="mb-6">
                <Link
                    to="/organizations"
                    className="text-primary hover:text-primary-dark"
                >
                    ← Back to Organizations
                </Link>
            </div>
            {!organization.is_verified && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded mb-4">
                    This organization is pending approval.
                </div>
            )}
            <h1 className="text-3xl font-bold mb-6">{organization.name}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <div className="w-32 h-32 mb-6 rounded-full border border-foreground/20">
                    {organization.logo ? (
                        <img
                            className="w-full h-full object-cover rounded-full"
                            src={organization.logo}
                        />
                    ) : (
                        <div className="rounded-full w-full h-full flex justify-center items-center bg-primary text-white text-6xl font-medium">
                            {organization.name[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <p className="text-gray-700 mb-4 whitespace-pre-line">{organization.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organization.email && (
                        <div>
                            <strong>Email:</strong>{" "}
                            <a
                                href={`mailto:${organization.email}`}
                                className="text-primary hover:underline"
                            >
                                {organization.email}
                            </a>
                        </div>
                    )}
                    {organization.website && (
                        <div>
                            <strong>Website:</strong>{" "}
                            <a
                                href={organization.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {organization.website
                                    .replace(/^https?:\/\//, "")
                                    .replace(/\/$/, "")}
                            </a>
                        </div>
                    )}
                    {organization.discord && (
                        <div>
                            <strong>Discord:</strong>{" "}
                            <a
                                href={organization.discord}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {organization.discord}
                            </a>
                        </div>
                    )}
                    {organization.instagram && (
                        <div>
                            <strong>Instagram:</strong>{" "}
                            <a
                                href={
                                    "https://www.instagram.com/" +
                                    organization.instagram
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                @{organization.instagram}
                            </a>
                        </div>
                    )}
                    {organization.linkedin && (
                        <div>
                            <strong>LinkedIn:</strong>{" "}
                            <a
                                href={
                                    "https://www.linkedin.com/company/" +
                                    organization.linkedin
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {organization.linkedin}
                            </a>
                        </div>
                    )}
                    {organization.slack && (
                        <div>
                            <strong>Slack:</strong>{" "}
                            <a
                                href={organization.slack}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                {organization.slack}
                            </a>
                        </div>
                    )}
                    <div>
                        <strong>Members:</strong> {organization.members_count}
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Events</h2>
            {organization.events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organization.events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            hideDetail={true}
                        />
                    ))}
                </div>
            ) : (
                <p>No events found for this organization.</p>
            )}
            <h2 className="text-2xl font-bold mt-6 mb-4">Board Members</h2>
            {organization.members.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
                    {organization.members
                        .filter((member) => member.is_board_member == true)
                        .map((member) => (
                            <MemberCard key={member.user} member={member} />
                        ))}
                </div>
            ) : (
                <p>No events found for this organization.</p>
            )}
        </div>
    );
}
