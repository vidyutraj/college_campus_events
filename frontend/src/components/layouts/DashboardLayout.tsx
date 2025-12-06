import DashboardNavbar from "../navigation/DashboardNavbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col">
            <DashboardNavbar
                sbCollapsed={sidebarCollapsed}
                setSbCollapsed={setSidebarCollapsed}
            />
            <div className="flex w-full flex-1 max-h-[calc(100%-64px)]">
                <Sidebar sbCollapsed={sidebarCollapsed} />
                <div
                    id="right-scroll-container"
                    className="flex-1 overflow-y-auto"
                >
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
