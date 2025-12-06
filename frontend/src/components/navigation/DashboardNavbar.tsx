import { IoIosMenu } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import {
    useState,
    type Dispatch,
    type SetStateAction,
    useRef,
    useEffect,
} from "react";
import Logo from "../../assets/campus-buzz.svg";
import { useNavigate } from "react-router-dom";
import { LuLogOut, LuUser } from "react-icons/lu";

interface DashboardNavbarProps {
    sbCollapsed: boolean;
    setSbCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function DashboardNavbar({
    sbCollapsed,
    setSbCollapsed,
}: DashboardNavbarProps) {
    const { user, userProfile, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const avatarRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            if (avatarRef.current?.contains(target)) {
                return;
            }

            if (showProfileMenu && !menuRef.current?.contains(target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showProfileMenu]);

    return (
        <header className="h-16 bg-white shadow-sm sticky top-0 z-100 transition-all duration-50 flex items-center pl-4 pr-6">
            <div className="w-full flex justify-between items-center flex-wrap gap-5 relative">
                <div className="flex items-center gap-4 font-stack">
                    <button
                        onClick={() => setSbCollapsed(!sbCollapsed)}
                        className="p-1.5 text-2xl hover:bg-foreground/10 rounded cursor-pointer"
                    >
                        <IoIosMenu />
                    </button>
                    <Link to="/events" className="flex gap-2">
                        <img
                            src={Logo}
                            className="w-8 -mt-1 saturate-120"
                        ></img>
                        <h1 className="font-bold m-0 text-2xl">CampusBuzz</h1>
                    </Link>
                </div>
                <nav className="flex items-center gap-3 flex-wrap">
                    {isAuthenticated && user ? (
                        <>
                            <span className="hidden md:block text-sm mr-2">
                                Welcome, {user.first_name}!
                            </span>
                            <div
                                ref={avatarRef}
                                className="w-9 h-9 rounded-full border-2 border-background outline outline-foreground/20 hover:shadow cursor-pointer
                                          bg-primary flex items-center justify-center select-none text-white text-xl"
                                onClick={() =>
                                    setShowProfileMenu(!showProfileMenu)
                                }
                            >
                                {userProfile?.profile_picture ? (
                                    <img
                                        className="w-full h-full object-cover rounded-full"
                                        src={userProfile.profile_picture}
                                    />
                                ) : (
                                    <p>{user.username[0].toUpperCase()}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="hidden sm:block font-medium rounded-full px-4 py-1
                                           btn-secondary border border-secondary hover:border-secondary-dark"
                            >
                                Sign Up
                            </Link>
                            <Link
                                to="/login"
                                className="font-medium px-3 py-0.5 sm:px-4 sm:py-1 rounded-full transition-all border
                                            bg-white hover:brightness-90"
                            >
                                Login
                            </Link>
                        </>
                    )}
                </nav>
                {showProfileMenu && user && (
                    <div
                        ref={menuRef}
                        className="absolute top-12 w-60 rounded-lg right-0 border border-foreground/15 shadow bg-white py-4 px-2"
                    >
                        <div className="text-sm px-2">
                            <p className="font-semibold">
                                {user.first_name} {user.last_name} (
                                {user.username})
                            </p>
                            <p>{user.email}</p>
                            <hr className="border-foreground/20 my-4" />
                        </div>
                        <div
                            onClick={() => navigate(`/user/${user.username}`)}
                            className="cursor-pointer flex gap-2 items-center hover:bg-foreground/5 px-2 py-1 rounded"
                        >
                            <LuUser /> Profile
                        </div>
                        <div
                            onClick={handleLogout}
                            className="cursor-pointer flex gap-2 items-center hover:bg-foreground/5 px-2 py-1 rounded"
                        >
                            <LuLogOut /> Log out
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
