import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Logo from "../../assets/campus-buzz.svg";

export default function Navbar() {
    const { user, leadOrgs, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    return (
        <header
            className="h-16 bg-white shadow-sm sticky top-0 z-100 transition-all duration-50 flex items-center px-6"
        >
            <div className="w-full flex justify-between items-center flex-wrap gap-5">
                <div className="flex items-center gap-4 font-stack">
                    {/* <IoIosMenu className="opacity-80" size={25} /> */}
                    <Link to="/" className="flex gap-2">
                        <img
                            src={Logo}
                            className="w-8 -mt-1 saturate-120"
                        ></img>
                        <h1
                            className="font-bold m-0 text-2xl"
                        >
                            CampusBuzz
                        </h1>
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
                                to="/events"
                                className="font-medium rounded-full btn-secondary
                                           border border-secondary hover:border-secondary-dark
                                           px-4 py-1"
                            >
                                Browse Events
                            </Link>
                            <Link
                                to="/login"
                                className="font-medium px-4 py-1 rounded-full transition-all border
                                            bg-white hover:brightness-90"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
