/** @format */
"use client";

import { Sun, Moon, LogOut, Menu, Search, Command } from "lucide-react";

type Props = {
    user: any;
    onLogout: () => void;
    toggleSidebar: () => void;
    darkMode: boolean;
    onToggleTheme: () => void; // ✅
    isLoggingOut?: boolean;
};

export default function AdminNavbar({
    user,
    onLogout,
    toggleSidebar,
    darkMode,
    onToggleTheme,
    isLoggingOut,
}: Props) {
    return (
        <header
            className='
                sticky top-0 z-40
                h-24 px-6 sm:px-10
                flex items-center justify-between
                bg-white/70 dark:bg-[#020617]/55
                backdrop-blur-xl
                border-b border-slate-200/60 dark:border-white/10
                shadow-[0_8px_30px_rgba(2,6,23,0.04)]
                dark:shadow-[0_8px_30px_rgba(0,0,0,0.20)]
            '
        >
            {/* Left: menu + search */}
            <div className='flex items-center gap-5 sm:gap-8 flex-1'>
                <button
                    onClick={toggleSidebar}
                    className='
                        group relative
                        p-3 rounded-2xl
                        bg-white dark:bg-white/3
                        border border-slate-200/70 dark:border-white/10
                        shadow-sm
                        transition-all duration-300
                        hover:-translate-y-px hover:shadow-md
                        active:translate-y-0
                        focus:outline-none focus:ring-2 focus:ring-amber-600/20
                    '
                    aria-label='Toggle sidebar'
                >
                    <Menu
                        size={20}
                        className='text-slate-700 dark:text-slate-200 transition-colors group-hover:text-amber-600'
                    />
                </button>

                <div className='relative group max-w-md w-full hidden md:block'>
                    <div className='pointer-events-none absolute -inset-1 rounded-3xl bg-amber-600/10 opacity-0 blur-xl transition duration-500 group-focus-within:opacity-100' />

                    <div
                        className='
                            relative flex items-center h-12 rounded-2xl
                            bg-white dark:bg-white/3
                            border border-slate-200/70 dark:border-white/10
                            shadow-sm transition-all duration-300
                            group-focus-within:border-amber-600/60
                            group-focus-within:ring-2 group-focus-within:ring-amber-600/15
                        '
                    >
                        <div className='absolute left-4 flex items-center pointer-events-none'>
                            <Search
                                size={16}
                                className='text-slate-400 transition-colors group-focus-within:text-amber-600'
                            />
                        </div>

                        <input
                            type='text'
                            placeholder='Search Intelligence...'
                            className='
                                w-full h-full pl-11 pr-14 bg-transparent
                                text-[11px] font-black uppercase tracking-[0.22em]
                                text-slate-800 dark:text-white
                                placeholder:text-slate-400 outline-none
                            '
                        />

                        <div className='absolute right-3 flex items-center pointer-events-none'>
                            <div
                                className='
                                    flex items-center gap-1 px-2 py-1 rounded-lg
                                    bg-slate-100/80 dark:bg-white/6
                                    border border-slate-200/70 dark:border-white/10
                                '
                            >
                                <Command size={10} className='text-slate-400' />
                                <span className='text-[9px] font-black text-slate-400'>
                                    K
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: theme + profile + logout */}
            <div className='flex items-center gap-6 sm:gap-10'>
                <button
                    onClick={onToggleTheme}
                    className='
                        group inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                        border border-slate-200/70 dark:border-white/10
                        bg-white dark:bg-white/3 shadow-sm
                        transition-all duration-300 hover:-translate-y-px hover:shadow-md
                        active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-amber-600/20
                    '
                    aria-label='Toggle theme'
                >
                    <span
                        className='
                            inline-flex items-center justify-center w-9 h-9 rounded-xl
                            bg-slate-50 dark:bg-white/6
                            border border-slate-200/70 dark:border-white/10
                            transition-colors group-hover:border-amber-600/30
                        '
                    >
                        {darkMode ? (
                            <Sun size={18} className='text-amber-600' />
                        ) : (
                            <Moon size={18} className='text-slate-700' />
                        )}
                    </span>

                    <span className='hidden sm:inline text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300'>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                </button>

                <div className='flex items-center gap-5 border-l border-slate-200/70 dark:border-white/10 pl-6 sm:pl-10'>
                    <div className='hidden sm:flex flex-col text-right leading-none'>
                        <span className='text-sm font-black text-slate-900 dark:text-white'>
                            {user?.name}
                        </span>
                        <span className='mt-1 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]'>
                            Root Admin
                        </span>
                    </div>

                    <button
                        onClick={onLogout}
                        disabled={isLoggingOut}
                        className='
                            group relative p-3 rounded-2xl
                            bg-slate-900 text-white
                            dark:bg-white dark:text-black
                            shadow-xl shadow-slate-200/70 dark:shadow-none
                            transition-all duration-300 hover:-translate-y-px
                            active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-rose-500/30
                            disabled:opacity-60
                        '
                        aria-label='Logout'
                    >
                        <span className='absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-rose-600/10 dark:bg-rose-500/15' />
                        <span className='relative'>
                            <LogOut
                                size={20}
                                className='group-hover:text-rose-500 dark:group-hover:text-rose-600 transition-colors'
                            />
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
}
