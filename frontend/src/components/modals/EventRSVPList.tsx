import type { Dispatch, SetStateAction } from "react";
import type { User } from "../../types";
import { Link } from "react-router-dom";

interface EventRSVPListProps {
    userRSVPs: User[];
    setShowRSVPList: Dispatch<SetStateAction<boolean>>;
}

export default function EventRSVPList({ userRSVPs, setShowRSVPList }: EventRSVPListProps) {
    return (
        <div className="z-100 fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-2xl p-0.5">
                <div className="relative p-10">
                    <h2 className="text-2xl font-bold mb-1">RSVP List</h2>
                    <p className="opacity-60 mb-4">RSVP Count: {userRSVPs.length}</p>
                    <div className="flex border-b-[1.5px] border-foreground/25 p-3">
                        <p className="w-1/2">Full Name</p>
                        <p className="w-1/2">Email</p>
                    </div>
                    <div className="max-h-[calc(80vh-237px)] overflow-y-auto">
                        {userRSVPs.map((user) => (
                            <div className="flex border-b border-foreground/15 p-3">
                                <p className="w-1/2">
                                    {user.first_name} {user.last_name}
                                </p>
                                <Link to={"mailto:"+user.email} className="w-1/2">{user.email}</Link>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowRSVPList(false)}
                        className="block mt-4 ml-auto px-4 py-2 rounded-lg border hover:bg-gray-100 btn"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
