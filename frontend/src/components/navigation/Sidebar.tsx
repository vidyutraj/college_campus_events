import { Link, useLocation } from "react-router-dom";
import {
    LuBadgeCheck,
    LuBuilding,
    LuCalendar,
    LuCalendarClock,
    LuCalendarRange,
    LuMap,
    LuPlus,
} from "react-icons/lu";
import PlaceholderImg from "../../assets/placeholder-img.jpg";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
    sbCollapsed: boolean;
}

export default function Sidebar({ sbCollapsed }: SidebarProps) {
    const location = useLocation();
    const { user, isAuthenticated, memberOrgs } = useAuth();

    const campusNavItems = [
        { name: "Events", href: "/events", icon: LuCalendar },
        { name: "Organizations", href: "/organizations", icon: LuBuilding },
        { name: "Event Map", href: "/event-map", icon: LuMap },
    ];

    const myEventsNavItems = [
        {
            name: "Upcoming",
            href: "/my-upcoming-events",
            icon: LuCalendarClock,
        },
    ];

    const adminNavItems = [
        {
            name: "Event Requests",
            href: "/admin/event-requests",
            icon: LuBadgeCheck,
        },
        {
            name: "Event Administration",
            href: "/admin/events",
            icon: LuCalendarRange,
        },
    ];

    return (
        <div
            className={`transition-[width] overflow-hidden max-h-full bg-white border-r border-r-foreground/10
                        flex flex-col gap-4 overflow-y-auto
                        ${
                            sbCollapsed
                                ? "items-center w-16 py-4 px-3"
                                : "w-80 p-4"
                        }`}
        >
            <div>
                {!sbCollapsed && (
                    <h3 className="text-sm uppercase text-foreground/50 font-semibold mb-2">
                        Campus
                    </h3>
                )}
                <div className="space-y-1">
                    {campusNavItems.map((nav) => (
                        <Link
                            key={nav.href}
                            to={nav.href}
                            className={`flex items-center gap-2 text-lg rounded py-2 hover:bg-foreground/5
                        ${
                            nav.href == location.pathname
                                ? "bg-foreground/5 font-semibold"
                                : ""
                        } ${sbCollapsed ? "px-2" : "px-3"}`}
                        >
                            <nav.icon /> {!sbCollapsed && nav.name}
                        </Link>
                    ))}
                </div>
            </div>
            {isAuthenticated && <div>
                {!sbCollapsed && (
                    <h3 className="text-sm uppercase text-foreground/50 font-semibold mb-2">
                        My Events
                    </h3>
                )}
                {sbCollapsed && <hr className="mb-5 border-foreground/15" />}
                <div className="space-y-1">
                    {myEventsNavItems.map((nav) => (
                        <Link
                            key={nav.href}
                            to={nav.href}
                            className={`flex items-center gap-2 text-lg rounded py-2 hover:bg-foreground/5
                        ${
                            nav.href == location.pathname
                                ? "bg-foreground/5 font-semibold"
                                : ""
                        } ${sbCollapsed ? "px-2" : "px-3"}`}
                        >
                            <nav.icon /> {!sbCollapsed && nav.name}
                        </Link>
                    ))}
                </div>
            </div>}
            {memberOrgs.length > 0 && (
                <div>
                    {!sbCollapsed && (
                        <h3 className="text-sm uppercase text-foreground/50 font-semibold mb-2">
                            My Organizations
                        </h3>
                    )}
                    {sbCollapsed && (
                        <hr className="mb-5 border-foreground/15" />
                    )}
                    <div className="space-y-1">
                        {memberOrgs.map((org) => (
                            <Link
                                key={org.name}
                                to={"/organization/" + org.name}
                                className={`flex items-center gap-3 text-lg rounded hover:bg-foreground/5
                                            ${
                                                org.name == location.pathname
                                                    ? "bg-foreground/5 font-semibold"
                                                    : ""
                                            } ${
                                    sbCollapsed ? "p-1.5" : "py-2 pl-2 pr-4"
                                }`}
                            >
                                <img
                                    src={PlaceholderImg}
                                    className="rounded-full w-7 aspect-square object-cover object-center
                                               border border-foreground/10"
                                />
                                {!sbCollapsed && org.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
            
            {user?.is_staff && <div>
                {!sbCollapsed && (
                    <h3 className="text-sm uppercase text-foreground/50 font-semibold mb-2">
                        Admin
                    </h3>
                )}
                {sbCollapsed && <hr className="mb-5 border-foreground/15" />}
                <div className="space-y-1">
                    {adminNavItems.map((nav) => (
                        <Link
                            key={nav.href}
                            to={nav.href}
                            className={`flex items-center gap-2 text-lg rounded py-2 hover:bg-foreground/5
                        ${
                            nav.href == location.pathname
                                ? "bg-foreground/5 font-semibold"
                                : ""
                        } ${sbCollapsed ? "px-2" : "px-3"}`}
                        >
                            <nav.icon /> {!sbCollapsed && nav.name}
                        </Link>
                    ))}
                </div>
            </div>}
            {isAuthenticated && <div className="mt-auto flex flex-col gap-2 text-sm">
                <hr className="mb-3 border-foreground/15" />
                {!sbCollapsed ? (
                    <>
                        <Link to="/organizations/create">
                            <button className="cursor-pointer w-full btn-primary
                                               rounded px-4 py-2 font-medium transition-colors">
                                + New Organization
                            </button>
                        </Link>
                        <Link to="/events/create">
                            <button className="cursor-pointer w-full btn-secondary
                                               rounded px-4 py-2 font-medium transition-colors">
                                + New Event
                            </button>
                        </Link>
                    </>
                ) : (
                    <div className="group">
                        <button
                            className="cursor-pointer text-2xl border border-foreground/15
                                           border-dashed rounded p-1 hover:bg-foreground/5"
                        >
                            <LuPlus />
                        </button>
                        <div
                            className="transition-all overflow-hidden fixed bottom-4 left-10 pl-10 shadow
                                        opacity-0 w-0 h-0
                                        group-hover:opacity-100 group-hover:h-[98px] group-hover:w-70"
                        >
                            <div
                                className="flex flex-col gap-2 w-60 border border-dashed rounded border-foreground/15
                                      bg-white p-2 text-sm"
                            >
                                <Link to="/organizations/create">
                                <button className="cursor-pointer w-full btn-primary
                                                   rounded px-4 py-2 font-medium">
                                    + New Organization
                                </button>
                                </Link>
                                <Link to="/events/create">
                                <button className="cursor-pointer w-full btn-secondary
                                                   rounded px-4 py-2 font-medium">
                                    + New Event
                                </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>}
        </div>
    );
}
