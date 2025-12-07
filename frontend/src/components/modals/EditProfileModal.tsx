import { useState, type Dispatch, type SetStateAction } from "react";
import axiosInstance from "../../utils/axiosConfig";
import type { UserProfile } from "../../types";
import { useAuth } from "../../context/AuthContext";

interface EditProfileModalProps {
    profile: UserProfile;
    username: string;
    setEditing: Dispatch<SetStateAction<boolean>>;
    setProfile: Dispatch<SetStateAction<UserProfile | null>>;
}

export default function EditProfileModal({
    username,
    profile,
    setEditing,
    setProfile,
}: EditProfileModalProps) {
    const { checkAuth } = useAuth();

    const [form, setForm] = useState({
        username: profile.user.username || "",
        first_name: profile.user.first_name || "",
        last_name: profile.user.last_name || "",
        description: profile.description || "",
        pronouns: profile.pronouns || "",
        profile_picture: null as File | null,
    });
    const [saving, setSaving] = useState(false);

    const handleFieldChange = (field: string, value: string | File | null) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append("username", form.username);
            formData.append("first_name", form.first_name);
            formData.append("last_name", form.last_name);
            formData.append("description", form.description);
            formData.append("pronouns", form.pronouns);
            if (form.profile_picture) {
                formData.append("profile_picture", form.profile_picture);
            }

            await axiosInstance.put(
                `/api/profiles/${username}/update/`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            checkAuth();
            alert("Profile updated!");
            setEditing(false);

            const response = await axiosInstance.get(`/api/profiles/${username}/`);
            setProfile(response.data);
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    const inputStyle =
        "w-full rounded-md px-3 py-2 input-gray input-focus-secondary";

    const labelStyle = "flex flex-col gap-1 w-full opacity-80 font-medium";

    return (
        <div className="z-100 fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl p-0.5">
                <div className="relative max-h-[80vh] overflow-y-auto p-10">
                    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

                    <form className="space-y-4" onSubmit={handleSaveProfile}>
                        <label className={labelStyle}>
                            Username *
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) =>
                                    handleFieldChange("username", e.target.value)
                                }
                                className={inputStyle}
                                required
                            />
                        </label>

                        <div className="flex gap-3 w-full">
                            <label className={labelStyle}>
                                First Name *
                                <input
                                    type="text"
                                    value={form.first_name}
                                    onChange={(e) =>
                                        handleFieldChange("first_name", e.target.value)
                                    }
                                    className={inputStyle}
                                    required
                                />
                            </label>

                            <label className={labelStyle}>
                                Last Name *
                                <input
                                    type="text"
                                    value={form.last_name}
                                    onChange={(e) =>
                                        handleFieldChange("last_name", e.target.value)
                                    }
                                    className={inputStyle}
                                    required
                                />
                            </label>
                        </div>

                        <label className={labelStyle}>
                            Pronouns
                            <input
                                type="text"
                                value={form.pronouns}
                                onChange={(e) =>
                                    handleFieldChange("pronouns", e.target.value)
                                }
                                className={inputStyle}
                            />
                        </label>

                        <label className={labelStyle}>
                            Description
                            <textarea
                                value={form.description}
                                onChange={(e) =>
                                    handleFieldChange("description", e.target.value)
                                }
                                className={inputStyle}
                                rows={4}
                            />
                        </label>

                        <label className={labelStyle}>
                            <span className="mb-1">Profile Picture</span>
                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profilePicture"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleFieldChange(
                                            "profile_picture",
                                            e.target.files?.[0] || null
                                        )
                                    }
                                />
                                <label
                                    htmlFor="profilePicture"
                                    className="btn-outline-primary px-4 py-2 rounded"
                                >
                                    Choose File
                                </label>
                                {form.profile_picture && (
                                    <span className="text-gray-700 text-sm">
                                        {form.profile_picture.name}
                                    </span>
                                )}
                            </div>
                        </label>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="px-4 py-2 rounded-lg border hover:bg-gray-100 btn"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="font-medium px-5 py-2 rounded-lg btn-secondary"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
