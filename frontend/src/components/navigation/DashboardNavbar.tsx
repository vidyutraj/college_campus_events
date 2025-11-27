import { IoIosMenu } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import type { Dispatch, SetStateAction } from "react";

interface DashboardNavbarProps {
    sbCollapsed: boolean;
    setSbCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardNavbar({
    sbCollapsed,
    setSbCollapsed,
}: DashboardNavbarProps) {
    const { user, leadOrgs, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <header className="h-16 bg-white shadow-sm sticky top-0 z-100 transition-all duration-50 flex items-center pl-4 pr-6">
            <div className="w-full flex justify-between items-center flex-wrap gap-5">
                <div className="flex items-center gap-4 font-stack">
                    <button
                        onClick={() => setSbCollapsed(!sbCollapsed)}
                        className="p-1.5 text-2xl hover:bg-foreground/10 rounded cursor-pointer"
                    >
                        <IoIosMenu />
                    </button>
                    <Link to="/events" className="flex gap-2">
                        <img
                            src="/campus-buzz.svg"
                            className="w-8 -mt-1 saturate-120"
                        ></img>
                        <h1 className="font-bold m-0 text-2xl">CampusBuzz</h1>
                    </Link>
                </div>
                <nav className="flex items-center gap-3 flex-wrap">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm">
                                Welcome, {user?.username} (
                                {user?.is_staff
                                    ? "Admin"
                                    : leadOrgs.length > 0
                                    ? "Organization Leader"
                                    : "Student"}
                                )
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-white/20 hover:bg-white/30 border-0 cursor-pointer
                                            font-medium px-4 py-2 rounded transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="transition-all font-medium rounded-full
                                           text-white border border-secondary bg-secondary
                                           hover:bg-secondary-dark hover:border-secondary-dark
                                           px-4 py-1"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="font-medium px-4 py-1 rounded-full transition-all border
                                            bg-white hover:brightness-90"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
