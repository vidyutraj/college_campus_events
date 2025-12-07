import { useNavigate } from "react-router-dom";
import type { MinimalOrganization, Organization } from "../../types";

interface OrganizationCardProps {
    org: Organization | MinimalOrganization;
}

export default function OrganizationCard({ org }: OrganizationCardProps) {
    const navigate = useNavigate();

    const handleOrganizationClick = (orgSlug: string) => {
        navigate(`/organization/${orgSlug}`);
    };

    return (
        <div
            className="flex flex-col sm:flex-row gap-8 bg-white border border-gray-200 rounded-lg p-6 shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-1"
            onClick={() => handleOrganizationClick(org.slug)}
        >
            <div className="w-20 h-20 rounded-full border border-foreground/20">
                {org.logo ? (
                    <img
                        className="w-full h-full object-cover rounded-full"
                        src={org.logo}
                    />
                ) : (
                    <div className="rounded-full w-full h-full flex justify-center items-center bg-primary text-white text-4xl font-medium">
                        {org.name[0].toUpperCase()}
                    </div>
                )}
            </div>
            <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">{org.name}</h3>
                <p className="text-gray-700 line-clamp-3">{org.description}</p>
            </div>
        </div>
    );
}
