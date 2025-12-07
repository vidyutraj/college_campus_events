import { Link } from "react-router-dom";
import type { OrganizationMember } from "../../types";

interface MemberCardProps {
    member: OrganizationMember;
}

export default function MemberCard({ member }: MemberCardProps) {
    return (
        <Link to={"/user/" + member.user_username}>
            <div className="rounded-lg border border-foreground/10 p-6 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-primary flex items-center justify-center">
                    {member.user_profile_picture ? (
                        <img
                            src={member.user_profile_picture}
                            alt="Profile"
                            className="w-full h-full rounded-full"
                        />
                    ) : (
                        <p className="text-white text-4xl pointer-events-none select-none">
                            {member.user_username[0].toUpperCase()}
                        </p>
                    )}
                </div>
                <h3 className="text-lg">{member.user_full_name}</h3>
                <p className="opacity-70">{member.role}</p>
            </div>
        </Link>
    );
}
