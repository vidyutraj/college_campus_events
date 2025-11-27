import DashboardNavbar from "../navigation/DashboardNavbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import { useState } from "react";

export default function DashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    return (
        <div className="w-full h-screen flex flex-col">
            <DashboardNavbar
                sbCollapsed={sidebarCollapsed}
                setSbCollapsed={setSidebarCollapsed}
            />
            <div className="flex w-full flex-1 max-h-[calc(100%-64px)]">
                <Sidebar sbCollapsed={sidebarCollapsed} />
                <div className="flex-1 overflow-y-auto">
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}
