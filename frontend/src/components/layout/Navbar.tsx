/** @format */

"use client";

import Link from "next/link";
import { useMe, useLogout } from "@/src/features/auth/hooks";

export default function Navbar() {
    const { data: user, isLoading } = useMe();
    const logoutMut = useLogout();

    return (
        <header className='w-full border-b bg-white'>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4'>
                <Link href='/' className='text-lg font-semibold tracking-tight'>
                    POSH BY REGNO
                </Link>

                <nav className='flex items-center gap-3'>
                    {isLoading ? (
                        <div className='text-sm text-gray-500'>Loading...</div>
                    ) : user ? (
                        <>
                            <span className='text-sm text-gray-600'>
                                Hi, {user.name}
                            </span>

                            {user.role === "superadmin" && (
                                <Link
                                    href='/admin/dashboard'
                                    className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50'
                                >
                                    Dashboard
                                </Link>
                            )}

                            <button
                                onClick={() => logoutMut.mutate()}
                                className='rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90'
                                disabled={logoutMut.isPending}
                            >
                                {logoutMut.isPending
                                    ? "Logging out..."
                                    : "Logout"}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href='/login'
                                className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50'
                            >
                                Login
                            </Link>
                            <Link
                                href='/register'
                                className='rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90'
                            >
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
