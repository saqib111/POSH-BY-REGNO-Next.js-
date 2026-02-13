/** @format */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminNavbar from "@/src/components/admin/AdminNavbar";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useLogout, useMe } from "@/src/features/auth/hooks";
import { useGlobalLoading } from "@/src/components/loading/GlobalLoadingProvider";
import Preloader from "@/src/components/Preloader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { darkMode, toggle } = useTheme();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { show, hide } = useGlobalLoading();

    const meQuery = useMe();
    const logoutMut = useLogout();

    const user = meQuery.data?.user;

    useEffect(() => {
        if (meQuery.isLoading) return;

        if (!user) {
            router.replace("/login");
            return;
        }
        if (user.role !== "admin") {
            router.replace("/");
            return;
        }
    }, [meQuery.isLoading, user, router]);

    const handleLogout = async () => {
        try {
            show();
            localStorage.setItem("just_logged_out", "1");
            await logoutMut.mutateAsync();
            router.replace("/login");
        } finally {
            hide();
        }
    };

    if (meQuery.isLoading) return <Preloader />;
    if (!user) return null;

    return (
        <div className='min-h-screen flex bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-700'>
            <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div
                className={`
          flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "md:ml-72" : "md:ml-24"} ml-0
        `}
            >
                <AdminNavbar
                    user={user}
                    onLogout={handleLogout}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    darkMode={darkMode}
                    onToggleTheme={toggle}
                    isLoggingOut={logoutMut.isPending}
                />

                <main className='flex-1 p-8 lg:p-14 bg-[#F8FAFC] dark:bg-[#020617] transition-colors duration-700'>
                    {children}
                </main>
            </div>
        </div>
    );
}
