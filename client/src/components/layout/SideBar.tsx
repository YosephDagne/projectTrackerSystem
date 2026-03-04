"use client";

import { useState, useEffect } from "react";
import { X, Menu, Settings, Layout } from "lucide-react";
import { MenuContainer } from "@/components/Menu/menuRenderer/MenuContainer";
import { useAppDispatch, useAppSelector } from "@/lib/redux/StoreProvider";
import { setIsSidebarCollapsed } from "@/lib/redux/globalSlice";

export const SideBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const dispatch = useAppDispatch();
    const isCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    useEffect(() => {
        if (!isMobile && isOpen) setIsOpen(false);
    }, [isMobile, isOpen]);

    return (
        <>
            {/* Mobile Toggle */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-6 left-6 z-40 md:hidden bg-white/10 dark:bg-zinc-900/10 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 p-3 rounded-2xl shadow-2xl transition-all active:scale-95"
                    aria-label="Open Viewport"
                >
                    <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
            )}

            {/* Sidebar Panel */}
            <aside
                className={`fixed top-0 left-0 h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-40
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:block
          bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 shadow-2xl overflow-hidden
          ${isCollapsed && !isMobile ? "w-[80px]" : "w-72"}`}
            >
                <div className="flex flex-col h-full relative px-4 py-8">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between mb-10 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Layout className="text-white" size={20} />
                            </div>
                            {!isCollapsed && (
                                <div className="animate-fadeIn">
                                    <h1 className="text-lg font-black tracking-tighter text-gray-900 dark:text-white leading-tight">
                                        PROJECT<br /><span className="text-indigo-500">TERMINAL</span>
                                    </h1>
                                </div>
                            )}
                        </div>

                        {isMobile && (
                            <button
                                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-full transition-colors text-gray-400"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>

                    {/* Navigation Matrix */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-3 ${isCollapsed ? 'text-center' : ''}`}>
                            {isCollapsed ? 'NAV' : 'Operational Matrix'}
                        </p>
                        <MenuContainer isCollapsed={isCollapsed && !isMobile} />
                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-zinc-900 space-y-2">
                        <button
                            onClick={() => !isMobile && dispatch(setIsSidebarCollapsed(!isCollapsed))}
                            className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-400 hover:text-indigo-500 transition-all group`}
                        >
                            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
                            {!isCollapsed && <span className="text-sm font-bold">Preferences</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Ambient Overlay */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};


