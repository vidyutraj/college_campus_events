import { LuClipboardList, LuPencil } from "react-icons/lu";
import type { Event } from "../../types";
import EventRSVPList from "../modals/EventRSVPList";
import type { Dispatch, SetStateAction } from "react";
import { toLocalInputValue } from "../../utils/events";

interface Props {
    event: Event;
    editing: boolean;
    saving: boolean;
    form: Partial<Event>;
    setForm: Dispatch<SetStateAction<Partial<Event>>>;
    showRSVPList: boolean;
    setShowRSVPList: Dispatch<SetStateAction<boolean>>;
    onEditToggle: () => void;
    onSave: () => void;
}

export default function EventAdminControls({
    event,
    editing,
    saving,
    form,
    setForm,
    showRSVPList,
    setShowRSVPList,
    onEditToggle,
    onSave,
}: Props) {
    console.log(event);
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="text-gray-700 font-medium">
                    Event Admin Controls
                </div>

                <div className="flex items-center gap-3">
                    {!editing && (
                        <button
                            onClick={() => setShowRSVPList(true)}
                            className="px-4 py-2 rounded-md border border-foreground/50 hover:bg-gray-200 btn"
                        >
                            <LuClipboardList /> View RSVP List
                        </button>
                    )}

                    {!editing ? (
                        <button
                            onClick={onEditToggle}
                            className="px-4 py-2 rounded-lg btn-secondary font-medium border border-secondary hover:border-secondary-dark"
                        >
                            <LuPencil /> Edit
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onSave}
                                disabled={saving}
                                className="px-4 py-2 rounded-md btn-primary border border-primary"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>

                            <button
                                onClick={() => {
                                    onEditToggle();
                                    setForm(event);
                                }}
                                disabled={saving}
                                className="px-4 py-2 rounded-md border border-foreground/50 hover:bg-gray-200 disabled:opacity-50 btn"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            {editing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm mb-1">Title</label>
                        <input
                            className="w-full border px-3 py-2"
                            value={form.title || ""}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm mb-1">Location</label>
                        <input
                            className="w-full border px-3 py-2"
                            value={form.location || ""}
                            onChange={(e) =>
                                setForm({ ...form, location: e.target.value })
                            }
                        />
                    </div>

                    {/* Room */}
                    <div>
                        <label className="block text-sm mb-1">Room</label>
                        <input
                            className="w-full border px-3 py-2"
                            value={form.room || ""}
                            onChange={(e) =>
                                setForm({ ...form, room: e.target.value })
                            }
                        />
                    </div>

                    {/* Modality */}
                    <div>
                        <label className="block text-sm mb-1">Modality</label>
                        <select
                            className="w-full border px-3 py-2"
                            value={form.modality || "in-person"}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    modality: e.target.value as
                                        | "in-person"
                                        | "online"
                                        | "hybrid",
                                })
                            }
                        >
                            <option value="in-person">In-Person</option>
                            <option value="online">Online</option>
                            <option value="hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Start */}
                    <div>
                        <label className="block text-sm mb-1">Start</label>
                        <input
                            type="datetime-local"
                            className="w-full border px-3 py-2"
                            value={
                                form.start_datetime
                                    ? toLocalInputValue(form.start_datetime)
                                    : ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    start_datetime: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* End */}
                    <div>
                        <label className="block text-sm mb-1">End</label>
                        <input
                            type="datetime-local"
                            className="w-full border px-3 py-2"
                            value={
                                form.end_datetime
                                    ? toLocalInputValue(form.end_datetime)
                                    : ""
                            }
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    end_datetime: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">
                            Description
                        </label>
                        <textarea
                            className="w-full border px-3 py-2"
                            rows={5}
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>
            )}

            {showRSVPList && (
                <EventRSVPList
                    userRSVPs={event.rsvp_users}
                    setShowRSVPList={setShowRSVPList}
                />
            )}
        </div>
    );
}
