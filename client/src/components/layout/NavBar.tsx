"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Moon, Sun, User, LogOut, Bell, Search, Command } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/StoreProvider";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/lib/redux/globalSlice";
import { logout } from "@/services/logout";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state) => state.global.isSidebarCollapsed);
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="flex items-center justify-between px-8 py-4 sticky top-0 z-30 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-gray-100 dark:border-zinc-900 transition-all duration-300">
            {/* Left: Search & Navigation Context */}
            <div className="flex items-center gap-6">
                {(!isMobile && isSidebarCollapsed) && (
                    <button
                        onClick={() => dispatch(setIsSidebarCollapsed(false))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition-all active:scale-95"
                    >
                        <Menu size={20} />
                    </button>
                )}

                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl w-80 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                    <Search size={16} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Cluster..."
                        className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 w-full"
                    />
                    <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-md shadow-sm">
                        <Command size={10} className="text-gray-400" />
                        <span className="text-[10px] font-black text-gray-400">K</span>
                    </div>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 text-gray-500 transition-all group">
                    <Bell size={20} className="group-hover:shake transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm overflow-hidden relative group"
                >
                    <div className={`transition-transform duration-500 ${isDarkMode ? '-translate-y-12' : 'translate-y-0'}`}>
                        <Sun size={20} className="text-amber-500" />
                    </div>
                    <div className={`absolute transition-transform duration-500 ${isDarkMode ? 'translate-y-0' : 'translate-y-12'}`}>
                        <Moon size={20} className="text-indigo-400" />
                    </div>
                </button>

                {/* Profile Dropdown */}
                <div ref={accountRef} className="relative ml-2">
                    <button
                        onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                        className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent hover:border-gray-100 dark:hover:border-zinc-800 transition-all"
                    >
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
                            A
                        </div>
                        {!isMobile && (
                            <div className="text-left">
                                <p className="text-xs font-black text-gray-900 dark:text-white leading-none">Admin User</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Super Admin</p>
                            </div>
                        )}
                    </button>

                    {isAccountMenuOpen && (
                        <div className="absolute right-0 top-full mt-4 w-56 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl animate-scaleIn overflow-hidden p-2 z-50">
                            <div className="px-4 py-3 border-b border-gray-50 dark:border-zinc-800 mb-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Managed</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">admin@project.local</p>
                            </div>

                            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all group">
                                <User size={16} className="text-indigo-500" />
                                Profile Configuration
                            </button>

                            <button
                                onClick={logout}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all mt-1"
                            >
                                <LogOut size={16} />
                                Terminate Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;


