import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import EventCard from "../components/cards/EventCard";
import type { UserProfile } from "../types";
import { LuMail } from "react-icons/lu";
import OrganizationCard from "../components/cards/OrganizationCard";
import EditProfileModal from "../components/modals/EditProfileModal";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
    const { user } = useAuth();
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(
                    `/api/profiles/${username}/`
                );
                setProfile(response.data);
                console.log(response);
            } catch (err) {
                setError("Failed to fetch profile.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    if (loading) {
        return <div>Loading profile...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!profile) {
        return <div>No profile found.</div>;
    }

    return (
        <div className="p-6 sm:p-10">
            <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-primary flex items-center justify-center">
                {profile.profile_picture ? (
                    <img
                        src={profile.profile_picture}
                        alt="Profile"
                        className="w-full h-full rounded-full"
                    />
                ) : (
                    <p className="text-white text-7xl pointer-events-none select-none">
                        {profile.user.username[0].toUpperCase()}
                    </p>
                )}
            </div>
            <div className="text-center space-y-4">
                <div>
                    <p className="text-foreground/50">
                        @{profile.user.username}
                    </p>
                    <h3 className="font-bold text-2xl">
                        {profile.user.first_name} {profile.user.last_name}
                    </h3>
                    <div className="flex flex-col sm:flex-row w-full justify-center sm:gap-2 text-foreground/80">
                        {profile.pronouns && (
                            <>
                                <p>{profile.pronouns}</p>
                                <span className="hidden sm:inline text-foreground/20">
                                    |
                                </span>
                            </>
                        )}
                        <p>Joined {formatDate(profile.created_at)}</p>
                    </div>
                </div>
                <div className="flex gap-4 justify-center items-center">
                    <a href={`mailto:${profile.user.email}`}>
                        <button
                            className="border border-foreground/20 py-2 px-4 rounded-lg flex items-center gap-2
                                       cursor-pointer hover:bg-foreground/5 transition-all"
                        >
                            <LuMail /> Email
                        </button>
                    </a>
                    {profile.user.username === user?.username && (
                        <button
                            onClick={() => setEditing(true)}
                            className="btn-outline-primary px-4 py-2 rounded-lg"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                {profile.description && (
                    <div className="whitespace-pre-line max-w-2xl m-auto">
                        <p>{profile.description}</p>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-3">
                    Events I&rsquo;m Attending
                </h2>
                {profile.rsvps.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.rsvps.map((rsvp) => (
                            <EventCard
                                key={rsvp.event.id}
                                event={rsvp.event}
                                hideDetail={true}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No events RSVP'd to yet.</p>
                )}
            </div>

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-3">
                    Organizations I Lead
                </h2>
                {profile.organizations_board_member.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {profile.organizations_board_member
                            .filter(
                                (org) => org.organization.is_verified == true
                            )
                            .map((org) => (
                                <OrganizationCard
                                    key={org.id}
                                    org={org.organization}
                                />
                            ))}
                    </div>
                ) : (
                    <p>Not a board member of any organizations.</p>
                )}
            </div>
            {editing && username && (
                <EditProfileModal
                    username={username}
                    profile={profile}
                    setProfile={setProfile}
                    setEditing={setEditing}
                />
            )}
        </div>
    );
}
