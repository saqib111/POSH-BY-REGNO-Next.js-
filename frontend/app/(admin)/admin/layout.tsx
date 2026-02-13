/** @format */

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Boxes,
    Layers,
    LogOut,
    Loader2,
} from "lucide-react";

import { useMe, useLogout } from "@/src/features/auth/hooks";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { data, isLoading } = useMe();
    const logoutMut = useLogout();

    const user = data?.user;

    // 🔐 Protect route (only admin)
    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace("/login");
            } else if (user.role !== "admin") {
                router.replace("/");
            }
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        // ✅ prevent login page redirect effect from firing for 1s
        localStorage.setItem("just_logged_out", "1");
        await logoutMut.mutateAsync();
        router.replace("/login");
    };

    if (isLoading || !user) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-zinc-950 text-white'>
                <Loader2 className='animate-spin' />
            </div>
        );
    }

    if (!user) {
        return null; // ✅ don't render layout while redirecting to /login
    }

    return (
        <div className='min-h-screen flex bg-zinc-950 text-white'>
            {/* Sidebar */}
            <aside className='w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl p-6 flex flex-col justify-between'>
                <div>
                    <div className='mb-10'>
                        <h1 className='text-lg font-black tracking-tight'>
                            POSH BY REGNO
                        </h1>
                        <p className='text-[10px] uppercase tracking-[0.35em] text-zinc-500 mt-1'>
                            Superadmin Panel
                        </p>
                    </div>

                    <nav className='space-y-3 text-sm'>
                        <Link
                            href='/admin/dashboard'
                            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition'
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>

                        <Link
                            href='/admin/manage-user'
                            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition'
                        >
                            <Users size={16} />
                            Manage Users
                        </Link>

                        <Link
                            href='/admin/category'
                            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition'
                        >
                            <Layers size={16} />
                            Categories
                        </Link>

                        <Link
                            href='/admin/products'
                            className='flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition'
                        >
                            <Boxes size={16} />
                            Products
                        </Link>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className='space-y-4'>
                    <div className='text-xs text-zinc-400'>
                        <p className='font-black'>{user.name}</p>
                        <p className='uppercase tracking-widest text-[9px] text-zinc-600'>
                            {user.role}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={logoutMut.isPending}
                        className='w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-wider hover:bg-white/10 disabled:opacity-50'
                    >
                        {logoutMut.isPending ? (
                            <>
                                <Loader2 size={14} className='animate-spin' />
                                Logging out
                            </>
                        ) : (
                            <>
                                <LogOut size={14} />
                                Logout
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className='flex-1 p-10'>{children}</main>
        </div>
    );
}
