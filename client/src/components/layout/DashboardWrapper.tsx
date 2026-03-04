"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/layout/NavBar";
import { SideBar } from "@/components/layout/SideBar";
import StoreProvider, { useAppSelector } from "@/lib/redux/StoreProvider";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDarkMode);
    }, [isDarkMode]);

    return (
        <div className="flex min-h-screen w-full bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-500 overflow-x-hidden">
            {/* Sidebar - Positioned fixed in its component */}
            <SideBar />

            {/* Main content area */}
            <main
                className={`flex flex-col w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarCollapsed ? "md:pl-[80px]" : "md:pl-72"
                    }`}
            >
                <Navbar />
                <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full animate-fadeInUp">
                    {children}
                </div>
            </main>
        </div>
    );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => (
    <StoreProvider>
        <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
);

export default DashboardWrapper;


