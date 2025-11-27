import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { useAuth } from "../context/AuthContext";

type Meeting = {
  id: number;
  title: string;
  description: string;
  location: string;
  room?: string;
  start_date: string;
  start_time: string;
  end_time: string;
  organization: number;
  organization_name: string;
  recurrence?: {
    frequency: string;
    interval: number;
    byweekday: string[];
    count?: number | null;
    until?: string | null;
  };
};

export default function MeetingsList() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const fetchMeetings = async () => {
    try {
      const { data } = await axios.get("/api/meetings/");
      console.log(data);
      setMeetings(data.results);
    } catch (err) {
      setError("Failed to load meetings.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    try {
      await axios.delete(`/api/meetings/${id}/`);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError("Failed to delete meeting.");
      console.error(err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/meetings/edit/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>You must be logged in to view meetings.</div>;

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">All Meetings</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">{error}</div>}

      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Organization</th>
            <th className="p-2 border">Start</th>
            <th className="p-2 border">End</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Room</th>
            <th className="p-2 border">Recurrence</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map(meeting => (
            <tr key={meeting.id} className="hover:bg-gray-50">
              <td className="p-2 border">{meeting.title}</td>
              <td className="p-2 border">{meeting.organization_name}</td>
              <td className="p-2 border">{new Date(meeting.start_date).toLocaleString()}</td>
              <td className="p-2 border">{new Date(meeting.start_date + " " + meeting.end_time).toLocaleTimeString()}</td>
              <td className="p-2 border">{meeting.location}</td>
              <td className="p-2 border">{meeting.room || "-"}</td>
              <td className="p-2 border">
                {meeting.recurrence
                  ? `${meeting.recurrence.frequency} every ${meeting.recurrence.interval} ${
                      meeting.recurrence.byweekday?.length ? `on ${meeting.recurrence.byweekday.join(", ")}` : ""
                    } ${
                      meeting.recurrence.until ? `until ${new Date(meeting.recurrence.until).toLocaleDateString()}` : ""
                    }`
                  : "No"}
              </td>
              <td className="p-2 border">
                <button
                  className="px-2 py-1 mr-2 text-white bg-blue-500 rounded"
                  onClick={() => handleEdit(meeting.id)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  onClick={() => handleDelete(meeting.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {meetings.length === 0 && (
            <tr>
              <td className="p-2 border text-center" colSpan={8}>
                No meetings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
